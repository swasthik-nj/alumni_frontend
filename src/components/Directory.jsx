import React, { useState, useEffect } from "react";
import { Search, Filter, Mail, Phone, Briefcase, GraduationCap, Building2, Calendar, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";
import Nav from "./Nav";
import Footer from "./Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Directory() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical & Electronics",
    "Artificial Intelligence & Data Science",
    "Master of Computer Applications",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

  const fetchAlumni = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (department) params.append("department", department);
      if (graduationYear) params.append("graduationYear", graduationYear);
      params.append("page", page);
      params.append("limit", "12");

      const response = await api.get(`/api/v1/auth/alumni?${params.toString()}`);

      if (response.data.success) {
        setAlumni(response.data.data.alumni || []);
        if (response.data.data.pagination) {
          setPagination(response.data.data.pagination);
        }
      }
    } catch (error) {
      console.error("Error fetching alumni:", error);
      toast.error("Failed to fetch alumni directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni(1);
  }, [search, department, graduationYear]);

  const handleClearFilters = () => {
    setSearch("");
    setDepartment("");
    setGraduationYear("");
  };

  const getInitials = (name) => {
    if (!name) return "AL";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Nav />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 w-full">
        {/* Header */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <GraduationCap className="w-3.5 h-3.5" /> Verified Global Roster
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Alumni Directory
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Search and connect with thousands of graduates worldwide across industries and sectors.
            </p>
          </div>

          <Badge variant="outline" className="text-xs font-normal">
            {pagination.total || alumni.length} Verified Alumni
          </Badge>
        </div>

        {/* Search & Filter Toolbar */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, company, or designation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Department */}
              <div>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs text-foreground focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs text-foreground focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Graduation Years</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      Class of {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(search || department || graduationYear) && (
              <div className="flex justify-end pt-1">
                <Button size="sm" variant="ghost" onClick={handleClearFilters} className="text-xs h-7 text-muted-foreground">
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alumni Grid */}
        <div>
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div>
              <p className="text-muted-foreground text-xs mt-3">Loading directory records...</p>
            </div>
          ) : alumni.length === 0 ? (
            <Card className="p-12 text-center">
              <GraduationCap className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground text-base">No Alumni Found</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your search criteria or resetting filters.
              </p>
              <Button size="sm" variant="outline" onClick={handleClearFilters} className="mt-4">
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((item) => (
                <Card
                  key={item._id}
                  className="hover:border-border transition-all duration-200 hover:shadow-md flex flex-col justify-between"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-11 w-11">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {getInitials(item.alumniName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">
                          {item.alumniName}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.designation || "Professional"}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-medium truncate">
                          {item.companyName || "Tech Enterprise"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2 pt-0 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                      <GraduationCap className="w-3.5 h-3.5 text-primary" />
                      <span>{item.department || "Engineering"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Class of {item.graduationYear || "Grad"}</span>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 border-t border-border/40">
                    <Button asChild size="sm" variant="outline" className="w-full text-xs">
                      <a href={`mailto:${item.email}`}>
                        <Mail className="w-3.5 h-3.5 mr-1.5" /> Contact Alumni
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
