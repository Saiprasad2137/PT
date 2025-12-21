const axios = require('axios');

const testWorkoutCreation = async () => {
    try {
        // 1. Register Trainer
        const trainerData = {
            name: "Test Trainer",
            email: `trainer_${Date.now()}@example.com`,
            password: "password123",
            role: "trainer"
        };
        console.log('Registering Trainer...');
        const authRes = await axios.post('http://localhost:5001/api/auth/register', trainerData);
        const token = authRes.data.token;
        console.log('Trainer Registered. Token:', token ? 'Yes' : 'No');

        // 2. Create Workout Plan
        const planData = {
            title: "Strength Builder 101",
            description: "Beginner routine",
            exercises: [
                { name: "Squats", sets: 3, reps: "10-12", notes: "Keep back straight" },
                { name: "Pushups", sets: 3, reps: "15", notes: "Chest to floor" }
            ]
        };

        console.log('Creating Workout Plan...');
        const planRes = await axios.post('http://localhost:5001/api/workouts', planData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Plan Created Successfully:');
        console.log(planRes.data);

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

testWorkoutCreation();
