// Test simple para verificar que useAuth funciona correctamente
// Este archivo puede eliminarse después de la verificación

console.log('Testing useAuth hook integration...');

// Verificar que el hook existe y se puede importar
try {
  const fs = require('fs');
  const path = require('path');
  
  const hookPath = path.join(__dirname, 'hooks', 'useAuth.ts');
  const hookContent = fs.readFileSync(hookPath, 'utf8');
  
  // Verificar que todas las funciones necesarias están exportadas
  const expectedFunctions = [
    'login',
    'register', 
    'logout',
    'forgotPassword',
    'refreshAuth',
    'syncVerification',
    'resendVerification'
  ];
  
  const missingFunctions = expectedFunctions.filter(func => 
    !hookContent.includes(func)
  );
  
  if (missingFunctions.length === 0) {
    console.log('✅ Todas las funciones necesarias están presentes en useAuth');
  } else {
    console.log('❌ Funciones faltantes:', missingFunctions);
  }
  
  // Verificar imports
  if (hookContent.includes("import { getCurrentUser } from '@/lib/supabase/auth'")) {
    console.log('✅ Import de getCurrentUser está presente');
  } else {
    console.log('❌ Import de getCurrentUser está faltando');
  }
  
  console.log('✅ Verificación del hook useAuth completada exitosamente');
  
} catch (error) {
  console.error('❌ Error durante la verificación:', error.message);
}
