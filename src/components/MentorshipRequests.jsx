import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  UserCheck,
  GraduationCap,
  Briefcase,
  ChevronRight,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  X,
  Target,
} from "lucide-react";
import api from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";
import Nav from "./Nav";
import Footer from "./Footer";
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

export default function MentorshipRequests() {
  const { user, isStudent } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [capacity, setCapacity] = useState({ activeCount: 0, maxCapacity: 3, remainingSlots: 3 });
  const [activeTab, setActiveTab] = useState("pending"); // 'pending' | 'accepted' | 'history'

  // Reject modal state
  const [rejectingRequestId, setRejectingRequestId] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      if (isStudent) {
        const res = await api.get("/api/v1/mentorship-requests/student/my-requests");
        setRequests(res?.data?.data?.requests || []);
      } else {
        const res = await api.get("/api/v1/mentorship-requests/alumni/incoming");
        setRequests(res?.data?.data?.requests || []);
        if (res?.data?.data?.capacity) {
          setCapacity(res.data.data.capacity);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load mentorship requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [isStudent]);

  // Student cancels their pending request
  const handleCancelRequest = async (id) => {
    if (window.confirm("Are you sure you want to cancel this mentorship request?")) {
      try {
        setActionLoading(true);
        await api.put(`/api/v1/mentorship-requests/${id}/cancel`);
        toast.success("Mentorship request cancelled.");
        fetchRequests();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to cancel request");
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Alumni accepts a request
  const handleAcceptRequest = async (id, studentName) => {
    try {
      setActionLoading(true);
      await api.put(`/api/v1/mentorship-requests/${id}/accept`);
      toast.success(`Accepted mentorship request from ${studentName}!`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept request");
    } finally {
      setActionLoading(false);
    }
  };

  // Alumni submits rejection
  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingRequestId) return;
    try {
      setActionLoading(true);
      await api.put(`/api/v1/mentorship-requests/${rejectingRequestId}/reject`, {
        responseNote: rejectNote,
      });
      toast.success("Mentorship request declined.");
      setRejectingRequestId(null);
      setRejectNote("");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to decline request");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter requests by tab
  const pendingList = requests.filter((r) => r.status === "PENDING");
  const acceptedList = requests.filter((r) => r.status === "ACCEPTED");
  const historyList = requests.filter((r) => ["REJECTED", "CANCELLED", "COMPLETED"].includes(r.status));

  const currentList =
    activeTab === "pending"
      ? pendingList
      : activeTab === "accepted"
      ? acceptedList
      : historyList;

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return <Badge variant="success">Active Mentorship</Badge>;
      case "PENDING":
        return <Badge variant="warning">Under Review</Badge>;
      case "COMPLETED":
        return <Badge variant="accent">Completed</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Declined</Badge>;
      case "CANCELLED":
        return <Badge variant="secondary">Withdrawn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
              <Sparkles className="w-3.5 h-3.5" /> Mentorship Relationship Workflow
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {isStudent ? "My Mentorship Pipeline" : "Incoming Student Applications"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isStudent
                ? "Track the status of your 1-on-1 mentorship requests and active mentors."
                : "Review and accept mentorship applications submitted by students."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isStudent ? (
              <Button asChild size="sm" className="bg-primary text-primary-foreground gap-1.5">
                <Link to="/mentorship/explore">
                  <Send className="w-3.5 h-3.5" /> Explore New Mentors
                </Link>
              </Button>
            ) : (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Mentoring Capacity</p>
                <p className="text-sm font-bold text-foreground">
                  {capacity.activeCount} / {capacity.maxCapacity} Slots Filled
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center p-1 rounded-xl bg-muted border border-border/60 max-w-fit">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "pending"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pending Review ({pendingList.length})
          </button>
          <button
            onClick={() => setActiveTab("accepted")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "accepted"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Active Mentorships ({acceptedList.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "history"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Archived / History ({historyList.length})
          </button>
        </div>

        {/* Requests List */}
        <div>
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div>
              <p className="text-muted-foreground text-xs mt-3">Loading mentorship pipeline...</p>
            </div>
          ) : currentList.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground text-base">No Requests Found</h3>
              <p className="text-xs text-muted-foreground mt-1">
                There are no {activeTab} mentorship applications recorded in your pipeline.
              </p>
              {isStudent && activeTab === "pending" && (
                <Button asChild size="sm" className="mt-4 bg-primary text-primary-foreground">
                  <Link to="/mentorship/explore">Explore & Connect with Alumni Mentors</Link>
                </Button>
              )}
            </Card>
          ) : (
            <div className="space-y-4">
              {currentList.map((req) => {
                const partner = isStudent ? req.alumni : req.student;
                const partnerName = isStudent ? partner?.alumniName : partner?.studentName;
                const partnerDetail = isStudent
                  ? `${partner?.designation || "Engineer"} at ${partner?.companyName || "Tech Company"}`
                  : `${partner?.department} (Sem ${partner?.currentSemester || 1})`;

                return (
                  <Card key={req._id} className="hover:border-border transition-colors">
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2.5">
                            <h3 className="font-semibold text-foreground text-base">{partnerName}</h3>
                            {getStatusBadge(req.status)}
                            <Badge variant="outline" className="text-[10px]">
                              {req.targetDomain || "General Guidance"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{partnerDetail}</p>

                          {req.message && (
                            <p className="text-xs text-foreground bg-muted/30 p-2.5 rounded-lg border border-border/40 mt-2 italic">
                              "{req.message}"
                            </p>
                          )}

                          {req.responseNote && (
                            <p className="text-xs text-muted-foreground bg-destructive/10 p-2 rounded-lg border border-destructive/20 mt-1">
                              <strong>Mentor note:</strong> {req.responseNote}
                            </p>
                          )}

                          <p className="text-[11px] text-muted-foreground pt-1">
                            Submitted on {new Date(req.createdAt).toLocaleDateString([], { dateStyle: "long" })}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {req.status === "PENDING" && isStudent && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelRequest(req._id)}
                              disabled={actionLoading}
                              className="text-xs text-destructive hover:bg-destructive/10"
                            >
                              Withdraw Request
                            </Button>
                          )}

                          {req.status === "PENDING" && !isStudent && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAcceptRequest(req._id, partnerName)}
                                disabled={actionLoading}
                                className="text-xs bg-primary text-primary-foreground gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Accept Mentee
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setRejectingRequestId(req._id);
                                  setRejectNote("");
                                }}
                                disabled={actionLoading}
                                className="text-xs text-destructive hover:bg-destructive/10"
                              >
                                Decline
                              </Button>
                            </>
                          )}

                          {req.status === "ACCEPTED" && (
                            <Button asChild size="sm" className="text-xs bg-primary text-primary-foreground gap-1.5">
                              <Link to={`/mentorship/chat/${req._id}`}>
                                <MessageSquare className="w-3.5 h-3.5" /> Open 1:1 Workspace
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Reject Note Dialog */}
      <Dialog open={Boolean(rejectingRequestId)} onOpenChange={() => setRejectingRequestId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Decline Mentorship Application</DialogTitle>
            <DialogDescription>
              Provide an optional note explaining why you cannot accept this request at this time.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRejectSubmit} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-medium mb-1">Reason / Guidance Note</label>
              <textarea
                rows={3}
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="e.g. Currently at maximum mentee capacity, recommend reaching out to mentors specializing in DevOps..."
                className="w-full rounded-lg border border-border bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setRejectingRequestId(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={actionLoading} className="text-destructive bg-destructive/10 hover:bg-destructive/20 border border-destructive/30">
                Confirm Decline
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
