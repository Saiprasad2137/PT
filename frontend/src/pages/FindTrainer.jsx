import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userService from '../features/userService';
import { FaUserMd, FaEnvelope } from 'react-icons/fa';
import BackButton from '../components/BackButton';

function FindTrainer() {
    const [trainers, setTrainers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    navigate('/login');
                    return;
                }

                const data = await userService.getTrainers(user.token);
                setTrainers(data);
            } catch (error) {
                toast.error('Failed to fetch trainers');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrainers();
    }, [navigate]);

    if (isLoading) {
        return <div className="loading-spinner"></div>;
    }

    return (
        <div className="page-container">
            <BackButton url="/dashboard" />
            <header className="page-header">
                <h1>Find a Trainer</h1>
                <p>Connect with professional trainers to reach your goals</p>
            </header>

            <div className="data-grid">
                {trainers.length > 0 ? (
                    trainers.map((trainer) => (
                        <div key={trainer._id} className="data-card trainer-card">
                            <div className="card-header">
                                <div className="icon-wrapper">
                                    <FaUserMd />
                                </div>
                                <h3>{trainer.name}</h3>
                            </div>
                            <div className="card-body">
                                <p><FaEnvelope style={{ marginRight: '8px' }} /> {trainer.email}</p>
                                <div className="trainer-actions">
                                    <button
                                        className="btn btn-primary"
                                        onClick={async () => {
                                            const confirm = window.confirm(`Do you want to hire ${trainer.name}?`);
                                            if (confirm) {
                                                try {
                                                    const user = JSON.parse(localStorage.getItem('user'));
                                                    await userService.hireTrainer(trainer._id, user.token);
                                                    toast.success(`You have successfully hired ${trainer.name}!`);
                                                } catch (error) {
                                                    toast.error('Failed to hire trainer. You may already have one.');
                                                }
                                            }
                                        }}
                                    >
                                        Hire Trainer
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => window.location.href = `mailto:${trainer.email}`}
                                    >
                                        <FaEnvelope /> Contact
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No trainers available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FindTrainer;
