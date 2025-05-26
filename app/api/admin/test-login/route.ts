import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    console.log('=== LOGIN TEST START ===');
    console.log('Email:', email);
    console.log('Password length:', password?.length);
    
    // Test 1: Route Handler Client
    const supabaseServer = createRouteHandlerClient({ cookies });
    const { data: authData1, error: authError1 } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Route Handler Client Result:', {
      hasData: !!authData1,
      hasError: !!authError1,
      errorMessage: authError1?.message,
      errorCode: authError1?.name,
      userData: authData1?.user ? 'User present' : 'No user'
    });

    // Test 2: Admin Client  
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: authData2, error: authError2 } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Admin Client Result:', {
      hasData: !!authData2,
      hasError: !!authError2,
      errorMessage: authError2?.message,
      errorCode: authError2?.name,
      userData: authData2?.user ? 'User present' : 'No user'
    });

    // Test 3: Basic client
    const supabaseBasic = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: authData3, error: authError3 } = await supabaseBasic.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Basic Client Result:', {
      hasData: !!authData3,
      hasError: !!authError3,
      errorMessage: authError3?.message,
      errorCode: authError3?.name,
      userData: authData3?.user ? 'User present' : 'No user'
    });

    console.log('=== LOGIN TEST END ===');

    return NextResponse.json({
      routeHandlerTest: {
        success: !authError1,
        error: authError1?.message
      },
      adminTest: {
        success: !authError2,
        error: authError2?.message
      },
      basicTest: {
        success: !authError3,
        error: authError3?.message
      }
    });

  } catch (error: any) {
    console.error('Error en test login:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
