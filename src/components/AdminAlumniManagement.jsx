import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Users,
  Search,
  Filter,
  Building2,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Award,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../utils/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AdminAlumniManagement() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [mentorFilter, setMentorFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Selected alumnus for profile modal
  const [selectedAlumnus, setSelectedAlumnus] = useState(null);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/api/v1/admin/all-alumni").catch(() => null) ||
                  await api.get("/api/v1/admin/alumni").catch(() => null) ||
                  await api.get("/api/v1/alumni").catch(() => null);

      const data = res?.data?.data || res?.data || [];
      if (Array.isArray(data)) {
        setAlumni(data);
      } else {
        setAlumni([]);
      }
    } catch (err) {
      console.error("Failed to load alumni:", err);
      setError("Failed to load registered alumni roster.");
      toast.error("Failed to load registered alumni roster.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const getInitials = (name) => {
    if (!name) return "AL";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // Distinct departments for filter
  const departmentsList = Array.from(
    new Set(alumni.map((a) => a.department).filter(Boolean))
  ).sort();

  // Filtered and sorted alumni
  const filteredAlumni = alumni.filter((item) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.alumniName?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.companyName?.toLowerCase().includes(q) ||
      item.designation?.toLowerCase().includes(q) ||
      item.department?.toLowerCase().includes(q) ||
      (Array.isArray(item.mentorshipDomains) &&
        item.mentorshipDomains.some((d) => d.toLowerCase().includes(q)));

    const matchesDept =
      deptFilter === "ALL" || item.department === deptFilter;

    const matchesMentor =
      mentorFilter === "ALL" ||
      (mentorFilter === "AVAILABLE" && item.isAvailableForMentoring) ||
      (mentorFilter === "UNAVAILABLE" && !item.isAvailableForMentoring);

    return matchesSearch && matchesDept && matchesMentor;
  });

  // Sort
  const sortedAlumni = [...filteredAlumni].sort((a, b) => {
    if (sortBy === "name_asc") return (a.alumniName || "").localeCompare(b.alumniName || "");
    if (sortBy === "name_desc") return (b.alumniName || "").localeCompare(a.alumniName || "");
    if (sortBy === "year_desc") return (b.graduationYear || 0) - (a.graduationYear || 0);
    if (sortBy === "year_asc") return (a.graduationYear || 0) - (b.graduationYear || 0);
    if (sortBy === "exp_desc") return (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0);
    return 0;
  });

  // Pagination
  const totalItems = sortedAlumni.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedAlumni = sortedAlumni.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Quick Analytics
  const totalMentors = alumni.filter((a) => a.isAvailableForMentoring).length;
  const uniqueCompanies = new Set(alumni.map((a) => a.companyName).filter(Boolean)).size;
  const totalMenteeCapacity = alumni.reduce(
    (acc, a) => acc + (a.isAvailableForMentoring ? a.maxMentees || 3 : 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/70 border-border/70 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Registered Alumni</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-3xl font-extrabold mt-1">
              {loading ? "..." : alumni.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Verified graduate profiles across all batches
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border/70 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Available Mentors</span>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <CardTitle className="text-3xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-400">
              {loading ? "..." : totalMentors}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {alumni.length > 0
                ? `${Math.round((totalMentors / alumni.length) * 100)}% active mentor participation`
                : "No mentors yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border/70 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Employers / Companies</span>
              <Building2 className="w-4 h-4 text-blue-500" />
            </div>
            <CardTitle className="text-3xl font-extrabold mt-1">
              {loading ? "..." : uniqueCompanies}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Diverse tech & enterprise organizations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border/70 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Mentee Capacity</span>
              <Award className="w-4 h-4 text-indigo-500" />
            </div>
            <CardTitle className="text-3xl font-extrabold mt-1 text-indigo-600 dark:text-indigo-400">
              {loading ? "..." : totalMenteeCapacity}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Simultaneous student mentorship slots offered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-border/70">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Master Alumni Directory & Roster
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Browse, search, and inspect all registered alumni profiles, company affiliations, and mentorship offerings.
              </CardDescription>
            </div>
            <Button
              onClick={fetchAlumni}
              variant="outline"
              size="sm"
              disabled={loading}
              className="gap-1.5 text-xs h-8"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search alumni, company, skill..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">All Departments</option>
              {departmentsList.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Mentorship Availability */}
            <select
              value={mentorFilter}
              onChange={(e) => {
                setMentorFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">All Mentoring Status</option>
              <option value="AVAILABLE">Available for Mentoring</option>
              <option value="UNAVAILABLE">Not Available / At Capacity</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="name_asc">Name (A to Z)</option>
              <option value="name_desc">Name (Z to A)</option>
              <option value="year_desc">Graduation Year (Newest)</option>
              <option value="year_asc">Graduation Year (Oldest)</option>
              <option value="exp_desc">Experience (Highest First)</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 text-center text-xs text-muted-foreground space-y-2">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary/20 border-t-primary" />
              <p>Loading registered alumni roster...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center text-xs text-destructive">
              <p>{error}</p>
              <Button onClick={fetchAlumni} size="sm" variant="outline" className="mt-3">
                Try Again
              </Button>
            </div>
          ) : paginatedAlumni.length === 0 ? (
            <div className="py-20 text-center text-xs text-muted-foreground space-y-2">
              <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="font-medium text-foreground">No matching alumni found.</p>
              <p className="max-w-xs mx-auto">
                Try adjusting your search criteria or clear active department filters.
              </p>
              {(search || deptFilter !== "ALL" || mentorFilter !== "ALL") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setDeptFilter("ALL");
                    setMentorFilter("ALL");
                  }}
                  className="mt-2 text-xs"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-y border-border/60 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Alumnus</th>
                    <th className="py-3 px-4">Company & Designation</th>
                    <th className="py-3 px-4">Department & Class</th>
                    <th className="py-3 px-4">Qualification</th>
                    <th className="py-3 px-4">Mentoring Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedAlumni.map((alum) => (
                    <tr
                      key={alum._id}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedAlumnus(alum)}
                    >
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                              {getInitials(alum.alumniName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                              {alum.alumniName}
                              {alum.isAvailableForMentoring && (
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" title="Available for Mentoring" />
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground/70" />
                              <span className="truncate max-w-[180px]">{alum.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Company & Role */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-medium text-foreground flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span>{alum.companyName || "Independent"}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Briefcase className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                            <span>{alum.designation || "Professional"}</span>
                            {alum.yearsOfExperience > 0 && (
                              <span className="text-[10px] text-muted-foreground">
                                • {alum.yearsOfExperience} yrs exp
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Department & Year */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-medium text-foreground">{alum.department}</div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground/70" />
                            <span>Class of {alum.graduationYear}</span>
                          </div>
                        </div>
                      </td>

                      {/* Qualification */}
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className="text-[11px] font-normal py-0.5">
                          {alum.qualification || "MCA"}
                        </Badge>
                      </td>

                      {/* Mentorship Status & Domains */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {alum.isAvailableForMentoring ? (
                            <Badge
                              variant="success"
                              className="text-[10px] py-0 px-2 font-medium"
                            >
                              Available ({alum.maxMentees || 3} slots)
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="text-[10px] py-0 px-2 font-normal text-muted-foreground"
                            >
                              Not Mentoring
                            </Badge>
                          )}

                          {Array.isArray(alum.mentorshipDomains) && alum.mentorshipDomains.length > 0 && (
                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                              {alum.mentorshipDomains.slice(0, 2).map((dom, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-muted/80 text-muted-foreground px-1.5 py-0.5 rounded border border-border/50"
                                >
                                  {dom}
                                </span>
                              ))}
                              {alum.mentorshipDomains.length > 2 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{alum.mentorshipDomains.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAlumnus(alum)}
                          className="h-8 text-xs gap-1 hover:text-primary"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 bg-muted/20 text-xs text-muted-foreground">
              <span>
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalItems)} of {totalItems} alumni
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-7 px-2"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="px-2 text-foreground font-medium">
                  {currentPage} of {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-7 px-2"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alumnus Detail Modal Dialog */}
      {selectedAlumnus && (
        <Dialog open={Boolean(selectedAlumnus)} onOpenChange={() => setSelectedAlumnus(null)}>
          <DialogContent className="max-w-lg bg-card text-foreground">
            <DialogHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {getInitials(selectedAlumnus.alumniName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-base font-bold text-foreground">
                    {selectedAlumnus.alumniName}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Building2 className="h-3 w-3" />
                    <span>
                      {selectedAlumnus.designation || "Alumnus"} at{" "}
                      {selectedAlumnus.companyName || "Organization"}
                    </span>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {/* Contact & Academic Information */}
              <div className="grid grid-cols-2 gap-3 bg-muted/40 p-3 rounded-xl border border-border/60">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Email Address
                  </span>
                  <p className="font-medium text-foreground truncate mt-0.5">
                    {selectedAlumnus.email}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Phone / Mobile
                  </span>
                  <p className="font-medium text-foreground mt-0.5">
                    {selectedAlumnus.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Department
                  </span>
                  <p className="font-medium text-foreground mt-0.5">
                    {selectedAlumnus.department}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Graduation Year
                  </span>
                  <p className="font-medium text-foreground mt-0.5">
                    Class of {selectedAlumnus.graduationYear}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Degree / Qualification
                  </span>
                  <p className="font-medium text-foreground mt-0.5">
                    {selectedAlumnus.qualification || "MCA (Master of Computer Applications)"}
                  </p>
                </div>
              </div>

              {/* Mentorship Settings */}
              <div className="space-y-2 border border-border/60 rounded-xl p-3 bg-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    Mentorship Availability
                  </span>
                  {selectedAlumnus.isAvailableForMentoring ? (
                    <Badge variant="success" className="text-[10px]">
                      Active ({selectedAlumnus.maxMentees || 3} student capacity)
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">
                      Unavailable
                    </Badge>
                  )}
                </div>

                {Array.isArray(selectedAlumnus.mentorshipDomains) &&
                  selectedAlumnus.mentorshipDomains.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                        Primary Guidance Domains:
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {selectedAlumnus.mentorshipDomains.map((dom, idx) => (
                          <Badge key={idx} variant="outline" className="text-[11px] font-normal">
                            {dom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Bio */}
              {selectedAlumnus.bio && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Professional Biography
                  </span>
                  <p className="text-xs text-foreground/90 bg-muted/30 p-3 rounded-lg border border-border/50 leading-relaxed whitespace-pre-wrap">
                    {selectedAlumnus.bio}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
