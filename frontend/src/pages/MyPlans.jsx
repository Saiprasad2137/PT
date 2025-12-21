import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaDumbbell, FaSpa, FaRunning, FaCheckCircle, FaCircle, FaChevronDown, FaChevronUp, FaClipboardList } from 'react-icons/fa';
import workoutService from '../features/workoutService';

function MyPlans() {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedPlan, setExpandedPlan] = useState(null);
    const [checkedExercises, setCheckedExercises] = useState({});

    // Get user from storage for role check
    const user = JSON.parse(localStorage.getItem('user'));
    const isTrainer = user?.role === 'trainer';

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
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

    const togglePlan = (planId) => {
        setExpandedPlan(expandedPlan === planId ? null : planId);
    };

    const toggleExercise = (planId, exerciseIndex) => {
        const key = `${planId}-${exerciseIndex}`;
        setCheckedExercises(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const getIcon = (muscleGroup) => {
        if (['Yoga', 'Yoga (Asanas)', 'Flexibility'].includes(muscleGroup)) return <FaSpa />;
        if (['Acrobatics', 'Cardio'].includes(muscleGroup)) return <FaRunning />;
        return <FaDumbbell />;
    };

    const getColorClass = (muscleGroup) => {
        if (['Yoga', 'Flexibility'].includes(muscleGroup)) return 'text-cyan-400 bg-cyan-500';
        if (['Cardio'].includes(muscleGroup)) return 'text-teal-400 bg-teal-500';
        return 'text-blue-400 bg-blue-500';
    };

    return (
        <div className='container py-8'>
            <header className='mb-8 border-b border-gray-800 pb-4'>
                <h1 className='text-3xl font-bold mb-2'>
                    {isTrainer ? 'Manage Plans' : 'Workout Library'}
                </h1>
                <p className='text-muted'>
                    {isTrainer ? 'Create and edit routines for your clients' : 'Browse and track your assigned workouts'}
                </p>
            </header>

            {isLoading ? (
                <div className='flex justify-center p-12'><div className='spinner'></div></div>
            ) : (
                <div className={expandedPlan ? 'flex flex-col gap-6' : 'grid-responsive'}>
                    {plans.length > 0 ? (
                        plans.map((plan) => {
                            const isExpanded = expandedPlan === plan._id;
                            const colorClass = getColorClass(plan.targetMuscleGroup);

                            return (
                                <div
                                    key={plan._id}
                                    onClick={() => !isExpanded && togglePlan(plan._id)}
                                    className={`card cursor-pointer transition-all ${isExpanded ? 'border-primary ring-1 ring-primary' : 'hover:border-gray-500'}`}
                                >
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-4'>
                                            <div className={`p-3 rounded-xl bg-opacity-10 ${colorClass} text-xl`}>
                                                {getIcon(plan.targetMuscleGroup)}
                                            </div>
                                            <div>
                                                <h3 className='font-bold text-lg'>{plan.title}</h3>
                                                <span className={`badge mt-1 ${plan.targetMuscleGroup === 'Yoga' ? 'badge-success' : 'badge-primary'
                                                    }`}>
                                                    {plan.targetMuscleGroup || 'General'}
                                                </span>
                                            </div>
                                        </div>
                                        {isExpanded ? (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); togglePlan(plan._id); }}
                                                className='btn btn-secondary text-sm'
                                            >
                                                Close <FaChevronUp />
                                            </button>
                                        ) : (
                                            <FaChevronDown className='text-muted' />
                                        )}
                                    </div>

                                    <div className={`mt-4 text-muted text-sm ${!isExpanded && 'line-clamp-2'}`}>
                                        {plan.description || 'No description provided.'}
                                    </div>

                                    {isExpanded && (
                                        <div className='mt-6 pt-6 border-t border-gray-700 animate-fadeIn'>
                                            <h4 className='font-bold mb-4 flex items-center gap-2'>
                                                <FaClipboardList /> Exercise Checklist
                                            </h4>
                                            <div className='flex flex-col gap-3'>
                                                {plan.exercises.map((exercise, index) => {
                                                    const isChecked = checkedExercises[`${plan._id}-${index}`];
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`p-3 rounded-lg flex items-start gap-3 transition-colors ${isChecked ? 'bg-green-900 bg-opacity-20 border border-green-800' : 'bg-gray-800'
                                                                }`}
                                                        >
                                                            <button
                                                                onClick={() => toggleExercise(plan._id, index)}
                                                                className={`mt-1 text-lg ${isChecked ? 'text-success' : 'text-muted'}`}
                                                            >
                                                                {isChecked ? <FaCheckCircle /> : <FaCircle />}
                                                            </button>
                                                            <div className={isChecked ? 'opacity-50 line-through' : ''}>
                                                                <strong className='block text-white'>{exercise.name}</strong>
                                                                <p className='text-sm text-muted mt-1'>
                                                                    {exercise.sets} sets x {exercise.reps} reps
                                                                    {exercise.notes && <span className='block italic text-xs mt-1 text-gray-500'>{exercise.notes}</span>}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className='mt-6 flex justify-end gap-3'>
                                                <button
                                                    className='btn btn-primary'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate('/log-progress');
                                                    }}
                                                >
                                                    Finish & Log
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className='col-span-full text-center p-12 text-muted'>
                            <p>No plans found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default MyPlans;
