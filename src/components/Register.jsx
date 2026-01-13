import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


export default function Register() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
    const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    alumniName: "",
    graduationYear: "",
    department: "",
    companyName: "",
    designation: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
        try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register`, form
      );
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Create an account</h2>
          <p className="text-cyan-300/70 mt-2">Register as an alumni</p>
        </div>
        <div className="mx-auto max-w-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit}>
            {message && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-900/30 border border-emerald-700/40 text-emerald-200">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700/40 text-red-200">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-cyan-100 text-sm mb-1">Full name</label>
              <input
                name="alumniName"
                value={form.alumniName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="mb-2 sm:mb-0">
                <label className="block text-cyan-100 text-sm mb-1">Graduation year</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={form.graduationYear}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                  placeholder="2020"
                />
              </div>

              <div>
                <label className="block text-cyan-100 text-sm mb-1">Department</label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-cyan-100 text-sm mb-1">Company (optional)</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                placeholder="ACME Corp"
              />
            </div>

            <div className="mt-4">
              <label className="block text-cyan-100 text-sm mb-1">Designation (optional)</label>
              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                placeholder="Software Engineer"
              />
            </div>

            <div className="mt-4">
              <label className="block text-cyan-100 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div className="mt-4">
              <label className="block text-cyan-100 text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                placeholder="Choose a strong password"
              />
            </div>

            <div className="mt-4 mb-6">
              <label className="block text-cyan-100 text-sm mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                placeholder="+91 98765 43210"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition disabled:bg-slate-700"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}