import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login/Login';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import PrivateRoutes from './routes/PrivateRoutes';
import Missing from './pages/Missing/Missing';

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Navigate replace to="/dashboard" />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<Missing />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
