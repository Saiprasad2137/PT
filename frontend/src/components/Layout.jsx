import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header'; // Keep Header for public pages if needed

function Layout({ children }) {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    // Define public routes where Sidebar shouldn't appear
    const isPublic = ['/login', '/register'].includes(location.pathname) || !user;

    return (
        <div className="page-wrapper">
            {!isPublic && <Sidebar />}

            <main className={isPublic ? 'public-content' : 'main-content'}>
                {/* Optional: Show public header on login/register */}
                {isPublic && location.pathname !== '/' && <div style={{ marginBottom: '2rem' }}><Header /></div>}
                {children}
            </main>
        </div>
    );
}

export default Layout;
