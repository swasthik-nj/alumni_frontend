import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Sparkles,
  Search,
  Filter,
  Briefcase,
  Building2,
  GraduationCap,
  Award,
  CheckCircle2,
  UserCheck,
  ChevronRight,
  Info,
  Clock,
  Layers,
  Flame,
  ArrowRight,
  ExternalLink,
  X,
  Target,
  Send,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import api from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";
import Nav from "./Nav";
import Footer from "./Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function MentorshipExplore() {
  const { user, isStudent } = useContext(AuthContext);
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("score"); // 'score' | 'experience' | 'slots'
  const [studentPrefs, setStudentPrefs] = useState({ domains: [], skills: [], interests: [] });

  // Match details modal
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Send request modal state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [targetMentor, setTargetMentor] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestDomain, setRequestDomain] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [myRequestsMap, setMyRequestsMap] = useState({});

  const domainFilters = [
    "All",
    "MERN Stack",
    "AI/ML",
    "Java",
    "Python",
    "Cloud Computing & AWS",
    "DevOps & CI/CD",
    "System Design",
    "Data Science",
    "Mobile App Development",
  ];

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedDomain && selectedDomain !== "All") params.append("domain", selectedDomain);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const [recRes, myReqRes] = await Promise.all([
        api.get(`/api/v1/students/recommendations?${params.toString()}`),
        api.get("/api/v1/mentorship-requests/student/my-requests").catch(() => ({ data: { data: { requests: [] } } })),
      ]);

      const data = recRes?.data?.data;
      if (data) {
        setRecommendations(data.recommendations || []);
        if (data.studentPreferences) {
          setStudentPrefs(data.studentPreferences);
        }
      }

      const userReqs = myReqRes?.data?.data?.requests || [];
      const reqMap = {};
      userReqs.forEach((r) => {
        const aId = r.alumni?._id || r.alumni;
        if (aId) reqMap[String(aId)] = r.status;
      });
      setMyRequestsMap(reqMap);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Please sign in as a student to access smart mentor matching.");
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to fetch mentor recommendations.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [selectedDomain, searchQuery]);

  const handleOpenRequestModal = (mentorItem) => {
    setTargetMentor(mentorItem);
    setRequestDomain(mentorItem.alumni.mentorshipDomains?.[0] || "General Guidance");
    setRequestMessage(
      `Hello ${mentorItem.alumni.alumniName}, I would love your guidance on ${mentorItem.alumni.mentorshipDomains?.[0] || "career development"} and preparing for technical roles in the industry.`
    );
    setShowRequestModal(true);
  };

  const handleSendRequestSubmit = async (e) => {
    e.preventDefault();
    if (!targetMentor) return;

    try {
      setSubmittingRequest(true);
      const res = await api.post("/api/v1/mentorship-requests", {
        alumniId: targetMentor.alumni._id,
        targetDomain: requestDomain,
        message: requestMessage,
      });

      toast.success(res?.data?.message || "Mentorship request sent successfully!");
      setShowRequestModal(false);
      setTargetMentor(null);
      setRequestMessage("");

      // Update local state map
      setMyRequestsMap((prev) => ({
        ...prev,
        [String(targetMentor.alumni._id)]: "PENDING",
      }));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  const openDetailModal = (mentorItem) => {
    setSelectedMentor(mentorItem);
    setShowDetailModal(true);
  };

  // Sort recommendations
  const sortedMentors = [...recommendations].sort((a, b) => {
    if (sortBy === "experience") {
      return (b.alumni.yearsOfExperience || 0) - (a.alumni.yearsOfExperience || 0);
    }
    if (sortBy === "slots") {
      return (b.alumni.availableCapacity || 0) - (a.alumni.availableCapacity || 0);
    }
    return (b.matchingScore || 0) - (a.matchingScore || 0);
  });

  const getInitials = (name) => {
    if (!name) return "AL";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Nav />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 w-full">
        {/* Header */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> AI Matchmaking Discovery Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Discover Verified Alumni Mentors
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Paired with senior industry professionals based on your technical interests, skills, and department.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild size="sm" variant="outline">
              <Link to="/mentorship/requests">My Requests Pipeline</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary text-primary-foreground">
              <Link to="/student/profile">Update Skills & Goals</Link>
            </Button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search alumni by name, company, designation, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-border bg-background py-2 px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="score">Highest Match Score</option>
                  <option value="experience">Years of Experience</option>
                  <option value="slots">Available Mentoring Slots</option>
                </select>
              </div>
            </div>

            {/* Domain Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
              {domainFilters.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedDomain === domain
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mentors Grid */}
        <div>
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div>
              <p className="text-muted-foreground text-xs mt-3 animate-pulse">
                Analyzing alumni profiles and calculating match compatibility scores...
              </p>
            </div>
          ) : sortedMentors.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground text-base">No Matching Mentors Found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Try selecting a different domain category or clearing your search term to see all available alumni.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedDomain("All");
                  setSearchQuery("");
                }}
                className="mt-4"
              >
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedMentors.map((item) => {
                const alumni = item.alumni;
                const score = item.matchingScore || 80;
                const reqStatus = myRequestsMap[String(alumni._id)];
                const isAtCapacity = (alumni.availableCapacity || 0) <= 0;

                return (
                  <Card
                    key={alumni._id}
                    className="flex flex-col justify-between hover:border-border transition-all duration-200 hover:shadow-md"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-11 w-11">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                              {getInitials(alumni.alumniName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                              {alumni.alumniName}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {alumni.designation || "Senior Specialist"}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-medium">
                              {alumni.companyName || "Technology Firm"}
                            </p>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div
                          onClick={() => openDetailModal(item)}
                          className="cursor-pointer group flex flex-col items-end shrink-0"
                          title="Click to view match breakdown"
                        >
                          <Badge
                            variant={score >= 80 ? "accent" : score >= 60 ? "success" : "secondary"}
                            className="text-[11px] font-mono gap-1 group-hover:scale-105 transition-transform"
                          >
                            <Sparkles className="w-3 h-3" />
                            {score}% Match
                          </Badge>
                          <span className="text-[10px] text-muted-foreground underline mt-0.5">
                            why match?
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0">
                      {/* Experience and slots */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                        <span>
                          {alumni.yearsOfExperience ? `${alumni.yearsOfExperience} yrs exp` : "Alumni Mentor"} • Class of {alumni.graduationYear || "Grad"}
                        </span>
                        <span className={isAtCapacity ? "text-amber-500 font-medium" : "text-emerald-600 dark:text-emerald-400 font-medium"}>
                          {isAtCapacity ? "At Full Capacity" : `${alumni.availableCapacity || 1} slots open`}
                        </span>
                      </div>

                      {/* Mentorship Domains */}
                      {Array.isArray(alumni.mentorshipDomains) && alumni.mentorshipDomains.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {alumni.mentorshipDomains.slice(0, 3).map((dom) => (
                            <Badge key={dom} variant="outline" className="text-[10px] py-0">
                              {dom}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Bio snippet */}
                      {alumni.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
                          "{alumni.bio}"
                        </p>
                      )}
                    </CardContent>

                    <CardFooter className="pt-3 border-t border-border/40">
                      {reqStatus === "ACCEPTED" ? (
                        <Button asChild size="sm" variant="outline" className="w-full text-xs gap-1.5 text-emerald-600">
                          <Link to="/student/mentorship-dashboard">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active Mentor (Go to Chat)
                          </Link>
                        </Button>
                      ) : reqStatus === "PENDING" ? (
                        <Button size="sm" variant="outline" disabled className="w-full text-xs gap-1.5 opacity-70">
                          <Clock className="w-3.5 h-3.5 text-amber-500" /> Application Pending Review
                        </Button>
                      ) : isAtCapacity ? (
                        <Button size="sm" variant="outline" disabled className="w-full text-xs">
                          Temporarily At Capacity
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleOpenRequestModal(item)}
                          className="w-full text-xs gap-1.5 bg-primary text-primary-foreground"
                        >
                          <Send className="w-3.5 h-3.5" /> Request 1:1 Mentorship
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Send Mentorship Request Dialog */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Mentorship Application</DialogTitle>
            <DialogDescription>
              Connect with {targetMentor?.alumni?.alumniName} for structured 1-on-1 career guidance.
            </DialogDescription>
          </DialogHeader>

          {targetMentor && (
            <form onSubmit={handleSendRequestSubmit} className="space-y-4 pt-2">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/40 text-xs space-y-1">
                <p><strong>Mentor:</strong> {targetMentor.alumni.alumniName}</p>
                <p><strong>Role:</strong> {targetMentor.alumni.designation} at {targetMentor.alumni.companyName}</p>
                <p><strong>Compatibility:</strong> <span className="font-mono text-primary font-bold">{targetMentor.matchingScore}%</span></p>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Primary Guidance Domain
                </label>
                <select
                  value={requestDomain}
                  onChange={(e) => setRequestDomain(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-ring"
                >
                  {(targetMentor.alumni.mentorshipDomains || ["General Career Guidance"]).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Personal Note / Introduction
                </label>
                <textarea
                  rows={4}
                  required
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Introduce yourself, your academic background, and what specific advice or feedback you are seeking..."
                  className="w-full rounded-lg border border-border bg-background p-3 text-xs text-foreground focus:ring-2 focus:ring-ring"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowRequestModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submittingRequest} className="bg-primary text-primary-foreground gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  {submittingRequest ? "Sending..." : "Submit Application"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Match Details Dialog */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Matchmaking Explanation
            </DialogTitle>
            <DialogDescription>
              How our matchmaking algorithm scored your compatibility with {selectedMentor?.alumni?.alumniName}.
            </DialogDescription>
          </DialogHeader>

          {selectedMentor && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20">
                <span className="font-semibold text-foreground">Overall Compatibility</span>
                <span className="text-xl font-mono font-extrabold text-primary">
                  {selectedMentor.matchingScore}%
                </span>
              </div>

              {selectedMentor.matchingDetails && (
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Matched Attributes:</p>
                  <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
                    <li>
                      Domain alignment: {selectedMentor.matchingDetails.matchedDomains?.length > 0 ? selectedMentor.matchingDetails.matchedDomains.join(", ") : "General Tech"}
                    </li>
                    {selectedMentor.matchingDetails.matchedSkills?.length > 0 && (
                      <li>
                        Overlapping skills: {selectedMentor.matchingDetails.matchedSkills.join(", ")}
                      </li>
                    )}
                    <li>
                      Department compatibility: {selectedMentor.alumni.department}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button size="sm" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
