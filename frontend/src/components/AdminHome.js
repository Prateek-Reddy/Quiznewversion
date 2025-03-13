import React from 'react';
import { RiAdminFill } from 'react-icons/ri'; // Admin icon
import { FaUsers } from 'react-icons/fa'; // Users icon
import { BsFillQuestionSquareFill, BsQuestionSquare } from 'react-icons/bs'; // Question icons
import { FaBookOpen } from 'react-icons/fa'; // Curriculum icon
import { IoAnalytics } from 'react-icons/io5'; // Analytics icon
import { MdPostAdd } from 'react-icons/md'; // Add Curriculum icon

const AdminHome = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-[#007367] mb-6 flex items-center">
        <RiAdminFill className="mr-2" /> Welcome to the Admin Dashboard
      </h1>
      <p className="text-lg text-[#005f56] mb-6">
        Manage users, questions, curriculum, and analytics from one place. Use the sidebar to navigate to different sections.
      </p>

      <div className="space-y-6">
        {/* Users Section */}
        <div className="bg-[#f0e1cb] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4 flex items-center">
            <FaUsers className="mr-2" /> Users
          </h2>
          <p className="text-lg text-[#005f56]">
            View and manage all users. Edit usernames, roles, and other details.
          </p>
        </div>

        {/* Questions Section */}
        <div className="bg-[#f0e1cb] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4 flex items-center">
            <BsFillQuestionSquareFill className="mr-2" /> Questions
          </h2>
          <p className="text-lg text-[#005f56]">
            Manage quiz questions. Add, edit, or delete questions as needed.
          </p>
        </div>

        {/* Curriculum Section */}
        <div className="bg-[#f0e1cb] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4 flex items-center">
            <FaBookOpen className="mr-2" /> Curriculum
          </h2>
          <p className="text-lg text-[#005f56]">
            Manage the curriculum. Add, edit, or delete curriculum topics and details.
          </p>
        </div>

        {/* Analytics Section */}
        <div className="bg-[#f0e1cb] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4 flex items-center">
            <IoAnalytics className="mr-2" /> Analytics
          </h2>
          <p className="text-lg text-[#005f56]">
            View analytics and insights about quiz performance, user activity, and more.
          </p>
        </div>

        {/* Add Question Section */}
        <div className="bg-[#f0e1cb] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4 flex items-center">
            <BsQuestionSquare className="mr-2" /> Add Question
          </h2>
          <p className="text-lg text-[#005f56]">
            Add new quiz questions to the database.
          </p>
        </div>

        {/* Add Curriculum Section */}
        <div className="bg-[#f0e1cb] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4 flex items-center">
            <MdPostAdd className="mr-2" /> Add Curriculum
          </h2>
          <p className="text-lg text-[#005f56]">
            Add new curriculum topics and details.
          </p>
        </div>

        {/* Company Rounds Section */}
        <div className="bg-[#f0e1cb] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4 flex items-center">
            <IoAnalytics className="mr-2" /> Company Rounds
          </h2>
          <p className="text-lg text-[#005f56]">
            Analyze the distribution of online and offline interview rounds across different companies.
            Understand how hiring processes vary and optimize your preparation accordingly.
          </p>
        </div>

        {/* Student Hiring Section */}
        <div className="bg-[#f0e1cb] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4 flex items-center">
            <IoAnalytics className="mr-2" /> Student Hiring
          </h2>
          <p className="text-lg text-[#005f56]">
            Gain insights into total students hired, categorized by gender. Identify hiring trends
            and understand company preferences in recruitment.
          </p>
        </div>

        {/* Type of Rounds Section */}
        <div className="bg-[#f0e1cb] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#007367] mb-4 flex items-center">
            <IoAnalytics className="mr-2" /> Type of Rounds
          </h2>
          <p className="text-lg text-[#005f56]">
            Explore the structure of interview rounds across companies, including aptitude,
            technical, managerial, HR, group discussions, online coding, and written coding rounds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;