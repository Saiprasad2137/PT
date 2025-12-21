import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaIdCard } from 'react-icons/fa';
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

        setIsLoading(true);

        try {
            const userData = { name, email, password, role, specialization, experience };
            await authService.register(userData);
            navigate('/dashboard');
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
                        <FaUserPlus style={{ marginRight: '10px' }} /> Register
                    </h1>
                    <p>Create your ManageX account</p>
                </section>

                <section className='form'>
                    <form onSubmit={onSubmit}>
                        <div className='form-group'>
                            <div className='input-wrapper'>
                                <span className='input-icon'>
                                    <FaUser />
                                </span>
                                <input
                                    type='text'
                                    className='form-control'
                                    id='name'
                                    name='name'
                                    value={name}
                                    placeholder='Enter your name'
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className='form-group'>
                            <div className='input-wrapper'>
                                <span className='input-icon'>
                                    <FaEnvelope />
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
                            <div className='input-wrapper'>
                                <span className='input-icon'>
                                    <FaIdCard />
                                </span>
                                <select
                                    name="role"
                                    id="role"
                                    value={role}
                                    onChange={onChange}
                                    className='form-control'
                                    style={{ appearance: 'auto' }}
                                >
                                    <option value="client">Client</option>
                                    <option value="trainer">Trainer</option>
                                </select>
                            </div>
                        </div>

                        {role === 'trainer' && (
                            <>
                                <div className='form-group'>
                                    <div className='input-wrapper'>
                                        <span className='input-icon'>
                                            <FaIdCard />
                                        </span>
                                        <input
                                            type='text'
                                            className='form-control'
                                            id='specialization'
                                            name='specialization'
                                            value={formData.specialization}
                                            placeholder='Specialization (e.g. Yoga)'
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <div className='input-wrapper'>
                                        <span className='input-icon'>
                                            <FaIdCard />
                                        </span>
                                        <input
                                            type='text'
                                            className='form-control'
                                            id='experience'
                                            name='experience'
                                            value={formData.experience}
                                            placeholder='Experience (e.g. 5 years)'
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className='form-group'>
                            <button type='submit' className='btn btn-block' disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className='loading-spinner'></span> Creating Account...
                                    </>
                                ) : (
                                    'Register'
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default Register;
