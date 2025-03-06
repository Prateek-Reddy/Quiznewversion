import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Quiz App</h1>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="ml-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;