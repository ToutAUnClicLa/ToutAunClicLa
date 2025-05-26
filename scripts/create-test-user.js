// Script temporal para crear un usuario de prueba para debugging
// Este archivo puede eliminarse después de las pruebas

import { supabase } from './lib/supabase/client';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  console.log('Creating test user...');
  
  const testEmail = 'test@example.com';
  const testPassword = 'testpassword123';
  const hashedPassword = await bcrypt.hash(testPassword, 12);
  
  // Crear usuario en Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });
  
  if (authError) {
    console.error('Error creating auth user:', authError);
    return;
  }
  
  console.log('Auth user created:', authData.user?.id);
  
  // Crear usuario en nuestra tabla personalizada
  const { data: userData, error: userError } = await supabase
    .from('usuarios')
    .insert([
      {
        nombre: 'Usuario de Prueba',
        correo_electronico: testEmail,
        telefono: '+1234567890',
        verificado: true, // Para pruebas, lo marcamos como verificado
        autenticacion_social: false,
        password_hash: hashedPassword,
      }
    ])
    .select()
    .single();
    
  if (userError) {
    console.error('Error creating user in database:', userError);
    return;
  }
  
  console.log('Database user created:', userData);
}

createTestUser();
