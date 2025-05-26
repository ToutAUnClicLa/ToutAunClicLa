import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      );
    }

    // Usar cliente admin para todas las operaciones
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Buscar en nuestra tabla
    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('correo_electronico', email)
      .single();

    // 2. Buscar en Supabase Auth
    const { data: authUsers, error: authListError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });

    const authUser = authUsers?.users.find(u => u.email === email);

    // 3. Probar autenticación directa con diferentes clientes
    let directAuthTest = null;
    let serverClientTest = null;
    
    try {
      // Prueba con cliente admin
      const { data: testAuthData, error: testAuthError } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password: 'TestPassword123!' // Solo para testing
      });
      
      directAuthTest = {
        success: !testAuthError,
        error: testAuthError?.message,
        data: testAuthData ? 'Auth data present' : 'No auth data'
      };
    } catch (authTestError: any) {
      directAuthTest = {
        success: false,
        error: authTestError.message,
        data: null
      };
    }

    try {
      // Prueba con Route Handler Client
      const { createRouteHandlerClient } = require('@supabase/auth-helpers-nextjs');
      const { cookies } = require('next/headers');
      const supabaseServer = createRouteHandlerClient({ cookies });
      
      const { data: serverAuthData, error: serverAuthError } = await supabaseServer.auth.signInWithPassword({
        email,
        password: 'TestPassword123!'
      });
      
      serverClientTest = {
        success: !serverAuthError,
        error: serverAuthError?.message,
        data: serverAuthData ? 'Auth data present' : 'No auth data'
      };
    } catch (serverTestError: any) {
      serverClientTest = {
        success: false,
        error: serverTestError.message,
        data: null
      };
    }

    return NextResponse.json({
      email,
      customUser: userData ? {
        id: userData.id,
        email: userData.correo_electronico,
        verified: userData.verificado,
        created: userData.fecha_creacion
      } : null,
      customUserError: userError?.message,
      authUser: authUser ? {
        id: authUser.id,
        email: authUser.email,
        email_confirmed_at: authUser.email_confirmed_at,
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at
      } : null,
      authListError: authListError?.message,
      directAuthTest,
      serverClientTest,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error en debug login:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
