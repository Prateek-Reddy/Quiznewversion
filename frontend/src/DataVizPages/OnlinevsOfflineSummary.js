import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components
ChartJS.register(ArcElement, Tooltip, Legend);

const OnlineVsOfflineSummary = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/dataviz/company-rounds"); // Update the API endpoint
        const totalOnline = response.data.reduce((acc, item) => acc + (item.no_of_online_rounds || 0), 0);
        const totalOffline = response.data.reduce((acc, item) => acc + (item.no_of_offline_rounds || 0), 0);

        setChartData({
          labels: ["Online Rounds", "Offline Rounds"],
          datasets: [
            {
              label: "Rounds",
              data: [totalOnline, totalOffline],
              backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(255, 99, 132, 0.7)"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching online vs offline summary data:", error);
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
        text: "Online vs Offline Rounds Summary",
      },
    },
    animation: {
      duration: 1000, // Animation duration in milliseconds
      easing: "easeOutBounce", // Easing function for the animation
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Online vs Offline Rounds Summary</h2>
      {chartData ? (
        <div style={{ height: "400px" }}> {/* Set a fixed height for the chart */}
          <Pie data={chartData} options={options} />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default OnlineVsOfflineSummary;