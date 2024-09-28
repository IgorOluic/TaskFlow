import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Center, Spinner } from '@chakra-ui/react';
import useAuth from '../../hooks/useAuth';

interface PrivateRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: PrivateRouteProps) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
