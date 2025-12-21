import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminService from '../features/adminService';
import { FaCheckCircle, FaUserClock, FaIdBadge } from 'react-icons/fa';

function AdminDashboard() {
    const [trainers, setTrainers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            navigate('/login');
            return;
        }

        if (!user.isAdmin) {
            navigate('/dashboard');
            return;
        }

        const fetchPendingTrainers = async () => {
            try {
                const data = await adminService.getPendingTrainers(user.token);
                setTrainers(data);
            } catch (error) {
                toast.error('Failed to fetch pending applications');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingTrainers();
    }, [navigate]);

    const handleVerify = async (id) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await adminService.verifyTrainer(id, user.token);
            setTrainers(trainers.filter((trainer) => trainer._id !== id));
            toast.success('Trainer verified successfully');
        } catch (error) {
            toast.error('Failed to verify trainer');
        }
    };

    if (isLoading) {
        return <div className="loading-spinner"></div>;
    }

    return (
        <div className="page-container">
            <header className="page-header">
                <h1>Admin Dashboard</h1>
                <p>Verify and manage trainer applications</p>
            </header>

            <div className="data-grid">
                {trainers.length > 0 ? (
                    trainers.map((trainer) => (
                        <div key={trainer._id} className="data-card trainer-card">
                            <div className="card-header">
                                <div className="icon-wrapper">
                                    <FaUserClock />
                                </div>
                                <h3>{trainer.name}</h3>
                            </div>
                            <div className="card-body">
                                <p><strong>Email:</strong> {trainer.email}</p>
                                <div style={{ margin: '10px 0', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                    <p><strong>Specialization:</strong> {trainer.specialization || 'N/A'}</p>
                                    <p><strong>Experience:</strong> {trainer.experience || 'N/A'}</p>
                                </div>
                                <button
                                    className="btn-primary"
                                    style={{ marginTop: '1rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                    onClick={() => handleVerify(trainer._id)}
                                >
                                    <FaCheckCircle /> Approve Application
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <FaIdBadge style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.7 }} />
                        <p>No pending trainer applications.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
