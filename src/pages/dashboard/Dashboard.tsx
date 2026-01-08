import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import MemberDashboard from './MemberDashboard';

const Dashboard = () => {
  const { role } = useAuth();

  // E-board gets admin dashboard, everyone else gets member dashboard
  if (role === 'e-board') {
    return <AdminDashboard />;
  }

  return <MemberDashboard />;
};

export default Dashboard;