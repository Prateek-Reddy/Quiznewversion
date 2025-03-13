import React, { useState } from "react";
import OnlinevsOffline from "./OnlinevsOffline"; // Import your OnlineVsOffline component
import OnlinevsOfflineSummary from "./OnlinevsOfflineSummary"; // Import your OnlineVsOfflineSummary component
import TotalHiredTrend from "./TotalHiredTrend"; // Import the TotalHiredTrend component
import GenderWisePieChart from "./GenderWisePieChart"; // Import the GenderWisePieChart component
import SubjectWiseBreakdown from "./SubjectWiseBreakdown"; // Import the SubjectWiseBreakdown component
import RoundTypeBreakdown from "./RoundTypeBreakdown"; // Import the RoundTypeBreakdown component
import SalariesVisualizationPage from "./SalariesVisualizationPage"; // Import the new SalariesVisualizationPage

const MainDataVizPage = () => {
  const [activeTab, setActiveTab] = useState("online-vs-offline"); // State to track the active tab

  return (
    <div className="min-h-screen bg-[#f0e1cb] p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#007367] mb-6">Data Visualization</h1>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("online-vs-offline")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "online-vs-offline"
                ? "bg-[#007367] text-white"
                : "bg-[#f0e1cb] text-[#007367] hover:bg-[#007367] hover:text-white"
            } transition-colors`}
          >
            Online vs Offline Rounds
          </button>
          <button
            onClick={() => setActiveTab("online-vs-offline-summary")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "online-vs-offline-summary"
                ? "bg-[#007367] text-white"
                : "bg-[#f0e1cb] text-[#007367] hover:bg-[#007367] hover:text-white"
            } transition-colors`}
          >
            Online vs Offline Summary
          </button>
          <button
            onClick={() => setActiveTab("total-hired-trend")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "total-hired-trend"
                ? "bg-[#007367] text-white"
                : "bg-[#f0e1cb] text-[#007367] hover:bg-[#007367] hover:text-white"
            } transition-colors`}
          >
            Total Hired Trend
          </button>
          <button
            onClick={() => setActiveTab("gender-wise-pie-chart")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "gender-wise-pie-chart"
                ? "bg-[#007367] text-white"
                : "bg-[#f0e1cb] text-[#007367] hover:bg-[#007367] hover:text-white"
            } transition-colors`}
          >
            Gender-Wise Distribution
          </button>
          <button
            onClick={() => setActiveTab("subject-wise-breakdown")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "subject-wise-breakdown"
                ? "bg-[#007367] text-white"
                : "bg-[#f0e1cb] text-[#007367] hover:bg-[#007367] hover:text-white"
            } transition-colors`}
          >
            Subject-Wise Breakdown
          </button>
          <button
            onClick={() => setActiveTab("round-type-breakdown")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "round-type-breakdown"
                ? "bg-[#007367] text-white"
                : "bg-[#f0e1cb] text-[#007367] hover:bg-[#007367] hover:text-white"
            } transition-colors`}
          >
            Round Type Breakdown
          </button>
          <button
            onClick={() => setActiveTab("salaries-visualization")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "salaries-visualization"
                ? "bg-[#007367] text-white"
                : "bg-[#f0e1cb] text-[#007367] hover:bg-[#007367] hover:text-white"
            } transition-colors`}
          >
            Salaries Visualization
          </button>
        </div>

        {/* Render the Active Component */}
        <div className="mt-6">
          {activeTab === "online-vs-offline" && <OnlinevsOffline />}
          {activeTab === "online-vs-offline-summary" && <OnlinevsOfflineSummary />}
          {activeTab === "total-hired-trend" && <TotalHiredTrend />}
          {activeTab === "gender-wise-pie-chart" && <GenderWisePieChart />}
          {activeTab === "subject-wise-breakdown" && <SubjectWiseBreakdown />}
          {activeTab === "round-type-breakdown" && <RoundTypeBreakdown />}
          {activeTab === "salaries-visualization" && <SalariesVisualizationPage />}
        </div>
      </div>
    </div>
  );
};

export default MainDataVizPage;