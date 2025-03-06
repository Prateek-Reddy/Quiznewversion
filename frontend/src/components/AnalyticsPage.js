// components/AnalyticsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/analytics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAnalytics(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch analytics. Please try again.');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>Total Questions: {analytics.totalQuestions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>Total Users: {analytics.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>Total Attempts: {analytics.totalAttempts}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;