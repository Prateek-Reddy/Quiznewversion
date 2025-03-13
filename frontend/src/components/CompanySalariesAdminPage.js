import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompanySalariesAdminPage = () => {
  const [companySalaries, setCompanySalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [companyFilter, setCompanyFilter] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [notification, setNotification] = useState('');
  const [distinctCompanies, setDistinctCompanies] = useState([]);
  const navigate = useNavigate();

  // Fetch all records
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/company-salaries', {
          params: { page, limit, company: companyFilter },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCompanySalaries(response.data.companySalaries);
        setTotalRecords(response.data.total);
      } catch (error) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, companyFilter]);

  // Fetch distinct companies
  useEffect(() => {
    const fetchDistinctCompanies = async () => {
      try {
        const response = await axios.get('/api/admin/company-salaries/distinct-companies', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setDistinctCompanies(response.data);
      } catch (error) {
        setError('Failed to fetch distinct companies.');
      }
    };
    fetchDistinctCompanies();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/company-salaries/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCompanySalaries(companySalaries.filter((record) => record.id !== id));
      setNotification('Record deleted successfully.');
    } catch (error) {
      setError('Failed to delete record.');
    }
  };

  // Handle edit
  const handleEdit = (record) => {
    setEditMode(true);
    setCurrentRecord(record);
  };

  // Handle form submission (add/edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      company: formData.get('company'),
      roles: formData.get('roles'),
      salaries: formData.get('salaries'),
    };

    try {
      if (editMode) {
        await axios.put(`/api/admin/company-salaries/${currentRecord.id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setNotification('Changes saved successfully.');
      } else {
        await axios.post('/api/admin/company-salaries', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setNotification('Data added successfully.');
      }
      setEditMode(false);
      setCurrentRecord(null);
      setPage(1); // Refresh the table
      setError(''); // Clear any previous errors
      e.target.reset(); // Clear the form fields
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save record.');
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
      <h2 className="text-3xl font-semibold text-[#007367] mb-6">Company Salaries Management</h2>

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
            <label className="block text-sm font-medium mb-2">Company</label>
            <input
              type="text"
              name="company"
              defaultValue={currentRecord?.company || ''}
              className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Roles (separated by /)</label>
            <input
              type="text"
              name="roles"
              defaultValue={currentRecord?.roles || ''}
              className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Salaries (separated by /)</label>
            <input
              type="text"
              name="salaries"
              defaultValue={currentRecord?.salaries || ''}
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
              setCurrentRecord(null);
            }}
            className="mt-4 ml-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Filter */}
      <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
        <label className="block text-sm font-medium mb-2">Filter by Company</label>
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="w-full p-2 border border-[#e0d1bb] rounded-md bg-[#f0e1cb] focus:outline-none focus:ring-2 focus:ring-[#007367]"
        >
          <option value="">All Companies</option>
          {distinctCompanies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#007367] text-white">
            <tr>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Roles</th>
              <th className="p-3 text-left">Salaries (LPA)</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companySalaries.map((record) => (
              <tr key={record.id} className="border-b hover:bg-[#e0d1bb]">
                <td className="p-3">{record.company}</td>
                <td className="p-3">{record.roles}</td>
                <td className="p-3">{record.salaries}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="bg-[#007367] text-white py-1 px-2 rounded-md hover:bg-[#005f56] w-20 text-center"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 w-20 text-center"
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
          disabled={page * limit >= totalRecords}
          className="bg-[#007367] text-white py-2 px-4 rounded-md hover:bg-[#005f56] disabled:bg-[#cccccc] disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompanySalariesAdminPage;