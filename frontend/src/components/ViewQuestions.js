import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const ViewQuestions = () => {
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const [courses, setCourses] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Fetch distinct courses and companies
  useEffect(() => {
    const fetchDistinct = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/quiz/distinct');
        setCourses(response.data.courses);
        setCompanies(response.data.companies);
      } catch (error) {
        console.error('Error fetching distinct values:', error);
      }
    };
    fetchDistinct();
  }, []);

  // Fetch questions with pagination and filtering
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/quiz/questions/all', {
          params: { course: selectedCourse, company: selectedCompany, page, limit },
        });
        setQuestions(response.data.questions);
        setTotal(response.data.total);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, [selectedCourse, selectedCompany, page]);

  return (
    <div className="min-h-screen bg-[#f0e1cb] p-8">
      <h1 className="text-3xl font-bold text-[#007367] mb-6">View Questions</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#005f56] mb-2">Select Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-3 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
          >
            <option value="">Select Course</option>
            {courses.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#005f56] mb-2">Select Company</label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full p-3 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
          >
            <option value="">Select Company</option>
            {companies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#007367] text-white">
                <th className="px-6 py-3 text-left text-sm font-medium">Company</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Question</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Course</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Course Code</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.question_id} className="hover:bg-[#e0d1bb] transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">{question.company}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{question.pyq}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{question.course}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{question.course_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56] disabled:bg-[#cccccc]"
        >
          Previous
        </button>
        <span className="text-sm text-[#005f56]">
          Page {page} of {Math.ceil(total / limit)}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * limit >= total}
          className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56] disabled:bg-[#cccccc]"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewQuestions;