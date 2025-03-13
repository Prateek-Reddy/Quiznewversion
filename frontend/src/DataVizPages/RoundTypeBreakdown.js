import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RoundTypeBreakdown = () => {
  const [roundTypes, setRoundTypes] = useState([
    'aptitude',
    'technical',
    'managerial',
    'technical-hr',
    'group-discussion',
    'online-coding',
    'written-coding',
  ]);
  const [selectedRoundType, setSelectedRoundType] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch data for the selected round type
  useEffect(() => {
    if (selectedRoundType) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:5000/api/dataviz/rounds/${selectedRoundType}`
          );
          const data = response.data;

          // Prepare chart data
          setChartData({
            labels: data.map((item) => item.company),
            datasets: [
              {
                label: `${selectedRoundType} Rounds`,
                data: data.map((item) => item.round_count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          });
          setLoading(false);
        } catch (error) {
          console.error(`Error fetching ${selectedRoundType} data:`, error);
          setError(`Failed to fetch ${selectedRoundType} data.`);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedRoundType]);

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#007367] mb-6">Round Type Breakdown</h1>

        {/* Dropdown to select round type */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Select Round Type</label>
          <select
            value={selectedRoundType}
            onChange={(e) => setSelectedRoundType(e.target.value)}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
          >
            <option value="">Select a round type</option>
            {roundTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace(/-/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Bar Chart */}
        <div className="flex justify-center">
          {loading ? (
            <div>Loading data...</div>
          ) : chartData ? (
            <div style={{ width: '600px', height: '400px' }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: `${selectedRoundType.replace(/-/g, ' ').toUpperCase()} Rounds`,
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p>Please select a round type to see the data.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoundTypeBreakdown;