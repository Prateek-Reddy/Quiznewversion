import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompanyRoundsPage = () => {
  const [companyRounds, setCompanyRounds] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [companyFilter, setCompanyFilter] = useState('');
  const [totalRounds, setTotalRounds] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [currentRound, setCurrentRound] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    no_of_rounds: '',
    no_of_online_rounds: '',
    no_of_offline_rounds: '',
  });
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  // Fetch distinct companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/distinct-companies', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch company rounds
  useEffect(() => {
    const fetchCompanyRounds = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/admin/company-rounds', {
          params: { page, limit, company: companyFilter },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCompanyRounds(response.data.companyRounds);
        setTotalRounds(response.data.total);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data. Please try again.');
        setLoading(false);
      }
    };

    fetchCompanyRounds();
  }, [page, companyFilter]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that total rounds equal the sum of online and offline rounds
    if (parseInt(formData.no_of_rounds) !== parseInt(formData.no_of_online_rounds) + parseInt(formData.no_of_offline_rounds)) {
      setError('Total rounds must equal the sum of online and offline rounds.');
      return;
    }

    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/admin/company-rounds/${currentRound.id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setNotification('Record updated successfully.');
      } else {
        await axios.post('http://localhost:5000/api/admin/company-rounds', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setNotification('Record added successfully.');
      }
      setFormData({
        company: '',
        no_of_rounds: '',
        no_of_online_rounds: '',
        no_of_offline_rounds: '',
      });
      setEditMode(false);
      setCurrentRound(null);
      setPage(1); // Refresh the table
      setError(''); // Clear any previous errors
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save data. Please try again.');
    }
  };

  // Handle edit button click
  const handleEdit = (round) => {
    setFormData({
      company: round.company,
      no_of_rounds: round.no_of_rounds,
      no_of_online_rounds: round.no_of_online_rounds,
      no_of_offline_rounds: round.no_of_offline_rounds,
    });
    setEditMode(true);
    setCurrentRound(round);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/company-rounds/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCompanyRounds(companyRounds.filter((round) => round.id !== id));
      setNotification('Record deleted successfully.');
    } catch (error) {
      setError('Failed to delete data. Please try again.');
    }
  };

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <h2 className="text-3xl font-semibold text-[#007367] mb-6">Company Rounds</h2>

      {/* Notification */}
      {notification && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {notification}
        </div>
      )}

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">{editMode ? 'Edit Record' : 'Add New Record'}</h3>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#005f56]">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#005f56]">Total Rounds</label>
            <input
              type="number"
              name="no_of_rounds"
              value={formData.no_of_rounds}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#005f56]">Online Rounds</label>
            <input
              type="number"
              name="no_of_online_rounds"
              value={formData.no_of_online_rounds}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#005f56]">Offline Rounds</label>
            <input
              type="number"
              name="no_of_offline_rounds"
              value={formData.no_of_offline_rounds}
              onChange={handleInputChange}
              className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56]"
        >
          {editMode ? 'Update' : 'Add'} Record
        </button>
        {editMode && (
          <button
            type="button"
            onClick={() => {
              setEditMode(false);
              setCurrentRound(null);
              setFormData({
                company: '',
                no_of_rounds: '',
                no_of_online_rounds: '',
                no_of_offline_rounds: '',
              });
            }}
            className="mt-4 ml-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Filter */}
      <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
        <label className="block text-sm font-medium mb-2 text-[#005f56]">Filter by Company</label>
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
        >
          <option value="">All Companies</option>
          {companies.map((company) => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#007367] text-white">
            <tr>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Total Rounds</th>
              <th className="p-3 text-left">Online Rounds</th>
              <th className="p-3 text-left">Offline Rounds</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companyRounds.map((round) => (
              <tr key={round.id} className="border-b hover:bg-[#e0d1bb]">
                <td className="p-3">{round.company}</td>
                <td className="p-3">{round.no_of_rounds}</td>
                <td className="p-3">{round.no_of_online_rounds}</td>
                <td className="p-3">{round.no_of_offline_rounds}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(round)}
                      className="w-20 bg-[#007367] text-white py-1 px-2 rounded-md hover:bg-[#005f56]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(round.id)}
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
          disabled={page * limit >= totalRounds}
          className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56] disabled:bg-[#cccccc] disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompanyRoundsPage;