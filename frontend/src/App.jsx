import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePlan from './pages/CreatePlan';
import LogProgress from './pages/LogProgress';
import MyPlans from './pages/MyPlans';
import MyClients from './pages/MyClients';
import FindTrainer from './pages/FindTrainer';
import AdminDashboard from './pages/AdminDashboard';
import WorkoutHistory from './pages/WorkoutHistory';
import Layout from './components/Layout';

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/admin' element={<AdminDashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/create-plan' element={<CreatePlan />} />
            <Route path='/log-progress' element={<LogProgress />} />
            <Route path='/my-plans' element={<MyPlans />} />
            <Route path='/my-clients' element={<MyClients />} />
            <Route path='/find-trainer' element={<FindTrainer />} />
            <Route path='/history' element={<WorkoutHistory />} />
          </Routes>
        </Layout>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
