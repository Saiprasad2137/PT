import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import authService from '../features/authService';

function Header() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const onLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <header className='header'>
            <div className='logo' style={{ display: 'flex', alignItems: 'center' }}>
                <Link to='/'>Manage<span className='text-accent'>X</span></Link>
            </div>
            <ul style={{ marginLeft: 'auto', display: 'flex', gap: '20px' }}>
                {user ? (
                    <li>
                        <button className='btn' onClick={onLogout}>
                            <FaSignOutAlt /> Logout
                        </button>
                    </li>
                ) : (
                    <>
                        <li>
                            <Link to='/login' className='nav-btn'>
                                <FaSignInAlt /> Login
                            </Link>
                        </li>
                        <li>
                            <Link to='/register' className='nav-btn'>
                                <FaUserPlus /> Register
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </header>
    );
}

export default Header;
