import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [companyFilter, setCompanyFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [companies, setCompanies] = useState([]);
  const [courses, setCourses] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDistinctValues = async () => {
      try {
        const [companiesResponse, coursesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/distinct/companies', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:5000/api/admin/distinct/courses', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        setCompanies(companiesResponse.data);
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error('Error fetching distinct values:', error);
      }
    };

    fetchDistinctValues();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/questions', {
          params: { page, limit, company: companyFilter, course: courseFilter },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setQuestions(response.data.questions);
        setTotalQuestions(response.data.total);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch questions. Please try again.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [page, limit, companyFilter, courseFilter]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/questions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setQuestions(questions.filter((question) => question.question_id !== id));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  if (loading) return <div className="text-[#007367] text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <h2 className="text-3xl font-semibold text-[#007367] mb-6">Questions</h2>

      {/* Filters */}
      <div className="bg-white p-4 shadow-md rounded-md mb-6">
        <div className="flex gap-4">
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="w-1/2 p-2 border rounded-md bg-[#f0e1cb] hover:bg-[#e0d1bb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
          >
            <option value="">All Companies</option>
            {companies.map((company) => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-1/2 p-2 border rounded-md bg-[#f0e1cb] hover:bg-[#e0d1bb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#007367] text-white">
            <tr>
              <th className="p-3 text-left">Question</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.question_id} className="border-b hover:bg-[#e0d1bb]">
                <td className="p-3">{question.pyq}</td>
                <td className="p-3">{question.course}</td>
                <td className="p-3">{question.company}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/questions/${question.question_id}/edit`)}
                    className="bg-[#007367] text-white px-3 py-1 rounded-md hover:bg-[#005f56]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(question.question_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-[#007367] text-white px-4 py-2 rounded-md hover:bg-[#005f56] disabled:bg-[#cccccc] disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="px-6 text-[#007367]">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * limit >= totalQuestions}
          className="bg-[#007367] text-white px-4 py-2 rounded-md hover:bg-[#005f56] disabled:bg-[#cccccc] disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionsPage;