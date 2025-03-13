import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch users. Please try again.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(users.filter((user) => user.user_id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) return <div className="text-[#007367] text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      <h2 className="text-3xl font-semibold text-[#007367] mb-6">Users</h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#007367] text-white">
            <tr>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id} className="border-b hover:bg-[#e0d1bb]">
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/users/${user.user_id}/edit`)}
                    className="w-20 bg-[#007367] text-white px-3 py-1 rounded-md hover:bg-[#005f56] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.user_id)}
                    className="w-20 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;