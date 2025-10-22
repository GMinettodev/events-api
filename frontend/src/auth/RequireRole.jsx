import { Navigate } from 'react-router-dom';
import { useAuth } from './UseAuth';

export default function RequireRole({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or a loading spinner

  if (!user || user.role !== role) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
