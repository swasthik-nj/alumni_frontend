import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  TrendingUp,
  Calendar,
  Award,
  Building2,
  UserCheck,
  MessageSquare,
  Star,
  BarChart3,
  DollarSign,
  Target,
  Briefcase,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Eye,
  HeartHandshake,
} from "lucide-react";
import api from "@/utils/api";
import AdminStudentManagement from "./AdminStudentManagement";
import AdminMentorshipAnalytics from "./AdminMentorshipAnalytics";
import Nav from "./Nav";
import Footer from "./Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("analytics"); // 'analytics' | 'students' | 'mentorship'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        setError("");

        const pickData = (res) => res?.data?.data || res?.data || [];

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
          nonAttendRes,
        ] = await Promise.all([
          api.get("/api/v1/admin/alumni-before-2015").catch(() => ({ data: [] })),
          api.get("/api/v1/admin/top-donor").catch(() => ({ data: null })),
          api.get("/api/v1/admin/popular-sessions").catch(() => ({ data: [] })),
          api.get("/api/v1/admin/multi-session-alumni").catch(() => ({ data: [] })),
          api.get("/api/v1/admin/total-donations").catch(() => ({ data: { totalAmount: 0, donorCount: 0 } })),
          api.get("/api/v1/admin/department-attendance").catch(() => ({ data: [] })),
          api.get("/api/v1/admin/donor-mentors").catch(() => ({ data: [] })),
          api.get("/api/v1/admin/active-mentors").catch(() => ({ data: [] })),
          api.get("/api/v1/admin/low-rating-feedback").catch(() => ({ data: [] })),
          api.get("/api/v1/admin/top-3-sessions").catch(() => ({ data: [] })),
          api.get("/api/v1/admin/same-company-attendees").catch(() => ({ data: [] })),
          api.get("/api/v1/admin/non-attending-departments").catch(() => ({ data: [] })),
        ]);

        if (mounted) {
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
        if (mounted) setError(e?.response?.data?.message || e?.message || "Failed to load admin data");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchAllAlumni = async () => {
    try {
      setError("");
      const tryEndpoints = [
        "/api/v1/admin/all-alumni",
        "/api/v1/alumni",
        "/api/v1/admin/alumni",
      ];

      let data = [];
      for (const ep of tryEndpoints) {
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
      setError(e?.response?.data?.message || "Failed to load alumni");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Nav />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="gap-1.5 text-xs font-normal">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Administrative Console
              </Badge>
              <Badge variant="success" className="text-[10px]">
                System Online
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Institutional Intelligence & Operations
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Comprehensive analytics across alumni engagement, student mentorship, donations, and event participation.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1 rounded-xl bg-muted border border-border/60">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "analytics"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview & Analytics
            </button>
            <button
              onClick={() => setActiveTab("mentorship")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "mentorship"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mentorship Intel
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "students"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Student Roster
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* Tab 1: Overview & Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Donations */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold uppercase tracking-wider">Endowment Funds</span>
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                  <CardTitle className="text-3xl font-extrabold mt-1">
                    ${(totalDonations?.totalAmount || 0).toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    From <span className="font-semibold text-foreground">{totalDonations?.donorCount || 0}</span> generous contributors
                  </p>
                </CardContent>
              </Card>

              {/* Active Mentors (3+) */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold uppercase tracking-wider">High-Impact Mentors</span>
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-extrabold mt-1">
                    {mentors3Plus.length}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Alumni mentoring 3 or more concurrent students
                  </p>
                </CardContent>
              </Card>

              {/* Donor-Mentors */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold uppercase tracking-wider">Dual Contributors</span>
                    <HeartHandshake className="w-4 h-4 text-indigo-500" />
                  </div>
                  <CardTitle className="text-3xl font-extrabold mt-1">
                    {donorMentors.length}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Alumni who both donate & actively mentor
                  </p>
                </CardContent>
              </Card>

              {/* Top Donor Highlight */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold uppercase tracking-wider">Top Contributor</span>
                    <Award className="w-4 h-4 text-amber-500" />
                  </div>
                  <CardTitle className="text-xl font-bold truncate mt-1">
                    {topDonor?.donorName || topDonor?.alumniName || "Anonymous Supporter"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                    ${(topDonor?.totalDonated || topDonor?.amount || 0).toLocaleString()} donated
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Grid of Analytical Queries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alumni Before 2015 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      Senior Alumni (Graduated Before 2015)
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {alumniBefore2015.length} alumni
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Experienced alumni with 10+ years in the industry.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {alumniBefore2015.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No senior alumni records found.</p>
                    ) : (
                      alumniBefore2015.map((a, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-muted/20 text-xs">
                          <div>
                            <p className="font-semibold text-foreground">{a.alumniName}</p>
                            <p className="text-muted-foreground">{a.companyName || "Tech Industry"} • {a.designation || "Executive"}</p>
                          </div>
                          <Badge variant="outline" className="font-mono text-[11px]">
                            Class of {a.graduationYear}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Campus Sessions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Most Popular Campus Events & Sessions
                    </CardTitle>
                    <Badge variant="accent" className="text-xs">
                      Trending
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Top sessions by total student & alumni registrations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {popularSessions.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No session data recorded.</p>
                    ) : (
                      popularSessions.map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-muted/20 text-xs">
                          <div>
                            <p className="font-semibold text-foreground">{s.title || s.sessionTitle || "Event"}</p>
                            <p className="text-muted-foreground">{s.date || "Scheduled"} • {s.department || "Campus-wide"}</p>
                          </div>
                          <Badge variant="secondary" className="font-mono">
                            {s.registrationCount || s.count || 0} attendees
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Multi-Session Registrants */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Active Event Champions (Multi-Registrants)
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {multiRegistrants.length} members
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Alumni who have registered for multiple institutional workshops.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {multiRegistrants.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No multi-event attendees found.</p>
                    ) : (
                      multiRegistrants.map((m, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-muted/20 text-xs">
                          <div>
                            <p className="font-semibold text-foreground">{m.alumniName}</p>
                            <p className="text-muted-foreground">{m.email}</p>
                          </div>
                          <Badge variant="success" className="text-[11px] font-mono">
                            {m.eventCount || m.sessionCount || 2}+ events
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Department Attendance Ranking */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      Department Participation in Sessions
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Academic Ranking
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Departments with highest participation numbers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {deptMostAttendees.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No department data recorded.</p>
                    ) : (
                      deptMostAttendees.map((d, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-muted/20 text-xs">
                          <span className="font-medium text-foreground">{d.department || d._id || "Department"}</span>
                          <Badge variant="secondary" className="font-mono">
                            {d.attendeeCount || d.count || 0} participants
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All Alumni Directory Viewer Shortcut */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Complete Alumni Network Records</CardTitle>
                  <CardDescription className="text-xs">
                    Quickly inspect all registered alumni records without leaving the operations console.
                  </CardDescription>
                </div>
                <Button onClick={fetchAllAlumni} size="sm" variant="outline" className="gap-2 shrink-0">
                  <Eye className="w-4 h-4" /> Load Master Directory
                </Button>
              </CardHeader>

              {showAllAlumni && (
                <CardContent>
                  <div className="overflow-x-auto max-h-80 border rounded-lg border-border/60">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/50 border-b border-border/60 text-muted-foreground uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold">Name</th>
                          <th className="py-2.5 px-4 font-semibold">Email</th>
                          <th className="py-2.5 px-4 font-semibold">Department</th>
                          <th className="py-2.5 px-4 font-semibold">Year</th>
                          <th className="py-2.5 px-4 font-semibold">Company & Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {allAlumni.map((alumnus) => (
                          <tr key={alumnus._id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2 px-4 font-semibold text-foreground">{alumnus.alumniName}</td>
                            <td className="py-2 px-4 text-muted-foreground">{alumnus.email}</td>
                            <td className="py-2 px-4">{alumnus.department}</td>
                            <td className="py-2 px-4 font-mono">{alumnus.graduationYear}</td>
                            <td className="py-2 px-4 text-muted-foreground">{alumnus.companyName || "—"} ({alumnus.designation || "—"})</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        )}

        {/* Tab 2: Mentorship Intelligence */}
        {activeTab === "mentorship" && <AdminMentorshipAnalytics />}

        {/* Tab 3: Student Management */}
        {activeTab === "students" && <AdminStudentManagement />}
      </main>

      <Footer />
    </div>
  );
}
