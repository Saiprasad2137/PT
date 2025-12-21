import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/';

// Get pending trainers
const getPendingTrainers = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL + 'pending', config);

    return response.data;
};

// Verify trainer
const verifyTrainer = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + 'verify/' + id, {}, config);

    return response.data;
};

const adminService = {
    getPendingTrainers,
    verifyTrainer,
};

export default adminService;
