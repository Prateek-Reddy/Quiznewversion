import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { logout } from '../utils/auth';
import { RiAdminFill } from "react-icons/ri";
import { MdHome } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { BsFillQuestionSquareFill, BsQuestionSquare } from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa";
import { MdPostAdd } from "react-icons/md";
import { IoAnalytics } from "react-icons/io5";
import logo from './logo.png';

const iconSize = 30; // Adjust this value to make icons bigger

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="bg-[#007367] text-white w-64 p-6 shadow-lg">
        {/* Logo Section */}
        <div className="flex-col items-center space-y-8 mb-8">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-17 h-13 rounded-lg" 
          />
           <h1 className="text-xl font-bold">
           <RiAdminFill size={30} /> <span> Admin Dashboard</span>
           </h1>
        </div>
        
        <nav>
          <ul className="space-y-3">
            <li>
              <Link
                to="/admin"
                className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
              >
                <MdHome size={iconSize} />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
              >
                <FaUsers size={iconSize} />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/questions"
                className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
              >
                <BsFillQuestionSquareFill size={iconSize} />
                <span>Questions</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/curriculum"
                className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
              >
                <FaBookOpen size={iconSize} />
                <span>Curriculum</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/analytics"
                className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
              >
                <IoAnalytics size={iconSize} />
                <span>Analytics</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/questions/add"
                className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
              >
                <BsQuestionSquare size={iconSize} />
                <span>Add Question</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/curriculum/add"
                className="flex items-center space-x-2 p-3 hover:bg-[#005f56] rounded-lg transition-colors"
              >
                <MdPostAdd size={iconSize} />
                <span>Add Curriculum</span>
              </Link>
            </li>
          </ul>
        </nav>
        <button
          onClick={logout}
          className="mt-8 w-full bg-[#f0e1cb] text-[#007367] py-2 px-4 rounded-md hover:bg-[#e0d1bb] transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-background flex-1 p-8 bg-gray-50">
       <Outlet /> {/* This will render nested routes */}
      </div>
    </div>
  );
};

export default AdminDashboard;