import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CurriculumAnalysesPage = () => {
  const [curriculumAnalyses, setCurriculumAnalyses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/distinct-subjects', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        
        console.log('Fetched subjects response:', response.data); // Log the response
        setSubjects(response.data.subjects || response.data); // Handle both array and object responses
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchCurriculumAnalyses = async () => {
      try {
        setLoading(true);
        setCurriculumAnalyses([]);  // Clear the list before fetching new data
        console.log('Fetching analyses with filter:', subjectFilter);
  
        const response = await axios.get('http://localhost:5000/api/admin/curriculum-analyses', {
          params: { page, limit, subject_name: subjectFilter },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
  
        console.log('Fetched analyses:', response.data);
        setCurriculumAnalyses(response.data.curriculumAnalyses);
        setTotalAnalyses(response.data.total);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching curriculum analyses:', error);
        setError('Failed to fetch data. Please try again.');
        setLoading(false);
      }
    };
  
    fetchCurriculumAnalyses();
  }, [page, subjectFilter]);  // Depend on subjectFilter and page changes
  

  const handleFilterChange = (e) => {
    setSubjectFilter(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/curriculum-analyses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCurriculumAnalyses(curriculumAnalyses.filter((item) => item.cur_id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <h2 className="text-3xl font-semibold text-[#007367] mb-6">Curriculum Analyses</h2>

      {/* Filters */}
      <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
        <label className="block text-sm font-medium mb-2 text-[#005f56]">Select Subject</label>
        
        <select
          value={subjectFilter}
          onChange={handleFilterChange}
          className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
        >
          <option value="">All Subjects</option>
          {subjects.map((subject, index) => (
            <option key={index} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      {/* Loading/Error Handling */}
      {loading ? (
        <div className="text-[#007367] text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#007367] text-white">
                <tr>
                  <th className="p-3 text-left">Curriculum</th>
                  <th className="p-3 text-left">Syllabus Analysis</th>
                  <th className="p-3 text-left">Faculty Attention</th>
                  <th className="p-3 text-left">Course ID</th>
                  <th className="p-3 text-left">Subject Name</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {curriculumAnalyses.map((analysis) => (
                  <tr key={analysis.cur_id} className="border-b hover:bg-[#e0d1bb]">
                    <td className="p-3">{analysis.curriculum}</td>
                    <td className="p-3">{analysis.syllabus_analysis}</td>
                    <td className="p-3">{analysis.faculty_attention}</td>
                    <td className="p-3">{analysis.course_id}</td>
                    <td className="p-3">{analysis.subject_name}</td>
                    <td className="p-3">
  <div className="flex gap-2">
    <button
      onClick={() => navigate(`/admin/curriculum-analyses/${analysis.cur_id}/edit`)}
      className="w-20 bg-[#007367] text-white py-1 px-2 rounded-md hover:bg-[#005f56]"
    >
      Edit
    </button>
    <button
      onClick={() => handleDelete(analysis.cur_id)}
      className="w-20 bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
    >
      Delete
    </button>
  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56] disabled:bg-[#cccccc] disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="mx-4 text-[#007367]">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * limit >= totalAnalyses}
              className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56] disabled:bg-[#cccccc] disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CurriculumAnalysesPage;