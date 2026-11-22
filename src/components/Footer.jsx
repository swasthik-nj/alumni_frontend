import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin, Heart, Github, Linkedin, Twitter, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/20 text-muted-foreground transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-foreground">
                Alumni<span className="text-indigo-600 dark:text-indigo-400">Sphere</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Bridging graduates and students through real-world mentorship, career guidance, and enduring campus community.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="text-[11px] font-normal gap-1.5 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Network Active
              </Badge>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/directory" className="hover:text-foreground transition-colors">
                  Alumni Directory
                </Link>
              </li>
              <li>
                <Link to="/mentorship/explore" className="hover:text-foreground transition-colors">
                  Find a Mentor
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-foreground transition-colors">
                  Campus Events
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-foreground transition-colors">
                  Community Feed
                </Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-foreground transition-colors">
                  Endowment & Giving
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/student/mentorship-dashboard" className="hover:text-foreground transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/personal" className="hover:text-foreground transition-colors">
                  Alumni Workspace
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-foreground transition-colors">
                  Admin Analytics
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Support & Helpdesk
                </Link>
              </li>
            </ul>
          </div>

          {/* Institution Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Campus Headquarters
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>NMAM Institute of Technology, Nitte</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <a href="mailto:info@einna.edu" className="hover:text-foreground transition-colors">
                  info@einna.edu
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>+91 89511 92848</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} AlumniSphere. All rights reserved.</p>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>by</span>
            <a
              href="https://swasthik-nj-portfolio.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground hover:underline ml-0.5"
            >
              Swasthik N J
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
