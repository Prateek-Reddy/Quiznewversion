import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth'; // Import getUserRole

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token); // Save the token

      // Get the user's role using getUserRole
      const role = getUserRole();

      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin'); // Redirect to admin dashboard
      } else if (role === 'student') {
        navigate('/student/home'); // Redirect to student quiz page
      }
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('/hydcampus2.jpeg')`, // Replace with your image path
        backgroundSize: '120%', // Ensures the image covers the entire container
        backgroundPosition: 'center', // Centers the image
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Blurry Overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>

      {/* Login Form */}
      <div className="relative z-10 bg-white/80 p-8 rounded-lg shadow-md w-96 backdrop-blur-sm">
        <h2 className="text-3xl font-semibold text-[#007367] mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#005f56]">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#005f56]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#007367] text-white py-2 rounded-md hover:bg-[#005f56] focus:outline-none focus:ring-2 focus:ring-[#005f56]"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-[#005f56]">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-[#007367] hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;