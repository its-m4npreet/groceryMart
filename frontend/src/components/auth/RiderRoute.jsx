import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RiderRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user?.role !== 'rider') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RiderRoute;
