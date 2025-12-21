const axios = require('axios');

const testLogging = async () => {
    try {
        // 1. Register Client
        const clientData = {
            name: "Test Client",
            email: `client_${Date.now()}@example.com`,
            password: "password123",
            role: "client"
        };
        console.log('Registering Client...');
        const authRes = await axios.post('http://localhost:5002/api/auth/register', clientData);
        const token = authRes.data.token;
        console.log('Client Registered. Token:', token ? 'Yes' : 'No');

        // 2. Log Workout
        const logData = {
            date: new Date().toISOString(),
            duration: 45,
            notes: "Ran 5km and did some stretching"
        };

        console.log('Logging Workout...');
        const logRes = await axios.post('http://localhost:5002/api/workouts/log', logData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Workout Logged Successfully:');
        console.log(logRes.data);

    } catch (error) {
        console.error('Test Failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

testLogging();
