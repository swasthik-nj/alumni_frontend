import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Target,
  User,
  Mail,
  Building,
  Award,
  Save,
  Plus,
  X,
  Compass,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import api from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";
import Nav from "./Nav";
import Footer from "./Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function StudentProfile() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Student profile state
  const [profile, setProfile] = useState({
    studentName: "",
    email: "",
    registrationNumber: "",
    department: "",
    graduationYear: "",
    currentSemester: 1,
    skills: [],
    areasOfInterest: [],
    careerGoals: "",
    preferredDomains: [],
    bio: "",
    isProfileCompleted: false,
  });

  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  const suggestedDomains = [
    "MERN Stack",
    "Java",
    "Python",
    "AI/ML",
    "Data Science",
    "Cloud Computing & AWS",
    "Cybersecurity",
    "Mobile App Development",
    "DevOps & Docker",
    "System Design",
    "Competitive Programming",
  ];

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/students/me");
      const data = res?.data?.data?.student || res?.data?.student;
      if (data) {
        setProfile({
          studentName: data.studentName || "",
          email: data.email || "",
          registrationNumber: data.registrationNumber || "",
          department: data.department || "",
          graduationYear: data.graduationYear || "",
          currentSemester: data.currentSemester || 1,
          skills: data.skills || [],
          areasOfInterest: data.areasOfInterest || [],
          careerGoals: data.careerGoals || "",
          preferredDomains: data.preferredDomains || [],
          bio: data.bio || "",
          isProfileCompleted: Boolean(data.isProfileCompleted),
        });
      }
    } catch (err) {
      console.error("Failed to load student profile:", err);
      if (user?.role === "alumni") {
        toast.error("You are logged in as an Alumni. Redirecting to Alumni Profile.");
        navigate("/personal");
      } else {
        toast.error("Please log in as a student to view your profile.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddSkill = (e) => {
    if ((e.key === "Enter" || e.type === "click") && skillInput.trim()) {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (!profile.skills.includes(trimmed)) {
        setProfile((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddInterest = (e) => {
    if ((e.key === "Enter" || e.type === "click") && interestInput.trim()) {
      e.preventDefault();
      const trimmed = interestInput.trim();
      if (!profile.areasOfInterest.includes(trimmed)) {
        setProfile((prev) => ({
          ...prev,
          areasOfInterest: [...prev.areasOfInterest, trimmed],
        }));
      }
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setProfile((prev) => ({
      ...prev,
      areasOfInterest: prev.areasOfInterest.filter((i) => i !== interestToRemove),
    }));
  };

  const handleToggleDomain = (domain) => {
    setProfile((prev) => {
      const exists = prev.preferredDomains.includes(domain);
      return {
        ...prev,
        preferredDomains: exists
          ? prev.preferredDomains.filter((d) => d !== domain)
          : [...prev.preferredDomains, domain],
      };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put("/api/v1/students/profile", {
        skills: profile.skills,
        areasOfInterest: profile.areasOfInterest,
        careerGoals: profile.careerGoals,
        preferredDomains: profile.preferredDomains,
        bio: profile.bio,
        currentSemester: Number(profile.currentSemester),
        graduationYear: Number(profile.graduationYear),
      });

      const updated = res?.data?.data?.student;
      if (updated) {
        setProfile((prev) => ({ ...prev, ...updated }));
        const token = localStorage.getItem("token");
        if (token) login(token, updated);
      }
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
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

  // Calculate completeness percentage
  const fields = [
    Boolean(profile.studentName),
    Boolean(profile.email),
    Boolean(profile.registrationNumber),
    Boolean(profile.department),
    Boolean(profile.careerGoals),
    Boolean(profile.bio),
    profile.skills.length > 0,
    profile.preferredDomains.length > 0,
  ];
  const completeness = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Nav />

      <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 w-full">
        {/* Header */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="accent" className="text-xs">
                Student Profile
              </Badge>
              <Badge variant={completeness >= 80 ? "success" : "warning"} className="text-xs">
                {completeness}% Completed
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {profile.studentName || "Student Profile"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {profile.registrationNumber} • {profile.department} (Semester {profile.currentSemester})
            </p>
          </div>

          <Button asChild size="sm" variant="outline">
            <Link to="/student/mentorship-dashboard">
              Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Profile Completion Bar */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-foreground">Matchmaking Profile Completeness</span>
              <span className="font-mono text-primary font-semibold">{completeness}%</span>
            </div>
            <Progress value={completeness} className="h-2" />
            <p className="text-[11px] text-muted-foreground">
              A completed profile earns you +50 XP and unlocks high-confidence AI mentor matching recommendations.
            </p>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Skills, Interests & Career Aspirations</CardTitle>
            <CardDescription className="text-xs">
              Keep your technical domains and career goals up-to-date for optimal mentor discovery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Row 1: Read-only info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Full Name (Registered)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profile.studentName}
                    className="w-full rounded-lg border border-border bg-muted/50 py-2 px-3 text-xs text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    College Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full rounded-lg border border-border bg-muted/50 py-2 px-3 text-xs text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profile.registrationNumber}
                    className="w-full rounded-lg border border-border bg-muted/50 py-2 px-3 text-xs font-mono text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Row 2: Semester & Graduation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Current Semester
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={profile.currentSemester}
                    onChange={(e) => setProfile({ ...profile, currentSemester: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Anticipated Graduation Year
                  </label>
                  <input
                    type="number"
                    value={profile.graduationYear}
                    onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Target Career Goals */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Target Career Goals & Ambitions
                </label>
                <input
                  type="text"
                  value={profile.careerGoals}
                  onChange={(e) => setProfile({ ...profile, careerGoals: e.target.value })}
                  placeholder="e.g. SDE at Top Tech, ML Researcher, Cloud Solutions Architect"
                  className="w-full rounded-lg border border-border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Preferred Domains Multi-select */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-2">
                  Preferred Mentorship Domains
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestedDomains.map((dom) => {
                    const selected = profile.preferredDomains.includes(dom);
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

              {/* Technical Skills */}
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
                    placeholder="e.g. React, Node.js, Python, PostgreSQL"
                    className="flex-1 rounded-lg border border-border bg-background py-2 px-3 text-xs"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={handleAddSkill}>
                    Add Skill
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
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
                  Student Bio & What You Seek from Mentors
                </label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Share your academic journey, personal projects, and areas where guidance would help most..."
                  className="w-full rounded-lg border border-border bg-background p-3 text-xs text-foreground focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={saving} className="gap-2 bg-primary text-primary-foreground">
                  <Save className="w-4 h-4" />
                  {saving ? "Saving Changes..." : "Save Student Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
