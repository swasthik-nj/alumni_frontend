import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import {
  BookOpen,
  Link as LinkIcon,
  FileText,
  Video,
  Github,
  Plus,
  X,
  ExternalLink,
  Trash2,
  Tag,
  User,
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

export default function SharedResourcesModal({
  requestId,
  request,
  partnerName,
  isOpen = true,
  onClose,
}) {
  const reqId = requestId || request?._id;
  const partner =
    partnerName ||
    request?.student?.studentName ||
    request?.alumni?.alumniName ||
    "Mentorship Partner";

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    resourceType: "LINK",
    urlOrContent: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  const fetchResources = async () => {
    if (!reqId) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/mentorship-resources/request/${reqId}`);
      if (res?.data?.data?.resources) {
        setResources(res.data.data.resources);
      }
    } catch (err) {
      console.error("Failed to load resources:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && reqId) {
      fetchResources();
    }
  }, [isOpen, reqId]);

  const handleAddTag = (e) => {
    if ((e.key === "Enter" || e.type === "click") && tagInput.trim()) {
      e.preventDefault();
      const val = tagInput.trim();
      if (!form.tags.includes(val)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, val] }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (t) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((item) => item !== t) }));
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.urlOrContent.trim()) {
      toast.error("Title and resource URL/content are required.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/api/v1/mentorship-resources", {
        mentorshipRequestId: reqId,
        title: form.title.trim(),
        description: form.description.trim(),
        resourceType: form.resourceType,
        urlOrContent: form.urlOrContent.trim(),
        tags: form.tags,
      });

      toast.success("Learning material shared successfully!");
      setForm({
        title: "",
        description: "",
        resourceType: "LINK",
        urlOrContent: "",
        tags: [],
      });
      setShowAddForm(false);
      fetchResources();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to share resource");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm("Remove this shared resource?")) {
      try {
        await api.delete(`/api/v1/mentorship-resources/${id}`);
        toast.success("Resource removed");
        fetchResources();
      } catch (err) {
        toast.error("Failed to delete resource");
      }
    }
  };

  const filteredResources =
    activeFilter === "ALL"
      ? resources
      : resources.filter((r) => r.resourceType === activeFilter);

  const getResourceIcon = (type) => {
    switch (type) {
      case "CODE_REPO":
        return <Github className="w-4 h-4 text-purple-500" />;
      case "VIDEO":
        return <Video className="w-4 h-4 text-rose-500" />;
      case "DOCUMENT":
        return <FileText className="w-4 h-4 text-amber-500" />;
      default:
        return <LinkIcon className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px]">
              Learning Repository
            </Badge>
          </div>
          <DialogTitle className="text-lg font-bold">
            Shared Resources with {partner}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Curate study roadmaps, GitHub repos, technical articles, and project templates.
          </DialogDescription>
        </DialogHeader>

        {/* Action button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {["ALL", "LINK", "DOCUMENT", "VIDEO", "CODE_REPO"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  activeFilter === type
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground"
          >
            <Plus className="w-3.5 h-3.5" />
            {showAddForm ? "Cancel" : "Share Resource"}
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddResource}
            className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3 animate-in fade-in-50 duration-200"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-foreground mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Distributed Systems & Kafka Architecture"
                  className="w-full rounded-lg border border-border bg-background py-1.5 px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-foreground mb-1">
                  Resource Format
                </label>
                <select
                  value={form.resourceType}
                  onChange={(e) => setForm({ ...form, resourceType: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background py-1.5 px-2 text-xs"
                >
                  <option value="LINK">Web Article / Docs</option>
                  <option value="DOCUMENT">PDF / Document</option>
                  <option value="VIDEO">Video Lecture / Talk</option>
                  <option value="CODE_REPO">GitHub Repository</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-foreground mb-1">
                Resource Link URL or Guide Text
              </label>
              <input
                type="text"
                required
                value={form.urlOrContent}
                onChange={(e) => setForm({ ...form, urlOrContent: e.target.value })}
                placeholder="https://github.com/... or https://aws.amazon.com/..."
                className="w-full rounded-lg border border-border bg-background py-1.5 px-3 text-xs"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[11px] font-medium text-foreground mb-1">
                Tags (Press Enter to add)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="e.g. Docker, System Design, Microservices"
                  className="flex-1 rounded-lg border border-border bg-background py-1.5 px-3 text-xs"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddTag} className="h-7 text-xs">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {form.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-[10px] gap-1">
                    {t}
                    <button type="button" onClick={() => handleRemoveTag(t)}>
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" disabled={submitting} className="bg-primary text-primary-foreground text-xs">
                {submitting ? "Sharing..." : "Post Learning Resource"}
              </Button>
            </div>
          </form>
        )}

        {/* Resources Feed */}
        <div className="space-y-3 pt-2">
          {loading ? (
            <div className="py-8 text-center text-muted-foreground text-xs">
              Loading shared materials...
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-xs border border-dashed rounded-xl">
              No learning resources shared under this filter. Click "Share Resource" to upload study materials!
            </div>
          ) : (
            filteredResources.map((item) => (
              <div
                key={item._id}
                className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted shrink-0">
                    {getResourceIcon(item.resourceType)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-sm">{item.title}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {item.resourceType}
                      </Badge>
                    </div>
                    {item.description && <p className="text-muted-foreground">{item.description}</p>}

                    {Array.isArray(item.tags) && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tags.map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px] py-0">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={item.urlOrContent.startsWith("http") ? item.urlOrContent : `https://${item.urlOrContent}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-muted text-primary transition-colors flex items-center gap-1 font-semibold"
                  >
                    Open <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDeleteResource(item._id)}
                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
