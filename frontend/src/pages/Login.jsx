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
            if (user.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
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
            if (user.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='login-page-wrapper'>
            <h1 className='main-title'>Personal Training Management System</h1>
            <div className='login-container'>
                <section className='header'>
                    <h1>
                        <FaSignInAlt style={{ marginRight: '10px' }} /> Login
                    </h1>
                    <p>Welcome back! Please login to your account</p>
                </section>

                <section className='form'>
                    <form onSubmit={onSubmit}>
                        <div className='form-group'>
                            <div className='input-wrapper'>
                                <span className='input-icon'>
                                    <FaUser />
                                </span>
                                <input
                                    type='email'
                                    className='form-control'
                                    id='email'
                                    name='email'
                                    value={email}
                                    placeholder='Enter your email'
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className='form-group'>
                            <div className='input-wrapper'>
                                <span className='input-icon'>
                                    <FaLock />
                                </span>
                                <input
                                    type='password'
                                    className='form-control'
                                    id='password'
                                    name='password'
                                    value={password}
                                    placeholder='Enter password'
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className='form-group'>
                            <button type='submit' className='btn btn-block' disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className='loading-spinner'></span> Processing...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default Login;
