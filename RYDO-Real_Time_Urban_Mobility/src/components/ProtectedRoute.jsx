import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;