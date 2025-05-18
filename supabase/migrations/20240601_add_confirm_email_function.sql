-- Primero, creamos una función para confirmar directamente el email de un usuario
-- Requiere permisos de administrador/service_role
CREATE OR REPLACE FUNCTION auth.confirm_user_email(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _now TIMESTAMP WITH TIME ZONE := now();
  _user_exists BOOLEAN;
BEGIN
  -- Verificar si el usuario existe
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = _user_id
  ) INTO _user_exists;
  
  IF NOT _user_exists THEN
    RAISE EXCEPTION 'User not found: %', _user_id;
  END IF;
  
  -- Actualizar email_confirmed_at si no está establecido
  UPDATE auth.users 
  SET 
    email_confirmed_at = COALESCE(email_confirmed_at, _now),
    updated_at = _now,
    last_sign_in_at = COALESCE(last_sign_in_at, _now)
  WHERE id = _user_id AND (email_confirmed_at IS NULL);
  
  RETURN true;
END;
$$;

-- Luego, creamos una función RPC que puede ser llamada desde nuestra API
-- También requiere permisos de administrador/service_role
CREATE OR REPLACE FUNCTION confirm_user_email_rpc(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Esta función simplemente llama a auth.confirm_user_email
  RETURN auth.confirm_user_email(user_id);
END;
$$;

-- Asegurar que solo los usuarios con permisos service_role pueden llamar a esta función
REVOKE ALL ON FUNCTION confirm_user_email_rpc(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION confirm_user_email_rpc(UUID) TO service_role;

-- Comentario para documentación
COMMENT ON FUNCTION confirm_user_email_rpc(UUID) IS 'Confirma el email de un usuario directamente en la base de datos. Requiere permisos de service_role.'; 