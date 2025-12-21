import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlusCircle, FaTrash, FaSave } from 'react-icons/fa';
import workoutService from '../features/workoutService';
import BackButton from '../components/BackButton';

function CreatePlan() {
    const [title, setTitle] = useState('');
    const [targetMuscleGroup, setTargetMuscleGroup] = useState('');
    const [description, setDescription] = useState('');
    const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', notes: '' }]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleExerciseChange = (index, e) => {
        const { name, value } = e.target;
        const list = [...exercises];
        list[index][name] = value;
        setExercises(list);
    };

    const addExercise = () => {
        setExercises([...exercises, { name: '', sets: '', reps: '', notes: '' }]);
    };

    const removeExercise = (index) => {
        const list = [...exercises];
        list.splice(index, 1);
        setExercises(list);
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

        const planData = {
            title,
            targetMuscleGroup,
            description,
            exercises
        };

        try {
            await workoutService.createPlan(planData, user.token);
            toast.success('Workout Plan Created!');
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
                <h1>Create Workout Plan</h1>
                <p>Design a new routine for your clients</p>
            </section>

            <section className='form' style={{ maxWidth: '800px', margin: '0 auto' }}>
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <label>Plan Title</label>
                        <div className="input-wrapper">
                            <input
                                type='text'
                                className='form-control'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. 'Beginner Strength'"
                                required
                            />
                        </div>
                    </div>

                    <div className='form-group'>
                        <label>Target Muscle Group</label>
                        <div className="input-wrapper">
                            <select
                                className='form-control'
                                value={targetMuscleGroup}
                                onChange={(e) => setTargetMuscleGroup(e.target.value)}
                                style={{ appearance: 'auto' }}
                                required
                            >
                                <option value="">Select Muscle Group</option>
                                <option value="Chest">Chest</option>
                                <option value="Back">Back</option>
                                <option value="Legs">Legs</option>
                                <option value="Shoulders">Shoulders</option>
                                <option value="Arms">Arms</option>
                                <option value="Core">Core</option>
                                <option value="Full Body">Full Body</option>
                                <option value="Cardio">Cardio</option>
                                <option value="Yoga">Yoga</option>
                                <option value="Yoga (Asanas)">Yoga (Asanas)</option>
                                <option value="Acrobatics">Acrobatics</option>
                                <option value="Flexibility">Flexibility</option>
                            </select>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label>Description (Optional)</label>
                        <div className="input-wrapper">
                            <textarea
                                className='form-control'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief overview of the routine"
                            />
                        </div>
                    </div>

                    <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#e0e0e0' }}>Exercises</h3>

                    {exercises.map((exercise, index) => (
                        <div key={index} className='dashboard-card' style={{ marginBottom: '1.5rem', position: 'relative' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div className='form-group'>
                                    <input
                                        name='name'
                                        placeholder='Exercise Name'
                                        value={exercise.name}
                                        onChange={(e) => handleExerciseChange(index, e)}
                                        className='form-control'
                                        required
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <input
                                        name='sets'
                                        type='number'
                                        placeholder='Sets'
                                        value={exercise.sets}
                                        onChange={(e) => handleExerciseChange(index, e)}
                                        className='form-control'
                                        required
                                    />
                                    <input
                                        name='reps'
                                        placeholder='Reps'
                                        value={exercise.reps}
                                        onChange={(e) => handleExerciseChange(index, e)}
                                        className='form-control'
                                        required
                                    />
                                </div>
                            </div>
                            <input
                                name='notes'
                                placeholder='Notes (optional)'
                                value={exercise.notes}
                                onChange={(e) => handleExerciseChange(index, e)}
                                className='form-control'
                                style={{ marginTop: '10px' }}
                            />

                            {exercises.length > 1 && (
                                <button
                                    type='button'
                                    onClick={() => removeExercise(index)}
                                    style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '-10px',
                                        background: '#ff4d4d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '25px',
                                        height: '25px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <FaTrash size={12} />
                                </button>
                            )}
                        </div>
                    ))}

                    <button type='button' className='btn btn-block' style={{ background: '#4d4dff', marginBottom: '2rem' }} onClick={addExercise}>
                        <FaPlusCircle /> Add Exercise
                    </button>

                    <div className='form-group'>
                        <button type='submit' className='btn btn-block' disabled={isLoading}>
                            {isLoading ? (<><div className="spinner"></div> Saving...</>) : (<><FaSave /> Save Plan</>)}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default CreatePlan;
