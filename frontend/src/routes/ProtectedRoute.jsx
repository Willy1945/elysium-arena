import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'CUSTOMER') return <Navigate to="/dashboard" replace />;
    if (user.role === 'STAFF_CAFE') return <Navigate to="/cafe/dashboard" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}