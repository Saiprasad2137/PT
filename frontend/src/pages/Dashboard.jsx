import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaDumbbell, FaCalendarAlt, FaChartLine, FaUsers, FaPlusCircle, FaClipboardList, FaHistory } from 'react-icons/fa';
import workoutService from '../features/workoutService';

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        workoutsCompleted: 0,
        currentStreak: 0,
        activeClients: 0,
        plansActive: 0
    });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser) {
            navigate('/login');
        } else {
            setUser(loggedInUser);
            // Fetch stats
            const fetchStats = async () => {
                try {
                    const data = await workoutService.getStats(loggedInUser.token);
                    setStats(data);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchStats();
        }
    }, [navigate]);

    if (!user) return null;

    const isTrainer = user.role === 'trainer';

    return (
        <div className='dashboard-container'>
            <section className='welcome-banner'>
                <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
                <p>Here's what's happening with your {isTrainer ? 'trainees' : 'training'} today.</p>
            </section>

            <section className='stats-grid'>
                <div className='dashboard-card stat-card'>
                    <div className='stat-icon'>{isTrainer ? <FaUsers /> : <FaDumbbell />}</div>
                    <div className='stat-info'>
                        <h3>{isTrainer ? 'Active Clients' : 'Workouts Completed'}</h3>
                        <p className='stat-number'>{isTrainer ? stats.activeClients || 0 : stats.workoutsCompleted || 0}</p>
                    </div>
                </div>
                <div className='dashboard-card stat-card'>
                    <div className='stat-icon'><FaCalendarAlt /></div>
                    <div className='stat-info'>
                        <h3>Upcoming Sessions</h3>
                        <p className='stat-number'>0</p>
                    </div>
                </div>
                <div className='dashboard-card stat-card'>
                    <div className='stat-icon'><FaChartLine /></div>
                    <div className='stat-info'>
                        <h3>{isTrainer ? 'Plans Active' : 'Current Streak'}</h3>
                        <p className='stat-number'>{isTrainer ? stats.plansActive || 0 : stats.streak || 0}</p>
                    </div>
                </div>
            </section>

            <h2 className='section-title'>Quick Actions</h2>
            <section className='actions-grid'>
                {isTrainer ? (
                    <>
                        <button className='dashboard-card action-card' onClick={() => navigate('/my-clients')}>
                            <FaUsers className='action-icon' />
                            <span>My Clients</span>
                        </button>
                        <button className='dashboard-card action-card' onClick={() => navigate('/create-plan')}>
                            <FaPlusCircle className='action-icon' />
                            <span>Create Plan</span>
                        </button>
                        <button className='dashboard-card action-card' onClick={() => navigate('/my-plans')}>
                            <FaDumbbell className='action-icon' />
                            <span>View Plans</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button className='dashboard-card action-card' onClick={() => navigate('/find-trainer')}>
                            <FaUsers className='action-icon' />
                            <span>Find Trainer</span>
                        </button>
                        <button className='dashboard-card action-card' onClick={() => navigate('/log-progress')}>
                            <FaClipboardList className='action-icon' />
                            <span>Log Progress</span>
                        </button>
                        <button className='dashboard-card action-card' onClick={() => navigate('/history')}>
                            <FaHistory className='action-icon' />
                            <span>View History</span>
                        </button>
                        <button className='dashboard-card action-card' onClick={() => navigate('/my-plans')}>
                            <FaDumbbell className='action-icon' />
                            <span>View Workouts</span>
                        </button>
                    </>
                )}
            </section>
        </div>
    );
}

export default Dashboard;
