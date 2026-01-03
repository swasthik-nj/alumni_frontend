import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Mail, Phone, Briefcase, GraduationCap, Building2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Nav from './Nav';

export default function Directory() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  
  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Technology'];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const fetchAlumni = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (department) params.append('department', department);
      if (graduationYear) params.append('graduationYear', graduationYear);
      params.append('page', page);
      params.append('limit', '12');

      const response = await api.get(`/api/v1/auth/alumni?\${params.toString()}`);
      
      if (response.data.success) {
        setAlumni(response.data.data.alumni);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
      toast.error('Failed to fetch alumni directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni(1);
  }, [search, department, graduationYear]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleClearFilters = () => {
    setSearch('');
    setDepartment('');
    setGraduationYear('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Nav/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Alumni Directory
          </h1>
          <p className="text-gray-600 text-lg">Connect with fellow alumni across the globe</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Alumni</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, company, or designation..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {(search || department || graduationYear) && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>Active filters applied</span>
              </div>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600 rounded-lg font-medium transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {!loading && (
          <div className="mb-6 flex items-center gap-2 text-gray-700 font-medium">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            Showing {alumni.length} of {pagination.total} alumni
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : alumni.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No alumni found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {alumni.map((person) => (
                <div
                  key={person._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:-translate-y-1"
                >
                  <div className="h- bg-indigo-500"></div>
                  
                  <div className="relative px-6 pb-6">
                    <div className="flex justify-center -mt-14 mb-4">
                      <div className="w-28 h-28 rounded-full bg-indigo-500 border-white shadow-xl flex items-center justify-center text-4xl font-bold text-white">
                        {person.alumniName?.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {person.alumniName}
                      </h3>
                      <div className="flex items-center justify-center gap-1 text-indigo-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-semibold">Class of {person.graduationYear}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-sm">
                        <GraduationCap className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                        <span className="text-gray-700">{person.department}</span>
                      </div>
                      
                      {person.companyName && (
                        <div className="flex items-start gap-3 text-sm">
                          <Building2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                          <span className="text-gray-700">{person.companyName}</span>
                        </div>
                      )}
                      
                      {person.designation && (
                        <div className="flex items-start gap-3 text-sm">
                          <Briefcase className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                          <span className="text-gray-700">{person.designation}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                      {person.email && (
                        <a
                          href={`mailto:\${person.email}`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </a>
                      )}
                      {person.phone && (
                        <a
                          href={`tel:\${person.phone}`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => fetchAlumni(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-300 transition-all font-medium"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => fetchAlumni(page)}
                      className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                        page === pagination.page
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'bg-white border-2 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => fetchAlumni(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-300 transition-all font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
