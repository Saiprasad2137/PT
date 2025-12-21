import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUser, FaDumbbell, FaFire, FaChartLine, FaUsers,
    FaPlusCircle, FaClipboardList, FaHistory, FaArrowRight
} from 'react-icons/fa';
import workoutService from '../features/workoutService';

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        workoutsCompleted: 0,
        streak: 0,
        activeClients: 0,
        plansActive: 0
    });
    const [recentLogs, setRecentLogs] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser) {
            navigate('/login');
            return;
        }
        setUser(loggedInUser);

        const fetchData = async () => {
            try {
                // Fetch Stats
                const statsData = await workoutService.getStats(loggedInUser.token);
                setStats(statsData);

                // Fetch Recent Logs if client
                if (loggedInUser.role === 'client') {
                    const logsData = await workoutService.getLogs(loggedInUser.token);
                    setRecentLogs(logsData.slice(0, 3)); // Top 3
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (!user) return null;

    const isTrainer = user.role === 'trainer';

    return (
        <div className='dashboard-content'>
            <header className='mb-8'>
                <h1 className='text-3xl font-bold mb-2'>
                    Welcome back, <span className='text-gradient'>{user.name.split(' ')[0]}</span>
                </h1>
                <p className='text-muted'>
                    {isTrainer
                        ? 'Manage your clients and training plans.'
                        : 'Track your progress and stay consistent.'}
                </p>
            </header>

            {/* Stats Grid */}
            <section className='grid-responsive mb-12'>
                <div className='card flex items-center gap-6'>
                    <div className='p-4 rounded-xl bg-opacity-10 bg-cyan-500 text-cyan-400 text-2xl'>
                        {isTrainer ? <FaUsers /> : <FaFire />}
                    </div>
                    <div>
                        <h3 className='text-sm text-muted font-medium uppercase tracking-wider'>
                            {isTrainer ? 'Active Clients' : 'Current Streak'}
                        </h3>
                        <p className='text-2xl font-bold text-white mt-1'>
                            {isTrainer ? stats.activeClients || 0 : `${stats.streak || 0} Days`}
                        </p>
                    </div>
                </div>

                <div className='card flex items-center gap-6'>
                    <div className='p-4 rounded-xl bg-opacity-10 bg-blue-500 text-blue-400 text-2xl'>
                        <FaDumbbell />
                    </div>
                    <div>
                        <h3 className='text-sm text-muted font-medium uppercase tracking-wider'>
                            {isTrainer ? 'Plans Created' : 'Workouts Done'}
                        </h3>
                        <p className='text-2xl font-bold text-white mt-1'>
                            {isTrainer ? stats.plansActive || 0 : stats.workoutsCompleted || 0}
                        </p>
                    </div>
                </div>

                <div className='card flex items-center gap-6'>
                    <div className='p-4 rounded-xl bg-opacity-10 bg-teal-500 text-teal-400 text-2xl'>
                        <FaChartLine />
                    </div>
                    <div>
                        <h3 className='text-sm text-muted font-medium uppercase tracking-wider'>
                            Performance
                        </h3>
                        <p className='text-2xl font-bold text-white mt-1'>
                            On Track
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className='grid-2' style={{ alignItems: 'start' }}>

                {/* Visual Quick Actions */}
                <section>
                    <h2 className='text-xl mb-6 flex items-center gap-2'>
                        <FaArrowRight className='text-primary text-sm' /> Quick Actions
                    </h2>
                    <div className='grid-2'>
                        {isTrainer ? (
                            <>
                                <button className='card hover:border-primary text-left group' onClick={() => navigate('/create-plan')}>
                                    <FaPlusCircle className='text-3xl text-primary mb-4 group-hover:scale-110 transition-transform' />
                                    <h3 className='text-lg font-bold'>Create Plan</h3>
                                    <p className='text-sm text-muted'>Design new workouts</p>
                                </button>
                                <button className='card hover:border-accent text-left group' onClick={() => navigate('/my-clients')}>
                                    <FaUsers className='text-3xl text-accent mb-4 group-hover:scale-110 transition-transform' />
                                    <h3 className='text-lg font-bold'>My Clients</h3>
                                    <p className='text-sm text-muted'>Monitor progress</p>
                                </button>
                            </>
                        ) : (
                            <>
                                <button className='card hover:border-primary text-left group' onClick={() => navigate('/log-progress')}>
                                    <FaClipboardList className='text-3xl text-primary mb-4 group-hover:scale-110 transition-transform' />
                                    <h3 className='text-lg font-bold'>Log Workout</h3>
                                    <p className='text-sm text-muted'>Track today's session</p>
                                </button>
                                <button className='card hover:border-accent text-left group' onClick={() => navigate('/find-trainer')}>
                                    <FaUsers className='text-3xl text-accent mb-4 group-hover:scale-110 transition-transform' />
                                    <h3 className='text-lg font-bold'>Find Trainer</h3>
                                    <p className='text-sm text-muted'>Get professional help</p>
                                </button>
                                <button className='card hover:border-secondary text-left group' onClick={() => navigate('/my-plans')}>
                                    <FaDumbbell className='text-3xl text-secondary mb-4 group-hover:scale-110 transition-transform' />
                                    <h3 className='text-lg font-bold'>My Plans</h3>
                                    <p className='text-sm text-muted'>View assigned routines</p>
                                </button>
                                <button className='card hover:border-warning text-left group' onClick={() => navigate('/history')}>
                                    <FaHistory className='text-3xl text-warning mb-4 group-hover:scale-110 transition-transform' />
                                    <h3 className='text-lg font-bold'>History</h3>
                                    <p className='text-sm text-muted'>Review past workouts</p>
                                </button>
                            </>
                        )}
                    </div>
                </section>

                {/* Recent Activity Feed */}
                <section>
                    <h2 className='text-xl mb-6 flex items-center gap-2'>
                        <FaHistory className='text-muted text-sm' /> Recent Activity
                    </h2>
                    <div className='flex flex-col gap-4'>
                        {recentLogs.length > 0 ? (
                            recentLogs.map(log => (
                                <div key={log._id} className='card p-4 flex justify-between items-center'>
                                    <div>
                                        <h4 className='font-bold text-white'>{log.plan ? 'Workout Plan' : 'Free Workout'}</h4>
                                        <p className='text-sm text-muted'>{new Date(log.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className='badge badge-success'>{log.duration} min</span>
                                </div>
                            ))
                        ) : (
                            <div className='card p-8 text-center text-muted border-dashed'>
                                <p>No recent activity available.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
