import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiUsers, FiSettings } from 'react-icons/fi';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import { getCurrentUser } from '../../api/services/auth';

const AdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Get current user
        const currentUser = getCurrentUser();
        
        // Check if user is admin
        if (!currentUser || !currentUser.is_admin) {
          router.push('/dashboard');
          return;
        }
        
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [router]);
  
  const adminModules = [
    { 
      name: 'User Management', 
      description: 'Manage users and permissions',
      icon: FiUsers, 
      color: 'bg-blue-500',
      link: '/admin/users'
    },
    { 
      name: 'System Settings', 
      description: 'Configure system settings and preferences',
      icon: FiSettings, 
      color: 'bg-gray-500',
      link: '/admin/settings'
    }
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
      
      {/* Admin Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {adminModules.map((module) => (
          <Card key={module.name} className="hover:shadow-lg transition-shadow duration-200">
            <Link href={module.link} className="block p-6">
              <div className="flex items-center mb-4">
                <div className={`${module.color} p-3 rounded-full mr-4`}>
                  <module.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{module.name}</h3>
              </div>
              <p className="text-gray-600">{module.description}</p>
            </Link>
          </Card>
        ))}
      </div>
      
      {/* Admin Information */}
      <div className="mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Information</h2>
          <p className="text-gray-600 mb-4">
            As an administrator, you have access to special features and capabilities to manage the application.
            Use the modules above to navigate to different administrative functions.
          </p>
          <p className="text-gray-600">
            This boilerplate provides a foundation for building administrative interfaces.
            You can extend this dashboard with your own custom admin modules and functionality.
          </p>
        </Card>
      </div>
    </div>
  );
};

AdminDashboard.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default AdminDashboard; 