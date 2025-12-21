import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaDumbbell, FaSpa, FaRunning } from 'react-icons/fa';
import workoutService from '../features/workoutService';
import BackButton from '../components/BackButton';

function MyPlans() {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedPlan, setExpandedPlan] = useState(null);
    const [checkedExercises, setCheckedExercises] = useState({});

    const navigate = useNavigate();

    // Toggle plan expansion
    const togglePlan = (planId) => {
        if (expandedPlan === planId) {
            setExpandedPlan(null);
        } else {
            setExpandedPlan(planId);
        }
    };

    // Toggle exercise check
    const toggleExercise = (planId, exerciseIndex) => {
        const key = `${planId}-${exerciseIndex}`;
        setCheckedExercises(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    navigate('/login');
                    return;
                }

                const data = await workoutService.getPlans(user.token);
                setPlans(data);
            } catch (error) {
                toast.error('Failed to fetch plans');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlans();
    }, [navigate]);

    return (
        <div className='dashboard-container'>
            <BackButton url='/dashboard' />

            <section className='heading'>
                <h1>{JSON.parse(localStorage.getItem('user'))?.role === 'trainer' ? 'My Workout Plans' : 'Available Workout Plans'}</h1>
                <p>{JSON.parse(localStorage.getItem('user'))?.role === 'trainer' ? 'Manage the routines you\'ve created for clients' : 'Browse routines to perform'}</p>
            </section>

            {isLoading ? (
                <div className="spinner"></div>
            ) : (
                <div className='content-grid' style={{ display: 'grid', gap: '20px', gridTemplateColumns: expandedPlan ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {plans.length > 0 ? (
                        plans.map((plan) => (
                            <div
                                key={plan._id}
                                className='dashboard-card'
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    gridColumn: expandedPlan === plan._id ? '1 / -1' : 'auto',
                                    cursor: expandedPlan === plan._id ? 'default' : 'pointer',
                                    border: expandedPlan === plan._id ? '1px solid #4facfe' : '1px solid rgba(255,255,255,0.1)'
                                }}
                                onClick={() => !expandedPlan && togglePlan(plan._id)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%' }}>
                                            {['Yoga', 'Yoga (Asanas)', 'Flexibility'].includes(plan.targetMuscleGroup) ? (
                                                <FaSpa size={20} color="#00f2fe" />
                                            ) : ['Acrobatics', 'Cardio'].includes(plan.targetMuscleGroup) ? (
                                                <FaRunning size={20} color="#00f2fe" />
                                            ) : (
                                                <FaDumbbell size={20} color="#00f2fe" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0 }}>{plan.title}</h3>
                                            <span style={{
                                                background: '#333',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '0.7rem',
                                                color: '#4facfe',
                                                marginTop: '4px',
                                                display: 'inline-block'
                                            }}>
                                                {plan.targetMuscleGroup || 'General'}
                                            </span>
                                        </div>
                                    </div>
                                    {expandedPlan === plan._id && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); togglePlan(plan._id); }}
                                            className='btn'
                                            style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8rem', background: '#333' }}
                                        >
                                            Close View
                                        </button>
                                    )}
                                </div>

                                <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{plan.description || 'No description provided'}</p>

                                {expandedPlan === plan._id && (
                                    <div style={{ marginTop: '20px', borderTop: '1px solid #444', paddingTop: '20px' }}>
                                        <h4 style={{ marginBottom: '15px' }}>Exercises Checklist</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {plan.exercises.map((exercise, index) => {
                                                const isChecked = checkedExercises[`${plan._id}-${index}`];
                                                return (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '15px',
                                                            background: isChecked ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255,255,255,0.05)',
                                                            padding: '12px',
                                                            borderRadius: '8px',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={!!isChecked}
                                                            onChange={() => toggleExercise(plan._id, index)}
                                                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                                        />
                                                        <div style={{ opacity: isChecked ? 0.5 : 1, textDecoration: isChecked ? 'line-through' : 'none' }}>
                                                            <strong style={{ display: 'block', fontSize: '1.1rem' }}>{exercise.name}</strong>
                                                            <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#ccc', marginTop: '4px' }}>
                                                                <span>Sets: {exercise.sets}</span>
                                                                <span>Reps: {exercise.reps}</span>
                                                            </div>
                                                            {exercise.notes && <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>Note: {exercise.notes}</p>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <button
                                            className='btn'
                                            style={{ marginTop: '20px', background: 'linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate('/log-progress');
                                            }}
                                        >
                                            Finish & Log Workout
                                        </button>
                                    </div>
                                )}

                                {!expandedPlan && (
                                    <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>
                                            {plan.exercises.length} Exercises • Click to View
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No plans found. Create one to get started!</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default MyPlans;
