import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';
import Toast from '../components/Toast';
import API_URL from '../api';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
        setShowToast(true);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Lock size={48} className="mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="text-gray-400 mt-2">Enter your password to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full"
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Login
          </button>
        </form>

        {showToast && error && (
          <Toast message={error} type="error" onClose={() => setShowToast(false)} />
        )}
      </div>
    </div>
  );
};

export default Admin;
