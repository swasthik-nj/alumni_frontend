import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  Users,
  Target,
  Clock,
  Save,
  Plus,
  X,
  CheckCircle,
  Building,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Award,
  MessageSquare,
  Check,
  XCircle,
  ArrowUpRight,
  ShieldCheck,
  Mail,
  Calendar,
  Layers,
  Flame,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../utils/api";
import Nav from "./Nav";
import Footer from "./Footer";
import MentorshipChat from "./MentorshipChat";
import MentorshipSessionModal from "./MentorshipSessionModal";
import SharedResourcesModal from "./SharedResourcesModal";
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

export default function Personal() {
  const { user, login, loading } = useContext(AuthContext);

  const [savingMentorship, setSavingMentorship] = useState(false);
  const [activeChatRequestId, setActiveChatRequestId] = useState(null);
  const [activeSessionReq, setActiveSessionReq] = useState(null);
  const [activeResourceReq, setActiveResourceReq] = useState(null);
  const [mentorship, setMentorship] = useState({
    isAvailableForMentoring: false,
    maxMentees: 3,
    yearsOfExperience: 0,
    skills: [],
    areasOfExpertise: [],
    mentorshipDomains: [],
    careerGuidanceCategories: [],
    bio: "",
    companyName: "",
    designation: "",
  });

  // Mentorship Dashboard state
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalAssignedStudents: 0,
      activeRelationshipsCount: 0,
      pendingRequestsCount: 0,
      completedRelationshipsCount: 0,
      maxCapacity: 3,
      availableCapacity: 3,
      isAvailableForMentoring: false,
    },
    activeStudents: [],
    pendingRequests: [],
    completedStudents: [],
  });
  const [activeTab, setActiveTab] = useState("active"); // 'active' | 'pending' | 'completed'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Chip input state
  const [skillInput, setSkillInput] = useState("");
  const [expertiseInput, setExpertiseInput] = useState("");

  const suggestedDomains = [
    "MERN Stack",
    "Java",
    "Python",
    "AI/ML",
    "Data Science",
    "Cloud Computing & AWS",
    "Cybersecurity",
    "Mobile App Development",
    "DevOps & CI/CD",
    "System Design",
    "Full Stack Development",
  ];

  const guidanceCategoriesList = [
    "Resume & Portfolio Review",
    "Mock Technical Interviews",
    "Career Transition Guidance",
    "Higher Studies & Research",
    "System Design & Architecture",
    "Open Source & Hackathons",
  ];

  useEffect(() => {
    if (user) {
      setMentorship({
        isAvailableForMentoring: Boolean(user.isAvailableForMentoring),
        maxMentees: user.maxMentees || 3,
        yearsOfExperience: user.yearsOfExperience || 0,
        skills: Array.isArray(user.skills) ? user.skills : [],
        areasOfExpertise: Array.isArray(user.areasOfExpertise) ? user.areasOfExpertise : [],
        mentorshipDomains: Array.isArray(user.mentorshipDomains) ? user.mentorshipDomains : [],
        careerGuidanceCategories: Array.isArray(user.careerGuidanceCategories) ? user.careerGuidanceCategories : [],
        bio: user.bio || "",
        companyName: user.companyName || "",
        designation: user.designation || "",
      });
      fetchDashboard();
    }
  }, [user]);

  const fetchDashboard = async () => {
    try {
      setDashboardLoading(true);
      const res = await api.get("/api/v1/mentorship-requests/alumni/dashboard");
      if (res?.data?.data) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load mentorship dashboard:", err);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      await api.put(`/api/v1/mentorship-requests/${requestId}/accept`);
      toast.success("Mentorship request accepted! Student added to your mentees roster.");
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept request");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    const reason = prompt("Optional: Reason for declining this request (e.g. at capacity, domain mismatch):");
    if (reason === null) return;
    try {
      setActionLoadingId(requestId);
      await api.put(`/api/v1/mentorship-requests/${requestId}/reject`, { responseNote: reason });
      toast.success("Request declined.");
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to decline request");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCompleteMentorship = async (requestId) => {
    if (!window.confirm("Are you sure you want to mark this mentorship as completed? This will archive the mentorship and free up a mentee slot.")) {
      return;
    }
    try {
      setActionLoadingId(requestId);
      await api.put(`/api/v1/mentorship-requests/${requestId}/complete`);
      toast.success("Mentorship completed! Capacity has been updated.");
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete mentorship");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openStudentModal = (student, requestInfo = null) => {
    setSelectedStudent({ ...student, requestInfo });
    setShowStudentModal(true);
  };

  const handleAddSkill = (e) => {
    if ((e.key === "Enter" || e.type === "click") && skillInput.trim()) {
      e.preventDefault();
      const val = skillInput.trim();
      if (!mentorship.skills.includes(val)) {
        setMentorship((prev) => ({ ...prev, skills: [...prev.skills, val] }));
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (item) => {
    setMentorship((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== item),
    }));
  };

  const handleAddExpertise = (e) => {
    if ((e.key === "Enter" || e.type === "click") && expertiseInput.trim()) {
      e.preventDefault();
      const val = expertiseInput.trim();
      if (!mentorship.areasOfExpertise.includes(val)) {
        setMentorship((prev) => ({ ...prev, areasOfExpertise: [...prev.areasOfExpertise, val] }));
      }
      setExpertiseInput("");
    }
  };

  const handleRemoveExpertise = (item) => {
    setMentorship((prev) => ({
      ...prev,
      areasOfExpertise: prev.areasOfExpertise.filter((e) => e !== item),
    }));
  };

  const handleToggleDomain = (domain) => {
    setMentorship((prev) => {
      const exists = prev.mentorshipDomains.includes(domain);
      return {
        ...prev,
        mentorshipDomains: exists
          ? prev.mentorshipDomains.filter((d) => d !== domain)
          : [...prev.mentorshipDomains, domain],
      };
    });
  };

  const handleToggleCategory = (cat) => {
    setMentorship((prev) => {
      const exists = prev.careerGuidanceCategories.includes(cat);
      return {
        ...prev,
        careerGuidanceCategories: exists
          ? prev.careerGuidanceCategories.filter((c) => c !== cat)
          : [...prev.careerGuidanceCategories, cat],
      };
    });
  };

  const handleSaveMentorship = async (e) => {
    e.preventDefault();
    try {
      setSavingMentorship(true);
      const res = await api.put("/api/v1/auth/mentorship-profile", mentorship);
      const updatedAlumni = res?.data?.data?.alumni;
      if (updatedAlumni) {
        const token = localStorage.getItem("token");
        login(token, updatedAlumni);
      }
      toast.success("Mentorship profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update mentorship settings");
    } finally {
      setSavingMentorship(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div>
      </div>
    );
  }

  const { metrics, activeStudents, pendingRequests, completedStudents } = dashboardData;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Nav />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {user && (
          <>
            {/* Top Overview Card */}
            <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="accent" className="text-xs">
                      Alumni Mentor
                    </Badge>
                    <Badge
                      variant={mentorship.isAvailableForMentoring ? "success" : "secondary"}
                      className="text-xs"
                    >
                      {mentorship.isAvailableForMentoring ? "Accepting Students" : "Mentoring Paused"}
                    </Badge>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    Welcome back, {user.alumniName || "Alumni"}! 🎓
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {user.companyName ? `${user.designation || "Professional"} at ${user.companyName}` : "Alumni Network Member"} • Class of {user.graduationYear || "Grad"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMentorship((prev) => ({
                        ...prev,
                        isAvailableForMentoring: !prev.isAvailableForMentoring,
                      }));
                    }}
                  >
                    {mentorship.isAvailableForMentoring ? "Pause Mentoring" : "Enable Mentoring"}
                  </Button>
                </div>
              </div>

              {/* Mentorship Capacity Indicator */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Mentoring Capacity Saturation</span>
                    <span className="font-mono text-foreground">
                      {metrics.activeRelationshipsCount} of {metrics.maxCapacity} slots taken
                    </span>
                  </div>
                  <Progress
                    value={Math.round((metrics.activeRelationshipsCount / Math.max(metrics.maxCapacity, 1)) * 100)}
                    className="h-2"
                  />
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-muted-foreground pt-1">
                  <span>Available capacity: <strong className="text-foreground">{metrics.availableCapacity} slots</strong></span>
                </div>
              </div>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Mentees</span>
                    <Users className="w-4 h-4 text-emerald-500" />
                  </div>
                  <CardTitle className="text-3xl font-extrabold mt-1">
                    {metrics.activeRelationshipsCount}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Students under 1-on-1 guidance</p>
                </CardContent>
              </Card>

              <Card>
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
                  <p className="text-xs text-muted-foreground">Applications awaiting your response</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold uppercase tracking-wider">Open Capacity</span>
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-extrabold mt-1">
                    {metrics.availableCapacity}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Available slots for new students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
                    <Award className="w-4 h-4 text-indigo-500" />
                  </div>
                  <CardTitle className="text-3xl font-extrabold mt-1">
                    {metrics.completedRelationshipsCount}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Successfully mentored graduates</p>
                </CardContent>
              </Card>
            </div>

            {/* Mentorship Pipeline Roster */}
            <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-semibold">Mentorship Relationship Pipeline</CardTitle>
                    <CardDescription className="text-xs">
                      Review active students, handle incoming requests, and manage guidance sessions.
                    </CardDescription>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center p-1 rounded-lg bg-muted border border-border/60">
                    <button
                      onClick={() => setActiveTab("active")}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeTab === "active" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                      }`}
                    >
                      Active ({activeStudents.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("pending")}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeTab === "pending" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                      }`}
                    >
                      Pending ({pendingRequests.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("completed")}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeTab === "completed" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                      }`}
                    >
                      Completed ({completedStudents.length})
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                {/* Active Tab */}
                {activeTab === "active" && (
                  <div className="space-y-3">
                    {activeStudents.length === 0 ? (
                      <div className="py-10 text-center text-muted-foreground text-xs">
                        No active mentees right now. Check pending requests to accept new students.
                      </div>
                    ) : (
                      activeStudents.map((rel) => {
                        const student = rel.student || {};
                        return (
                          <div
                            key={rel._id}
                            className="p-4 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/30 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground text-sm">{student.studentName}</h4>
                                <Badge variant="outline" className="font-mono text-[10px]">
                                  {student.registrationNumber}
                                </Badge>
                                <Badge variant="success" className="text-[10px]">
                                  Active Mentee
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {student.department} • Semester {student.currentSemester || 1} • Goal: {student.careerGoals || "Software Engineer"}
                              </p>
                              {Array.isArray(student.skills) && student.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {student.skills.slice(0, 4).map((s, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-[10px] py-0 px-1.5">
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setActiveChatRequestId(rel._id)}
                                className="h-8 gap-1.5 text-xs"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-primary" /> Chat
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setActiveSessionReq(rel)}
                                className="h-8 gap-1.5 text-xs"
                              >
                                <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Schedule
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setActiveResourceReq(rel)}
                                className="h-8 gap-1.5 text-xs"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Share Resources
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCompleteMentorship(rel._id)}
                                disabled={actionLoadingId === rel._id}
                                className="h-8 text-xs text-muted-foreground hover:text-foreground"
                              >
                                Complete
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Pending Tab */}
                {activeTab === "pending" && (
                  <div className="space-y-3">
                    {pendingRequests.length === 0 ? (
                      <div className="py-10 text-center text-muted-foreground text-xs">
                        No pending mentorship requests.
                      </div>
                    ) : (
                      pendingRequests.map((req) => {
                        const student = req.student || {};
                        return (
                          <div
                            key={req._id}
                            className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground text-sm">{student.studentName}</h4>
                                <Badge variant="warning" className="text-[10px]">
                                  Pending Application
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {student.department} • Reg: {student.registrationNumber}
                              </p>
                              {req.message && (
                                <p className="text-xs text-foreground bg-background/80 p-2 rounded-md border border-border/40 mt-1 italic">
                                  "{req.message}"
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openStudentModal(student, req)}
                                className="h-8 text-xs"
                              >
                                View Profile
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleAcceptRequest(req._id)}
                                disabled={actionLoadingId === req._id}
                                className="h-8 text-xs bg-primary text-primary-foreground"
                              >
                                Accept Mentee
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectRequest(req._id)}
                                disabled={actionLoadingId === req._id}
                                className="h-8 text-xs text-destructive hover:bg-destructive/10"
                              >
                                Decline
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Completed Tab */}
                {activeTab === "completed" && (
                  <div className="space-y-3">
                    {completedStudents.length === 0 ? (
                      <div className="py-10 text-center text-muted-foreground text-xs">
                        No completed mentorships yet.
                      </div>
                    ) : (
                      completedStudents.map((rel) => {
                        const student = rel.student || {};
                        return (
                          <div
                            key={rel._id}
                            className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-semibold text-foreground">{student.studentName}</p>
                              <p className="text-muted-foreground">{student.department} • Completed</p>
                            </div>
                            <Badge variant="outline" className="gap-1">
                              <Award className="w-3.5 h-3.5 text-indigo-500" /> Mentorship Completed
                            </Badge>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mentorship Settings & Profile Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mentorship Settings & Expertise</CardTitle>
                <CardDescription className="text-xs">
                  Configure your availability, capacity limit, technical domains, and mentoring categories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveMentorship} className="space-y-6">
                  {/* Row 1: Experience & Capacity */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={mentorship.yearsOfExperience}
                        onChange={(e) =>
                          setMentorship({ ...mentorship, yearsOfExperience: Number(e.target.value) })
                        }
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Max Student Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={mentorship.maxMentees}
                        onChange={(e) =>
                          setMentorship({ ...mentorship, maxMentees: Number(e.target.value) })
                        }
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Availability Status
                      </label>
                      <select
                        value={mentorship.isAvailableForMentoring ? "yes" : "no"}
                        onChange={(e) =>
                          setMentorship({
                            ...mentorship,
                            isAvailableForMentoring: e.target.value === "yes",
                          })
                        }
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-xs"
                      >
                        <option value="yes">Available to accept students</option>
                        <option value="no">Temporarily paused</option>
                      </select>
                    </div>
                  </div>

                  {/* Mentorship Domains Multi-select */}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-2">
                      Specialized Mentorship Domains
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {suggestedDomains.map((dom) => {
                        const selected = mentorship.mentorshipDomains.includes(dom);
                        return (
                          <button
                            key={dom}
                            type="button"
                            onClick={() => handleToggleDomain(dom)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              selected
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                            }`}
                          >
                            {dom} {selected && "✓"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Skills Tag Input */}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Technical Skills (Press Enter to add)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleAddSkill}
                        placeholder="e.g. React, Next.js, Docker, Kubernetes"
                        className="flex-1 rounded-lg border border-border bg-background py-2 px-3 text-xs"
                      />
                      <Button type="button" size="sm" variant="outline" onClick={handleAddSkill}>
                        Add Skill
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {mentorship.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="gap-1 text-xs">
                          {s}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(s)}
                            className="hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Mentoring Philosophy & Bio
                    </label>
                    <textarea
                      rows={3}
                      value={mentorship.bio}
                      onChange={(e) => setMentorship({ ...mentorship, bio: e.target.value })}
                      placeholder="Share your background, industry journey, and what guidance you offer students..."
                      className="w-full rounded-lg border border-border bg-background p-3 text-xs"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={savingMentorship} className="gap-2 bg-primary text-primary-foreground">
                      <Save className="w-4 h-4" />
                      {savingMentorship ? "Saving Changes..." : "Save Mentorship Settings"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </>
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
          onSessionCreated={() => fetchDashboard()}
        />
      )}

      {activeResourceReq && (
        <SharedResourcesModal
          request={activeResourceReq}
          onClose={() => setActiveResourceReq(null)}
        />
      )}

      {/* Student Profile Dialog */}
      <Dialog open={showStudentModal} onOpenChange={setShowStudentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Student Applicant Profile</DialogTitle>
            <DialogDescription>
              Review student qualifications and career aspirations.
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-3 text-xs pt-2">
              <div>
                <span className="font-semibold text-foreground text-sm">{selectedStudent.studentName}</span>
                <p className="text-muted-foreground">{selectedStudent.email} • {selectedStudent.registrationNumber}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40">
                <p><strong>Department:</strong> {selectedStudent.department}</p>
                <p><strong>Semester:</strong> {selectedStudent.currentSemester} • Class of {selectedStudent.graduationYear}</p>
                <p><strong>Career Goals:</strong> {selectedStudent.careerGoals || "Software Engineering"}</p>
              </div>
              {Array.isArray(selectedStudent.skills) && (
                <div>
                  <span className="font-semibold text-foreground">Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedStudent.skills.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button size="sm" onClick={() => setShowStudentModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
