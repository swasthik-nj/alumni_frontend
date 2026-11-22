import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import Nav from "./Nav";
import Footer from "./Footer";
import api from "../utils/api";
import { AuthContext } from "@/contexts/AuthContext";
import {
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Grid,
  Filter,
  Briefcase,
  MessageCircle,
  Palette,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const typeLabels = {
  career: "Career Talk",
  networking: "Networking Mixer",
  cultural: "Cultural Celebration",
  other: "Campus Special",
};

export default function Event() {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const url = filter ? `/api/v1/events/sessions?type=${filter}` : "/api/v1/events/sessions";
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
      const res = await api.get("/api/v1/events/registrations/me");
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

  const isRegistered = (sessionId) => myRegs.some((r) => r.session?._id === sessionId);

  const handleRegister = async (sessionId) => {
    if (!user) {
      toast.error("Please login to register for events");
      return;
    }
    if (isRegistered(sessionId)) return;
    try {
      setRegLoading(sessionId);
      const res = await api.post("/api/v1/events/sessions/register", { sessionId });
      if (res.data.success) {
        setMyRegs((prev) => [...prev, res.data.data.registration]);
        toast.success("Successfully registered for the session!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  const getSessionIcon = (type) => {
    switch (type) {
      case "career":
        return <Briefcase className="w-4 h-4 text-primary" />;
      case "networking":
        return <MessageCircle className="w-4 h-4 text-emerald-500" />;
      case "cultural":
        return <Palette className="w-4 h-4 text-purple-500" />;
      default:
        return <Calendar className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Nav />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 w-full">
        {/* Header */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Calendar className="w-3.5 h-3.5" /> Campus Activities & Meetups
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Campus Events & Masterclasses
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Join upcoming workshops, alumni reunions, technical conferences, and networking mixers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{myRegs.length}</span> registered events on your calendar
          </div>
        </div>

        {/* Filter Pills */}
        <Card>
          <CardContent className="p-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by Type:
            </span>
            {["", "career", "networking", "cultural", "other"].map((t) => (
              <button
                key={t || "all"}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === t
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {t === "" ? "All Events" : typeLabels[t]}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Event Cards Grid */}
        <div>
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div>
              <p className="text-muted-foreground text-xs mt-3">Loading campus events...</p>
            </div>
          ) : sessions.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground text-base">No Sessions Scheduled</h3>
              <p className="text-xs text-muted-foreground mt-1">
                There are currently no events matching the selected filter.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((s) => {
                const registered = isRegistered(s._id);
                return (
                  <Card
                    key={s._id}
                    className="flex flex-col justify-between hover:border-border transition-all duration-200 hover:shadow-md"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-muted">
                            {getSessionIcon(s.sessionType)}
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            {typeLabels[s.sessionType] || "General Event"}
                          </Badge>
                        </div>
                        {registered && (
                          <Badge variant="success" className="text-[10px] gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Registered
                          </Badge>
                        )}
                      </div>

                      <CardTitle className="text-base font-semibold line-clamp-1">
                        {s.title}
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-2 mt-1">
                        {s.description || "Join fellow alumni and students for an interactive session."}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-2 pt-0 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>
                          {s.date ? new Date(s.date).toLocaleDateString([], { dateStyle: "long" }) : "Scheduled Date"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{s.time || "10:00 AM - 12:30 PM"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{s.location || "Auditorium / Hybrid Online"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{s.registeredCount || s.attendeeCount || 0} registered</span>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-3 border-t border-border/40">
                      <Button
                        size="sm"
                        disabled={registered || regLoading === s._id}
                        onClick={() => handleRegister(s._id)}
                        className={`w-full text-xs font-semibold ${
                          registered
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {registered ? (
                          "You're Registered"
                        ) : regLoading === s._id ? (
                          "Registering..."
                        ) : (
                          "Register for Event"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
