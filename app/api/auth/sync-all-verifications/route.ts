import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/database/client';

// Requiere autenticación, limita a 10 usuarios por llamada para evitar sobrecarga
const BATCH_SIZE = 10;

export async function POST(req: NextRequest) {
  try {
    // Verificar autorización - esto debería ser más robusto en producción
    // Por ejemplo, requerir una clave API o autenticación de administrador
    const authorization = req.headers.get('authorization');
    const secretKey = process.env.ADMIN_API_KEY;
    
    if (!secretKey || authorization !== `Bearer ${secretKey}`) {
      console.error('Intento de acceso no autorizado a sync-all-verifications');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // 1. Obtener todos los usuarios marcados como verificados en nuestra tabla personalizada
    const { data: verifiedUsers, error: usersError } = await supabase
      .from('usuarios')
      .select('id, correo_electronico, verificado')
      .eq('verificado', true)
      .limit(BATCH_SIZE);
    
    if (usersError) {
      console.error('Error al obtener usuarios verificados:', usersError);
      return NextResponse.json(
        { error: 'Error al obtener usuarios' },
        { status: 500 }
      );
    }

    if (!verifiedUsers || verifiedUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No se encontraron usuarios verificados para sincronizar',
        count: 0,
      });
    }
    
    // 2. Configurar Supabase Admin client con service_role
    const supabaseAdmin = createRouteHandlerClient<any>({ cookies }, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
    
    // 3. Obtener todos los usuarios de Auth para poder compararlos
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({});
    
    if (authError || !authData || !authData.users) {
      console.error('Error al obtener usuarios de Auth:', authError);
      return NextResponse.json(
        { error: 'Error al obtener usuarios de Auth' },
        { status: 500 }
      );
    }
    
    // 4. Para cada usuario verificado, comprobar si necesita sincronización
    const syncResults = [];
    let syncCount = 0;
    
    for (const user of verifiedUsers) {
      // Encontrar el usuario correspondiente en Auth
      const authUser = authData.users.find(u => u.email === user.correo_electronico);
      
      if (!authUser) {
        syncResults.push({
          email: user.correo_electronico,
          status: 'not_found_in_auth',
          success: false
        });
        continue;
      }
      
      // Si ya está confirmado en Auth, no hacemos nada
      if (authUser.email_confirmed_at) {
        syncResults.push({
          email: user.correo_electronico,
          status: 'already_confirmed',
          success: true
        });
        continue;
      }
      
      // Este usuario necesita sincronización
      try {
        // Intentar con la API admin primero
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          authUser.id,
          { 
            email_confirm: true,
            user_metadata: {
              ...authUser.user_metadata || {},
              email_verified: true,
              verified_at: new Date().toISOString()
            }
          }
        );
        
        if (updateError) {
          throw updateError;
        }
        
        // Intentar también con la función RPC directa
        try {
          await supabaseAdmin.rpc('confirm_user_email_rpc', { user_id: authUser.id });
        } catch (rpcError) {
          // Ignoramos errores de RPC, ya que la función puede no existir aún
          console.log('Nota: Error en RPC para usuario', user.correo_electronico, rpcError);
        }
        
        syncResults.push({
          email: user.correo_electronico,
          status: 'synchronized',
          success: true
        });
        
        syncCount++;
      } catch (syncError) {
        console.error('Error al sincronizar usuario', user.correo_electronico, syncError);
        syncResults.push({
          email: user.correo_electronico,
          status: 'error',
          error: (syncError as Error).message || 'Error desconocido',
          success: false
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Sincronización completada para ${syncCount} de ${verifiedUsers.length} usuarios`,
      results: syncResults,
      count: syncCount
    });
    
  } catch (error: any) {
    console.error('Error en sincronización masiva:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 