import { useState, useEffect } from 'react';
import { FaSignInAlt, FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../features/authService';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const { email, password } = formData;
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            navigate(user.isAdmin ? '/admin' : '/dashboard');
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
        setIsLoading(true);

        try {
            const userData = { email, password };
            const user = await authService.login(userData);
            toast.success(`Welcome back, ${user.name}!`);
            navigate(user.isAdmin ? '/admin' : '/dashboard');
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto'>

            <div className='text-center mb-8 animate-fadeIn'>
                <h1 className='text-3xl font-bold mb-2'>
                    Welcome <span className='text-gradient'>Back</span>
                </h1>
                <p className='text-muted'>Sign in to continue your journey</p>
            </div>

            <div className='card w-full animate-fadeIn'>
                <div className='text-center mb-6'>
                    <div className='inline-flex p-4 rounded-full bg-gray-800 text-primary text-2xl mb-4 shadow-lg border border-gray-700'>
                        <FaSignInAlt />
                    </div>
                </div>

                <form onSubmit={onSubmit}>
                    <div className='input-group'>
                        <label className='input-label'>Email Address</label>
                        <div className='relative'>
                            <span className='absolute left-4 top-3.5 text-muted'>
                                <FaUser />
                            </span>
                            <input
                                type='email'
                                className='form-input pl-11'
                                id='email'
                                name='email'
                                value={email}
                                placeholder='Enter your email'
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>

                    <div className='input-group'>
                        <label className='input-label'>Password</label>
                        <div className='relative'>
                            <span className='absolute left-4 top-3.5 text-muted'>
                                <FaLock />
                            </span>
                            <input
                                type='password'
                                className='form-input pl-11'
                                id='password'
                                name='password'
                                value={password}
                                placeholder='Enter password'
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>

                    <div className='mt-8'>
                        <button type='submit' className='btn btn-primary w-full' disabled={isLoading}>
                            {isLoading ? <div className='spinner'></div> : 'Sign In'}
                        </button>
                    </div>

                    <div className='text-center mt-6'>
                        <p className='text-sm text-muted'>
                            Don't have an account? <span className='text-primary cursor-pointer hover:underline' onClick={() => navigate('/register')}>Register</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
