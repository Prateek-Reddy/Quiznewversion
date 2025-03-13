import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const GenderWisePieChart = () => {
  const [data, setData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch distinct companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dataviz/student-hiring');
        setCompanies(response.data.map((item) => item.company));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError('Failed to fetch companies.');
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch gender-wise data for the selected company
  useEffect(() => {
    if (selectedCompany) {
      const fetchGenderWiseData = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/dataviz/gender-wise-data', {
            params: { company: selectedCompany },
          });
          setData(response.data);
        } catch (error) {
          console.error('Error fetching gender-wise data:', error);
          setError('Failed to fetch gender-wise data.');
        }
      };
      fetchGenderWiseData();
    }
  }, [selectedCompany]);

  // Prepare chart data
  const chartData = data
    ? {
        labels: ['Male Students', 'Female Students'],
        datasets: [
          {
            data: [data.no_of_male_students, data.no_of_female_students],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      }
    : null;

  if (loading) return <div>Loading data...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!companies.length) return <div>No companies available.</div>;

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-[#007367] mb-6">Gender-Wise Distribution</h2>
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

export default GenderWisePieChart;