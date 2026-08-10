import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute: wraps any admin component.
 * - If token is missing: redirect immediately to /admin/login (no flash)
 * - If token exists but is invalid (e.g. expired): also redirect
 * - Only if token is verified by the backend does it render children
 */
const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'authorized' | 'unauthorized'

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5001');

    if (!token) {
      setStatus('unauthorized');
      return;
    }

    fetch(`${API_URL}/api/admin/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          setStatus('authorized');
        } else {
          localStorage.removeItem('adminToken');
          setStatus('unauthorized');
        }
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
        setStatus('unauthorized');
      });
  }, []);

  if (status === 'checking') {
    // Show nothing (blank) while we verify — prevents any dashboard flash
    return null;
  }

  if (status === 'unauthorized') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
