import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import {
  Star,
  Sparkles,
  CheckCircle2,
  X,
  MessageSquare,
  Award,
  ThumbsUp,
  UserCheck,
} from "lucide-react";
import api from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";
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

export default function MentorshipFeedbackModal({
  requestId,
  request,
  partnerName,
  isOpen = true,
  onClose,
  onFeedbackSubmitted,
}) {
  const reqId = requestId || request?._id;
  const partner =
    partnerName ||
    request?.student?.studentName ||
    request?.alumni?.alumniName ||
    "Mentor";

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState([]);

  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackComments, setFeedbackComments] = useState("");
  const [overallExperience, setOverallExperience] = useState("EXCELLENT");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");

  const suggestedSkills = [
    "System Architecture",
    "Frontend Mastery",
    "Backend & APIs",
    "Technical Interview Prep",
    "Resume Critique",
    "Debugging Skills",
    "Career Roadmapping",
  ];

  const fetchFeedback = async () => {
    if (!reqId) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/mentorship-feedback/request/${reqId}`);
      if (res?.data?.data?.feedbacks) {
        setExistingFeedback(res.data.data.feedbacks);
      }
    } catch (err) {
      console.error("Failed to load feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && reqId) {
      fetchFeedback();
    }
  }, [isOpen, reqId]);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    if ((e.key === "Enter" || e.type === "click") && customSkill.trim()) {
      e.preventDefault();
      const val = customSkill.trim();
      if (!selectedSkills.includes(val)) {
        setSelectedSkills([...selectedSkills, val]);
      }
      setCustomSkill("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a star rating.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/api/v1/mentorship-feedback", {
        mentorshipRequestId: reqId,
        rating,
        feedbackComments: feedbackComments.trim(),
        overallExperience,
        keySkillsLearned: selectedSkills,
      });

      toast.success("Thank you! Mentorship rating and feedback recorded.");
      fetchFeedback();
      if (onFeedbackSubmitted) onFeedbackSubmitted();
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" className="text-[10px]">
              Feedback Review
            </Badge>
          </div>
          <DialogTitle className="text-lg font-bold">
            Mentorship Review for {partner}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Rate your mentorship experience and share key technical skills acquired.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Star Rating */}
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 text-center space-y-2">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
              Overall Satisfaction Rating
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-7 h-7 cursor-pointer transition-transform hover:scale-110 ${
                    star <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-foreground">
              {rating} out of 5 stars
            </span>
          </div>

          {/* Overall Experience Pill Selector */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Experience Assessment
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["EXCELLENT", "GOOD", "AVERAGE", "NEEDS_IMPROVEMENT"].map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setOverallExperience(exp)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                    overallExperience === exp
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {exp.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Key Skills Learned Tags */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Key Technical Skills & Competencies Developed
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {suggestedSkills.map((sk) => {
                const selected = selectedSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      selected
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {sk} {selected && "✓"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Feedback Comments & Testimonial
            </label>
            <textarea
              rows={3}
              required
              value={feedbackComments}
              onChange={(e) => setFeedbackComments(e.target.value)}
              placeholder="What did you appreciate most about this guidance? Any constructive advice for future mentees?"
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs focus:ring-2 focus:ring-ring"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting} className="bg-primary text-primary-foreground">
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
