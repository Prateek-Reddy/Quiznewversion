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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AverageSalariesLineChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/dataviz/average-salaries");
        const companies = response.data.map((item) => item.company);
        const averageSalaries = response.data.map((item) => item.average_salary);

        setChartData({
          labels: companies,
          datasets: [
            {
              label: "Average Salary (LPA)",
              data: averageSalaries,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching average salaries:", error);
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
        text: "Average Salaries by Company",
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Average Salaries by Company</h2>
      {chartData ? (
        <div style={{ height: "400px" }}>
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default AverageSalariesLineChart;