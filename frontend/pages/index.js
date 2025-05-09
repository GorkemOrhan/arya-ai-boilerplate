import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, getCurrentUser } from '../api/services/auth';

const Home = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect based on authentication status and user role
    if (isAuthenticated()) {
      // Get current user information
      const user = getCurrentUser();
      console.log('Home page: Authenticated user:', user);
      
      // If user is admin, redirect to admin dashboard
      if (user && user.is_admin) {
        console.log('Home page: Redirecting admin to admin dashboard');
        router.push('/admin');
      } else {
        console.log('Home page: Redirecting user to user dashboard');
        router.push('/dashboard');
      }
    } else {
      console.log('Home page: No authentication, redirecting to login');
      router.push('/login');
    }
  }, [router]);
  
  return (
    <div className="min-h-full flex items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
};

export default Home; 