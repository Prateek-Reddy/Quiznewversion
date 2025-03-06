// utils/auth.js
import { jwtDecode } from 'jwt-decode'; // Use named import

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decoded = jwtDecode(token); // Use the named export
  return decoded.role;
};