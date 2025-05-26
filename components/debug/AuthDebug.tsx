"use client";

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function AuthDebug() {
  const { isAuthenticated, user, userData, isLoading, login, logout } = useAuth();

  const handleTestLogin = async () => {
    console.log('🧪 Probando login...');
    const result = await login({
      email: 'usuario.prueba@example.com',
      password: 'testpassword123'
    });
    console.log('🧪 Resultado del login:', result);
  };

  const handleTestLogout = async () => {
    console.log('🧪 Probando logout...');
    const result = await logout();
    console.log('🧪 Resultado del logout:', result);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px',
      borderRadius: '8px',
      zIndex: 9999,
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <div><strong>Auth Debug</strong></div>
      <div>Loading: {isLoading ? 'YES' : 'NO'}</div>
      <div>Authenticated: {isAuthenticated ? 'YES' : 'NO'}</div>
      <div>User: {user?.email || 'None'}</div>
      <div>UserData: {userData?.nombre || 'None'}</div>
      <div style={{ marginTop: '10px' }}>
        <Button onClick={handleTestLogin} size="sm" style={{ marginRight: '5px' }}>
          Test Login
        </Button>
        <Button onClick={handleTestLogout} size="sm" variant="outline">
          Test Logout
        </Button>
      </div>
    </div>
  );
}
