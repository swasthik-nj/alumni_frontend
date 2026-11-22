import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  GraduationCap,
  Briefcase,
  Mail,
  Lock,
  Building,
  User,
  Phone,
  BookOpen,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import api from "../utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("alumni"); // "alumni" | "student"
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [alumniForm, setAlumniForm] = useState({
    alumniName: "",
    graduationYear: "",
    department: "Computer Science",
    companyName: "",
    designation: "",
    email: "",
    password: "",
    phone: "",
  });

  const [studentForm, setStudentForm] = useState({
    studentName: "",
    email: "",
    registrationNumber: "",
    department: "Computer Science",
    graduationYear: new Date().getFullYear() + 2,
    currentSemester: 1,
    password: "",
    skillsInput: "",
    interestsInput: "",
    careerGoals: "",
    preferredDomainsInput: "",
    bio: "",
  });

  const handleAlumniChange = (e) => {
    setAlumniForm({ ...alumniForm, [e.target.name]: e.target.value });
  };

  const handleStudentChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (role === "alumni") {
        const res = await api.post("/api/v1/auth/register", alumniForm);
        setMessage(res.data.message || "Alumni registered successfully!");
        toast.success("Account created! Redirecting to sign in...");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        const payload = {
          studentName: studentForm.studentName,
          email: studentForm.email,
          registrationNumber: studentForm.registrationNumber,
          department: studentForm.department,
          graduationYear: Number(studentForm.graduationYear),
          currentSemester: Number(studentForm.currentSemester),
          password: studentForm.password,
          skills: studentForm.skillsInput
            ? studentForm.skillsInput.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          areasOfInterest: studentForm.interestsInput
            ? studentForm.interestsInput.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          careerGoals: studentForm.careerGoals,
          preferredDomains: studentForm.preferredDomainsInput
            ? studentForm.preferredDomainsInput.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          bio: studentForm.bio,
        };

        const res = await api.post("/api/v1/students/register", payload);
        setMessage(res.data.message || "Student registered successfully!");
        toast.success("Student registration complete! Please sign in.");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Registration failed. Please review your details.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical & Electronics",
    "Artificial Intelligence & Data Science",
    "Master of Computer Applications",
  ];

  const parsedSkills = studentForm.skillsInput
    ? studentForm.skillsInput.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-background transition-colors">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 shadow-xs">
            <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Join the AlumniSphere Community
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect with verified mentors, accelerate your career, and give back.
          </p>
        </div>

        <Card className="border-border/60 shadow-xl">
          <CardHeader className="pb-4">
            {/* Role switch */}
            <div className="grid grid-cols-2 p-1 rounded-lg bg-muted border border-border/40">
              <button
                type="button"
                onClick={() => {
                  setRole("alumni");
                  setError("");
                  setMessage("");
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                  role === "alumni"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Register as Alumni
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("student");
                  setError("");
                  setMessage("");
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                  role === "student"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Register as Student
              </button>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {role === "alumni" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="alumniName"
                        value={alumniForm.alumniName}
                        onChange={handleAlumniChange}
                        placeholder="John Doe"
                        required
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Official Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={alumniForm.email}
                        onChange={handleAlumniChange}
                        placeholder="john@example.com"
                        required
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Department
                      </label>
                      <select
                        name="department"
                        value={alumniForm.department}
                        onChange={handleAlumniChange}
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      >
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Graduation Year
                      </label>
                      <input
                        type="number"
                        name="graduationYear"
                        value={alumniForm.graduationYear}
                        onChange={handleAlumniChange}
                        placeholder="e.g. 2021"
                        min="1980"
                        max={new Date().getFullYear()}
                        required
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Current Company
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={alumniForm.companyName}
                        onChange={handleAlumniChange}
                        placeholder="Google, Microsoft, etc."
                        required
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Designation / Role
                      </label>
                      <input
                        type="text"
                        name="designation"
                        value={alumniForm.designation}
                        onChange={handleAlumniChange}
                        placeholder="Senior Software Engineer"
                        required
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={alumniForm.phone}
                        onChange={handleAlumniChange}
                        placeholder="+91 9876543210"
                        required
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={alumniForm.password}
                        onChange={handleAlumniChange}
                        placeholder="Create strong password"
                        required
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Student Full Name
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        value={studentForm.studentName}
                        onChange={handleStudentChange}
                        placeholder="Jane Doe"
                        required
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        College Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={studentForm.email}
                        onChange={handleStudentChange}
                        placeholder="student@college.edu"
                        required
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Registration No.
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={studentForm.registrationNumber}
                        onChange={handleStudentChange}
                        placeholder="4NM22MC001"
                        required
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Department
                      </label>
                      <select
                        name="department"
                        value={studentForm.department}
                        onChange={handleStudentChange}
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      >
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Semester
                      </label>
                      <input
                        type="number"
                        name="currentSemester"
                        value={studentForm.currentSemester}
                        onChange={handleStudentChange}
                        min="1"
                        max="8"
                        required
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Technical Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="skillsInput"
                      value={studentForm.skillsInput}
                      onChange={handleStudentChange}
                      placeholder="e.g. React, Node.js, Python, Cloud"
                      className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                    {parsedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {parsedSkills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Target Career Goals
                      </label>
                      <input
                        type="text"
                        name="careerGoals"
                        value={studentForm.careerGoals}
                        onChange={handleStudentChange}
                        placeholder="e.g. Full Stack Developer at Tier 1 Tech"
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={studentForm.password}
                        onChange={handleStudentChange}
                        placeholder="Create strong password"
                        required
                        className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-4 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Complete Registration as {role === "student" ? "Student" : "Alumni"}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col border-t border-border/40 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline transition-colors"
              >
                Sign into your account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
