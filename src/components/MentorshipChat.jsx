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
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [peerTypingName, setPeerTypingName] = useState("");
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);

  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingEmittedRef = useRef(false);
  const lastTypingPingRef = useRef(0);

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
        setIsPeerTyping(Boolean(res.data.data.isTyping));
        if (res.data.data.typingUser) {
          setPeerTypingName(res.data.data.typingUser);
        }
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

    // Real-time WhatsApp-like fast polling every 1.2 seconds for messages & typing status
    pollIntervalRef.current = setInterval(() => {
      fetchConversation(true);
    }, 1200);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Reset typing on unmount
      if (requestId && isTypingEmittedRef.current) {
        api.post(`/api/v1/messages/request/${requestId}/typing`, { isTyping: false }).catch(() => {});
      }
    };
  }, [requestId]);

  useEffect(() => {
    scrollToBottom(loading ? "auto" : "smooth");
  }, [messages.length, isPeerTyping]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    if (val.trim()) {
      const now = Date.now();
      // Emit typing immediately or refresh every 2 seconds while actively typing
      if (!isTypingEmittedRef.current || now - lastTypingPingRef.current > 2000) {
        isTypingEmittedRef.current = true;
        lastTypingPingRef.current = now;
        api.post(`/api/v1/messages/request/${requestId}/typing`, { isTyping: true }).catch(() => {});
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        isTypingEmittedRef.current = false;
        api.post(`/api/v1/messages/request/${requestId}/typing`, { isTyping: false }).catch(() => {});
      }, 3000);
    } else {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      isTypingEmittedRef.current = false;
      api.post(`/api/v1/messages/request/${requestId}/typing`, { isTyping: false }).catch(() => {});
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || sending) return;

    const textToSend = inputText.trim();
    setInputText("");
    setSending(true);

    // Stop typing state immediately
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    isTypingEmittedRef.current = false;
    api.post(`/api/v1/messages/request/${requestId}/typing`, { isTyping: false }).catch(() => {});

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

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
            <p className="text-[11px] flex items-center gap-1.5">
              {isPeerTyping ? (
                <span className="text-emerald-500 font-semibold animate-pulse flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  typing...
                </span>
              ) : (
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Connected 1-on-1 Workspace
                </span>
              )}
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
            const msgSenderId = String(msg.senderId || msg.sender?._id || msg.sender || "");
            const myUserId = String(user?._id || user?.id || "");
            const myName = String(user?.alumniName || user?.studentName || user?.name || user?.username || "").trim().toLowerCase();
            const msgSenderName = String(msg.senderName || "").trim().toLowerCase();
            const partnerLower = String(partnerName || "").trim().toLowerCase();

            // 100% reliable detection for 1-to-1 conversation
            const isMe = Boolean(
              (myUserId && msgSenderId && msgSenderId === myUserId) ||
              (myName && msgSenderName && msgSenderName === myName) ||
              (msgSenderName && partnerLower && msgSenderName !== partnerLower)
            );

            const displayName = isMe ? "You" : (msg.senderName || partnerName);
            const timeStr = formatTime(msg.createdAt);

            if (isMe) {
              return (
                <div key={msg._id || index} className="flex items-start justify-end gap-2.5">
                  <div className="flex flex-col items-end gap-1 w-full max-w-[320px] sm:max-w-[460px]">
                    {/* Header: Name and Time */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-foreground">You</span>
                      <span className="text-[11px] font-normal text-muted-foreground">{timeStr}</span>
                    </div>

                    {/* Speech Bubble */}
                    <div className="flex flex-col leading-relaxed p-3.5 bg-primary text-primary-foreground rounded-2xl rounded-tr-none shadow-xs text-sm">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {/* Footer: Seen / Delivered Status */}
                    <div className="flex items-center gap-1 text-[11px] font-normal text-muted-foreground">
                      <span>{msg.isRead ? `Seen at ${formatTime(msg.readAt || msg.createdAt)}` : "Delivered"}</span>
                      {msg.isRead ? (
                        <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>

                  {/* Avatar Right */}
                  <Avatar className="w-8 h-8 rounded-full shrink-0 mt-1">
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs">
                      {getInitials(user?.alumniName || user?.studentName || user?.name || user?.username || "You")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              );
            }

            return (
              <div key={msg._id || index} className="flex items-start gap-2.5">
                {/* Avatar Left */}
                <Avatar className="w-8 h-8 rounded-full shrink-0 mt-1">
                  <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-xs">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-1 w-full max-w-[320px] sm:max-w-[460px]">
                  {/* Header: Name and Time */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-foreground">{displayName}</span>
                    <span className="text-[11px] font-normal text-muted-foreground">{timeStr}</span>
                  </div>

                  {/* Speech Bubble */}
                  <div className="flex flex-col leading-relaxed p-3.5 border border-border/70 bg-card rounded-2xl rounded-tl-none text-foreground shadow-xs text-sm">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {/* Footer: Status */}
                  <span className="text-[11px] font-normal text-muted-foreground">Delivered</span>
                </div>
              </div>
            );
          })
        )}

        {/* WhatsApp-style Real-time Typing Indicator */}
        {isPeerTyping && (
          <div className="flex items-start gap-2.5 animate-fadeIn">
            <Avatar className="w-8 h-8 rounded-full shrink-0 mt-1 ring-2 ring-emerald-500/20">
              <AvatarFallback className="bg-emerald-500/10 text-emerald-500 font-bold text-xs">
                {getInitials(peerTypingName || partnerName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 max-w-[320px]">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-foreground">{peerTypingName || partnerName}</span>
                <span className="text-[11px] text-emerald-500 font-semibold animate-pulse">typing...</span>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-3 bg-muted/60 dark:bg-card border border-border/70 rounded-2xl rounded-tl-none shadow-xs w-fit">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-[11px] text-emerald-500 font-medium italic">
                {peerTypingName || partnerName} is typing...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-border/60 bg-card">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
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
