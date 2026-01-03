import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Use api helper instead of axios directly
      const { data } = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`, form);

      // Backend should return token and optionally user data
      const token = data?.token || data?.data?.token;
      const userData = data?.data?.alumni || data?.alumni || data?.user;
      if (token) {
        // Always store token if returned
        login(token, userData);
        toast.success(data?.message || "Logged in successfully");
        navigate("/");
      } else {
        throw new Error("No token returned from server");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Check credentials.");
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 text-white">Login In</h2>
        <p className="text-sm text-gray-500 mt-1 text-white">Use your email and password</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700">{error}</div>
            )}

            <div>
              <label className="block text-gray-700 text-sm mb-2 text-white">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-lg border text-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="you@school.edu"
              />
            </div>

            <div>
              <label className="block  text-sm mb-2 text-white">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full text-white px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-700">
                <input type="checkbox" checked={remember} onChange={() => setRemember((r) => !r)} />
                Remember me
              </label>
              <Link to="/forgot" className="text-blue-600 hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

           

            <p className="text-center text-sm text-gray-600 mt-4">Don't have an account? <Link to="/register" className="text-blue-600 font-medium hover:underline">Create one</Link></p>
          </form>
      </div>
    </div>
  );
}
