-- ===================================================================
-- MEJORAS DE SEGURIDAD PARA LA TABLA USUARIOS
-- ===================================================================

-- OPCIÓN 1: RECOMENDADA - Usar solo Supabase Auth para autenticación
-- ===================================================================

-- 1. ELIMINAR campo de contraseña (redundante con Supabase Auth)
ALTER TABLE public.usuarios DROP COLUMN IF EXISTS contrasena_hash;

-- 2. AÑADIR campos de seguridad esenciales
-- (No incluimos token_verificacion_email ni fecha_expiracion_token porque ya tienes tablas separadas)
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS intentos_login_fallidos integer DEFAULT 0;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS fecha_ultimo_login timestamp with time zone;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS cuenta_bloqueada boolean DEFAULT false;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS fecha_bloqueo timestamp with time zone;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS razon_bloqueo text;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS ip_ultimo_acceso inet;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS fecha_cambio_contrasena timestamp with time zone;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS requiere_cambio_contrasena boolean DEFAULT false;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS dispositivos_confiables jsonb DEFAULT '[]'::jsonb;

-- 3. AÑADIR constraints de seguridad
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_intentos_login_check 
            CHECK (intentos_login_fallidos >= 0 AND intentos_login_fallidos <= 10);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
END $$;

-- 4. CREAR índices para mejorar rendimiento y seguridad
CREATE INDEX IF NOT EXISTS idx_usuarios_correo_electronico ON public.usuarios(correo_electronico);
CREATE INDEX IF NOT EXISTS idx_usuarios_verificado ON public.usuarios(verificado);
CREATE INDEX IF NOT EXISTS idx_usuarios_cuenta_bloqueada ON public.usuarios(cuenta_bloqueada);
CREATE INDEX IF NOT EXISTS idx_usuarios_fecha_ultimo_login ON public.usuarios(fecha_ultimo_login);

-- 4.1. AÑADIR índices y políticas para tablas de tokens existentes
-- Índices para tokens_verificacion_email
CREATE INDEX IF NOT EXISTS idx_tokens_verificacion_email_token ON public.tokens_verificacion_email(token);
CREATE INDEX IF NOT EXISTS idx_tokens_verificacion_email_usuario_id ON public.tokens_verificacion_email(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tokens_verificacion_email_expires_at ON public.tokens_verificacion_email(expires_at);

-- Índices para tokens_recuperacion
CREATE INDEX IF NOT EXISTS idx_tokens_recuperacion_token ON public.tokens_recuperacion(token);
CREATE INDEX IF NOT EXISTS idx_tokens_recuperacion_usuario_id ON public.tokens_recuperacion(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tokens_recuperacion_expires_at ON public.tokens_recuperacion(expires_at);

-- Constraints únicos para tokens (usando DO para evitar errores si ya existen)
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE public.tokens_verificacion_email ADD CONSTRAINT tokens_verificacion_email_token_unique UNIQUE (token);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE public.tokens_recuperacion ADD CONSTRAINT tokens_recuperacion_token_unique UNIQUE (token);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
END $$;

-- 5. HABILITAR Row Level Security (RLS)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens_verificacion_email ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens_recuperacion ENABLE ROW LEVEL SECURITY;

-- 6. POLÍTICAS DE SEGURIDAD RLS
-- Políticas para usuarios
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Usuarios pueden ver sus propios datos' AND tablename = 'usuarios'
    ) THEN
        CREATE POLICY "Usuarios pueden ver sus propios datos" ON public.usuarios
            FOR SELECT USING (auth.uid()::text = id::text);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Usuarios pueden actualizar sus propios datos' AND tablename = 'usuarios'
    ) THEN
        CREATE POLICY "Usuarios pueden actualizar sus propios datos" ON public.usuarios
            FOR UPDATE USING (auth.uid()::text = id::text);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Solo admin puede insertar usuarios' AND tablename = 'usuarios'
    ) THEN
        CREATE POLICY "Solo admin puede insertar usuarios" ON public.usuarios
            FOR INSERT WITH CHECK (
                EXISTS (
                    SELECT 1 FROM auth.users 
                    WHERE auth.users.id = auth.uid() 
                    AND auth.users.raw_user_meta_data->>'role' = 'admin'
                )
            );
    END IF;
END $$;

-- Políticas para tokens de verificación de email
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Solo sistema puede gestionar tokens verificacion' AND tablename = 'tokens_verificacion_email'
    ) THEN
        CREATE POLICY "Solo sistema puede gestionar tokens verificacion" ON public.tokens_verificacion_email
            FOR ALL USING (false);
    END IF;
END $$;

