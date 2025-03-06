import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const ViewCurriculum = () => {
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const [curriculumData, setCurriculumData] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const itemsPerPage = 5; // Number of items to display per page

  // Fetch distinct subjects
  useEffect(() => {
    const fetchDistinctSubjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/curriculum/distinct-subjects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching distinct subjects:', error);
      }
    };
    fetchDistinctSubjects();
  }, []);

  // Fetch curriculum data based on selected subject
  useEffect(() => {
    const fetchCurriculumData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/curriculum/curriculum-analyses', {
          params: { subject_name: subjectName },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurriculumData(response.data);
      } catch (error) {
        console.error('Error fetching curriculum data:', error);
      }
    };

    fetchCurriculumData();
  }, [subjectName]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(curriculumData.length / itemsPerPage);

  // Get the current page's data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = curriculumData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[#f9fafb] p-8">
      <h1 className="text-3xl font-bold text-[#007367] mb-6">Curriculum Analysis</h1>
      <div className="mb-6">
        <label htmlFor="subjectName" className="block text-sm font-medium text-[#005f56]">
          Select Subject
        </label>
        <select
          id="subjectName"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          className="mt-1 p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367] w-full max-w-md"
        >
          <option value="">Select a subject</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>
      {curriculumData.length === 0 ? (
        <p className="text-[#005f56]">
          Curriculum analysis helps you understand the structure and focus of your courses. Select a subject to view its curriculum details.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full">
              <thead className="bg-[#007367] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Curriculum</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Syllabus Analysis</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Faculty Attention</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Course ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Subject Name</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((curriculum) => (
                  <tr key={curriculum.cur_id} className="hover:bg-[#e0d1bb] transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{curriculum.curriculum}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{curriculum.syllabus_analysis}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{curriculum.faculty_attention}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{curriculum.course_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{curriculum.subject_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56] disabled:bg-[#cccccc]"
            >
              Previous
            </button>
            <span className="text-sm text-[#005f56]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56] disabled:bg-[#cccccc]"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewCurriculum;