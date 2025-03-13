import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { logout } from '../utils/auth';
import { RiAdminFill } from 'react-icons/ri'; // Admin icon
import { MdHome } from 'react-icons/md'; // Home icon
import { FaUsers } from 'react-icons/fa'; // Users icon
import { BsFillQuestionSquareFill, BsQuestionSquare } from 'react-icons/bs'; // Question icons
import { FaBookOpen } from 'react-icons/fa'; // Curriculum icon
import { IoAnalytics } from 'react-icons/io5'; // Analytics icon
import { MdPostAdd } from 'react-icons/md'; // Add Curriculum icon
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import arrow icons
import { FaPowerOff } from "react-icons/fa6"; // Added FaPowerOff for the Logout icon
import { FaBuilding } from 'react-icons/fa';
import logo from './logo.png';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 relative">
      {/* Grayish Tint with Logo Background */}
      <div
        className="absolute inset-0 bg-[#017069] opacity-10 bg-repeat bg-center"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundSize: '200px', // Adjust the size of the logo
        }}
      ></div>

      {/* Main Content Area */}
      <div className="flex flex-1 relative z-10">
        {/* Sidebar */}
        <div
          className={`bg-[#007367] text-white p-6 shadow-lg flex-shrink-0 transition-all duration-300 ${
            isSidebarOpen ? 'w-72' : 'w-24'
          } sticky top-0 h-screen m-4 rounded-xl`}
        >
          {/* Scrollable Container */}
          <div className="h-full flex flex-col">
            {/* Logo Section */}
            <div className="flex-col items-center space-y-8 mb-8">
              <img src={logo} alt="Logo" className="w-0 h-13 rounded-lg" />
              {isSidebarOpen && (
                <h1 className="text-xl font-bold">
                  <RiAdminFill size={30} /> <span> Admin Dashboard</span>
                </h1>
              )}
            </div>

            {/* Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="w-full bg-[#f0e1cb] text-[#007367] py-2 px-4 rounded-md hover:bg-[#e0d1bb] transition-colors mb-6 flex items-center justify-center"
            >
              {isSidebarOpen ? (
                <FaArrowLeft size={24} />
              ) : (
                <FaArrowRight size={24} />
              )}
            </button>

            {/* Scrollable Nav */}
            <div className="overflow-auto scrollbar h-100 w-full">
              <nav>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
                    >
                      <MdHome size={24} />
                      {isSidebarOpen && <span>Home</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/users"
                      className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
                    >
                      <FaUsers size={24} />
                      {isSidebarOpen && <span>Users</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/questions"
                      className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
                    >
                      <BsFillQuestionSquareFill size={24} />
                      {isSidebarOpen && <span>Questions</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/curriculum"
                      className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
                    >
                      <FaBookOpen size={24} />
                      {isSidebarOpen && <span>Curriculum</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/questions/add"
                      className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
                    >
                      <BsQuestionSquare size={24} />
                      {isSidebarOpen && <span>Add Question</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/curriculum/add"
                      className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
                    >
                      <MdPostAdd size={24} />
                      {isSidebarOpen && <span>Add Curriculum</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/company-rounds"
                      className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
                    >
                      <IoAnalytics size={24} />
                      {isSidebarOpen && <span>Company Rounds</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/student-hiring"
                      className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
                    >
                      <IoAnalytics size={24} />
                      {isSidebarOpen && <span>Student Hiring</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/typeofrounds"
                      className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
                    >
                      <IoAnalytics size={24} />
                      {isSidebarOpen && <span>Type of Rounds</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/company-salaries"
                      className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
                    >
                      <IoAnalytics size={24} />
                      {isSidebarOpen && <span>Company Salaries</span>}
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-17 bg-[#f0e1cb] text-[#007367] py-2 px-4 rounded-md hover:bg-[#e0d1bb] transition-colors mt-6"
            >
              <FaPowerOff size={24} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* This will render nested routes */}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#007367] text-white p-4 text-center relative z-10">
        &copy; {new Date().getFullYear()} Placement Assistant. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminDashboard;