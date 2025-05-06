import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../../components/layout/MainLayout';
import Card from '../../../components/ui/Card';
import { getCurrentUser } from '../../../api/services/auth';

const UserManagement = () => {
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
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [router]);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      </div>
      
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">User Management</h2>
        <p className="text-gray-600 mb-4">
          This is a placeholder for the user management interface. In a real application, you would be able to:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-1">
          <li>View all registered users</li>
          <li>Create new user accounts</li>
          <li>Edit user details and permissions</li>
          <li>Deactivate or delete user accounts</li>
          <li>Assign roles and permissions</li>
        </ul>
        <p className="text-gray-600">
          Extend this page by implementing the user management functionality according to your application's requirements.
        </p>
      </Card>
    </div>
  );
};

UserManagement.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default UserManagement; 