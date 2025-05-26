// Script para verificar usuarios existentes
require('dotenv').config({ path: '.env' });
console.log('Verificando usuarios existentes...');

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  console.log('URL:', !!supabaseUrl);
  console.log('Service Key:', !!supabaseServiceKey);
  process.exit(1);
}

// Usar service role para consultas administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUsers() {
  try {
    // Verificar usuarios en nuestra tabla personalizada
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(10);
      
    if (usuariosError) {
      console.error('❌ Error al consultar usuarios:', usuariosError);
      console.log('❌ Detalles del error:', {
        message: usuariosError.message,
        code: usuariosError.code,
        details: usuariosError.details,
        hint: usuariosError.hint
      });
    } else {
      console.log('👥 Usuarios encontrados:', usuarios?.length || 0);
      if (usuarios && usuarios.length > 0) {
        usuarios.forEach((user, index) => {
          console.log(`${index + 1}. ${user.nombre} (${user.correo_electronico}) - Verificado: ${user.verificado}`);
        });
      }
    }
    
    // Verificar si existe el email específico
    const testEmails = ['test@example.com', 'usuario.prueba@example.com'];
    
    for (const email of testEmails) {
      const { data: specificUser, error: specificError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('correo_electronico', email)
        .maybeSingle();
        
      if (specificError) {
        console.error(`❌ Error al buscar ${email}:`, specificError);
      } else {
        console.log(`🔍 Usuario ${email}:`, specificUser ? 'Existe' : 'No existe');
        if (specificUser) {
          console.log('📋 Detalles:', {
            id: specificUser.id,
            nombre: specificUser.nombre,
            verificado: specificUser.verificado,
            fecha_creacion: specificUser.fecha_creacion
          });
        }
      }
    }
    
    // Verificar sesión actual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error al verificar sesión:', sessionError);
    } else {
      console.log('🔐 Sesión actual:', session ? `${session.user.email}` : 'No hay sesión');
    }
    
    // Verificar usuarios en Supabase Auth también
    console.log('\n🔐 Verificando usuarios en Supabase Auth...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error al consultar Auth users:', authError);
    } else {
      console.log('👥 Auth usuarios encontrados:', authUsers.users?.length || 0);
      authUsers.users?.slice(0, 5).forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} - Verificado: ${user.email_confirmed_at ? 'true' : 'false'} - ID: ${user.id}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkUsers();
