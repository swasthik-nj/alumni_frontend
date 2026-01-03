import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  HeartHandshake, 
  IndianRupee, 
  Calendar, 
  User, 
  TrendingUp,
  Users,
  Award,
  Sparkles
} from 'lucide-react';
import Nav from './Nav';

export default function Donate() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState([]);
  const [stats, setStats] = useState({ total: 0, count: 0 });

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  const fetchRecent = async () => {
    try {
      const res = await api.get('/api/v1/donations?limit=8');
      if (res.data?.success) {
        const donations = res.data.data.donations || [];
        setRecent(donations);
        
        // Calculate stats
        const total = donations.reduce((sum, d) => sum + d.donationAmount, 0);
        setStats({ total, count: res.data.data.pagination?.total || donations.length });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const handlePresetClick = (value) => {
    setAmount(value.toString());
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to donate');
      navigate('/login');
      return;
    }
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/api/v1/donations', { donationAmount: value });
      if (res.data?.success) {
        toast.success('🎉 Thank you for your generous donation!');
        setAmount('');
        setCustomAmount('');
        fetchRecent();
      } else {
        toast.error('Failed to process donation');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Donation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <Nav />
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-rose-500 rounded-full mb-4">
              <HeartHandshake className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Support Our Alumni Community
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your donation helps fund scholarships, events, mentorship programs, and connects our growing alumni network.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Raised</p>
                <p className="text-2xl font-bold text-gray-900">₹ {stats.total.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-amber-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-rose-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Donors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
              </div>
              <Users className="w-10 h-10 text-rose-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Impact</p>
                <p className="text-2xl font-bold text-gray-900">Lives Changed</p>
              </div>
              <Award className="w-10 h-10 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">Make Your Donation</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Preset Amounts */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Amount
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handlePresetClick(preset)}
                        className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                          amount === preset.toString() && !customAmount
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-gray-200 hover:border-amber-300 text-gray-700'
                        }`}
                      >
                        ₹{preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Or Enter Custom Amount
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={customAmount}
                      onChange={handleCustomChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg"
                      placeholder="Enter amount..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !amount}
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="w-5 h-5" />
                      Donate {amount && `₹${Number(amount).toLocaleString()}`}
                    </>
                  )}
                </button>

                {!user && (
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">Note:</span> You must be logged in to make a donation.
                    </p>
                  </div>
                )}
              </form>

              {/* Impact Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Your Impact</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• ₹500 - Supports one student's study materials</p>
                  <p>• ₹2,500 - Funds a networking event</p>
                  <p>• ₹5,000 - Sponsors a mentorship program</p>
                  <p>• ₹10,000+ - Establishes a scholarship fund</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                Recent Donors
              </h3>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {recent.length === 0 ? (
                  <div className="text-center py-8">
                    <HeartHandshake className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Be the first to donate!</p>
                  </div>
                ) : (
                  recent.map((d) => (
                    <div 
                      key={d._id} 
                      className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-white font-bold">
                        {d.alumni?.alumniName?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {d.alumni?.alumniName || 'Anonymous'}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(d.createdAt).toLocaleDateString('en-IN', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      <div className="flex-shrink-0 font-bold text-amber-700">
                        ₹{d.donationAmount.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
