import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';
import logo from './logo.png';
import { MdQuiz } from "react-icons/md";
import { GrScorecard } from "react-icons/gr";
import { FaQuestion } from "react-icons/fa";
import { RiFileList3Fill } from "react-icons/ri";

const StudentDashboard = () => {
  const location = useLocation(); // Get the current route location
  const [activeLink, setActiveLink] = useState(location.pathname); // Track the active link

  // Update the active link whenever the location changes
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f0e1cb] flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#007367] p-6"> {/* Increased padding for thicker top area */}
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center">
            <img
              src={logo} // Replace with your logo path
              alt="College Logo"
              className="h-35 w-40 mr-10"
            />
            <h1 className="text-3xl font-bold text-[#f0e1cb]">Placement Assistant</h1>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="bg-[#f0e1cb] text-[#007367] py-2 px-4 rounded-md hover:bg-[#005f56] hover:text-[#f0e1cb] transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6">
          <ul className="flex justify-around">
            <li>
              <Link
                to="/student/quiz"
                className={`flex flex-col items-center p-4 rounded-md text-[#f0e1cb] hover:bg-[#f0e1cb] hover:text-[#007367] transition-colors ${
                  activeLink === '/student/quiz' ? 'bg-[#f0e1cb] !text-[#007367]' : ''
                }`}
                onClick={() => setActiveLink('/student/quiz')}
              >
                <MdQuiz
                  className={`text-3xl mb-2 ${
                    activeLink === '/student/quiz' ? '!text-[#007367]' : ''
                  }`}
                />
                <span className="text-lg">Quiz</span>
              </Link>
            </li>
            <li>
              <Link
                to="/student/scores"
                className={`flex flex-col items-center p-4 rounded-md text-[#f0e1cb] hover:bg-[#f0e1cb] hover:text-[#007367] transition-colors ${
                  activeLink === '/student/scores' ? 'bg-[#f0e1cb] !text-[#007367]' : ''
                }`}
                onClick={() => setActiveLink('/student/scores')}
              >
                <GrScorecard
                  className={`text-3xl mb-2 ${
                    activeLink === '/student/scores' ? '!text-[#007367]' : ''
                  }`}
                />
                <span className="text-lg">Scores</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/student/view-questions"
                className={`flex flex-col items-center p-4 rounded-md text-[#f0e1cb] hover:bg-[#f0e1cb] hover:text-[#007367] transition-colors ${
                  activeLink === '/student/view-questions' ? 'bg-[#f0e1cb] !text-[#007367]' : ''
                }`}
                onClick={() => setActiveLink('/student/view-questions')}
              >
                <FaQuestion
                  className={`text-3xl mb-2 ${
                    activeLink === '/student/view-questions' ? '!text-[#007367]' : ''
                  }`}
                />
                <span className="text-lg">View Questions</span>
              </Link>
            </li>
            <li>
              <Link
                to="/student/view-curriculum"
                className={`flex flex-col items-center p-4 rounded-md text-[#f0e1cb] hover:bg-[#f0e1cb] hover:text-[#007367] transition-colors ${
                  activeLink === '/student/view-curriculum' ? 'bg-[#f0e1cb] !text-[#007367]' : ''
                }`}
                onClick={() => setActiveLink('/student/view-curriculum')}
              >
                <RiFileList3Fill
                  className={`text-3xl mb-2 ${
                    activeLink === '/student/view-curriculum' ? '!text-[#007367]' : ''
                  }`}
                />
                <span className="text-lg">View Curriculum</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-cream p-6 rounded-t-lg shadow-lg">
        <Outlet /> {/* This will render the nested routes (Quiz, Scores, ViewQuestions, or ViewCurriculum) */}
      </div>
    </div>
  );
};

export default StudentDashboard;