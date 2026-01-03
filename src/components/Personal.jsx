import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';


export default function Personal() {
  const { user, logout, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">Alumni Connect</h1>
          <div className="flex items-center gap-5">
            {user ? (
              <>
                <Link to="/" className='text-gray-600 bg-gray-200/50 px-3 py-1 rounded hover:text-indigo-800'>Home</Link>
                <span className="text-sm text-gray-600">Hello, {user.alumniName || user.email}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {user ? (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome back, {user.alumniName}! 🎓</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-800">{user.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="text-gray-800">{user.department || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Graduation Year</label>
                  <p className="text-gray-800">{user.graduationYear || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-3">
                {user.companyName && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-gray-800">{user.companyName}</p>
                  </div>
                )}
                
                {user.designation && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Designation</label>
                    <p className="text-gray-800">{user.designation}</p>
                  </div>
                )}
                
                {user.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-800">{user.phone}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition">
                  Edit Profile
                </button>
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
                  Browse Alumni
                </button>
                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition">
                  Post Update
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Alumni Connect</h2>
            <p className="text-gray-600 mb-6">Connect with fellow alumni, share updates, and grow your network.</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
