import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiSettings, FiUser, FiShield } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getCurrentUser } from '../api/services/auth';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Get current user
        const currentUser = getCurrentUser();
        console.log('Dashboard: Current user from localStorage:', currentUser ? currentUser.username : 'none');
        
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Dashboard: Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const stats = [
    { name: 'User Profile', value: user ? user.username : '...', icon: FiUser, color: 'bg-blue-500' },
    { name: 'Role', value: user && user.is_admin ? 'Admin' : 'User', icon: FiShield, color: 'bg-green-500' },
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          {user && user.is_admin && (
            <Button
              variant="outline"
              onClick={() => router.push('/admin')}
              className="flex items-center"
            >
              <FiSettings className="mr-2" />
              Admin Panel
            </Button>
          )}
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="flex items-center">
            <div className={`${stat.color} p-3 rounded-full mr-4`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Welcome Card */}
      <div className="mb-8">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Welcome to the Application Boilerplate</h2>
            <p className="mb-4 text-gray-600">
              This is a clean boilerplate with user authentication and account management features.
              Feel free to build your application on top of this foundation.
            </p>
            <p className="text-gray-600">
              The boilerplate includes:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 space-y-1">
              <li>User authentication (login/register)</li>
              <li>JWT token-based sessions</li>
              <li>User roles (admin/regular)</li>
              <li>Responsive layout with mobile support</li>
              <li>Admin dashboard</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

Dashboard.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Dashboard; 