import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const Scores = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch scores and metrics when the component mounts
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch the last 10 scores
        const scoresResponse = await axios.get('http://localhost:5000/api/scores', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setScores(scoresResponse.data);

        // Fetch aggregated metrics
        const metricsResponse = await axios.get('http://localhost:5000/api/scores/metrics', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMetrics(metricsResponse.data);

        setLoading(false);
      } catch (error) {
        setError('Failed to fetch scores and metrics. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Handle clear scores
  const handleClearScores = async () => {
    try {
      await axios.delete('http://localhost:5000/api/scores/clear', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Refresh the scores and metrics
      setScores([]);
      setMetrics([]);
      alert('All scores and metrics cleared successfully.');
    } catch (error) {
      alert('Failed to clear scores and metrics. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-4 text-[#007367]">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] p-8">
      <h1 className="text-3xl font-bold text-[#007367] mb-6">Your Quiz Scores</h1>

      {/* Clear Scores Button */}
      <button
        onClick={handleClearScores}
        className="mb-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
      >
        Clear All Scores
      </button>

      {/* Aggregated Metrics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#007367] mb-4">Aggregated Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-[#005f56] mb-2">
                {metric.course_code} - {metric.company}
              </h3>
              <p>Average Score: {metric.average_score.toFixed(2)}</p>
              <p>Highest Score: {metric.highest_score}</p>
              <p>Total Attempts: {metric.total_attempts}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Last 10 Scores */}
      <div>
        <h2 className="text-2xl font-bold text-[#007367] mb-4">Last 10 Attempts</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full">
            <thead className="bg-[#007367] text-white">
              <tr>
                <th className="text-left p-3">Course</th>
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Score</th>
                <th className="text-left p-3">Total Questions</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={index} className="border-b hover:bg-[#e0d1bb]">
                  <td className="p-3">{score.course_code}</td>
                  <td className="p-3">{score.company}</td>
                  <td className="p-3">{score.score} / {score.total_questions}</td>
                  <td className="p-3">{score.total_questions}</td>
                  <td className="p-3">{new Date(score.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Scores;