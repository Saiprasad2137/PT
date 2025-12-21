const axios = require('axios');

const testRegistration = async () => {
    try {
        const userData = {
            name: "Backend Test User",
            email: `backend_test_${Date.now()}@example.com`,
            password: "password123",
            role: "client"
        };

        console.log('Sending request to http://localhost:5000/api/auth/register');
        const response = await axios.post('http://localhost:5000/api/auth/register', userData);

        console.log('Registration Successful:');
        console.log(response.data);
    } catch (error) {
        console.error('Registration Failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Message:', error.response.data.message);
        } else {
            console.error(error.message);
        }
    }
};

testRegistration();
