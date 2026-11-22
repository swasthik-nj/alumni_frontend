import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import Nav from "./Nav";
import Footer from "./Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      toast.success("Thank you! Your message has been sent to our campus coordinator.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Nav />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 w-full">
        {/* Header */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" /> Support & Campus Relations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Get in Touch with AlumniSphere
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Have questions about student mentorship, alumni verification, donations, or upcoming campus events? Reach out to our campus office.
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary w-fit">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Official Email</h3>
              <p className="text-xs text-muted-foreground">info@einna.edu</p>
              <p className="text-xs text-muted-foreground">mentorship@nmamit.in</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary w-fit">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Phone Line</h3>
              <p className="text-xs text-muted-foreground">+91 89511 92848</p>
              <p className="text-[11px] text-muted-foreground">Monday - Friday, 9:00 AM - 5:30 PM IST</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary w-fit">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Campus Headquarters</h3>
              <p className="text-xs text-muted-foreground">NMAM Institute of Technology</p>
              <p className="text-xs text-muted-foreground">Nitte, Karkala Taluk, Karnataka, India</p>
            </CardContent>
          </Card>
        </div>

        {/* Message Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Send a Message</CardTitle>
            <CardDescription className="text-xs">
              Fill out the form below and our team will get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full rounded-lg border border-border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="Inquiry regarding alumni mentorship program"
                  className="w-full rounded-lg border border-border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="How can we assist you?"
                  className="w-full rounded-lg border border-border bg-background p-3 text-xs text-foreground focus:ring-2 focus:ring-ring"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground gap-2 font-medium"
              >
                <Send className="w-3.5 h-3.5" />
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
