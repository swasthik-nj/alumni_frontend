import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Users,
  UserPlus,
  Upload,
  Search,
  Filter,
  Trash2,
  Edit,
  GraduationCap,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  RefreshCw,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../utils/api";
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

export default function AdminStudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Bulk import state
  const [bulkMode, setBulkMode] = useState("csv"); // "csv" | "json"
  const [jsonText, setJsonText] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [importSummary, setImportSummary] = useState(null);

  // Add student form
  const [newStudent, setNewStudent] = useState({
    studentName: "",
    email: "",
    registrationNumber: "",
    department: "Computer Science",
    graduationYear: new Date().getFullYear() + 2,
    currentSemester: 1,
    password: "ChangeMe@123",
    skills: "",
    areasOfInterest: "",
    careerGoals: "",
    bio: "",
  });

  const departmentsList = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical & Electronics",
    "Artificial Intelligence & Data Science",
    "Master of Computer Applications",
  ];

  const fetchStudents = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (department) params.append("department", department);
      if (graduationYear) params.append("graduationYear", graduationYear);
      params.append("page", page);
      params.append("limit", pagination.limit);

      const res = await api.get(`/api/v1/admin/students?${params.toString()}`);
      const data = res?.data?.data;
      if (data) {
        setStudents(data.students || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load student records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(1);
  }, [search, department, graduationYear]);

  // Handle Add Student
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newStudent,
        graduationYear: Number(newStudent.graduationYear),
        currentSemester: Number(newStudent.currentSemester),
        skills: newStudent.skills ? newStudent.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
        areasOfInterest: newStudent.areasOfInterest ? newStudent.areasOfInterest.split(",").map((a) => a.trim()).filter(Boolean) : [],
      };

      await api.post("/api/v1/admin/students", payload);
      toast.success("Student record created successfully!");
      setShowAddModal(false);
      setNewStudent({
        studentName: "",
        email: "",
        registrationNumber: "",
        department: "Computer Science",
        graduationYear: new Date().getFullYear() + 2,
        currentSemester: 1,
        password: "ChangeMe@123",
        skills: "",
        areasOfInterest: "",
        careerGoals: "",
        bio: "",
      });
      fetchStudents(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create student");
    }
  };

  // Handle Edit Student
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      await api.put(`/api/v1/admin/students/${selectedStudent._id}`, {
        studentName: selectedStudent.studentName,
        email: selectedStudent.email,
        registrationNumber: selectedStudent.registrationNumber,
        department: selectedStudent.department,
        graduationYear: Number(selectedStudent.graduationYear),
        currentSemester: Number(selectedStudent.currentSemester),
        isActive: selectedStudent.isActive,
      });
      toast.success("Student updated successfully!");
      setShowEditModal(false);
      fetchStudents(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update student");
    }
  };

  // Handle Delete Student
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete student "${name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/api/v1/admin/students/${id}`);
        toast.success("Student deleted successfully");
        fetchStudents(pagination.page);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete student");
      }
    }
  };

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(",");
      const cleanRow = row.map((val) => val.trim().replace(/^["']|["']$/g, ""));

      const record = {};
      headers.forEach((h, idx) => {
        record[h] = cleanRow[idx] !== undefined ? cleanRow[idx] : "";
      });
      records.push(record);
    }
    return records;
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setBulkLoading(true);
    setImportSummary(null);

    try {
      let records = [];

      if (bulkMode === "json") {
        try {
          const parsed = JSON.parse(jsonText);
          records = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          toast.error("Invalid JSON format. Please verify your JSON syntax.");
          setBulkLoading(false);
          return;
        }
      } else {
        if (!csvFile) {
          toast.error("Please select a CSV file first.");
          setBulkLoading(false);
          return;
        }
        const fileContent = await csvFile.text();
        records = parseCSV(fileContent);
      }

      if (records.length === 0) {
        toast.error("No valid records found in the uploaded file/payload.");
        setBulkLoading(false);
        return;
      }

      const res = await api.post("/api/v1/admin/students/bulk-import", { students: records });
      setImportSummary(res.data.data);
      toast.success(res.data.message || "Bulk import complete!");
      fetchStudents(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Bulk import failed");
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border/60 bg-card shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" /> Campus Directory Control
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Student Management & Verification Roster
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Search, filter, enroll new students, or perform batch roster imports via CSV / JSON.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => setShowBulkModal(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Upload className="w-4 h-4" /> Bulk Import
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="gap-2 bg-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4" /> Add Student
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search name, USN, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Departments</option>
                {departmentsList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                type="number"
                placeholder="Filter graduation year (e.g. 2026)"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Table Card */}
      <Card>
        <CardHeader className="py-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Registered Students</CardTitle>
            <span className="text-xs text-muted-foreground font-mono">
              Showing {students.length} of {pagination.total} students
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Student Name</th>
                  <th className="py-3 px-4 font-semibold">Reg. No. (USN)</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">Sem & Year</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary/20 border-t-primary"></div>
                      <p className="mt-2 text-xs">Loading student records...</p>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      No students found matching your search filters.
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s._id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-foreground">{s.studentName}</p>
                        <p className="text-[11px] text-muted-foreground">{s.email}</p>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-foreground">
                        {s.registrationNumber}
                      </td>
                      <td className="py-3 px-4">{s.department}</td>
                      <td className="py-3 px-4">
                        Sem {s.currentSemester || 1} • {s.graduationYear}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={s.isActive !== false ? "success" : "destructive"}
                          className="text-[10px]"
                        >
                          {s.isActive !== false ? "Enrolled" : "Suspended"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedStudent(s);
                              setShowEditModal(true);
                            }}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit Student"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(s._id, s.studentName)}
                            className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 text-xs text-muted-foreground">
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchStudents(pagination.page - 1)}
                  className="h-7 px-2.5 gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchStudents(pagination.page + 1)}
                  className="h-7 px-2.5 gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Student Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enroll New Student</DialogTitle>
            <DialogDescription>
              Add a single student profile to the verified alumni platform.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-medium mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={newStudent.studentName}
                onChange={(e) => setNewStudent({ ...newStudent, studentName: e.target.value })}
                className="w-full rounded-lg border border-border bg-background py-1.5 px-3 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background py-1.5 px-3 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">USN / Reg No.</label>
                <input
                  type="text"
                  required
                  value={newStudent.registrationNumber}
                  onChange={(e) => setNewStudent({ ...newStudent, registrationNumber: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background py-1.5 px-3 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Department</label>
                <select
                  value={newStudent.department}
                  onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background py-1.5 px-2 text-xs"
                >
                  {departmentsList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Graduation Year</label>
                <input
                  type="number"
                  required
                  value={newStudent.graduationYear}
                  onChange={(e) => setNewStudent({ ...newStudent, graduationYear: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background py-1.5 px-3 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Initial Password</label>
              <input
                type="text"
                required
                value={newStudent.password}
                onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                className="w-full rounded-lg border border-border bg-background py-1.5 px-3 text-xs"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                Save & Enroll
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Modal */}
      <Dialog open={showBulkModal} onOpenChange={setShowBulkModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Bulk Import Student Roster</DialogTitle>
            <DialogDescription>
              Upload a CSV file or paste JSON payload to register students in batch.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBulkSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 p-1 rounded-lg bg-muted border border-border/40">
              <button
                type="button"
                onClick={() => setBulkMode("csv")}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                  bulkMode === "csv" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
                }`}
              >
                CSV File Upload
              </button>
              <button
                type="button"
                onClick={() => setBulkMode("json")}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                  bulkMode === "json" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
                }`}
              >
                JSON Payload
              </button>
            </div>

            {bulkMode === "csv" ? (
              <div className="p-4 border-2 border-dashed border-border rounded-xl text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                <p className="text-[11px] text-muted-foreground mt-2">
                  Expected headers: <code>studentName, email, registrationNumber, department, graduationYear</code>
                </p>
              </div>
            ) : (
              <div>
                <textarea
                  rows={6}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder='[ { "studentName": "Alex", "email": "alex@nmamit.in", "registrationNumber": "4NM22MC005", "department": "Computer Science" } ]'
                  className="w-full rounded-lg border border-border bg-background p-3 text-xs font-mono"
                />
              </div>
            )}

            {importSummary && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
                Successfully processed: {importSummary.successCount || 0} enrolled, {importSummary.failedCount || 0} failed.
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowBulkModal(false)}>
                Close
              </Button>
              <Button type="submit" size="sm" disabled={bulkLoading} className="bg-primary text-primary-foreground">
                {bulkLoading ? "Importing..." : "Process Import"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
