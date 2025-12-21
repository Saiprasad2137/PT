import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaDumbbell,
    FaUsers,
    FaUserMd,
    FaHistory,
    FaSignOutAlt,
    FaShieldAlt
} from 'react-icons/fa';
import authService from '../features/authService';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) return null;

    const onLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Link to="/" className="brand-logo">ManageX</Link>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') || isActive('/')}`}>
                            <FaHome className="nav-icon" />
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    {/* Client Routes */}
                    {user.role === 'client' && (
                        <>
                            <li>
                                <Link to="/find-trainer" className={`nav-item ${isActive('/find-trainer')}`}>
                                    <FaUserMd className="nav-icon" />
                                    <span>Find Trainer</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-plans" className={`nav-item ${isActive('/my-plans')}`}>
                                    <FaDumbbell className="nav-icon" />
                                    <span>My Plans</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/history" className={`nav-item ${isActive('/history')}`}>
                                    <FaHistory className="nav-icon" />
                                    <span>History</span>
                                </Link>
                            </li>
                        </>
                    )}

                    {/* Trainer Routes */}
                    {user.role === 'trainer' && (
                        <>
                            <li>
                                <Link to="/my-clients" className={`nav-item ${isActive('/my-clients')}`}>
                                    <FaUsers className="nav-icon" />
                                    <span>My Clients</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-plans" className={`nav-item ${isActive('/my-plans')}`}>
                                    <FaDumbbell className="nav-icon" />
                                    <span>Manage Plans</span>
                                </Link>
                            </li>
                        </>
                    )}

                    {/* Admin Routes */}
                    {(user.role === 'admin' || user.isAdmin) && (
                        <li>
                            <Link to="/admin" className={`nav-item ${isActive('/admin')}`}>
                                <FaShieldAlt className="nav-icon" />
                                <span>Admin Panel</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                    <div className="user-details">
                        <span className="user-name">{user.name}</span>
                        <span className="user-role">{user.role}</span>
                    </div>
                </div>
                <button onClick={onLogout} className="logout-btn">
                    <FaSignOutAlt />
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
