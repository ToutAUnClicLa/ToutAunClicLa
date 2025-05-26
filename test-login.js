// Script para probar diferentes contraseñas de login
require('dotenv').config({ path: '.env' });

async function testLogin(email, password) {
  try {
    console.log(`🔑 Probando login: ${email} con contraseña: ${password}`);
    
    const response = await fetch('http://localhost:3003/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login exitoso!', data);
      return true;
    } else {
      console.log('❌ Login falló:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

async function testMultiplePasswords() {
  const email = 'usuario.prueba@example.com';
  const passwords = [
    'password123',
    'testpassword123', 
    'Password123',
    'Password123!',
    '123456',
    'prueba123',
    'usuario123'
  ];

  for (const password of passwords) {
    const success = await testLogin(email, password);
    if (success) {
      console.log(`🎉 Contraseña correcta encontrada: ${password}`);
      break;
    }
    // Esperar un poco entre intentos
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

testMultiplePasswords();
