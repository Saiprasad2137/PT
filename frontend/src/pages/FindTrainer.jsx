import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userService from '../features/userService';
import { FaUserMd, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

function FindTrainer() {
    const [trainers, setTrainers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    navigate('/login');
                    return;
                }
                const data = await userService.getTrainers(user.token);
                setTrainers(data);
            } catch (error) {
                toast.error('Failed to fetch trainers');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrainers();
    }, [navigate]);

    if (isLoading) {
        return <div className='flex justify-center p-12'><div className='spinner'></div></div>;
    }

    return (
        <div className='container py-8'>
            <header className='mb-12 text-center max-w-2xl mx-auto'>
                <h1 className='text-3xl font-bold mb-4'>Find Your <span className='text-gradient'>Perfect Trainer</span></h1>
                <p className='text-muted text-lg'>
                    Connect with certified professionals who can guide you on your fitness journey with personalized plans and expert advice.
                </p>
            </header>

            <div className='grid-responsive'>
                {trainers.length > 0 ? (
                    trainers.map((trainer) => (
                        <div key={trainer._id} className='card flex flex-col items-center text-center relative overflow-hidden group'>
                            {/* Decorative Background Blur */}
                            <div className='absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary to-transparent opacity-10 group-hover:opacity-20 transition-opacity'></div>

                            <div className='relative z-10 -mt-2 mb-4'>
                                <div className='w-24 h-24 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center text-3xl text-primary shadow-lg group-hover:border-primary transition-colors'>
                                    <FaUserMd />
                                </div>
                                <div className='absolute bottom-0 right-0 bg-gray-900 rounded-full p-1 border border-gray-700'>
                                    <FaCheckCircle className='text-success text-xl' />
                                </div>
                            </div>

                            <h3 className='text-xl font-bold mb-1'>{trainer.name}</h3>
                            <div className='flex items-center gap-2 mb-4'>
                                <span className='badge badge-primary'>{trainer.specialization || 'Certified Trainer'}</span>
                            </div>

                            <p className='text-muted text-sm mb-6 line-clamp-2 px-4'>
                                {trainer.bio || `Specializes in ${trainer.specialization || 'fitness capabilities'} with years of experience helping clients achieve their goals.`}
                            </p>

                            <div className='mt-auto w-full grid-2 gap-3'>
                                <button
                                    className='btn btn-primary w-full'
                                    onClick={async () => {
                                        if (window.confirm(`Hire ${trainer.name} as your personal trainer?`)) {
                                            try {
                                                const user = JSON.parse(localStorage.getItem('user'));
                                                await userService.hireTrainer(trainer._id, user.token);
                                                toast.success(`Hired ${trainer.name}!`);
                                                navigate('/dashboard');
                                            } catch (error) {
                                                toast.error('Could not hire trainer.');
                                            }
                                        }
                                    }}
                                >
                                    Hire Now
                                </button>
                                <button
                                    className='btn btn-secondary w-full'
                                    onClick={() => window.location.href = `mailto:${trainer.email}`}
                                >
                                    <FaEnvelope /> Contact
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='col-span-full text-center p-12 text-muted border-dashed border border-gray-800 rounded-xl'>
                        <FaUserMd className='text-4xl mb-4 mx-auto opacity-50' />
                        <h3 className='text-xl font-bold mb-2'>No Trainers Found</h3>
                        <p>Check back later for new professionals.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FindTrainer;
