import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    course: '',
    pyq: '',
    concept: '',
    course_code: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    answer: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the question by ID
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/questions/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFormData(response.data); // Set all fields in the form
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch question. Please try again.');
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/questions/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate('/admin/questions'); // Redirect to the questions page after saving
    } catch (error) {
      setError('Failed to update question. Please try again.');
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
      <h2 className="text-3xl font-semibold text-[#007367] mb-6">Edit Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {/* Company */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Company</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* Course */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Course</label>
          <input
            type="text"
            value={formData.course}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* PYQ */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">PYQ</label>
          <input
            type="text"
            value={formData.pyq}
            onChange={(e) => setFormData({ ...formData, pyq: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* Concept */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Concept</label>
          <input
            type="text"
            value={formData.concept}
            onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
          />
        </div>

        {/* Course Code */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Course Code</label>
          <input
            type="text"
            value={formData.course_code}
            onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
          />
        </div>

        {/* Option A */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Option A</label>
          <input
            type="text"
            value={formData.option_a}
            onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* Option B */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Option B</label>
          <input
            type="text"
            value={formData.option_b}
            onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* Option C */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Option C</label>
          <input
            type="text"
            value={formData.option_c}
            onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* Option D */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Option D</label>
          <input
            type="text"
            value={formData.option_d}
            onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* Answer */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Answer</label>
          <input
            type="text"
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
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

export default EditQuestion;