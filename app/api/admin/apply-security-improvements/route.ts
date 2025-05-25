import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req: NextRequest) {
  try {
    // Verificar autorización
    const authorization = req.headers.get('authorization');
    const secretKey = process.env.ADMIN_API_KEY || 'dev-secret-key';
    
    if (authorization !== `Bearer ${secretKey}`) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    console.log('Iniciando aplicación de mejoras de seguridad...');

    // 1. Añadir nuevas columnas a la tabla usuarios
    console.log('1. Añadiendo nuevas columnas a la tabla usuarios...');
    await supabaseAdmin.rpc('execute_sql', {
      query: `
        -- Añadir nuevas columnas de seguridad a la tabla usuarios
        ALTER TABLE usuarios 
        ADD COLUMN IF NOT EXISTS intentos_login_fallidos INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS cuenta_bloqueada BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS fecha_bloqueo TIMESTAMP,
        ADD COLUMN IF NOT EXISTS fecha_ultimo_login TIMESTAMP,
        ADD COLUMN IF NOT EXISTS ip_ultimo_login INET,
        ADD COLUMN IF NOT EXISTS user_agent_ultimo_login TEXT,
        ADD COLUMN IF NOT EXISTS requiere_cambio_contrasena BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS fecha_ultimo_cambio_contrasena TIMESTAMP;
      `
    });

    // 2. Crear tabla de logs de acceso
    console.log('2. Creando tabla de logs de acceso...');
    await supabaseAdmin.rpc('execute_sql', {
      query: `
        -- Crear tabla de logs de acceso si no existe
        CREATE TABLE IF NOT EXISTS logs_acceso (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
          email TEXT NOT NULL,
          evento TEXT NOT NULL, -- 'login_exitoso', 'login_fallido', 'cuenta_bloqueada', 'password_reset', etc.
          ip_address INET,
          user_agent TEXT,
          detalles JSONB,
          fecha_evento TIMESTAMP DEFAULT NOW()
        );
        
        -- Crear índices para optimizar consultas
        CREATE INDEX IF NOT EXISTS idx_logs_acceso_usuario_id ON logs_acceso(usuario_id);
        CREATE INDEX IF NOT EXISTS idx_logs_acceso_email ON logs_acceso(email);
        CREATE INDEX IF NOT EXISTS idx_logs_acceso_evento ON logs_acceso(evento);
        CREATE INDEX IF NOT EXISTS idx_logs_acceso_fecha ON logs_acceso(fecha_evento DESC);
      `
    });

    // 3. Crear funciones de seguridad
    console.log('3. Creando funciones de seguridad...');
    
    // Función para manejar intentos de login fallidos
    await supabaseAdmin.rpc('execute_sql', {
      query: `
        -- Función para manejar intentos de login fallidos
        CREATE OR REPLACE FUNCTION handle_failed_login_attempt(user_email TEXT, ip_addr INET DEFAULT NULL, user_agent_str TEXT DEFAULT NULL)
        RETURNS JSON AS $$
        DECLARE
          user_record usuarios%ROWTYPE;
          intentos_actuales INTEGER;
          debe_bloquear BOOLEAN := FALSE;
          resultado JSON;
        BEGIN
          -- Buscar usuario
          SELECT * INTO user_record FROM usuarios WHERE correo_electronico = user_email;
          
          IF NOT FOUND THEN
            -- Log del intento con email inexistente
            INSERT INTO logs_acceso (usuario_id, email, evento, ip_address, user_agent, detalles)
            VALUES (NULL, user_email, 'login_fallido', ip_addr, user_agent_str, 
                   '{"razon": "email_no_existe"}'::jsonb);
            
            RETURN '{"success": false, "blocked": false, "attempts": 0}'::json;
          END IF;
          
          -- Incrementar contador de intentos fallidos
          intentos_actuales := COALESCE(user_record.intentos_login_fallidos, 0) + 1;
          
          -- Determinar si debe bloquearse (5 intentos fallidos)
          IF intentos_actuales >= 5 THEN
            debe_bloquear := TRUE;
          END IF;
          
          -- Actualizar usuario
          UPDATE usuarios 
          SET 
            intentos_login_fallidos = intentos_actuales,
            cuenta_bloqueada = debe_bloquear,
            fecha_bloqueo = CASE WHEN debe_bloquear THEN NOW() ELSE fecha_bloqueo END
          WHERE id = user_record.id;
          
          -- Log del evento
          INSERT INTO logs_acceso (usuario_id, email, evento, ip_address, user_agent, detalles)
          VALUES (user_record.id, user_email, 
                 CASE WHEN debe_bloquear THEN 'cuenta_bloqueada' ELSE 'login_fallido' END,
                 ip_addr, user_agent_str,
                 jsonb_build_object('intentos', intentos_actuales, 'bloqueada', debe_bloquear));
          
          resultado := jsonb_build_object(
            'success', false,
            'blocked', debe_bloquear,
            'attempts', intentos_actuales
          );
          
          RETURN resultado;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });

    // Función para resetear intentos fallidos
    await supabaseAdmin.rpc('execute_sql', {
      query: `
        -- Función para resetear intentos de login fallidos
        CREATE OR REPLACE FUNCTION reset_failed_login_attempts(user_email TEXT, ip_addr INET DEFAULT NULL, user_agent_str TEXT DEFAULT NULL)
        RETURNS JSON AS $$
        DECLARE
          user_record usuarios%ROWTYPE;
        BEGIN
          -- Buscar usuario
          SELECT * INTO user_record FROM usuarios WHERE correo_electronico = user_email;
          
          IF NOT FOUND THEN
            RETURN '{"success": false, "error": "Usuario no encontrado"}'::json;
          END IF;
          
          -- Resetear contadores y desbloquear
          UPDATE usuarios 
          SET 
            intentos_login_fallidos = 0,
            cuenta_bloqueada = FALSE,
            fecha_bloqueo = NULL,
            fecha_ultimo_login = NOW(),
            ip_ultimo_login = ip_addr,
            user_agent_ultimo_login = user_agent_str
          WHERE id = user_record.id;
          
          -- Log del login exitoso
          INSERT INTO logs_acceso (usuario_id, email, evento, ip_address, user_agent, detalles)
          VALUES (user_record.id, user_email, 'login_exitoso', ip_addr, user_agent_str,
                 '{"intentos_previos_reseteados": true}'::jsonb);
          
          RETURN '{"success": true, "message": "Login exitoso, contadores reseteados"}'::json;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });

    // Función para generar token de verificación
    await supabaseAdmin.rpc('execute_sql', {
      query: `
        -- Función para generar token de verificación
        CREATE OR REPLACE FUNCTION generate_verification_token(user_email TEXT)
        RETURNS JSON AS $$
        DECLARE
          user_record usuarios%ROWTYPE;
          new_token TEXT;
          expires_at TIMESTAMP;
        BEGIN
          -- Buscar usuario
          SELECT * INTO user_record FROM usuarios WHERE correo_electronico = user_email;
          
          IF NOT FOUND THEN
            RETURN '{"success": false, "error": "Usuario no encontrado"}'::json;
          END IF;
          
          -- Generar token
          new_token := encode(gen_random_bytes(32), 'hex');
          expires_at := NOW() + INTERVAL '24 hours';
          
          -- Eliminar tokens antiguos
          DELETE FROM tokens_verificacion_email WHERE usuario_id = user_record.id;
          
          -- Insertar nuevo token
          INSERT INTO tokens_verificacion_email (usuario_id, token, expires_at)
          VALUES (user_record.id, new_token, expires_at);
          
          RETURN jsonb_build_object(
            'success', true,
            'token', new_token,
            'expires_at', expires_at,
            'user_id', user_record.id
          );
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });

    // 4. Crear políticas RLS
    console.log('4. Configurando Row Level Security...');
    await supabaseAdmin.rpc('execute_sql', {
      query: `
        -- Habilitar RLS en las tablas
        ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
        ALTER TABLE tokens_verificacion_email ENABLE ROW LEVEL SECURITY;
        ALTER TABLE tokens_recuperacion ENABLE ROW LEVEL SECURITY;
        ALTER TABLE logs_acceso ENABLE ROW LEVEL SECURITY;
        
        -- Política para usuarios: solo pueden ver/editar su propio perfil
        DROP POLICY IF EXISTS "usuarios_select_own" ON usuarios;
        CREATE POLICY "usuarios_select_own" ON usuarios
          FOR SELECT USING (auth.uid()::text = id::text);
        
        DROP POLICY IF EXISTS "usuarios_update_own" ON usuarios;
        CREATE POLICY "usuarios_update_own" ON usuarios
          FOR UPDATE USING (auth.uid()::text = id::text);
        
        -- Política para tokens de verificación: solo lectura para verificación
        DROP POLICY IF EXISTS "tokens_verificacion_select" ON tokens_verificacion_email;
        CREATE POLICY "tokens_verificacion_select" ON tokens_verificacion_email
          FOR SELECT USING (true); -- Necesario para verificación pública
        
        -- Política para tokens de recuperación: solo lectura para recuperación
        DROP POLICY IF EXISTS "tokens_recuperacion_select" ON tokens_recuperacion;
        CREATE POLICY "tokens_recuperacion_select" ON tokens_recuperacion
          FOR SELECT USING (true); -- Necesario para recuperación pública
        
        -- Política para logs: solo administradores pueden ver
        DROP POLICY IF EXISTS "logs_acceso_admin_only" ON logs_acceso;
        CREATE POLICY "logs_acceso_admin_only" ON logs_acceso
          FOR ALL USING (false); -- Solo acceso programático
      `
    });

    // 5. Crear función auxiliar para SQL execution
    console.log('5. Creando función auxiliar...');
    await supabaseAdmin.rpc('execute_sql', {
      query: `
        -- Función auxiliar para ejecutar SQL (solo para administración)
        CREATE OR REPLACE FUNCTION execute_sql(query TEXT)
        RETURNS TEXT AS $$
        BEGIN
          EXECUTE query;
          RETURN 'OK';
        EXCEPTION WHEN OTHERS THEN
          RETURN 'ERROR: ' || SQLERRM;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });

    console.log('✅ Mejoras de seguridad aplicadas exitosamente');

    return NextResponse.json({
      success: true,
      message: 'Mejoras de seguridad aplicadas exitosamente',
      steps: [
        'Columnas de seguridad añadidas a usuarios',
        'Tabla logs_acceso creada',
        'Funciones de seguridad creadas',
        'Row Level Security configurado',
        'Función auxiliar creada'
      ]
    });

  } catch (error: any) {
    console.error('Error aplicando mejoras de seguridad:', error);
    return NextResponse.json(
      { error: error.message || 'Error al aplicar mejoras' },
      { status: 500 }
    );
  }
}
