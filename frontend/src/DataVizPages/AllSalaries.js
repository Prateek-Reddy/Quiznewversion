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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AllSalariesBarChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/dataviz/all-salaries");
        const companies = [...new Set(response.data.map((item) => item.company))]; // Unique companies
        const datasets = [];
        let roles = []; // Define roles outside the loop

        companies.forEach((company) => {
          const companyData = response.data.filter((item) => item.company === company);
          roles = companyData[0].roles.split("/"); // Update roles for each company
          const salaries = companyData[0].salaries.split("/").map(Number);

          datasets.push({
            label: company,
            data: salaries,
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)}, 0.7)`,
          });
        });

        setChartData({
          labels: roles, // Use roles here
          datasets,
        });
      } catch (error) {
        console.error("Error fetching all salaries:", error);
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
        text: "Salaries by Company and Role",
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Salaries by Company and Role</h2>
      {chartData ? (
        <div style={{ height: "400px" }}>
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default AllSalariesBarChart;