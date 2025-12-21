import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/workouts/';

// Create new workout plan
const createPlan = async (planData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL, planData, config);

    return response.data;
};

// Get user workout plans
const getPlans = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL, config);

    return response.data;
};

// Log user workout
const logWorkout = async (logData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL + 'log', logData, config);

    return response.data;
};

// Get workout logs
const getLogs = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL + 'log', config);

    return response.data;
};

// Get user stats
const getStats = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL + 'stats', config);

    return response.data;
};

const workoutService = {
    createPlan,
    getPlans,
    logWorkout,
    getLogs,
    getStats,
};

export default workoutService;
