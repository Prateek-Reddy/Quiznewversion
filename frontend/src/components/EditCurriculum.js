import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCurriculum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    curriculum: '',
    syllabus_analysis: '',
    faculty_attention: '',
    course_id: '',
    subject_name: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the curriculum analysis by ID
  useEffect(() => {
    const fetchCurriculumAnalysis = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/curriculum-analyses/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch curriculum analysis. Please try again.');
        setLoading(false);
      }
    };

    fetchCurriculumAnalysis();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/curriculum-analyses/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate('/admin/curriculum'); // Redirect to the curriculum page after saving
    } catch (error) {
      setError('Failed to update curriculum analysis. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-[#007367] text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <h2 className="text-3xl font-semibold text-[#007367] mb-6">Edit Curriculum Analysis</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {/* Curriculum */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Curriculum</label>
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
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Syllabus Analysis</label>
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
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Faculty Attention</label>
          <input
            type="text"
            value={formData.faculty_attention}
            onChange={(e) => setFormData({ ...formData, faculty_attention: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* Course ID */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Course ID</label>
          <input
            type="text"
            value={formData.course_id}
            onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* Subject Name */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Subject Name</label>
          <input
            type="text"
            value={formData.subject_name}
            onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56] focus:outline-none focus:ring-2 focus:ring-[#005f56]"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCurriculum;