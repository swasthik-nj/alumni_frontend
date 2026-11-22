import { useState, useEffect } from "react";
import api from "../utils/api";
import {
  MessageSquare,
  Star,
  Calendar,
  Users,
  Send,
  TrendingUp,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import Nav from "./Nav";
import Footer from "./Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Community() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expandedSession, setExpandedSession] = useState(null);

  // Feedback form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/community/sessions");
      setSessions(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionFeedbacks = async (sessionId) => {
    try {
      const res = await api.get(`/api/v1/community/sessions/${sessionId}/feedbacks`);
      setFeedbacks(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleSessionClick = (session) => {
    if (expandedSession === session._id) {
      setExpandedSession(null);
      setSelectedSession(null);
      setFeedbacks([]);
      setShowFeedbackForm(false);
    } else {
      setExpandedSession(session._id);
      setSelectedSession(session);
      fetchSessionFeedbacks(session._id);
      setShowFeedbackForm(false);
      setRating(0);
      setComment("");
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!rating) {
      alert("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/api/v1/community/feedback", {
        sessionId: selectedSession._id,
        feedbackRating: rating,
        comment: comment.trim(),
      });

      alert("Feedback submitted successfully!");
      setRating(0);
      setComment("");
      setShowFeedbackForm(false);
      fetchSessionFeedbacks(selectedSession._id);
      fetchSessions();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating: currentRating, size = "w-4 h-4", interactive = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              interactive ? "cursor-pointer transition-transform hover:scale-110" : ""
            } ${
              star <= (interactive ? hoverRating || rating : currentRating)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/40"
            }`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Nav />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 w-full">
        {/* Header */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <MessageCircle className="w-3.5 h-3.5" /> Campus Discussions & Experience Sharing
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Alumni Community & Session Reviews
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
              Explore past sessions, review community feedback, and share your learning experiences with peers.
            </p>
          </div>

          <Badge variant="outline" className="text-xs font-normal">
            {sessions.length} Community Sessions Recorded
          </Badge>
        </div>

        {/* Sessions Feed */}
        <div>
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div>
              <p className="text-muted-foreground text-xs mt-3">Loading community sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <Card className="p-12 text-center">
              <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground text-base">No Community Sessions Yet</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Sessions will appear here once campus events and workshops conclude.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => {
                const isExpanded = expandedSession === session._id;
                return (
                  <Card key={session._id} className="hover:border-border transition-colors">
                    <CardHeader
                      onClick={() => handleSessionClick(session)}
                      className="cursor-pointer pb-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">{session.title}</CardTitle>
                            <Badge variant="outline" className="text-[10px]">
                              {session.sessionType || "General"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {session.description || "Session concluded."}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <StarRating rating={Math.round(session.averageRating || 5)} />
                            <span className="text-xs font-mono font-bold text-foreground">
                              {session.averageRating ? session.averageRating.toFixed(1) : "5.0"}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              ({session.feedbackCount || 0})
                            </span>
                          </div>

                          <button className="p-1 rounded-md text-muted-foreground hover:text-foreground">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Expanded Reviews & Feedback */}
                    {isExpanded && (
                      <CardContent className="pt-2 border-t border-border/40 space-y-4">
                        <div className="flex items-center justify-between pt-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Attendee Reviews & Comments ({feedbacks.length})
                          </h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                            className="text-xs h-7"
                          >
                            {showFeedbackForm ? "Cancel" : "Leave Review"}
                          </Button>
                        </div>

                        {/* Review Form */}
                        {showFeedbackForm && (
                          <form onSubmit={handleSubmitFeedback} className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">Your Rating</label>
                              <StarRating rating={rating} size="w-5 h-5" interactive={true} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Comment / Key Takeaway</label>
                              <textarea
                                rows={2}
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="What did you learn from this session?"
                                className="w-full rounded-lg border border-border bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring"
                              />
                            </div>
                            <Button type="submit" size="sm" disabled={submitting} className="bg-primary text-primary-foreground text-xs">
                              {submitting ? "Submitting..." : "Submit Review"}
                            </Button>
                          </form>
                        )}

                        {/* Feedback List */}
                        {feedbacks.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic py-3">
                            No reviews submitted yet for this session.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {feedbacks.map((f) => (
                              <div
                                key={f._id}
                                className="p-3 rounded-lg border border-border/40 bg-muted/20 text-xs space-y-1"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-foreground">
                                    {f.student?.studentName || f.alumni?.alumniName || "Community Member"}
                                  </span>
                                  <StarRating rating={f.feedbackRating} size="w-3.5 h-3.5" />
                                </div>
                                <p className="text-muted-foreground leading-relaxed">{f.comment}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    )}
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
