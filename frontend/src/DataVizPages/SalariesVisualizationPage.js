import React, { useState } from "react";
import AverageSalaries from "./AverageSalaries"; // Import the AverageSalaries component
import AllSalaries from "./AllSalaries"; // Import the AllSalaries component
import SalariesTable from "./SalariesTable"; // Import the SalariesTable component

const SalariesVisualizationPage = () => {
  const [activeTab, setActiveTab] = useState("average-salaries"); // State to track the active tab

  return (
    <div className="min-h-screen bg-[#f0e1cb] p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#007367] mb-6">Salaries Visualization</h1>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("average-salaries")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "average-salaries"
                ? "bg-[#007367] text-white"
                : "bg-[#f0e1cb] text-[#007367] hover:bg-[#007367] hover:text-white"
            } transition-colors`}
          >
            Average Salaries
          </button>
          <button
            onClick={() => setActiveTab("all-salaries")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "all-salaries"
                ? "bg-[#007367] text-white"
                : "bg-[#f0e1cb] text-[#007367] hover:bg-[#007367] hover:text-white"
            } transition-colors`}
          >
            All Salaries
          </button>
          <button
            onClick={() => setActiveTab("salaries-table")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "salaries-table"
                ? "bg-[#007367] text-white"
                : "bg-[#f0e1cb] text-[#007367] hover:bg-[#007367] hover:text-white"
            } transition-colors`}
          >
            Salaries Table
          </button>
        </div>

        {/* Render the Active Component */}
        <div className="mt-6">
          {activeTab === "average-salaries" && <AverageSalaries />}
          {activeTab === "all-salaries" && <AllSalaries />}
          {activeTab === "salaries-table" && <SalariesTable />}
        </div>
      </div>
    </div>
  );
};

export default SalariesVisualizationPage;