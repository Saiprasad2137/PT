import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaCalendarAlt, FaDumbbell, FaCheckSquare, FaSquare } from 'react-icons/fa';
import workoutService from '../features/workoutService';
import BackButton from '../components/BackButton';

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
            if (user) {
                try {
                    const data = await workoutService.getPlans(user.token);
                    setPlans(data);
                } catch (error) {
                    toast.error('Could not load workout plans');
                }
            }
        }
        fetchPlans();
    }, []);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        // Initialize exercise logs based on plan
        const initialLogs = plan.exercises.map(ex => ({
            name: ex.name,
            setsCompleted: ex.sets, // Default to target sets
            isCompleted: false
        }));
        setExerciseLogs(initialLogs);
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
            toast.error('You must be logged in');
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
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='dashboard-container'>
            <BackButton url='/dashboard' />

            <section className='heading'>
                <h1>Log Workout Progress</h1>
                <p>Track your sessions to see your improvement</p>
            </section>

            {step === 1 && (
                <div className='step-container' style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Select a Workout Plan to Log</h3>
                    <div className='data-grid'>
                        {plans.map(plan => (
                            <div key={plan._id} className='data-card' onClick={() => handlePlanSelect(plan)} style={{ cursor: 'pointer' }}>
                                <div className='card-header'>
                                    <div className='icon-wrapper'><FaDumbbell /></div>
                                    <h3>{plan.title}</h3>
                                </div>
                                <div className='card-body'>
                                    <p><strong>Target:</strong> {plan.targetMuscleGroup}</p>
                                    <p>{plan.exercises.length} Exercises</p>
                                    <button className="btn-secondary" style={{ width: '100%', marginTop: '10px' }}>Log this Workout</button>
                                </div>
                            </div>
                        ))}
                        <div className='data-card' onClick={() => { setSelectedPlan(null); setExerciseLogs([]); setStep(2); }} style={{ cursor: 'pointer', border: '2px dashed rgba(255,255,255,0.2)' }}>
                            <div className='card-header'>
                                <div className='icon-wrapper'><FaCalendarAlt /></div>
                                <h3>Free Workout</h3>
                            </div>
                            <div className='card-body'>
                                <p>Log a workout without a plan</p>
                                <button className="btn-secondary" style={{ width: '100%', marginTop: '10px' }}>Log Manual</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <section className='form' style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <form onSubmit={onSubmit}>
                        {selectedPlan && (
                            <div className="plan-summary" style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                <h3>{selectedPlan.title}</h3>
                                <p className="text-sm">Target: {selectedPlan.targetMuscleGroup}</p>

                                <h4 style={{ marginTop: '15px', marginBottom: '10px' }}>Exercises</h4>
                                {exerciseLogs.map((ex, index) => (
                                    <div key={index} className="exercise-check-item"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '10px',
                                            marginBottom: '5px',
                                            background: ex.isCompleted ? 'rgba(77, 255, 148, 0.1)' : 'transparent',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => toggleExercise(index)}
                                    >
                                        <span>{ex.name} ({ex.setsCompleted} sets)</span>
                                        {ex.isCompleted ? <FaCheckSquare color="#4dff94" size={24} /> : <FaSquare color="rgba(255,255,255,0.3)" size={24} />}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className='form-group'>
                            <label>Date</label>
                            <div className="input-wrapper">
                                <FaCalendarAlt className="icon" />
                                <input
                                    type='date'
                                    className='form-control'
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className='form-group'>
                            <label>Duration (minutes)</label>
                            <div className="input-wrapper">
                                <input
                                    type='number'
                                    className='form-control'
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    placeholder="e.g. 45"
                                    required
                                />
                            </div>
                        </div>

                        <div className='form-group'>
                            <label>Session Details</label>
                            <div className="input-wrapper">
                                <textarea
                                    className='form-control'
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="How did it feel? Weights used?"
                                    rows="5"
                                    required
                                />
                            </div>
                        </div>

                        <div className='form-group'>
                            <button type='button' className='btn btn-video' onClick={() => setStep(1)} style={{ marginRight: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)' }}>
                                Change Plan
                            </button>
                            <button type='submit' className='btn btn-block' disabled={isLoading} style={{ width: 'auto', flex: 1 }}>
                                {isLoading ? (<><div className="spinner"></div> Saving...</>) : (<><FaSave /> Save Workout Log</>)}
                            </button>
                        </div>
                    </form>
                </section>
            )}
        </div>
    );
}

export default LogProgress;
