import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";
import {
  GraduationCap,
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [role, setRole] = useState("alumni"); // "alumni" | "student"
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  // Form states
  const [form, setForm] = useState({
    email: "",
    identifier: "", // email or registrationNumber for students
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let response;
      if (role === "student") {
        response = await api.post("/api/v1/students/login", {
          identifier: form.identifier || form.email,
          password: form.password,
        });
      } else {
        response = await api.post("/api/v1/auth/login", {
          email: form.email,
          password: form.password,
        });
      }

      const { data } = response;
      const token = data?.data?.token || data?.token;
      const userData =
        data?.data?.student ||
        data?.data?.alumni ||
        data?.student ||
        data?.alumni ||
        data?.user;

      if (token) {
        const enrichedUser = {
          ...userData,
          role: role,
        };
        login(token, enrichedUser);
        toast.success(data?.message || "Welcome back! Logged in successfully.");
        if (role === "student") {
          navigate("/student/mentorship-dashboard");
        } else {
          navigate("/personal");
        }
      } else {
        throw new Error("No authorization token received");
      }
    } catch (err) {
      console.error(err);
      const errMsg =
        err.response?.data?.message || "Invalid credentials. Please verify your email/password.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-background transition-colors">
      <div className="w-full max-w-md">
        {/* Header Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 shadow-xs">
            {role === "student" ? (
              <GraduationCap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Briefcase className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to AlumniSphere
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Access your mentorship pipeline, events, and network.
          </p>
        </div>

        {/* Card */}
        <Card className="border-border/60 shadow-lg">
          <CardHeader className="pb-4">
            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-lg bg-muted border border-border/40">
              <button
                type="button"
                onClick={() => {
                  setRole("alumni");
                  setError(null);
                }}
                className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${
                  role === "alumni"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Alumni Portal
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("student");
                  setError(null);
                }}
                className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${
                  role === "student"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Student Portal
              </button>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {role === "student" ? (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Email or Registration Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="identifier"
                      value={form.identifier}
                      onChange={handleChange}
                      placeholder="e.g. 4NM22MC001 or student@nmamit.in"
                      required
                      className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Alumni Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="alumni@company.com"
                      required
                      className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Password
                  </label>
                  <Link
                    to="/contact"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-ring h-3.5 w-3.5"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In as {role === "student" ? "Student" : "Alumni"}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col border-t border-border/40 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary hover:underline transition-colors"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
