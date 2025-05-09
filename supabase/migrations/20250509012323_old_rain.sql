/*
  # Create cart table

  1. New Tables
    - `carrito`
      - `id` (uuid, primary key)
      - `usuario_id` (uuid, foreign key)
      - `producto_id` (uuid, foreign key)
      - `cantidad` (integer)
      - `fecha_creacion` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS carrito (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  producto_id uuid REFERENCES productos(id) ON DELETE CASCADE,
  cantidad integer NOT NULL DEFAULT 1,
  fecha_creacion timestamptz DEFAULT now()
);

ALTER TABLE carrito ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own cart"
  ON carrito
  FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert into own cart"
  ON carrito
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own cart"
  ON carrito
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can delete from own cart"
  ON carrito
  FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);