import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'patient'
  });

  // Check for existing user on load
  useEffect(() => {
    const savedUser = localStorage.getItem('careconnect_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in email and password');
      return false;
    }

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (!formData.fullName) {
        setError('Please enter your full name');
        return false;
      }
    }

    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (formData.email === 'patient@demo.com' && formData.password === 'password123') {
        const userData = {
          id: '1',
          email: 'patient@demo.com',
          full_name: 'Raj Kumar Sharma',
          role: 'patient'
        };
        setUser(userData);
        localStorage.setItem('careconnect_user', JSON.stringify(userData));
      } else if (formData.email === 'caretaker@demo.com' && formData.password === 'password123') {
        const userData = {
          id: '2',
          email: 'caretaker@demo.com',
          full_name: 'Sunita Sharma',
          role: 'caretaker'
        };
        setUser(userData);
        localStorage.setItem('careconnect_user', JSON.stringify(userData));
      } else {
        setError('Invalid email or password. Try demo accounts.');
      }
      setLoading(false);
    }, 1500);
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    // Simulate signup
    setTimeout(() => {
      const userData = {
        id: Date.now().toString(),
        email: formData.email,
        full_name: formData.fullName,
        role: formData.role
      };
      setUser(userData);
      localStorage.setItem('careconnect_user', JSON.stringify(userData));
      setLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('careconnect_user');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      role: 'patient'
    });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      role: 'patient'
    });
  };

  // Success screen when logged in
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-white">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome!</h2>
          <p className="text-lg text-gray-700 mb-2">{user.full_name}</p>
          <p className="text-sm text-gray-500 mb-6">Role: {user.role}</p>
          
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-green-600 transition-all duration-200">
              {user.role === 'patient' ? 'Go to Patient Dashboard' : 'Go to Caretaker Dashboard'}
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-xl">
            <p className="text-sm text-green-700">
              🎉 Authentication working! Now you can integrate this with your dashboard routing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl text-white">🏥</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">CareConnect</h1>
          <p className="text-gray-600">
            {isLogin ? 'Welcome back to your health companion' : 'Join CareConnect for better health management'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-gray-600 mt-1">
              {isLogin ? 'Access your health dashboard' : 'Get started with personalized care'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Full Name (Signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Role Selection (Signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                >
                  <option value="patient">Patient</option>
                  <option value="caretaker">Caretaker</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={isLogin ? handleSignIn : handleSignUp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            {/* Quick Login Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => {
                  setFormData({ ...formData, email: 'patient@demo.com', password: 'password123' });
                }}
                className="bg-blue-50 text-blue-700 py-2 px-4 rounded-lg text-sm hover:bg-blue-100 transition-colors"
              >
                Demo Patient
              </button>
              <button
                onClick={() => {
                  setFormData({ ...formData, email: 'caretaker@demo.com', password: 'password123' });
                }}
                className="bg-green-50 text-green-700 py-2 px-4 rounded-lg text-sm hover:bg-green-100 transition-colors"
              >
                Demo Caretaker
              </button>
            </div>
          </div>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center border-t border-gray-200 pt-6">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-red-500 hover:text-red-600 font-semibold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Demo Info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Patient:</strong> patient@demo.com / password123</p>
              <p><strong>Caretaker:</strong> caretaker@demo.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
