import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userService from '../features/userService';
import { FaUser, FaSearch } from 'react-icons/fa';
import BackButton from '../components/BackButton';

function MyClients() {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || user.role !== 'trainer') {
                    navigate('/login');
                    return;
                }

                const data = await userService.getClients(user.token);
                setClients(data);
            } catch (error) {
                toast.error('Failed to fetch clients');
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, [navigate]);

    if (isLoading) {
        return <div className="loading-spinner"></div>;
    }

    return (
        <div className="page-container">
            <BackButton url="/dashboard" />
            <header className="page-header">
                <h1>My Clients</h1>
                <p>Manage and track your trainees</p>
            </header>

            <div className="data-grid">
                {clients.length > 0 ? (
                    clients.map((client) => (
                        <div key={client._id} className="data-card client-card">
                            <div className="card-header">
                                <div className="icon-wrapper">
                                    <FaUser />
                                </div>
                                <h3>{client.name}</h3>
                            </div>
                            <div className="card-body">
                                <p><strong>Email:</strong> {client.email}</p>
                                <p><strong>Joined:</strong> {new Date(client.createdAt).toLocaleDateString()}</p>
                                <button className="btn-secondary" style={{ marginTop: '1rem', width: '100%' }}>
                                    View Progress
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No clients have hired you yet.</p>
                        <small>Clients can hire you from the "Find Trainer" page.</small>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyClients;
