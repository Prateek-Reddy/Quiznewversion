import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const SubjectWiseBreakdown = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch distinct companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dataviz/distinct-companies');
        setCompanies(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError('Failed to fetch companies.');
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch question count by subject for the selected company
  useEffect(() => {
    const fetchQuestionData = async () => {
      if (!selectedCompany) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/dataviz/question-count-by-subject/${selectedCompany}`
        );
        const questionData = response.data;

        // Generate random colors for each subject
        const colors = generateRandomColors(questionData.length);

        // Prepare chart data
        setChartData({
          labels: questionData.map((item) => item.course),
          datasets: [
            {
              label: `Questions for ${selectedCompany}`,
              data: questionData.map((item) => item.question_count),
              backgroundColor: colors.map((color) => color.background),
              borderColor: colors.map((color) => color.border),
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching question data:', error);
        setError('Failed to fetch question data.');
      }
    };

    fetchQuestionData();
  }, [selectedCompany]);

  // Function to generate random colors
  const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      colors.push({
        background: `rgba(${r}, ${g}, ${b}, 0.6)`,
        border: `rgba(${r}, ${g}, ${b}, 1)`,
      });
    }
    return colors;
  };

  if (loading) return <div>Loading data...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!companies.length) return <div>No companies available.</div>;

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-[#007367] mb-6">Subject-Wise Breakdown</h2>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Select Company</label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
          >
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center">
          <div style={{ width: '400px', height: '400px' }}>
            {chartData ? (
              <Pie data={chartData} options={{ responsive: true }} />
            ) : (
              <p>Please select a company to see the data.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectWiseBreakdown;