/*
  # Create favorites table and related functionality

  1. New Tables
    - `favoritos`
      - `id` (uuid, primary key)
      - `usuario_id` (uuid, foreign key)
      - `producto_id` (uuid, foreign key)
      - `fecha_agregado` (timestamptz)

  2. Security
    - Enable RLS on favorites table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS favoritos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  producto_id uuid REFERENCES productos(id) ON DELETE CASCADE,
  fecha_agregado timestamptz DEFAULT now(),
  UNIQUE(usuario_id, producto_id)
);

ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own favorites"
  ON favoritos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert own favorites"
  ON favoritos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own favorites"
  ON favoritos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);