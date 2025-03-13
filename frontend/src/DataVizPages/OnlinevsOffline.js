import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OnlineVsOffline = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/dataviz/company-rounds"); // Update the API endpoint
        const companies = response.data.map((item) => item.company);
        const onlineRounds = response.data.map((item) => item.no_of_online_rounds);
        const offlineRounds = response.data.map((item) => item.no_of_offline_rounds);

        setChartData({
          labels: companies,
          datasets: [
            {
              label: "Online Rounds",
              data: onlineRounds,
              backgroundColor: "rgba(54, 162, 235, 0.7)",
            },
            {
              label: "Offline Rounds",
              data: offlineRounds,
              backgroundColor: "rgba(255, 99, 132, 0.7)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching online vs offline data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true, // Make the chart responsive
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Online vs Offline Rounds",
      },
    },
    animation: {
      duration: 1000, // Animation duration in milliseconds
      easing: "easeOutBounce", // Easing function for the animation
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Online vs Offline Rounds</h2>
      {chartData ? (
        <div style={{ height: "400px" }}> {/* Set a fixed height for the chart */}
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default OnlineVsOffline;