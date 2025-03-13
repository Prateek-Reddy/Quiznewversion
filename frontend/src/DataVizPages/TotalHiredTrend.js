import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TotalHiredTrend = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/dataviz/student-hiring");
        console.log("API Response:", response.data); // Debugging
        const companies = response.data.map((item) => item.company);
        const hired = response.data.map((item) => item.no_of_students_hired || 0); // Ensure zeros are plotted

        setChartData({
          labels: companies,
          datasets: [
            {
              label: "Total Students Hired",
              data: hired,
              borderColor: "rgba(75, 192, 192, 1)", // Blue for the line (matching reference)
              backgroundColor: "rgba(75, 192, 192, 0.2)", // Light blue fill
              fill: true,
              tension: 0.4, // Smooth line connection
              pointBackgroundColor: "rgba(75, 192, 192, 1)", // Blue for points
              pointBorderColor: "#ffffff", // White border for points
              pointHoverBackgroundColor: "rgba(60, 160, 160, 1)", // Darker blue on hover
              pointHoverBorderColor: "#ffffff", // White border on hover
              spanGaps: false, // Ensure zero values are plotted and connected
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching total hired trend data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Students Hired Trend",
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutBounce",
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#e0d1bb",
        },
      },
      x: {
        grid: {
          color: "#e0d1bb",
        },
      },
    },
  };

  if (loading) return <div>Loading data...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!chartData) return <div>No data available.</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Total Students Hired Trend</h2>
      <div style={{ height: "400px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TotalHiredTrend;
