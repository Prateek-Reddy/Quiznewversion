import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddQuestionPage = () => {
  const [formData, setFormData] = useState({
    company: '',
    newCompany: '', // For "Others" option
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
  const [companies, setCompanies] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseCodes, setCourseCodes] = useState([]);
  const [error, setError] = useState('');
  const [showNewCompanyInput, setShowNewCompanyInput] = useState(false); // Toggle for "Others" option
  const [file, setFile] = useState(null); // For file upload
  const navigate = useNavigate();

  // Fetch distinct companies and courses on component mount
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

  // Fetch course codes when course changes
  useEffect(() => {
    const fetchCourseCodes = async () => {
      if (formData.course) {
        try {
          const response = await axios.get('http://localhost:5000/api/admin/course-code', {
            params: { course: formData.course },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setCourseCodes(response.data);
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

  // Handle company selection
  const handleCompanyChange = (e) => {
    const selectedCompany = e.target.value;
    if (selectedCompany === 'Others') {
      setShowNewCompanyInput(true); // Show input for new company
      setFormData((prevData) => ({
        ...prevData,
        company: '', // Reset company value
      }));
    } else {
      setShowNewCompanyInput(false); // Hide input for new company
      setFormData((prevData) => ({
        ...prevData,
        company: selectedCompany,
        newCompany: '', // Reset new company input
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload submission
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/admin/upload-questions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setError('');
      alert(response.data.message); // Show success message
      navigate('/admin/questions'); // Redirect to questions page
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to upload questions.');
    }
  };

  // Handle form submission for manual question addition
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate company input
    if (!formData.company && !formData.newCompany) {
      setError('Please select a company or enter a new company name.');
      return;
    }

    try {
      // Use newCompany if "Others" is selected
      const finalCompany = showNewCompanyInput ? formData.newCompany : formData.company;

      const payload = {
        ...formData,
        company: finalCompany, // Replace company with newCompany if applicable
      };

      await axios.post('http://localhost:5000/api/admin/questions', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate('/admin/questions');
    } catch (error) {
      setError('Failed to add question. Please try again.');
    }
  };

  // Handle download of sample and instructions
  const handleDownloadSample = async () => {
    try {
      // Download the sample Excel sheet
      const sampleResponse = await axios.get('http://localhost:5000/api/admin/download-sample-sheet', {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      // Create a download link for the sample Excel sheet
      const sampleUrl = window.URL.createObjectURL(new Blob([sampleResponse.data]));
      const sampleLink = document.createElement('a');
      sampleLink.href = sampleUrl;
      sampleLink.setAttribute('download', 'sample-questions.xlsx');
      document.body.appendChild(sampleLink);
      sampleLink.click();
      sampleLink.remove();
  
      // Wait for the first download to complete
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
  
      // Download the instructions file
      const instructionsResponse = await axios.get('http://localhost:5000/api/admin/download-instructions', {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      // Create a download link for the instructions file
      const instructionsUrl = window.URL.createObjectURL(new Blob([instructionsResponse.data]));
      const instructionsLink = document.createElement('a');
      instructionsLink.href = instructionsUrl;
      instructionsLink.setAttribute('download', 'instructions.txt');
      document.body.appendChild(instructionsLink);
      instructionsLink.click();
      instructionsLink.remove();
    } catch (error) {
      setError('Failed to download files. Please try again.');
    }
  };

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <h2 className="text-3xl font-semibold text-[#007367] mb-6">Add Question</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Download Sample and Instructions Button */}
      <button
        onClick={handleDownloadSample}
        className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56] focus:outline-none focus:ring-2 focus:ring-[#005f56] mb-6"
      >
        Download Sample and Instructions
      </button>

      {/* File Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-[#005f56]">Upload Questions via Excel<span className="text-red-500">*</span></label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367] mb-2"
        />
        <button
          onClick={handleFileUpload}
          className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56] focus:outline-none focus:ring-2 focus:ring-[#005f56]"
        >
          Upload Questions
        </button>
      </div>

      {/* Manual Question Addition Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {/* Company Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Company<span className="text-red-500">*</span></label>
          <select
            value={formData.company}
            onChange={handleCompanyChange}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required={!showNewCompanyInput} // Only required if "Others" is not selected
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company} value={company}>{company}</option>
            ))}
            <option value="Others">Others</option> {/* Add "Others" option */}
          </select>
        </div>

        {/* New Company Input (shown if "Others" is selected) */}
        {showNewCompanyInput && (
          <div>
            <label className="block text-sm font-medium mb-2 text-[#005f56]">New Company Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.newCompany}
              onChange={(e) => setFormData({ ...formData, newCompany: e.target.value })}
              className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
              required={showNewCompanyInput} // Required if "Others" is selected
            />
          </div>
        )}

        {/* Course Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Course<span className="text-red-500">*</span></label>
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
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Course Code<span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.course_code}
            readOnly // Make it read-only
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
          />
        </div>

        {/* PYQ */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Question<span className="text-red-500">*</span></label>
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

        {/* Option A */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Option A<span className="text-red-500">*</span></label>
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
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Option B<span className="text-red-500">*</span></label>
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
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Option C<span className="text-red-500">*</span></label>
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
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Option D<span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.option_d}
            onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          />
        </div>

        {/* Answer Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#005f56]">Answer</label>
          <select
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
            required
          >
            <option value="">Select Answer</option>
            <option value="OptionA">Option A</option>
            <option value="OptionB">Option B</option>
            <option value="OptionC">Option C</option>
            <option value="OptionD">Option D</option>
            <option value="All Valid">All Valid</option>
            <option value="Placeholder">Placeholder</option>
          </select>
        </div>

        {/* Add Question Button */}
        <button
          type="submit"
          className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56] focus:outline-none focus:ring-2 focus:ring-[#005f56]"
        >
          Add Question
        </button>
      </form>
    </div>
  );
};

export default AddQuestionPage;