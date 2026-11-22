import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import gsap from "gsap";
import {
  Trophy,
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Users,
  BookOpen,
  Calendar,
  UserCheck,
  Target,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  ChevronRight,
  Lock,
} from "lucide-react";
import api from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";
import Nav from "./Nav";
import Footer from "./Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const BADGE_ICONS = {
  UserCheck,
  Users,
  BookOpen,
  Calendar,
  Award,
  Flame,
  Sparkles,
};

export default function Gamification() {
  const { user, isStudent } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeframe, setTimeframe] = useState("all"); // 'weekly' | 'monthly' | 'all'
  const [activeTab, setActiveTab] = useState("badges"); // 'badges' | 'leaderboard' | 'challenges'
  const [claimingId, setClaimingId] = useState(null);
  const [displayXP, setDisplayXP] = useState(0);
  const containerRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gamRes, leadRes] = await Promise.all([
        api.get("/api/v1/gamification/me").catch(() => null),
        api.get(`/api/v1/gamification/leaderboard?timeframe=${timeframe}`),
      ]);

      if (gamRes?.data?.data) {
        setProfileData(gamRes.data.data);
      }
      if (leadRes?.data?.data?.leaderboard) {
        setLeaderboard(leadRes.data.data.leaderboard);
      }
    } catch (err) {
      console.error("Failed to load gamification data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  // GSAP Counter for Total XP
  useEffect(() => {
    if (profileData?.totalXP !== undefined) {
      const obj = { val: displayXP };
      gsap.to(obj, {
        val: profileData.totalXP,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => setDisplayXP(Math.round(obj.val)),
      });
    }
  }, [profileData?.totalXP]);

  // GSAP Tab Switch Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (activeTab === "badges") {
        gsap.fromTo(
          ".badge-card",
          { scale: 0.92, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, stagger: 0.04, duration: 0.45, ease: "back.out(1.4)" }
        );
      } else if (activeTab === "leaderboard") {
        gsap.fromTo(
          ".leaderboard-row",
          { x: -15, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.03, duration: 0.35, ease: "power2.out" }
        );
      } else if (activeTab === "challenges") {
        gsap.fromTo(
          ".challenge-card",
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power2.out" }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [activeTab, profileData, leaderboard]);

  const handleClaim = async (challengeId) => {
    try {
      setClaimingId(challengeId);
      const res = await api.post("/api/v1/gamification/claim-challenge", { challengeId });
      toast.success(res?.data?.message || "Reward claimed successfully!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to claim reward");
    } finally {
      setClaimingId(null);
    }
  };

  const getInitials = (name) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const currentUserId = String(user?._id || user?.id || "");

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Nav />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 w-full">
        {/* Header Hero */}
        <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-card via-card to-primary/5 p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="accent" className="text-xs gap-1.5 py-0.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  Gamified Growth Engine
                </Badge>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{profileData?.streakDays || 3}-Day Streak</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Level {profileData?.currentLevel || 2}: {profileData?.levelTitle || "Explorer"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                Earn experience points (XP) for verified profile updates, mentorship sessions, and campus events to unlock achievement badges and climb the global ranking.
              </p>
            </div>

            {/* Total XP Counter */}
            <div className="flex flex-col items-start md:items-end p-4 rounded-xl border border-border/60 bg-background/80 shadow-xs min-w-[200px]">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Total Verified XP</span>
              <span className="text-3xl font-extrabold font-mono text-primary mt-0.5">
                {displayXP.toLocaleString()} <span className="text-sm font-sans text-muted-foreground">XP</span>
              </span>
              <span className="text-[11px] text-muted-foreground mt-1">
                Next level at {profileData?.nextLevelXP || 500} XP
              </span>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="mt-6 pt-6 border-t border-border/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">
                Progress to Level {(profileData?.currentLevel || 2) + 1}
              </span>
              <span className="font-mono font-bold text-foreground">
                {profileData?.progressPercent || 45}%
              </span>
            </div>
            <Progress value={profileData?.progressPercent || 45} className="h-2.5" />
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center p-1 rounded-xl bg-muted border border-border/60 max-w-fit">
          <button
            onClick={() => setActiveTab("badges")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "badges"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Achievement Badges ({profileData?.badges?.filter((b) => b.unlocked)?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "leaderboard"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Campus Leaderboard
          </button>
          <button
            onClick={() => setActiveTab("challenges")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "challenges"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Daily & Weekly Challenges
          </button>
        </div>

        {/* Tab 1: Badges Showcase */}
        {activeTab === "badges" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(profileData?.badges || []).map((badge) => {
                const IconComponent = BADGE_ICONS[badge.icon] || Award;
                return (
                  <Card
                    key={badge.id}
                    className={`badge-card flex flex-col justify-between transition-all ${
                      badge.unlocked
                        ? "border-primary/40 bg-card shadow-xs"
                        : "border-border/40 bg-muted/20 opacity-70"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`p-2.5 rounded-xl ${
                            badge.unlocked
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <Badge
                          variant={badge.unlocked ? "success" : "outline"}
                          className="text-[10px]"
                        >
                          {badge.unlocked ? "Unlocked" : "Locked"}
                        </Badge>
                      </div>

                      <CardTitle className="text-sm font-semibold">{badge.name}</CardTitle>
                      <CardDescription className="text-xs leading-relaxed mt-1">
                        {badge.description}
                      </CardDescription>
                    </CardHeader>

                    <CardFooter className="pt-2 border-t border-border/40 text-[11px] flex items-center justify-between text-muted-foreground">
                      <span>Value: +{badge.xpValue} XP</span>
                      {badge.unlocked ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Earned
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Lock className="w-3 h-3" /> In Progress
                        </span>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Leaderboard */}
        {activeTab === "leaderboard" && (
          <Card>
            <CardHeader className="border-b border-border/50 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Top Student Achievers
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Rankings calculated from verified mentorship interactions and campus activities.
                  </CardDescription>
                </div>

                {/* Timeframe selector */}
                <div className="flex items-center p-1 rounded-lg bg-muted border border-border/40 text-xs">
                  <button
                    onClick={() => setTimeframe("weekly")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      timeframe === "weekly" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setTimeframe("monthly")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      timeframe === "monthly" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setTimeframe("all")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      timeframe === "all" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    All-Time
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 font-semibold w-16">Rank</th>
                      <th className="py-3 px-4 font-semibold">Student Name</th>
                      <th className="py-3 px-4 font-semibold">Department</th>
                      <th className="py-3 px-4 font-semibold">Rank Tier</th>
                      <th className="py-3 px-4 font-semibold text-right">Total XP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {leaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-muted-foreground">
                          No student ranking records found.
                        </td>
                      </tr>
                    ) : (
                      leaderboard.map((item) => {
                        const isMe = String(item.id) === currentUserId;
                        return (
                          <tr
                            key={item.id}
                            className={`leaderboard-row hover:bg-muted/30 transition-colors ${
                              isMe ? "bg-primary/5 font-semibold border-l-2 border-primary" : ""
                            }`}
                          >
                            <td className="py-3 px-4 font-mono font-bold">
                              {item.rank === 1 ? (
                                <Badge className="bg-amber-500 text-white text-[10px] py-0 px-1.5">
                                  #1
                                </Badge>
                              ) : item.rank === 2 ? (
                                <Badge className="bg-slate-400 text-white text-[10px] py-0 px-1.5">
                                  #2
                                </Badge>
                              ) : item.rank === 3 ? (
                                <Badge className="bg-amber-700 text-white text-[10px] py-0 px-1.5">
                                  #3
                                </Badge>
                              ) : (
                                `#${item.rank}`
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                                    {getInitials(item.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <span className="font-semibold text-foreground">{item.name}</span>
                                  {isMe && (
                                    <Badge variant="outline" className="ml-1.5 text-[9px] py-0">
                                      You
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {item.department} (Sem {item.semester})
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="secondary" className="text-[10px]">
                                Level {item.level} {item.levelTitle}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-extrabold text-primary">
                              {item.xp.toLocaleString()} XP
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Challenges */}
        {activeTab === "challenges" && (
          <div className="space-y-4">
            {(profileData?.challenges || []).map((ch) => (
              <Card key={ch.id} className="challenge-card hover:border-border transition-colors">
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground text-sm">{ch.title}</h4>
                      <Badge variant="accent" className="font-mono text-[10px]">
                        +{ch.xp} XP
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{ch.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {ch.claimed ? (
                      <Badge variant="success" className="text-xs gap-1 py-1 px-3">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                      </Badge>
                    ) : ch.completed ? (
                      <Button
                        size="sm"
                        disabled={claimingId === ch.id}
                        onClick={() => handleClaim(ch.id)}
                        className="bg-primary text-primary-foreground text-xs gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {claimingId === ch.id ? "Claiming..." : "Claim +XP Reward"}
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        Incomplete
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
