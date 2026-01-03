import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Calendar, Award, Building2, UserCheck, MessageSquare, Star, BarChart3, DollarSign, Target, Briefcase } from 'lucide-react';
import api from '@/utils/api';

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allAlumni, setAllAlumni] = useState([]);
  const [showAllAlumni, setShowAllAlumni] = useState(false);

  // Data states for each query
  const [alumniBefore2015, setAlumniBefore2015] = useState([]);
  const [topDonor, setTopDonor] = useState(null);
  const [popularSessions, setPopularSessions] = useState([]);
  const [multiRegistrants, setMultiRegistrants] = useState([]);
  const [totalDonations, setTotalDonations] = useState({ totalAmount: 0, donorCount: 0 });
  const [deptMostAttendees, setDeptMostAttendees] = useState([]);
  const [donorMentors, setDonorMentors] = useState([]);
  const [mentors3Plus, setMentors3Plus] = useState([]);
  const [lowFeedbackAlumni, setLowFeedbackAlumni] = useState([]);
  const [top3Sessions, setTop3Sessions] = useState([]);
  const [sameCompanyAttendees, setSameCompanyAttendees] = useState([]);
  const [deptsDidNotAttend, setDeptsDidNotAttend] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError('');

        const pickData = (res) => res?.data?.data || res?.data || [];

        // Fetch all data in parallel from dedicated admin endpoints
        const [
          alumniRes,
          topDonorRes,
          popularRes,
          multiRes,
          totalRes,
          deptRes,
          donorMentorRes,
          mentorRes,
          feedbackRes,
          top3Res,
          companyRes,
          nonAttendRes
        ] = await Promise.all([
          api.get('/api/v1/admin/alumni-before-2015').catch(() => ({ data: [] })),
          api.get('/api/v1/admin/top-donor').catch(() => ({ data: null })),
          api.get('/api/v1/admin/popular-sessions').catch(() => ({ data: [] })),
          api.get('/api/v1/admin/multi-session-alumni').catch(() => ({ data: [] })),
          api.get('/api/v1/admin/total-donations').catch(() => ({ data: { totalAmount: 0, donorCount: 0 } })),
          api.get('/api/v1/admin/department-attendance').catch(() => ({ data: [] })),
          api.get('/api/v1/admin/donor-mentors').catch(() => ({ data: [] })),
          api.get('/api/v1/admin/active-mentors').catch(() => ({ data: [] })),
          api.get('/api/v1/admin/low-rating-feedback').catch(() => ({ data: [] })),
          api.get('/api/v1/admin/top-3-sessions').catch(() => ({ data: [] })),
          api.get('/api/v1/admin/same-company-attendees').catch(() => ({ data: [] })),
          api.get('/api/v1/admin/non-attending-departments').catch(() => ({ data: [] }))
        ]);

        if (mounted) {
          console.log('Admin Data:', {
            alumniRes, topDonorRes, popularRes, multiRes, totalRes, 
            deptRes, donorMentorRes, mentorRes, feedbackRes, top3Res, 
            companyRes, nonAttendRes
          });
          
          setAlumniBefore2015(pickData(alumniRes));
          setTopDonor(pickData(topDonorRes));
          setPopularSessions(pickData(popularRes));
          setMultiRegistrants(pickData(multiRes));
          setTotalDonations(pickData(totalRes));
          setDeptMostAttendees(pickData(deptRes));
          setDonorMentors(pickData(donorMentorRes));
          setMentors3Plus(pickData(mentorRes));
          setLowFeedbackAlumni(pickData(feedbackRes));
          setTop3Sessions(pickData(top3Res));
          setSameCompanyAttendees(pickData(companyRes));
          setDeptsDidNotAttend(pickData(nonAttendRes));
        }

      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e?.message || 'Failed to load admin data');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAll();
    return () => { mounted = false; };
  }, []);

  const fetchAllAlumni = async () => {
    try {
      setError('');
      // Try multiple endpoints to improve compatibility
      const tryEndpoints = [
        '/api/v1/admin/all-alumni',
        '/api/v1/alumni',
        '/api/v1/admin/alumni',
      ];

      let data = [];
      for (const ep of tryEndpoints) {
        // eslint-disable-next-line no-await-in-loop
        const res = await api.get(ep).catch(() => null);
        const maybe = res?.data?.data || res?.data;
        if (Array.isArray(maybe) && maybe.length >= 0) {
          data = maybe;
          break;
        }
      }

      setAllAlumni(Array.isArray(data) ? data : []);
      setShowAllAlumni(true);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load all alumni');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-b border-cyan-800/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-cyan-300/60 mt-1">Comprehensive analytics and insights</p>
            </div>
           <div>
             <Link 
              to="/" 
              className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium transition-all shadow-lg shadow-cyan-500/20"
            >
              Back to Home
            </Link>
            <button
              onClick={fetchAllAlumni}
              className="ml-3 text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium transition-all shadow-lg shadow-violet-500/20"
            >
              View All Alumni
            </button>
           </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {showAllAlumni && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-cyan-100">All Alumni</h2>
              <button
                onClick={() => setShowAllAlumni(false)}
                className="text-xs px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-slate-700"
              >
                Close
              </button>
            </div>
            {allAlumni.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-slate-800">
                {allAlumni.map((a) => (
                  <div key={a._id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="font-medium text-white">{a.alumniName || a.name}</div>
                    <div className="text-xs text-cyan-300/70 mt-1">
                      {a.department} • {a.companyName || a.company}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{a.email}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-cyan-300/60 text-sm">No alumni found</div>
            )}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/50 text-red-200 backdrop-blur-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500/20 border-t-cyan-500"></div>
            <p className="text-cyan-300 mt-4">Loading analytics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* 1. Alumni before 2015 */}
            <MetricCard 
              title="Alumni Graduated Before 2015" 
              icon={Users}
              gradient="from-purple-600 to-pink-600"
            >
              {alumniBefore2015.length ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-slate-800">
                  {alumniBefore2015.slice(0, 10).map(a => (
                    <div key={a._id} className="flex justify-between items-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{a.alumniName}</div>
                        <div className="text-xs text-cyan-300/70">{a.department}</div>
                      </div>
                      <span className="ml-2 px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-semibold">
                        {a.graduationYear}
                      </span>
                    </div>
                  ))}
                  {alumniBefore2015.length > 10 && (
                    <div className="text-xs text-cyan-300/50 text-center pt-2">
                      +{alumniBefore2015.length - 10} more
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState message="No alumni found" />
              )}
            </MetricCard>

            {/* 2. Top Donor */}
            <MetricCard 
              title="Top Donor" 
              icon={Award}
              gradient="from-amber-600 to-orange-600"
            >
              {topDonor ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-xl text-white">{topDonor.alumni?.name || 'Anonymous'}</div>
                        <div className="text-sm text-amber-300/70 mt-1">{topDonor.alumni?.department}</div>
                        <div className="text-xs text-amber-300/50 mt-2">
                          {new Date(topDonor.donationDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                          ₹{Number(topDonor.donationAmount).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState message="No donations recorded" />
              )}
            </MetricCard>

            {/* 5. Total Donations - Feature Card */}
            <MetricCard 
              title="Total Donations" 
              icon={DollarSign}
              gradient="from-green-600 to-emerald-600"
            >
              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    ₹{Number(totalDonations.totalAmount || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-300/70 mt-2">Total Amount Raised</div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <span className="text-cyan-300/70 text-sm">Total Donors</span>
                  <span className="text-xl font-bold text-white">{totalDonations.donorCount || 0}</span>
                </div>
              </div>
            </MetricCard>

            {/* 3. Popular Sessions (>50 attendees) */}
            <MetricCard 
              title="Sessions with >50 Attendees" 
              icon={TrendingUp}
              gradient="from-blue-600 to-cyan-600"
            >
              {popularSessions.length ? (
                <div className="space-y-2">
                  {popularSessions.map(s => (
                    <div key={s._id} className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-white">{s.sessionName}</div>
                          <div className="text-xs text-cyan-300/70 capitalize mt-1">{s.sessionType}</div>
                        </div>
                        <span className="ml-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold">
                          {s.attendeeCount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No sessions exceed 50 attendees" />
              )}
            </MetricCard>

            {/* 4. Multi-session Alumni */}
            <MetricCard 
              title="Alumni with Multiple Registrations" 
              icon={UserCheck}
              gradient="from-indigo-600 to-purple-600"
            >
              {multiRegistrants.length ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-slate-800">
                  {multiRegistrants.slice(0, 10).map((m, idx) => (
                    <div key={m._id || idx} className="flex justify-between items-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{m.alumniName}</div>
                        <div className="text-xs text-indigo-300/70">{m.department || m.email}</div>
                      </div>
                      <span className="ml-2 px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                        {m.sessionCount} sessions
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No multi-registrants found" />
              )}
            </MetricCard>

            {/* 6. Department Attendance */}
            <MetricCard 
              title="Top Departments by Attendance" 
              icon={Building2}
              gradient="from-rose-600 to-pink-600"
            >
              {deptMostAttendees.length ? (
                <div className="space-y-2">
                  {deptMostAttendees.map((dept, idx) => (
                    <div key={dept.department || idx} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-rose-300">#{idx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{dept.department}</div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-sm font-semibold">
                        {dept.attendeeCount}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No department data available" />
              )}
            </MetricCard>

            {/* 10. Top 3 Sessions */}
            <MetricCard 
              title="Top 3 Sessions by Attendance" 
              icon={BarChart3}
              gradient="from-teal-600 to-cyan-600"
            >
              {top3Sessions.length ? (
                <div className="space-y-3">
                  {top3Sessions.map((s, idx) => (
                    <div key={s._id} className="p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition border border-teal-500/20">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center font-bold text-white text-lg">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{s.sessionName}</div>
                          <div className="text-xs text-teal-300/70 capitalize mt-1">{s.sessionType}</div>
                          <div className="mt-2 text-2xl font-bold text-teal-300">{s.attendeeCount} attendees</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No session data available" />
              )}
            </MetricCard>

            {/* 7. Donor-Mentors */}
            <MetricCard 
              title="Alumni Who Are Both Donors & Mentors" 
              icon={Target}
              gradient="from-violet-600 to-purple-600"
            >
              {donorMentors.length ? (
                <div className="space-y-2 pt-3 max-h-94 overflow-y-auto pr scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-slate-800">
                  {donorMentors.map(a => (
                    <div key={a._id} className="p-3 h-full  rounded-lg bg-slate-800 transition border-l-2 border-violet-500">
                      <div className="font-medium text-white">{a.alumniName}</div>
                      <div className="text-xs text-violet-300/70 mt-1">{a.department} • {a.companyName}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No alumni found in both categories" />
              )}
            </MetricCard>

            {/* 8. Active Mentors (>3 students) */}
            <MetricCard 
              title="Mentors Guiding >3 Students" 
              icon={Users}
              gradient="from-sky-600 to-blue-600"
            >
              {mentors3Plus.length ? (
                <div className="space-y-2">
                  {mentors3Plus.map(m => (
                    <div key={m._id} className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition">
                      <div className="flex-1">
                        <div className="font-medium text-white">{m.alumniName}</div>
                        <div className="text-xs text-sky-300/70 mt-1">{m.department}</div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-sm font-semibold">
                        {m.studentCount} students
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No active mentors found" />
              )}
            </MetricCard>

            {/* 9. Low Rating Feedback */}
            <MetricCard 
              title="Feedback Below 3 Rating" 
              icon={Star}
              gradient="from-red-600 to-rose-600"
            >
              {lowFeedbackAlumni.length ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-slate-800">
                  {lowFeedbackAlumni.map((f, idx) => (
                    <div key={f._id || idx} className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-white text-sm">{f.alumni?.name}</div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-red-400 fill-red-400" />
                          <span className="text-red-300 text-xs font-semibold">{f.feedbackRating}</span>
                        </div>
                      </div>
                      <div className="text-xs text-red-300/70">{f.session?.sessionName}</div>
                      {f.comment && (
                        <div className="text-xs text-slate-400 mt-2 italic">"{f.comment}"</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No low ratings found" />
              )}
            </MetricCard>

            {/* 11. Same Company Attendees */}
            <MetricCard 
              title="Same Company Alumni Groups" 
              icon={Briefcase}
              gradient="from-orange-600 to-amber-600"
            >
              {sameCompanyAttendees.length ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-slate-800">
                  {sameCompanyAttendees.slice(0, 8).map((group, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-white truncate flex-1">{group.companyName}</div>
                        <span className="ml-2 px-2 py-1 rounded bg-orange-500/20 text-orange-300 text-xs font-semibold">
                          {group.count}
                        </span>
                      </div>
                      <div className="text-xs text-orange-300/60">
                        {group.alumni.slice(0, 3).map(a => a.alumniName).join(', ')}
                        {group.alumni.length > 3 && ` +${group.alumni.length - 3} more`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No company groups found" />
              )}
            </MetricCard>

            {/* 12. Non-attending Departments */}
            <MetricCard 
              title="Departments with No Attendance (2025)" 
              icon={MessageSquare}
              gradient="from-slate-600 to-gray-600"
            >
              {deptsDidNotAttend.length ? (
                <div className="space-y-1 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-slate-800">
                  {deptsDidNotAttend.map((dept, idx) => (
                    <div key={idx} className="px-3 py-2 rounded-lg bg-slate-800/30 text-slate-300 text-sm">
                      {typeof dept === 'string' ? dept : dept.department || 'Unknown'}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="All departments have attendance" />
              )}
            </MetricCard>

          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, icon: Icon, gradient, children }) {
  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
      <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-cyan-800/30">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-20`}>
            <Icon className="w-5 h-5 text-cyan-300" />
          </div>
          <h2 className="text-base font-semibold text-cyan-100 flex-1">{title}</h2>
        </div>
        <div className="min-h-[120px]">
          {children}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex items-center justify-center h-32 text-cyan-300/40 text-sm">
      {message}
    </div>
  );
}
