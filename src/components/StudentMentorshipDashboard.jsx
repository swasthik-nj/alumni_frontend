import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import gsap from "gsap";
import {
  GraduationCap,
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  Briefcase,
  ChevronRight,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  BookOpen,
  MessageSquare,
  Calendar,
  Layers,
  Flame,
  Info,
  X,
  Star,
  ExternalLink,
  Target,
  Trophy,
} from "lucide-react";
import api from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";
import Nav from "./Nav";
import Footer from "./Footer";
import MentorshipChat from "./MentorshipChat";
import MentorshipSessionModal from "./MentorshipSessionModal";
import SharedResourcesModal from "./SharedResourcesModal";
import MentorshipFeedbackModal from "./MentorshipFeedbackModal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function StudentMentorshipDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeChatRequestId, setActiveChatRequestId] = useState(null);
  const [activeSessionReq, setActiveSessionReq] = useState(null);
  const [activeResourceReq, setActiveResourceReq] = useState(null);
  const [activeFeedbackReq, setActiveFeedbackReq] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [data, setData] = useState({
    metrics: {
      activeMentorsCount: 0,
      pendingRequestsCount: 0,
      completedMentorshipsCount: 0,
      topRecommendationsCount: 0,
    },
    studentProfile: null,
    activeMentors: [],
    pendingRequests: [],
    completedMentorships: [],
    topRecommendations: [],
  });

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const dashRef = useRef(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, sessRes] = await Promise.all([
        api.get("/api/v1/mentorship-requests/student/dashboard"),
        api.get("/api/v1/mentorship-sessions/my-upcoming").catch(() => ({ data: { data: { sessions: [] } } })),
      ]);

      if (dashRes?.data?.data) {
        setData(dashRes.data.data);
      }
      if (sessRes?.data?.data?.sessions) {
        setUpcomingSessions(sessRes.data.data.sessions);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Please log in as a student to access your dashboard.");
        navigate("/login");
      } else {
        toast.error("Failed to load student dashboard.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // GSAP Dashboard Entrance Animation
  useEffect(() => {
    if (!loading && dashRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(".dash-header", { y: -20, opacity: 0, duration: 0.5, ease: "power2.out" });
        gsap.from(".dash-stat-card", {
          y: 25,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.1,
        });
        gsap.from(".dash-section", {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.55,
          ease: "power2.out",
          delay: 0.2,
        });
      }, dashRef);

      return () => ctx.revert();
    }
  }, [loading]);

  const handleCompleteMentorship = async (requestId) => {
    if (
      window.confirm(
        "Are you sure you want to mark this mentorship as completed? This will archive the mentorship and enable feedback rating."
      )
    ) {
      try {
        await api.put(`/api/v1/mentorship-requests/${requestId}/complete`);
        toast.success("Mentorship marked as completed!");
        fetchDashboardData();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to complete mentorship");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div>
        </div>
      </div>
    );
  }

  const { metrics, studentProfile, activeMentors, pendingRequests, completedMentorships, topRecommendations } = data;

  return (
    <div ref={dashRef} className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Nav />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 w-full">
        {/* Welcome Header */}
        <div className="dash-header rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
              <GraduationCap className="w-3.5 h-3.5" /> Student Mentorship Space
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Hello, {studentProfile?.studentName || user?.studentName || "Student"}! 🚀
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-primary font-semibold">
                {studentProfile?.registrationNumber || user?.registrationNumber}
              </span>
              <span>•</span>
              <span>
                {studentProfile?.department || "Computer Science"} (Semester {studentProfile?.currentSemester || 1})
              </span>
              <span>•</span>
              <span>Class of {studentProfile?.graduationYear || 2026}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button asChild size="sm" variant="outline">
              <Link to="/student/profile">Edit Skills & Goals</Link>
            </Button>
            <Button asChild size="sm" className="gap-1.5 bg-primary text-primary-foreground shadow-xs">
              <Link to="/mentorship/explore">
                <Sparkles className="w-4 h-4" /> Find Mentors
              </Link>
            </Button>
          </div>
        </div>

        {/* Gamification Level & XP Snapshot */}
        <Card className="dash-section border-border/60 bg-gradient-to-r from-card via-card to-primary/5">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Trophy className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Rank & Standing
                    </span>
                    <Badge variant="success" className="text-[10px] py-0 h-4">
                      Level 2 Explorer
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">225 Total XP</h3>
                </div>
              </div>

              {/* Progress to Level 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress to Level 3 (Achiever)</span>
                  <span className="font-mono font-medium text-foreground">225 / 500 XP</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>

              {/* Weekly Streak / Challenge Preview */}
              <div className="flex flex-wrap items-center justify-start md:justify-end gap-2.5 text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 border border-border/40">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>3-Day Streak</span>
                </div>
                <Button asChild size="sm" variant="outline" className="h-8 text-xs gap-1">
                  <Link to="/gamification">
                    Badges & Rankings <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="dash-stat-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Mentors</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <CardTitle className="text-3xl font-extrabold mt-1">
                {metrics.activeMentorsCount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Mentors guiding you 1-on-1</p>
            </CardContent>
          </Card>

          <Card className="dash-stat-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Pending Requests</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <CardTitle className="text-3xl font-extrabold mt-1 text-amber-600 dark:text-amber-400">
                {metrics.pendingRequestsCount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Awaiting alumni acceptance</p>
            </CardContent>
          </Card>

          <Card className="dash-stat-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Upcoming Sessions</span>
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-3xl font-extrabold mt-1">
                {upcomingSessions.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Scheduled calendar calls</p>
            </CardContent>
          </Card>

          <Card className="dash-stat-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
              </div>
              <CardTitle className="text-3xl font-extrabold mt-1">
                {metrics.completedMentorshipsCount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Completed guidance cycles</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Sessions Section */}
        {upcomingSessions.length > 0 && (
          <Card className="border-border/60">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Upcoming Mentorship Sessions ({upcomingSessions.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingSessions.map((sess) => (
                  <div
                    key={sess._id}
                    className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{sess.title}</span>
                        <Badge variant="outline" className="text-[10px]">{sess.status}</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        With <strong className="text-foreground">{sess.mentorAlumni?.alumniName}</strong> ({sess.durationMinutes} mins)
                      </p>
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                        📅 {new Date(sess.sessionDate).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>

                    {sess.meetingLinkOrLocation && sess.meetingMode === "ONLINE" && (
                      <a
                        href={sess.meetingLinkOrLocation.startsWith("http") ? sess.meetingLinkOrLocation : `https://${sess.meetingLinkOrLocation}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1 shrink-0"
                      >
                        Join Call <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Mentors Grid */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-base font-semibold">My Active Mentors</CardTitle>
            <CardDescription className="text-xs">
              Alumni currently providing 1-on-1 industry mentorship and career advice.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {activeMentors.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-xs">
                <p>You do not have any active mentors yet.</p>
                <Button asChild size="sm" className="mt-3 bg-primary text-primary-foreground">
                  <Link to="/mentorship/explore">Explore & Connect with Mentors</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeMentors.map((rel) => {
                  const mentor = rel.alumni || {};
                  return (
                    <div
                      key={rel._id}
                      className="p-4 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/30 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">{mentor.alumniName}</h4>
                          <p className="text-xs text-muted-foreground">
                            {mentor.designation || "Engineer"} at {mentor.companyName || "Tech"}
                          </p>
                          <p className="text-[11px] text-muted-foreground">Class of {mentor.graduationYear || "Grad"}</p>
                        </div>
                        <Badge variant="success" className="text-[10px]">
                          Active Mentorship
                        </Badge>
                      </div>

                      {Array.isArray(mentor.skills) && mentor.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {mentor.skills.slice(0, 4).map((s, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[10px] py-0 px-1.5">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveChatRequestId(rel._id)}
                          className="h-8 gap-1.5 text-xs flex-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-primary" /> Chat
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveSessionReq(rel)}
                          className="h-8 gap-1.5 text-xs flex-1"
                        >
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Book Session
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveResourceReq(rel)}
                          className="h-8 gap-1.5 text-xs flex-1"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Resources
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCompleteMentorship(rel._id)}
                          className="h-8 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Complete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Recommended Alumni Mentors */}
        {topRecommendations.length > 0 && (
          <Card>
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI-Recommended Alumni Mentors
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Curated mentors matching your department, technical skills, and career interests.
                  </CardDescription>
                </div>
                <Button asChild size="sm" variant="ghost" className="text-xs text-primary gap-1">
                  <Link to="/mentorship/explore">
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topRecommendations.slice(0, 3).map((rec) => {
                  const alumni = rec.alumni || rec;
                  const matchScore = rec.matchingScore || rec.score || 85;
                  return (
                    <div
                      key={alumni._id}
                      className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground text-sm">{alumni.alumniName}</h4>
                          <Badge variant="accent" className="text-[10px] font-mono">
                            {matchScore}% Match
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {alumni.companyName ? `${alumni.designation} at ${alumni.companyName}` : "Alumni Mentor"}
                        </p>
                      </div>

                      <Button asChild size="sm" className="w-full text-xs bg-primary text-primary-foreground">
                        <Link to="/mentorship/explore">
                          Connect with Mentor <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Modals */}
      {activeChatRequestId && (
        <MentorshipChat
          requestId={activeChatRequestId}
          onClose={() => setActiveChatRequestId(null)}
        />
      )}

      {activeSessionReq && (
        <MentorshipSessionModal
          request={activeSessionReq}
          onClose={() => setActiveSessionReq(null)}
          onSessionCreated={() => fetchDashboardData()}
        />
      )}

      {activeResourceReq && (
        <SharedResourcesModal
          request={activeResourceReq}
          onClose={() => setActiveResourceReq(null)}
        />
      )}

      {activeFeedbackReq && (
        <MentorshipFeedbackModal
          request={activeFeedbackReq}
          onClose={() => setActiveFeedbackReq(null)}
          onFeedbackSubmitted={() => fetchDashboardData()}
        />
      )}

      <Footer />
    </div>
  );
}
