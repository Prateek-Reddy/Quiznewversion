import React, { useEffect, useState } from "react";
import axios from "axios";

const SalariesTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/dataviz/all-salaries");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching all salaries:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate the total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get the data for the current page
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">All Salaries</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-3 text-left">Company</th>
            <th className="p-3 text-left">Roles</th>
            <th className="p-3 text-left">Salaries (LPA)</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-100">
              <td className="p-3">{row.company}</td>
              <td className="p-3">{row.roles}</td>
              <td className="p-3">{row.salaries}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-[#007367] text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 ${
              currentPage === index + 1
                ? "bg-[#007367] text-white"
                : "bg-gray-200 text-[#007367]"
            } rounded-md`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-[#007367] text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SalariesTable;