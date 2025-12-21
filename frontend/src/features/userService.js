import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/users/';

// Get all clients
const getClients = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL + 'clients', config);

    return response.data;
};

// Get all trainers
const getTrainers = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL + 'trainers', config);

    return response.data;
};

// Hire a trainer
const hireTrainer = async (trainerId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + 'hire/' + trainerId, {}, config);

    return response.data;
};

const userService = {
    getClients,
    getTrainers,
    hireTrainer
};

export default userService;
