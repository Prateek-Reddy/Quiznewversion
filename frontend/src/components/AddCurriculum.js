import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCurriculumAnalysisPage = () => {
  const [formData, setFormData] = useState({
    curriculum: '',
    syllabus_analysis: '',
    faculty_attention: '',
    course_code: '', // Renamed from course_id
    course: '', // Renamed from subject_name
  });
  const [courses, setCourses] = useState([]); // Distinct course names
  const [courseCodes, setCourseCodes] = useState([]); // Distinct course codes
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch distinct course names on component mount
  useEffect(() => {
    const fetchDistinctCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/distinct/courses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCourses(response.data); // Set distinct course names
      } catch (error) {
        console.error('Error fetching distinct courses:', error);
      }
    };

    fetchDistinctCourses();
  }, []);

  // Fetch course codes when course changes
  useEffect(() => {
    const fetchCourseCodes = async () => {
      if (formData.course) {
        try {
          const response = await axios.get('http://localhost:5000/api/admin/course-code', {
            params: { course: formData.course },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setCourseCodes(response.data); // Set course codes for the selected course
          // Automatically set the first course code if available
          if (response.data.length > 0) {
            setFormData((prevData) => ({
              ...prevData,
              course_code: response.data[0], // Set the first course code
            }));
          }
        } catch (error) {
          console.error('Error fetching course codes:', error);
        }
      }
    };

    fetchCourseCodes();
  }, [formData.course]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/curriculum-analyses', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate('/admin/curriculum');
    } catch (error) {
      setError('Failed to add curriculum analysis. Please try again.');
    }
  };

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <h2 className="text-3xl font-semibold text-[#007367] mb-6">Add Curriculum Analysis</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {/* Course Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">
            Course <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.course}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>

        {/* Course Code (automatically populated) */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">
            Course Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.course_code}
            readOnly // Make it read-only
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* Curriculum */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">
            Curriculum <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.curriculum}
            onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* Syllabus Analysis */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">
            Syllabus Analysis <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.syllabus_analysis}
            onChange={(e) => setFormData({ ...formData, syllabus_analysis: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* Faculty Attention */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">
            Faculty Attention <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.faculty_attention}
            onChange={(e) => setFormData({ ...formData, faculty_attention: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* Add Button */}
        <button
          type="submit"
          className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56] focus:outline-none focus:ring-2 focus:ring-[#005f56]"
        >
          Add Curriculum Analysis
        </button>
      </form>
    </div>
  );
};

export default AddCurriculumAnalysisPage;