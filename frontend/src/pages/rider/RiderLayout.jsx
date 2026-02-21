import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, Package, LogOut, Bike, Bell } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const navItems = [
    { to: '/rider', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/rider/orders', label: 'My Orders', icon: Package },
];

const RiderLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Nav */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                            <Bike className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-900 text-lg">Rider Portal</span>
                    </div>

                    {/* Nav links */}
                    <nav className="hidden sm:flex items-center gap-1">
                        {navItems.map(({ to, label, icon: Icon, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`
                                }
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User + Logout */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-xs text-emerald-600 font-medium">● Active</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:block">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Mobile bottom nav */}
                <div className="sm:hidden border-t border-gray-100 flex">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors ${isActive ? 'text-primary-700' : 'text-gray-500'
                                }`
                            }
                        >
                            <Icon className="h-5 w-5 mb-0.5" />
                            {label}
                        </NavLink>
                    ))}
                </div>
            </header>

            {/* Page content */}
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
};

export default RiderLayout;
