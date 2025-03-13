import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const Home = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(''); // State to store error messages
  const navigate = useNavigate();

  // Fetch user data when the component mounts
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data); // Set user data
        setLoading(false); // Set loading to false
      } catch (error) {
        setError('Failed to fetch user data. Please try again.');
        setLoading(false); // Set loading to false
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return <div className="p-4 text-[#007367]">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      {/* Welcome Message */}
      {user && (
        <h1 className="text-3xl font-bold text-[#007367] mb-6">
          Welcome, {user.username}!
        </h1>
      )}

      <p className="text-lg text-[#005f56] mb-6">
        Placement Assistant is your one-stop solution for preparing for placement interviews. 
        Whether you're practicing quizzes, analyzing your scores, reviewing questions, or 
        exploring the curriculum, we've got you covered!
      </p>

      <div className="space-y-6">
        {/* Quiz Section */}
        <div className="bg-[#f0e1cb] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4">Quizzes</h2>
          <p className="text-lg text-[#005f56]">
            Take quizzes tailored to specific courses and companies. Filter quizzes by 
            course code and company to focus on areas that matter most to you.
          </p>
        </div>

        {/* Scores Section */}
        <div className="bg-[#f0e1cb] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4">Scores</h2>
          <p className="text-lg text-[#005f56]">
            Track your quiz scores over time. Analyze your performance to identify 
            strengths and areas for improvement.
          </p>
        </div>

        {/* View Questions Section */}
        <div className="bg-[#f0e1cb] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4">View Questions</h2>
          <p className="text-lg text-[#005f56]">
            Review questions without taking a quiz. This is perfect for studying and 
            understanding the types of questions asked in placement interviews.
          </p>
        </div>

        {/* Curriculum Analysis Section */}
        <div className="bg-[#f0e1cb] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4">Curriculum Analysis</h2>
          <p className="text-lg text-[#005f56]">
            Explore detailed curriculum breakdowns for various courses. Learn about key 
            topics, time complexity, space complexity, and real-world applications. 
          </p>
        </div>
        {/* Data Visualization Insights */}
         <div className="bg-[#f0e1cb] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4">Data-Driven Insights</h2>
          <p className="text-lg text-[#005f56]">
            Understanding placement trends through data visualization can provide valuable insights 
            into hiring patterns, subject-wise strengths, and the effectiveness of different preparation strategies. 
            By analyzing key metrics like online vs. offline rounds, hiring trends, and performance breakdowns, 
            you can make informed decisions about your preparation, focus on high-impact topics, and refine 
            your approach to ace your interviews.
          </p>
         </div>
      </div>
    </div>
  );
};

export default Home;