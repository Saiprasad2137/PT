import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaCalendarAlt, FaDumbbell, FaCheckSquare, FaSquare, FaRegSquare, FaCheckCircle, FaArrowLeft, FaClock } from 'react-icons/fa';
import workoutService from '../features/workoutService';

function LogProgress() {
    const [step, setStep] = useState(1); // 1 = Select Plan, 2 = Log Details
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Form state
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
    const [exerciseLogs, setExerciseLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                navigate('/login');
                return;
            }
            try {
                const data = await workoutService.getPlans(user.token);
                setPlans(data);
            } catch (error) {
                toast.error('Could not load workout plans');
            }
        }
        fetchPlans();
    }, [navigate]);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        // Initialize exercise logs
        const initialLogs = plan.exercises.map(ex => ({
            name: ex.name,
            setsCompleted: ex.sets,
            isCompleted: false
        }));
        setExerciseLogs(initialLogs);
        setStep(2);
    };

    const handleManualLog = () => {
        setSelectedPlan(null);
        setExerciseLogs([]);
        setStep(2);
    };

    const toggleExercise = (index) => {
        const logs = [...exerciseLogs];
        logs[index].isCompleted = !logs[index].isCompleted;
        setExerciseLogs(logs);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
            navigate('/login');
            return;
        }

        const logData = {
            date,
            duration,
            notes,
            plan: selectedPlan ? selectedPlan._id : null,
            exercises: exerciseLogs
        };

        try {
            await workoutService.logWorkout(logData, user.token);
            toast.success('Workout Logged Successfully!');
            navigate('/dashboard');
        } catch (error) {
            const message = (error.response?.data?.message) || error.message;
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='container py-8 max-w-4xl mx-auto'>
            {/* Header */}
            <div className='mb-8 flex items-center gap-4'>
                <button onClick={() => step === 2 ? setStep(1) : navigate('/dashboard')} className='btn btn-secondary p-2 rounded-full'>
                    <FaArrowLeft />
                </button>
                <div>
                    <h1 className='text-3xl font-bold'>Log Progress</h1>
                    <p className='text-muted'>Track your training session</p>
                </div>
            </div>

            {/* Step 1: Select Plan */}
            {step === 1 && (
                <div className='animate-fadeIn'>
                    <h2 className='text-xl font-bold mb-6'>What did you perform today?</h2>

                    <div className='grid-responsive'>
                        {/* Manual Log Card */}
                        <div
                            onClick={handleManualLog}
                            className='card cursor-pointer hover:border-primary group text-center flex flex-col items-center justify-center p-8'
                        >
                            <div className='bg-gray-800 p-4 rounded-full mb-4 text-2xl text-muted group-hover:text-primary transition-colors'>
                                <FaCalendarAlt />
                            </div>
                            <h3 className='font-bold text-lg'>Free Workout</h3>
                            <p className='text-sm text-muted mt-2'>Log a session without a specific plan</p>
                        </div>

                        {/* Existing Plans */}
                        {plans.map(plan => (
                            <div
                                key={plan._id}
                                onClick={() => handlePlanSelect(plan)}
                                className='card cursor-pointer hover:border-secondary group'
                            >
                                <div className='flex items-center gap-4 mb-4'>
                                    <div className='bg-blue-500 bg-opacity-10 p-3 rounded-lg text-blue-400'>
                                        <FaDumbbell />
                                    </div>
                                    <div>
                                        <h3 className='font-bold'>{plan.title}</h3>
                                        <span className='badge badge-primary mt-1'>{plan.targetMuscleGroup}</span>
                                    </div>
                                </div>
                                <div className='text-sm text-muted'>
                                    {plan.exercises.length} Exercises defined
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Log Details */}
            {step === 2 && (
                <form onSubmit={onSubmit} className='animate-fadeIn max-w-2xl mx-auto'>

                    {/* Selected Plan Summary */}
                    {selectedPlan && (
                        <div className='card mb-8 border-primary bg-primary bg-opacity-5'>
                            <h3 className='font-bold text-lg mb-4 flex items-center gap-2'>
                                <FaCheckCircle className='text-primary' /> {selectedPlan.title}
                            </h3>

                            <div className='space-y-2'>
                                {exerciseLogs.map((ex, index) => (
                                    <div
                                        key={index}
                                        onClick={() => toggleExercise(index)}
                                        className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all ${ex.isCompleted ? 'bg-green-900 bg-opacity-20 border border-green-800' : 'bg-gray-800 border border-transparent hover:border-gray-600'
                                            }`}
                                    >
                                        <span className={ex.isCompleted ? 'text-white' : 'text-muted'}>
                                            {ex.name} <span className='text-xs opacity-60 ml-1'>({ex.setsCompleted} sets)</span>
                                        </span>
                                        {ex.isCompleted ? <FaCheckSquare className='text-success text-xl' /> : <FaRegSquare className='text-muted text-xl' />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className='card space-y-6'>
                        <div className='grid-2'>
                            <div className='input-group mb-0'>
                                <label className='input-label'>Date</label>
                                <div className='relative'>
                                    <span className='absolute left-4 top-3.5 text-muted'><FaCalendarAlt /></span>
                                    <input
                                        type='date'
                                        className='form-input pl-11'
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='input-group mb-0'>
                                <label className='input-label'>Duration (min)</label>
                                <div className='relative'>
                                    <span className='absolute left-4 top-3.5 text-muted'><FaClock /></span>
                                    <input
                                        type='number'
                                        className='form-input pl-11'
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        placeholder='e.g. 60'
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='input-group mb-0'>
                            <label className='input-label'>Session Notes</label>
                            <textarea
                                className='form-input'
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder='How did the workout feel?'
                                rows='3'
                                required
                            />
                        </div>

                        <div className='pt-4'>
                            <button type='submit' className='btn btn-primary w-full text-lg py-4' disabled={isLoading}>
                                {isLoading ? <div className='spinner'></div> : <><FaSave /> Save Log</>}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

export default LogProgress;