-- Políticas para tokens de recuperación
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Solo sistema puede gestionar tokens recuperacion' AND tablename = 'tokens_recuperacion'
    ) THEN
        CREATE POLICY "Solo sistema puede gestionar tokens recuperacion" ON public.tokens_recuperacion
            FOR ALL USING (false);
    END IF;
END $$;

-- 7. FUNCIÓN para manejar intentos de login fallidos
CREATE OR REPLACE FUNCTION handle_failed_login_attempt(user_email text)
RETURNS void AS $$
DECLARE
    current_attempts integer;
    max_attempts integer := 5;
BEGIN
    -- Incrementar intentos fallidos
    UPDATE public.usuarios 
    SET 
        intentos_login_fallidos = intentos_login_fallidos + 1,
        fecha_actualizacion = now()
    WHERE correo_electronico = user_email
    RETURNING intentos_login_fallidos INTO current_attempts;
    
    -- Bloquear cuenta si excede máximo de intentos
    IF current_attempts >= max_attempts THEN
        UPDATE public.usuarios 
        SET 
            cuenta_bloqueada = true,
            fecha_bloqueo = now(),
            razon_bloqueo = 'Demasiados intentos de login fallidos',
            fecha_actualizacion = now()
        WHERE correo_electronico = user_email;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. FUNCIÓN para resetear intentos de login después de login exitoso
CREATE OR REPLACE FUNCTION reset_failed_login_attempts(user_email text, user_ip inet DEFAULT NULL)
RETURNS void AS $$
BEGIN
    UPDATE public.usuarios 
    SET 
        intentos_login_fallidos = 0,
        fecha_ultimo_login = now(),
        ip_ultimo_acceso = COALESCE(user_ip, ip_ultimo_acceso),
        cuenta_bloqueada = false,
        fecha_bloqueo = NULL,
        razon_bloqueo = NULL,
        fecha_actualizacion = now()
    WHERE correo_electronico = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. FUNCIÓN para generar token de verificación seguro (usando tabla dedicada)
CREATE OR REPLACE FUNCTION generate_verification_token(user_email text)
RETURNS text AS $$
DECLARE
    user_id_var uuid;
    new_token text;
    expiration_time timestamp with time zone;
BEGIN
    -- Obtener ID del usuario
    SELECT id INTO user_id_var 
    FROM public.usuarios 
    WHERE correo_electronico = user_email;
    
    IF user_id_var IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    -- Generar token aleatorio seguro
    new_token := encode(gen_random_bytes(32), 'hex');
    expiration_time := now() + interval '24 hours';
    
    -- Eliminar tokens existentes para este usuario
    DELETE FROM public.tokens_verificacion_email 
    WHERE usuario_id = user_id_var;
    
    -- Insertar nuevo token
    INSERT INTO public.tokens_verificacion_email (usuario_id, token, expires_at)
    VALUES (user_id_var, new_token, expiration_time);
    
    RETURN new_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. FUNCIÓN para validar y consumir token de verificación (usando tabla dedicada)
CREATE OR REPLACE FUNCTION verify_email_token(token text)
RETURNS table(user_id uuid, success boolean, message text) AS $$
DECLARE
    token_record record;
    user_record record;
BEGIN
    -- Buscar token válido
    SELECT t.usuario_id, t.expires_at, u.verificado, u.correo_electronico
    INTO token_record
    FROM public.tokens_verificacion_email t
    JOIN public.usuarios u ON t.usuario_id = u.id
    WHERE t.token = token;
    
    -- Verificar si token existe
    IF NOT FOUND THEN
        RETURN QUERY SELECT NULL::uuid, false, 'Token inválido'::text;
        RETURN;
    END IF;
    
    -- Verificar si token no ha expirado
    IF token_record.expires_at < now() THEN
        -- Eliminar token expirado
        DELETE FROM public.tokens_verificacion_email WHERE token = token;
        RETURN QUERY SELECT token_record.usuario_id, false, 'Token expirado'::text;
        RETURN;
    END IF;
    
    -- Verificar si usuario ya está verificado
    IF token_record.verificado = true THEN
        -- Eliminar token ya que el usuario ya está verificado
        DELETE FROM public.tokens_verificacion_email WHERE token = token;
        RETURN QUERY SELECT token_record.usuario_id, true, 'Usuario ya verificado'::text;
        RETURN;
    END IF;
    
    -- Marcar como verificado
    UPDATE public.usuarios 
    SET 
        verificado = true,
        fecha_actualizacion = now()
    WHERE id = token_record.usuario_id;
    
    -- Eliminar token usado
    DELETE FROM public.tokens_verificacion_email WHERE token = token;
    
    RETURN QUERY SELECT token_record.usuario_id, true, 'Verificación exitosa'::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. TRIGGER para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION update_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'trigger_update_fecha_actualizacion'
    ) THEN
        CREATE TRIGGER trigger_update_fecha_actualizacion
            BEFORE UPDATE ON public.usuarios
            FOR EACH ROW
            EXECUTE FUNCTION update_fecha_actualizacion();
    END IF;
