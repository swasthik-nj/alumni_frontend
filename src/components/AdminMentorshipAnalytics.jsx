import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Users,
  Award,
  Star,
  Sparkles,
  Calendar,
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  RefreshCw,
  Building,
  Layers,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import api from "../utils/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function AdminMentorshipAnalytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/admin/mentorship-analytics");
      if (res?.data?.data) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load mentorship analytics:", err);
      toast.error("Failed to load mentorship analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary/20 border-t-primary"></div>
        <p className="text-muted-foreground text-xs mt-3 animate-pulse">
          Computing mentorship metrics & capacity saturation...
        </p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground text-sm">No mentorship analytics available.</p>
        <Button onClick={fetchAnalytics} size="sm" className="mt-3">
          Retry
        </Button>
      </Card>
    );
  }

  const { overview, ratingBreakdown, topDomains, departmentBreakdown } = analytics;

  return (
    <div className="space-y-6">
      {/* Analytics Subheader */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/60 bg-card shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Institutional Mentorship Intelligence
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Smart Mentorship Ecosystem Overview
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time analytics on alumni mentoring capacity, student demand, satisfaction, and learning sessions.
          </p>
        </div>

        <Button
          onClick={fetchAnalytics}
          variant="outline"
          size="sm"
          className="gap-2 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Metrics
        </Button>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Mentorships */}
        <Card className="hover:border-border transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Active Relationships
              </span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-3xl font-extrabold mt-1">
              {overview.activeMentorships}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Out of <span className="font-semibold text-foreground">{overview.totalRequests}</span> total applications
            </p>
          </CardContent>
        </Card>

        {/* Capacity Saturation */}
        <Card className="hover:border-border transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Capacity Saturation
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <CardTitle className="text-3xl font-extrabold mt-1">
              {overview.capacityUtilization}%
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={Math.min(100, overview.capacityUtilization)} className="h-1.5" />
            <p className="text-xs text-muted-foreground">
              {overview.activeMentorships} filled / {overview.totalCapacity} total slots
            </p>
          </CardContent>
        </Card>

        {/* Completed Mentorships */}
        <Card className="hover:border-border transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Completed
              </span>
              <Award className="w-4 h-4 text-indigo-500" />
            </div>
            <CardTitle className="text-3xl font-extrabold mt-1">
              {overview.completedMentorships}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Graduated from active guidance
            </p>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card className="hover:border-border transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Student Rating
              </span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <CardTitle className="text-3xl font-extrabold mt-1 flex items-baseline gap-1">
              {overview.avgRating}
              <span className="text-xs font-normal text-muted-foreground">/ 5.0</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              From <span className="font-semibold text-foreground">{overview.totalFeedbacks}</span> verified reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border/60 bg-card">
          <div className="text-xs text-muted-foreground">Available Mentors</div>
          <div className="text-xl font-bold text-foreground mt-1">
            {overview.availableMentors} <span className="text-xs font-normal text-muted-foreground">/ {overview.totalAlumni} alumni</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card">
          <div className="text-xs text-muted-foreground">Pending Review</div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {overview.pendingRequests} <span className="text-xs font-normal text-muted-foreground">applications</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card">
          <div className="text-xs text-muted-foreground">Sessions Conducted</div>
          <div className="text-xl font-bold text-primary mt-1">
            {overview.totalSessionsConducted} <span className="text-xs font-normal text-muted-foreground">1-on-1 calls</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card">
          <div className="text-xs text-muted-foreground">Shared Resources</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {overview.totalSharedResources} <span className="text-xs font-normal text-muted-foreground">materials</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top In-Demand Domains */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Top In-Demand Mentorship Domains
            </CardTitle>
            <CardDescription className="text-xs">
              Student guidance applications categorized by technical domain.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topDomains.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No domain data available.</p>
            ) : (
              topDomains.map((d, index) => {
                const maxCount = Math.max(...topDomains.map((item) => item.count), 1);
                const percent = Math.round((d.count / maxCount) * 100);
                return (
                  <div key={d.domain} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">
                        {index + 1}. {d.domain}
                      </span>
                      <span className="text-primary font-mono font-medium">
                        {d.count} request{d.count !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <Progress value={percent} className="h-1.5" />
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Rating Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              Student Satisfaction Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              Detailed star distribution submitted by students after completing mentorship.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingBreakdown?.[stars] || 0;
              const total = overview.totalFeedbacks || 1;
              const percent = Math.round((count / total) * 100);
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-12 font-medium text-foreground">
                    <span>{stars}</span>
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  </div>
                  <Progress value={percent} className="flex-1 h-2" />
                  <span className="w-16 text-right font-mono text-muted-foreground">
                    {count} ({percent}%)
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            Departmental Participation Distribution
          </CardTitle>
          <CardDescription className="text-xs">
            Volume of active student mentorship relationships across campus departments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-border/60 bg-muted/40 text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Department</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Active Mentorships</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {departmentBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-muted-foreground italic">
                      No departmental data recorded yet.
                    </td>
                  </tr>
                ) : (
                  departmentBreakdown.map((dept) => {
                    const totalActive = overview.activeMentorships || 1;
                    const share = Math.round((dept.count / totalActive) * 100);
                    return (
                      <tr key={dept._id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-foreground">{dept._id || "Unassigned"}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-semibold text-primary">
                          {dept.count}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <Badge variant="outline" className="text-[10px]">
                            {share}%
                          </Badge>
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
    </div>
  );
}
