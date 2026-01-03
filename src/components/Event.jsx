import React, { useEffect, useState, useContext } from 'react';
import toast from 'react-hot-toast';
import Nav from './Nav';
import api from '../utils/api';
import { AuthContext } from '@/contexts/AuthContext';
import { Calendar, Users, CheckCircle, Clock, Grid, Filter, Briefcase, MessageCircle, Palette } from 'lucide-react';

const typeLabels = {
  career: 'Career Talk',
  networking: 'Networking',
  cultural: 'Cultural',
  other: 'Other'
};

export default function Event() {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const url = filter ? `/api/v1/events/sessions?type=${filter}` : '/api/v1/events/sessions';
      const res = await api.get(url);
      if (res.data.success) {
        setSessions(res.data.data.sessions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRegistrations = async () => {
    if (!user) return;
    try {
      const res = await api.get('/api/v1/events/registrations/me');
      if (res.data.success) {
        setMyRegs(res.data.data.registrations || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [filter]);

  useEffect(() => {
    fetchMyRegistrations();
  }, [user]);

  const isRegistered = (sessionId) => myRegs.some(r => r.session?._id === sessionId);

  const handleRegister = async (sessionId) => {
    if (!user) {
      toast.error('Please login to register for events');
      return;
    }
    if (isRegistered(sessionId)) return;
    try {
      setRegLoading(sessionId);
      const res = await api.post('/api/v1/events/sessions/register', { sessionId });
      if (res.data.success) {
        setMyRegs(prev => [...prev, res.data.data.registration]);
        toast.success('✅ Successfully registered for the session!');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  };

  const getSessionIcon = (type) => {
    switch(type) {
      case 'career': return <Briefcase className="w-5 h-5" />;
      case 'networking': return <MessageCircle className="w-5 h-5" />;
      case 'cultural': return <Palette className="w-5 h-5" />;
      default: return <Grid className="w-5 h-5" />;
    }
  };

  const getSessionColor = (type) => {
    switch(type) {
      case 'career': return 'border-blue-500';
      case 'networking': return 'border-green-500';
      case 'cultural': return 'border-purple-500';
      default: return 'border-indigo-500';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-fuchsia-50">
      <Nav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Events & Sessions</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Join upcoming alumni sessions: career insights, networking mixers, cultural celebrations, and more.</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-gray-700 font-medium"><Filter className="w-4 h-4"/> Filter by type:</div>
          {['', 'career', 'networking', 'cultural', 'other'].map(t => (
            <button
              key={t || 'all'}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-full text-sm border transition ${filter === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
            >
              {t === '' ? 'All' : typeLabels[t]}
            </button>
          ))}
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-indigo-600"></div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow p-10 text-center text-gray-600">No sessions found.</div>
          ) : (
            sessions.map(s => {
              const registered = isRegistered(s._id);
              return (
                <div key={s._id} className={`bg-white rounded-xl shadow hover:shadow-lg transition p-6 border-t-4 relative overflow-hidden group ${getSessionColor(s.sessionType)}`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100 rounded-bl-full group-hover:bg-indigo-200 transition" />
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-gray-600">{new Date(s.date).toLocaleDateString()}</span>
                    </div>
                    <div className="text-indigo-600">{getSessionIcon(s.sessionType)}</div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{s.sessionName}</h3>
                  <span className="inline-block text-xs font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-700 mb-3">{typeLabels[s.sessionType] || s.sessionType}</span>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{s.description}</p>
                  <button
                    disabled={registered || regLoading === s._id}
                    onClick={() => handleRegister(s._id)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${registered ? 'bg-green-50 text-green-700 border border-green-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'} disabled:opacity-50`}
                  >
                    {registered ? (<><CheckCircle className="w-4 h-4"/> Registered</>) : regLoading === s._id ? (<><Clock className="w-4 h-4 animate-pulse"/> Processing...</>) : (<><Users className="w-4 h-4"/> Register</>)}
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* My Registrations */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">My Registrations</h2>
          {!user && (
            <p className="text-gray-600 text-sm">Login to see and manage your registrations.</p>
          )}
          {user && myRegs.length === 0 && (
            <p className="text-gray-600 text-sm">You haven't registered for any sessions yet.</p>
          )}
          {user && myRegs.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              {myRegs.map(r => (
                <div key={r._id} className="border rounded-lg p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-gray-800">{r.session?.sessionName}</span>
                  </div>
                  <span className="text-xs text-gray-600">{typeLabels[r.session?.sessionType] || r.session?.sessionType}</span>
                  <span className="text-xs text-gray-500">{new Date(r.session?.date).toLocaleString()}</span>
                  <span className="text-xs text-gray-400">Registered {new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