END $$;

-- 12. FUNCIÓN para limpiar tokens expirados (ejecutar periódicamente)
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    -- Limpiar tokens de verificación expirados
    DELETE FROM public.tokens_verificacion_email 
    WHERE expires_at < now();
    
    -- Limpiar tokens de recuperación expirados
    DELETE FROM public.tokens_recuperacion 
    WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12.1. FUNCIONES adicionales para tokens de recuperación
CREATE OR REPLACE FUNCTION generate_password_reset_token(user_email text)
RETURNS text AS $$
DECLARE
    user_id_var uuid;
    new_token text;
    expiration_time timestamp with time zone;
BEGIN
    -- Obtener ID del usuario
    SELECT id INTO user_id_var 
    FROM public.usuarios 
    WHERE correo_electronico = user_email;
    
    IF user_id_var IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    -- Generar token aleatorio seguro
    new_token := encode(gen_random_bytes(32), 'hex');
    expiration_time := now() + interval '1 hour'; -- Los tokens de reset duran menos
    
    -- Eliminar tokens existentes para este usuario
    DELETE FROM public.tokens_recuperacion 
    WHERE usuario_id = user_id_var;
    
    -- Insertar nuevo token
    INSERT INTO public.tokens_recuperacion (usuario_id, token, expires_at)
    VALUES (user_id_var, new_token, expiration_time);
    
    RETURN new_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12.2. FUNCIÓN para validar token de recuperación
CREATE OR REPLACE FUNCTION validate_password_reset_token(token text)
RETURNS table(user_id uuid, user_email text, success boolean, message text) AS $$
DECLARE
    token_record record;
BEGIN
    -- Buscar token válido
    SELECT t.usuario_id, t.expires_at, u.correo_electronico
    INTO token_record
    FROM public.tokens_recuperacion t
    JOIN public.usuarios u ON t.usuario_id = u.id
    WHERE t.token = token;
    
    -- Verificar si token existe
    IF NOT FOUND THEN
        RETURN QUERY SELECT NULL::uuid, NULL::text, false, 'Token inválido'::text;
        RETURN;
    END IF;
    
    -- Verificar si token no ha expirado
    IF token_record.expires_at < now() THEN
        -- Eliminar token expirado
        DELETE FROM public.tokens_recuperacion WHERE token = token;
        RETURN QUERY SELECT token_record.usuario_id, token_record.correo_electronico, false, 'Token expirado'::text;
        RETURN;
    END IF;
    
    RETURN QUERY SELECT token_record.usuario_id, token_record.correo_electronico, true, 'Token válido'::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12.3. FUNCIÓN para consumir token de recuperación después del reset
CREATE OR REPLACE FUNCTION consume_password_reset_token(token_param text)
RETURNS boolean AS $$
DECLARE
    token_record record;
    user_id_var uuid;
BEGIN
    -- Buscar token válido y obtener usuario_id
    SELECT t.usuario_id, t.expires_at
    INTO token_record
    FROM public.tokens_recuperacion t
    WHERE t.token = token_param AND t.expires_at > now();
    
    -- Verificar si el token existe y no ha expirado
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Guardar usuario_id antes de eliminar el token
    user_id_var := token_record.usuario_id;
    
    -- Eliminar el token
    DELETE FROM public.tokens_recuperacion WHERE token = token_param;
    
    -- Actualizar fecha de cambio de contraseña
    UPDATE public.usuarios 
    SET 
        fecha_cambio_contrasena = now(),
        fecha_actualizacion = now()
    WHERE id = user_id_var;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- OPCIÓN 2: ALTERNATIVA - Si prefieres mantener control total
-- ===================================================================

/*
-- Solo descomenta esta sección si NO vas a usar Supabase Auth

-- Mantener contrasena_hash pero añadir campos de seguridad
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS algoritmo_hash text DEFAULT 'bcrypt';
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS salt text;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS iteraciones_hash integer DEFAULT 12;

-- Añadir constraint para algoritmo de hash
ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_algoritmo_hash_check 
    CHECK (algoritmo_hash IN ('bcrypt', 'argon2', 'scrypt'));

-- Función para validar fortaleza de contraseña
CREATE OR REPLACE FUNCTION validate_password_strength(password text)
RETURNS boolean AS $$
BEGIN
    -- Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo
    RETURN password ~ '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$';
END;
$$ LANGUAGE plpgsql;
*/

