// Script para verificar manualmente un usuario
require('dotenv').config({ path: '.env' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyUser(email) {
  try {
    console.log(`🔄 Verificando usuario: ${email}`);
    
    // 1. Buscar usuario en Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error al buscar en Auth:', authError);
      return;
    }
    
    const authUser = authUsers.users.find(user => user.email === email);
    
    if (!authUser) {
      console.error('❌ Usuario no encontrado en Auth');
      return;
    }
    
    console.log('✅ Usuario encontrado en Auth:', authUser.id);
    
    // 2. Actualizar el estado en Auth para marcarlo como verificado
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      authUser.id,
      { email_confirm: true }
    );
    
    if (updateError) {
      console.error('❌ Error al verificar en Auth:', updateError);
      return;
    }
    
    console.log('✅ Usuario verificado en Auth');
    
    // 3. Actualizar en nuestra tabla personalizada
    const { error: dbError } = await supabase
      .from('usuarios')
      .update({ verificado: true })
      .eq('correo_electronico', email);
    
    if (dbError) {
      console.error('❌ Error al actualizar en tabla usuarios:', dbError);
      return;
    }
    
    console.log('✅ Usuario verificado en tabla usuarios');
    console.log('🎉 Proceso de verificación completado');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar
const email = process.argv[2] || 'usuario.prueba@example.com';
verifyUser(email);
