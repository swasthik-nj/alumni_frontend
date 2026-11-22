import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Send,
  ArrowLeft,
  Check,
  CheckCheck,
  Clock,
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  RefreshCw,
  X,
  MessageSquare,
  Calendar,
  BookOpen,
} from "lucide-react";
import api from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";
import Nav from "./Nav";
import MentorshipSessionModal from "./MentorshipSessionModal";
import SharedResourcesModal from "./SharedResourcesModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function MentorshipChat({ requestId: propRequestId, onClose }) {
  const { requestId: paramRequestId } = useParams();
  const requestId = propRequestId || paramRequestId;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [mentorshipInfo, setMentorshipInfo] = useState(null);
  const [inputText, setInputText] = useState("");
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const isModalMode = Boolean(onClose);
  const currentUserId = String(user?._id || user?.id || "");

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const fetchConversation = async (silent = false) => {
    if (!requestId) return;
    try {
      if (!silent) setLoading(true);
      const res = await api.get(`/api/v1/messages/request/${requestId}`);
      if (res?.data?.data) {
        setMentorshipInfo(res.data.data.mentorshipRequest);
        setMessages(res.data.data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load conversation:", err);
      if (!silent) {
        toast.error(err.response?.data?.message || "Failed to load conversation history.");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();

    // Start real-time polling every 4 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchConversation(true);
    }, 4000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [requestId]);

  useEffect(() => {
    scrollToBottom(loading ? "auto" : "smooth");
  }, [messages.length]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || sending) return;

    const textToSend = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      const res = await api.post("/api/v1/messages", {
        mentorshipRequestId: requestId,
        content: textToSend,
      });

      if (res?.data?.data?.message) {
        setMessages((prev) => [...prev, res.data.data.message]);
        scrollToBottom();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error(err.response?.data?.message || "Failed to send message.");
      setInputText(textToSend);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const partner =
    mentorshipInfo?.student?._id === currentUserId
      ? mentorshipInfo?.alumni
      : mentorshipInfo?.student;

  const partnerName = partner?.alumniName || partner?.studentName || "Mentorship Partner";

  const getInitials = (name) => {
    if (!name) return "MP";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const chatContent = (
    <div className="flex flex-col h-full bg-background text-foreground transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-card/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {!isModalMode && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate(-1)}
              className="mr-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {getInitials(partnerName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-sm">{partnerName}</h3>
              <Badge variant="outline" className="text-[10px] py-0 h-4 font-normal">
                {mentorshipInfo?.targetDomain || "Active Mentorship"}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected 1-on-1 Workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSessionModal(true)}
            className="h-8 text-xs gap-1.5 hidden sm:inline-flex"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Book Session
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowResourceModal(true)}
            className="h-8 text-xs gap-1.5 hidden sm:inline-flex"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Resources
          </Button>
          {isModalMode && (
            <Button variant="ghost" size="icon-sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground text-xs">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary/20 border-t-primary"></div>
            <p className="mt-2">Loading conversation...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground text-xs space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="font-medium text-foreground">No messages yet.</p>
            <p className="max-w-xs mx-auto">
              Say hello, introduce your goals, or schedule your first mentorship meeting call!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = String(msg.sender?._id || msg.sender) === currentUserId;
            return (
              <div
                key={msg._id || index}
                className={`flex gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && (
                  <Avatar className="h-7 w-7 mt-1 shrink-0">
                    <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
                      {getInitials(msg.senderName || partnerName)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-tr-xs"
                      : "bg-muted/70 text-foreground border border-border/50 rounded-tl-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <div
                    className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                      isMe ? "text-primary-foreground/75" : "text-muted-foreground"
                    }`}
                  >
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMe && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-border/60 bg-card">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${partnerName}... (Press Enter to send)`}
            className="flex-1 rounded-xl border border-border bg-background py-2.5 px-4 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            type="submit"
            disabled={!inputText.trim() || sending}
            size="sm"
            className="h-9 px-4 bg-primary text-primary-foreground gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </div>

      {/* Modals */}
      {showSessionModal && mentorshipInfo && (
        <MentorshipSessionModal
          request={mentorshipInfo}
          onClose={() => setShowSessionModal(false)}
        />
      )}

      {showResourceModal && mentorshipInfo && (
        <SharedResourcesModal
          request={mentorshipInfo}
          onClose={() => setShowResourceModal(false)}
        />
      )}
    </div>
  );

  if (isModalMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
        <div className="w-full max-w-2xl h-[600px] rounded-2xl border border-border/80 shadow-2xl overflow-hidden flex flex-col bg-background">
          {chatContent}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        <div className="flex-1 rounded-2xl border border-border/60 shadow-lg overflow-hidden flex flex-col bg-card">
          {chatContent}
        </div>
      </div>
    </div>
  );
}
