import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
  X,
  ExternalLink,
  AlertCircle,
  Check,
  User,
  GraduationCap,
} from "lucide-react";
import api from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function MentorshipSessionModal({
  requestId,
  request,
  partnerName,
  isOpen = true,
  onClose,
  onSessionCreated,
}) {
  const reqId = requestId || request?._id;
  const partner =
    partnerName ||
    request?.student?.studentName ||
    request?.alumni?.alumniName ||
    request?.mentorAlumni?.alumniName ||
    "Mentorship Partner";

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    sessionDate: "",
    durationMinutes: 45,
    meetingMode: "ONLINE",
    meetingLinkOrLocation: "",
    agendaTopics: [],
  });
  const [topicInput, setTopicInput] = useState("");

  const fetchSessions = async () => {
    if (!reqId) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/mentorship-sessions/request/${reqId}`);
      if (res?.data?.data?.sessions) {
        setSessions(res.data.data.sessions);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && reqId) {
      fetchSessions();
    }
  }, [isOpen, reqId]);

  const handleAddTopic = (e) => {
    if ((e.key === "Enter" || e.type === "click") && topicInput.trim()) {
      e.preventDefault();
      const val = topicInput.trim();
      if (!form.agendaTopics.includes(val)) {
        setForm((prev) => ({ ...prev, agendaTopics: [...prev.agendaTopics, val] }));
      }
      setTopicInput("");
    }
  };

  const handleRemoveTopic = (t) => {
    setForm((prev) => ({
      ...prev,
      agendaTopics: prev.agendaTopics.filter((item) => item !== t),
    }));
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.sessionDate) {
      toast.error("Please enter a session title and date/time.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/api/v1/mentorship-sessions", {
        mentorshipRequestId: reqId,
        title: form.title.trim(),
        description: form.description.trim(),
        sessionDate: form.sessionDate,
        durationMinutes: Number(form.durationMinutes) || 45,
        meetingMode: form.meetingMode,
        meetingLinkOrLocation: form.meetingLinkOrLocation.trim(),
        agendaTopics: form.agendaTopics,
      });

      toast.success("Mentorship session scheduled successfully!");
      setShowScheduleForm(false);
      setForm({
        title: "",
        description: "",
        sessionDate: "",
        durationMinutes: 45,
        meetingMode: "ONLINE",
        meetingLinkOrLocation: "",
        agendaTopics: [],
      });
      fetchSessions();
      if (onSessionCreated) onSessionCreated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to schedule session");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (sessionId, status) => {
    try {
      setActionLoadingId(sessionId);
      await api.put(`/api/v1/mentorship-sessions/${sessionId}/status`, { status });
      toast.success(`Session marked as ${status.toLowerCase()}!`);
      fetchSessions();
      if (onSessionCreated) onSessionCreated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update session status");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px]">
              1-on-1 Calendar
            </Badge>
          </div>
          <DialogTitle className="text-lg font-bold">
            Mentorship Sessions with {partner}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Schedule, manage, and join verified 1-on-1 mentorship video calls.
          </DialogDescription>
        </DialogHeader>

        {/* Action button to schedule */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Scheduled Calls ({sessions.length})
          </span>
          <Button
            size="sm"
            onClick={() => setShowScheduleForm(!showScheduleForm)}
            className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground"
          >
            <Plus className="w-3.5 h-3.5" />
            {showScheduleForm ? "Cancel Scheduling" : "Schedule New Session"}
          </Button>
        </div>

        {/* Schedule Form */}
        {showScheduleForm && (
          <form
            onSubmit={handleScheduleSubmit}
            className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3 animate-in fade-in-50 duration-200"
          >
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              New Session Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-foreground mb-1">
                  Session Topic / Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. System Design Mock Interview"
                  className="w-full rounded-lg border border-border bg-background py-1.5 px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-foreground mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.sessionDate}
                  onChange={(e) => setForm({ ...form, sessionDate: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background py-1.5 px-3 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-foreground mb-1">
                  Meeting Mode
                </label>
                <select
                  value={form.meetingMode}
                  onChange={(e) => setForm({ ...form, meetingMode: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background py-1.5 px-2 text-xs"
                >
                  <option value="ONLINE">Google Meet / Zoom (Online)</option>
                  <option value="IN_PERSON">Campus In-Person</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-foreground mb-1">
                  Meeting Link or Location
                </label>
                <input
                  type="text"
                  value={form.meetingLinkOrLocation}
                  onChange={(e) => setForm({ ...form, meetingLinkOrLocation: e.target.value })}
                  placeholder="https://meet.google.com/xyz or CS Dept Lab"
                  className="w-full rounded-lg border border-border bg-background py-1.5 px-3 text-xs"
                />
              </div>
            </div>

            {/* Agenda Topics */}
            <div>
              <label className="block text-[11px] font-medium text-foreground mb-1">
                Agenda Topics (Press Enter to add)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={handleAddTopic}
                  placeholder="e.g. Resume critique, distributed caching, salary negotiation"
                  className="flex-1 rounded-lg border border-border bg-background py-1.5 px-3 text-xs"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddTopic} className="h-7 text-xs">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {form.agendaTopics.map((t) => (
                  <Badge key={t} variant="secondary" className="text-[10px] gap-1">
                    {t}
                    <button type="button" onClick={() => handleRemoveTopic(t)}>
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" disabled={submitting} className="bg-primary text-primary-foreground text-xs">
                {submitting ? "Booking Session..." : "Confirm & Send Calendar Invite"}
              </Button>
            </div>
          </form>
        )}

        {/* Sessions Feed */}
        <div className="space-y-3 pt-2">
          {loading ? (
            <div className="py-8 text-center text-muted-foreground text-xs">
              Loading session schedule...
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-xs border border-dashed rounded-xl">
              No mentorship sessions scheduled yet. Click "Schedule New Session" to set up your first call!
            </div>
          ) : (
            sessions.map((sess) => (
              <div
                key={sess._id}
                className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{sess.title}</span>
                    <Badge
                      variant={sess.status === "COMPLETED" ? "success" : sess.status === "CANCELLED" ? "destructive" : "outline"}
                      className="text-[10px]"
                    >
                      {sess.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    📅 {new Date(sess.sessionDate).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })} ({sess.durationMinutes || 45} mins)
                  </p>
                  {sess.meetingLinkOrLocation && sess.meetingMode === "ONLINE" && (
                    <a
                      href={sess.meetingLinkOrLocation.startsWith("http") ? sess.meetingLinkOrLocation : `https://${sess.meetingLinkOrLocation}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                    >
                      Join Video Meeting <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {sess.status === "SCHEDULED" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(sess._id, "COMPLETED")}
                        disabled={actionLoadingId === sess._id}
                        className="h-7 text-xs text-emerald-600 dark:text-emerald-400"
                      >
                        Mark Completed
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUpdateStatus(sess._id, "CANCELLED")}
                        disabled={actionLoadingId === sess._id}
                        className="h-7 text-xs text-muted-foreground hover:text-destructive"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
