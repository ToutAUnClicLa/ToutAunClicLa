/*
  # Create authentication tables

  1. New Tables
    - `usuarios`
      - `id` (uuid, primary key)
      - `nombre` (text)
      - `email` (text, unique)
      - `fecha_creacion` (timestamptz)
      - `autenticacion_social` (boolean)

    - `direcciones_envio`
      - `id` (uuid, primary key)
      - `usuario_id` (uuid, foreign key)
      - `direccion` (text)
      - `ciudad` (text)
      - `estado` (text)
      - `codigo_postal` (text)
      - `pais` (text)
      - `telefono` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create usuarios table
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text UNIQUE NOT NULL,
  fecha_creacion timestamptz DEFAULT now(),
  autenticacion_social boolean DEFAULT false
);

-- Create direcciones_envio table
CREATE TABLE IF NOT EXISTS direcciones_envio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  direccion text NOT NULL,
  ciudad text NOT NULL,
  estado text NOT NULL,
  codigo_postal text NOT NULL,
  pais text NOT NULL,
  telefono text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE direcciones_envio ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON usuarios
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own addresses"
  ON direcciones_envio
  FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert own addresses"
  ON direcciones_envio
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own addresses"
  ON direcciones_envio
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own addresses"
  ON direcciones_envio
  FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);