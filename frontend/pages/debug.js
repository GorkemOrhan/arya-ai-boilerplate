import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, getCurrentUser, validateToken } from '../api/services/auth';
import Cookies from 'js-cookie';

export default function Debug() {
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState({
    isLoading: true,
    isAuthenticated: false,
    currentUser: null,
    tokenValidation: null,
    token: null,
    error: null
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check if authenticated
        const authenticated = isAuthenticated();
        console.log('Debug: Is authenticated:', authenticated);
        
        // Get token
        const token = Cookies.get('token');
        console.log('Debug: Token exists:', !!token);
        console.log('Debug: Token length:', token ? token.length : 0);
        
        // Get current user
        const user = getCurrentUser();
        console.log('Debug: Current user:', user);
        console.log('Debug: Is admin:', user?.is_admin);
        
        // Validate token
        let validationResult = null;
        try {
          if (token) {
            validationResult = await validateToken();
            console.log('Debug: Token validation result:', validationResult);
          }
        } catch (validationError) {
          console.error('Debug: Token validation error:', validationError);
        }
        
        setDebugInfo({
          isLoading: false,
          isAuthenticated: authenticated,
          currentUser: user,
          tokenValidation: validationResult,
          token: token ? `${token.substring(0, 10)}...` : null,
          error: null
        });
      } catch (error) {
        console.error('Debug: Error in auth check:', error);
        setDebugInfo({
          isLoading: false,
          error: error.message
        });
      }
    }
    
    checkAuth();
  }, []);
  
  const goToLogin = () => router.push('/login');
  const goToDashboard = () => router.push('/dashboard');
  const goToAdmin = () => router.push('/admin');
  
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>
      
      {debugInfo.isLoading ? (
        <p>Loading...</p>
      ) : debugInfo.error ? (
        <div className="bg-red-100 p-4 rounded mb-4">
          <p className="text-red-700">Error: {debugInfo.error}</p>
        </div>
      ) : (
        <div>
          <div className="mb-6 bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
            <p><strong>Is Authenticated:</strong> {debugInfo.isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Token (partial):</strong> {debugInfo.token || 'None'}</p>
          </div>
          
          <div className="mb-6 bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">User Information</h2>
            {debugInfo.currentUser ? (
              <div>
                <p><strong>Username:</strong> {debugInfo.currentUser.username}</p>
                <p><strong>Email:</strong> {debugInfo.currentUser.email}</p>
                <p><strong>Is Admin:</strong> {debugInfo.currentUser.is_admin ? 'Yes' : 'No'}</p>
                <p><strong>User ID:</strong> {debugInfo.currentUser.id}</p>
              </div>
            ) : (
              <p>No user information found</p>
            )}
          </div>
          
          <div className="mb-6 bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Token Validation</h2>
            {debugInfo.tokenValidation ? (
              <div>
                <p><strong>Valid:</strong> {debugInfo.tokenValidation.valid ? 'Yes' : 'No'}</p>
                {debugInfo.tokenValidation.user && (
                  <div className="mt-2">
                    <p><strong>Validated User:</strong> {debugInfo.tokenValidation.user.username}</p>
                    <p><strong>Validated Admin Status:</strong> {debugInfo.tokenValidation.user.is_admin ? 'Yes' : 'No'}</p>
                  </div>
                )}
              </div>
            ) : (
              <p>No token validation information</p>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={goToLogin} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Login
            </button>
            <button 
              onClick={goToDashboard} 
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Dashboard
            </button>
            <button 
              onClick={goToAdmin} 
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Admin
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 