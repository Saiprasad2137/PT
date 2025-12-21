import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlusCircle, FaTrash, FaSave, FaDumbbell, FaListAlt, FaStickyNote } from 'react-icons/fa';
import workoutService from '../features/workoutService';
import BackButton from '../components/BackButton';

function CreatePlan() {
    const [title, setTitle] = useState('');
    const [targetMuscleGroup, setTargetMuscleGroup] = useState('');
    const [description, setDescription] = useState('');
    const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', notes: '' }]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'trainer') {
            navigate('/dashboard');
        }
    }, [navigate]);

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

        if (!title || !targetMuscleGroup) {
            toast.error('Please fill in required fields');
            return;
        }

        setIsLoading(true);

        const user = JSON.parse(localStorage.getItem('user'));

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
            const message = (error.response?.data?.message) || error.message || error.toString();
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='container py-8 max-w-4xl mx-auto'>
            <div className='mb-6'>
                <BackButton url='/dashboard' />
            </div>

            <div className='flex flex-col gap-8 animate-fadeIn'>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold mb-2'>Create Workout Plan</h1>
                    <p className='text-muted'>Design a comprehensive routine for your clients</p>
                </div>

                <form onSubmit={onSubmit} className='flex flex-col gap-6'>
                    {/* Plan Details Card */}
                    <div className='card'>
                        <h2 className='text-xl font-bold mb-6 flex items-center gap-2 border-b border-gray-700 pb-3'>
                            <FaListAlt className='text-primary' /> Plan Details
                        </h2>

                        <div className='grid-2 gap-6'>
                            <div className='input-group mb-0'>
                                <label className='input-label'>Plan Title</label>
                                <div className='relative'>
                                    <span className='absolute left-4 top-3.5 text-muted'><FaDumbbell /></span>
                                    <input
                                        type='text'
                                        className='form-input pl-11'
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. High Intensity Cardio"
                                        required
                                    />
                                </div>
                            </div>

                            <div className='input-group mb-0'>
                                <label className='input-label'>Target Muscle Group</label>
                                <div className='relative'>
                                    <select
                                        className='form-input cursor-pointer'
                                        value={targetMuscleGroup}
                                        onChange={(e) => setTargetMuscleGroup(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Category...</option>
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
                        </div>

                        <div className='input-group mt-6 mb-0'>
                            <label className='input-label'>Description</label>
                            <textarea
                                className='form-input'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Briefly describe the goal of this workout..."
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Exercises Card */}
                    <div className='card bg-opacity-50'>
                        <div className='flex items-center justify-between mb-6 border-b border-gray-700 pb-3'>
                            <h2 className='text-xl font-bold flex items-center gap-2'>
                                <FaDumbbell className='text-secondary' /> Activity List
                            </h2>
                            <button
                                type='button'
                                onClick={addExercise}
                                className='btn btn-secondary text-sm py-2'
                            >
                                <FaPlusCircle /> Add Activity
                            </button>
                        </div>

                        <div className='space-y-6'>
                            {exercises.map((exercise, index) => (
                                <div key={index} className='bg-gray-800 p-6 rounded-xl relative group transition-all hover:bg-opacity-80 border border-gray-700'>
                                    {exercises.length > 1 && (
                                        <button
                                            type='button'
                                            onClick={() => removeExercise(index)}
                                            className='absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors z-10'
                                            title="Remove Exercise"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    )}

                                    <div className='grid-responsive gap-4'>
                                        <div className='col-span-2'>
                                            <label className='text-xs text-muted font-bold uppercase mb-1 block'>Activity Name</label>
                                            <input
                                                name='name'
                                                placeholder='e.g. Bench Press'
                                                value={exercise.name}
                                                onChange={(e) => handleExerciseChange(index, e)}
                                                className='form-input bg-gray-900 border-gray-600'
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className='text-xs text-muted font-bold uppercase mb-1 block'>Sets/Duration</label>
                                            <input
                                                name='sets'
                                                placeholder='e.g. 3'
                                                value={exercise.sets}
                                                onChange={(e) => handleExerciseChange(index, e)}
                                                className='form-input bg-gray-900 border-gray-600'
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className='text-xs text-muted font-bold uppercase mb-1 block'>Reps/Distance</label>
                                            <input
                                                name='reps'
                                                placeholder='e.g. 12'
                                                value={exercise.reps}
                                                onChange={(e) => handleExerciseChange(index, e)}
                                                className='form-input bg-gray-900 border-gray-600'
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className='mt-4'>
                                        <div className='relative'>
                                            <span className='absolute left-3 top-3.5 text-muted'><FaStickyNote size={12} /></span>
                                            <input
                                                name='notes'
                                                placeholder='Special instructions (optional)'
                                                value={exercise.notes}
                                                onChange={(e) => handleExerciseChange(index, e)}
                                                className='form-input pl-10 text-sm bg-gray-900 border-gray-600'
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='mt-8 pt-6 border-t border-gray-700'>
                            <button type='button' className='btn btn-secondary w-full border-dashed border-2 bg-transparent hover:bg-gray-800' onClick={addExercise}>
                                <FaPlusCircle /> Add Another Activity
                            </button>
                        </div>
                    </div>

                    <div className='flex justify-end mt-4 mb-12'>
                        <button type='submit' className='btn btn-primary text-lg px-8 py-3 shadow-lg shadow-cyan-500/20' disabled={isLoading}>
                            {isLoading ? <div className='spinner'></div> : <><FaSave /> Publish Workout Plan</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePlan;