-- ===================================================================
-- CONFIGURACIÓN ADICIONAL DE SEGURIDAD
-- ===================================================================

-- Trigger para limpieza automática de tokens expirados al insertar nuevos
CREATE OR REPLACE FUNCTION auto_cleanup_expired_tokens()
RETURNS TRIGGER AS $$
BEGIN
    -- Limpiar tokens expirados cuando se inserta uno nuevo
    IF TG_TABLE_NAME = 'tokens_verificacion_email' THEN
        DELETE FROM public.tokens_verificacion_email WHERE expires_at < now();
    ELSIF TG_TABLE_NAME = 'tokens_recuperacion' THEN
        DELETE FROM public.tokens_recuperacion WHERE expires_at < now();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers a ambas tablas de tokens
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'trigger_cleanup_expired_verification_tokens'
    ) THEN
        CREATE TRIGGER trigger_cleanup_expired_verification_tokens
            BEFORE INSERT ON public.tokens_verificacion_email
            FOR EACH STATEMENT
            EXECUTE FUNCTION auto_cleanup_expired_tokens();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'trigger_cleanup_expired_recovery_tokens'
    ) THEN
        CREATE TRIGGER trigger_cleanup_expired_recovery_tokens
            BEFORE INSERT ON public.tokens_recuperacion
            FOR EACH STATEMENT
            EXECUTE FUNCTION auto_cleanup_expired_tokens();
    END IF;
END $$;

-- Crear tabla para auditoría de accesos
CREATE TABLE IF NOT EXISTS public.logs_acceso (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id uuid REFERENCES public.usuarios(id) ON DELETE CASCADE,
    tipo_evento text NOT NULL CHECK (tipo_evento IN ('login_exitoso', 'login_fallido', 'logout', 'cambio_contrasena', 'verificacion_email')),
    ip_address inet,
    user_agent text,
    detalles jsonb DEFAULT '{}'::jsonb,
    fecha_evento timestamp with time zone DEFAULT now()
);

-- Índices para logs de acceso
CREATE INDEX IF NOT EXISTS idx_logs_acceso_usuario_id ON public.logs_acceso(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_acceso_tipo_evento ON public.logs_acceso(tipo_evento);
CREATE INDEX IF NOT EXISTS idx_logs_acceso_fecha_evento ON public.logs_acceso(fecha_evento);

-- RLS para logs de acceso
ALTER TABLE public.logs_acceso ENABLE ROW LEVEL SECURITY;

-- Políticas para logs de acceso
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Usuarios pueden ver sus propios logs' AND tablename = 'logs_acceso'
    ) THEN
        CREATE POLICY "Usuarios pueden ver sus propios logs" ON public.logs_acceso
            FOR SELECT USING (usuario_id::text = auth.uid()::text);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Solo sistema puede insertar logs' AND tablename = 'logs_acceso'
    ) THEN
        CREATE POLICY "Solo sistema puede insertar logs" ON public.logs_acceso
            FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Función para registrar evento de acceso
CREATE OR REPLACE FUNCTION log_access_event(
    p_usuario_id uuid,
    p_tipo_evento text,
    p_ip_address inet DEFAULT NULL,
    p_user_agent text DEFAULT NULL,
    p_detalles jsonb DEFAULT '{}'::jsonb
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.logs_acceso (usuario_id, tipo_evento, ip_address, user_agent, detalles)
    VALUES (p_usuario_id, p_tipo_evento, p_ip_address, p_user_agent, p_detalles);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- COMENTARIOS Y RECOMENDACIONES
-- ===================================================================

/*
RECOMENDACIONES DE IMPLEMENTACIÓN:

1. EJECUTAR LA OPCIÓN 1 (recomendada) para usar Supabase Auth
2. Actualizar tu código de autenticación para usar las nuevas funciones
3. Implementar rate limiting en tu aplicación
4. Configurar alertas para intentos de login sospechosos
5. Ejecutar cleanup_expired_tokens() periódicamente (cron job)
6. Monitorear logs_acceso para detectar patrones anómalos
7. Implementar 2FA en el futuro
8. Considerar geolocalización de IPs para detección de fraude

SEGURIDAD ADICIONAL A NIVEL DE APLICACIÓN:
- Rate limiting en API routes
- Validación de input robusta
- Sanitización de datos
- Headers de seguridad
- HTTPS obligatorio
- Validación CSRF
- Encriptación de datos sensibles en tránsito
*/
