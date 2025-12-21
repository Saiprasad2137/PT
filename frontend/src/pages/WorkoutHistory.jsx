import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHistory, FaClock } from 'react-icons/fa';
import workoutService from '../features/workoutService';
import BackButton from '../components/BackButton';

function WorkoutHistory() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || user.role !== 'client') {
                    navigate('/login');
                    return;
                }

                const data = await workoutService.getLogs(user.token); // We need to ensure logic exists for this
                // Note: getLogs might rely on a backend endpoint I need to confirm is wired up in the service.
                // Looking at previous turn, getLogs IS in workoutController and exported in workoutService.
                setLogs(data);
            } catch (error) {
                toast.error('Failed to fetch history');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, [navigate]);

    return (
        <div className='dashboard-container'>
            <BackButton url='/dashboard' />

            <section className='heading'>
                <h1>Workout History</h1>
                <p>Your fitness journey timeline</p>
            </section>

            {isLoading ? (
                <div className="spinner"></div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '800px', margin: '0 auto' }}>
                    {logs.length > 0 ? (
                        logs.map((log) => (
                            <div key={log._id} className='dashboard-card' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                        <FaHistory color="#4facfe" />
                                        <h3 style={{ margin: 0 }}>{new Date(log.date).toLocaleDateString()}</h3>
                                    </div>
                                    <p style={{ margin: 0, color: '#ccc' }}>{log.notes}</p>
                                </div>
                                <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                                        <FaClock color="#888" />
                                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{log.duration}</span>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>mins</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center' }}>No workouts logged yet. Go log one!</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default WorkoutHistory;
