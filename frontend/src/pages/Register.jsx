import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaIdCard, FaRunning } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../features/authService';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'client',
        specialization: '',
        experience: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const { name, email, password, role, specialization, experience } = formData;
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (role === 'default') {
            toast.error('Please select a valid role');
            return;
        }

        const trimmedEmail = email.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            toast.error('Please enter a valid email address');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/;
        if (!passwordRegex.test(password)) {
            toast.error('Password must contain at least one uppercase letter, one lowercase letter, and one special character');
            return;
        }

        setIsLoading(true);

        try {
            const userData = { name, email: trimmedEmail, password, role, specialization, experience };
            await authService.register(userData);
            navigate('/dashboard');
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto py-12'>
            <div className='text-center mb-8 animate-fadeIn'>
                <h1 className='text-3xl font-bold mb-2'>
                    Join <span className='text-gradient'>ManageX</span>
                </h1>
                <p className='text-muted'>Start your fitness journey today</p>
            </div>

            <div className='card w-full animate-fadeIn'>
                <div className='text-center mb-6'>
                    <div className='inline-flex p-4 rounded-full bg-gray-800 text-primary text-2xl mb-4 shadow-lg border border-gray-700'>
                        <FaUserPlus />
                    </div>
                </div>

                <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                    <div className='input-group mb-0'>
                        <label className='input-label'>Full Name</label>
                        <div className='relative'>
                            <span className='absolute left-4 top-3.5 text-muted'><FaUser /></span>
                            <input
                                type='text'
                                className='form-input pl-11'
                                name='name'
                                value={name}
                                placeholder='John Doe'
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>

                    <div className='input-group mb-0'>
                        <label className='input-label'>Email Address</label>
                        <div className='relative'>
                            <span className='absolute left-4 top-3.5 text-muted'><FaEnvelope /></span>
                            <input
                                type='email'
                                className='form-input pl-11'
                                name='email'
                                value={email}
                                placeholder='john@example.com'
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>

                    <div className='input-group mb-0'>
                        <label className='input-label'>Password</label>
                        <div className='relative'>
                            <span className='absolute left-4 top-3.5 text-muted'><FaLock /></span>
                            <input
                                type='password'
                                className='form-input pl-11'
                                name='password'
                                value={password}
                                placeholder='Min 6 characters'
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>

                    <div className='input-group mb-0'>
                        <label className='input-label'>I am a...</label>
                        <div className='grid-2 gap-4'>
                            <label className={`cursor-pointer p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${role === 'client' ? 'border-primary bg-cyan-500 bg-opacity-10 text-primary' : 'border-gray-700 hover:bg-gray-800'}`}>
                                <input type='radio' name='role' value='client' checked={role === 'client'} onChange={onChange} className='hidden' />
                                <FaUser /> Client
                            </label>
                            <label className={`cursor-pointer p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${role === 'trainer' ? 'border-primary bg-cyan-500 bg-opacity-10 text-primary' : 'border-gray-700 hover:bg-gray-800'}`}>
                                <input type='radio' name='role' value='trainer' checked={role === 'trainer'} onChange={onChange} className='hidden' />
                                <FaRunning /> Trainer
                            </label>
                        </div>
                    </div>

                    {role === 'trainer' && (
                        <div className='animate-fadeIn flex flex-col gap-4 p-4 rounded-lg bg-gray-800 border border-gray-700'>
                            <div className='input-group mb-0'>
                                <label className='input-label'>Specialization</label>
                                <div className='relative'>
                                    <span className='absolute left-4 top-3.5 text-muted'><FaIdCard /></span>
                                    <input
                                        type='text'
                                        className='form-input pl-11'
                                        name='specialization'
                                        value={specialization}
                                        placeholder='e.g. Yoga, HIIT'
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='input-group mb-0'>
                                <label className='input-label'>Years Experience</label>
                                <div className='relative'>
                                    <span className='absolute left-4 top-3.5 text-muted'><FaIdCard /></span>
                                    <input
                                        type='text'
                                        className='form-input pl-11'
                                        name='experience'
                                        value={experience}
                                        placeholder='e.g. 5 years'
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='mt-6'>
                        <button type='submit' className='btn btn-primary w-full' disabled={isLoading}>
                            {isLoading ? <div className='spinner'></div> : 'Create Account'}
                        </button>
                    </div>

                    <div className='text-center mt-4'>
                        <p className='text-sm text-muted'>
                            Already have an account? <span className='text-primary cursor-pointer hover:underline' onClick={() => navigate('/login')}>Sign In</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
