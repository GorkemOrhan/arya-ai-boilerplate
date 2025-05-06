import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiHome, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { isAuthenticated, logout, getCurrentUser } from '../../api/services/auth';
import Cookies from 'js-cookie';

const MainLayout = ({ children }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Add a boolean to prevent multiple redirects
    let isMounted = true;
    let redirectInProgress = false;
    
    const checkAuth = async () => {
      try {
        // Check local authentication first
        const isLocallyAuthenticated = isAuthenticated();
        console.log('LocalLayout: Token exists in cookies:', isLocallyAuthenticated);
        
        // If not even locally authenticated, redirect to login immediately
        if (!isLocallyAuthenticated) {
          console.log('MainLayout: No token found, redirecting to login');
          if (isMounted && !redirectInProgress) {
            redirectInProgress = true;
            router.push('/login');
          }
          return;
        }
        
        // Get current user from localStorage
        const currentUser = getCurrentUser();
        console.log('MainLayout: Current user from localStorage:', currentUser ? currentUser.username : 'none');
        
        if (currentUser) {
          setUser(currentUser);
        }
        
        // As an additional check, validate the token with the backend
        // This helps ensure the token is actually valid
        // But we don't redirect immediately if this fails
        try {
          const validation = await fetch('http://localhost:5000/api/auth/validate-token', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${Cookies.get('token')}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (validation.ok) {
            console.log('MainLayout: Token validated successfully with backend');
          } else {
            console.warn('MainLayout: Token validation failed, status:', validation.status);
            // Don't redirect here, just log it
          }
        } catch (err) {
          console.error('MainLayout: Error validating token with backend:', err);
          // Network error - don't redirect as it might be a temporary issue
        }
      } catch (error) {
        console.error('MainLayout: Error in authentication check:', error);
      }
    };
    
    checkAuth();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [router]);
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const navigation = [
    { name: 'User Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Admin Dashboard', href: '/admin', icon: FiSettings },
  ];
  
  return (
    <div className="min-h-full">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="fixed inset-0 flex z-40">
          {/* Mobile menu button */}
          <button
            type="button"
            className="fixed top-4 right-4 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <FiX className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <FiMenu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
          
          {/* Mobile menu panel */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 flex">
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleMobileMenu}></div>
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <Link href="/dashboard" className="text-xl font-bold text-primary-600 hover:text-primary-700">
                      App Boilerplate
                    </Link>
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                          item.href === '/dashboard' || item.href === '/admin'
                            ? router.pathname === item.href
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            : router.pathname.startsWith(item.href)
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon
                          className={`mr-4 flex-shrink-0 h-6 w-6 ${
                            item.href === '/dashboard' || item.href === '/admin'
                              ? router.pathname === item.href
                                ? 'text-primary-500'
                                : 'text-gray-400 group-hover:text-gray-500'
                              : router.pathname.startsWith(item.href)
                                ? 'text-primary-500'
                                : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-base font-medium text-gray-600 hover:text-gray-900"
                  >
                    <FiLogOut className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link href="/dashboard" className="text-xl font-bold text-primary-600 hover:text-primary-700">
                App Boilerplate
              </Link>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.href === '/dashboard' || item.href === '/admin'
                      ? router.pathname === item.href
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      : router.pathname.startsWith(item.href)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 ${
                      item.href === '/dashboard' || item.href === '/admin'
                        ? router.pathname === item.href
                          ? 'text-primary-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                        : router.pathname.startsWith(item.href)
                          ? 'text-primary-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="group flex items-center px-2 py-2 text-sm font-medium w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              <FiLogOut className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-10">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 