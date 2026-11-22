import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  GraduationCap,
  Briefcase,
  Compass,
  Calendar,
  Heart,
  Users,
  Menu,
  X,
  User,
  LogOut,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Trophy,
} from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Nav() {
  const { user, logout, isStudent, isAlumni } = React.useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const displayName = user?.studentName || user?.alumniName || user?.name || "User";
  const displayEmail = user?.email || "";
  const roleLabel = isStudent ? "Student" : isAlumni ? "Alumni" : user?.role || "Member";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Directory", path: "/directory" },
    { name: "Mentorship", path: "/mentorship/explore", highlight: true },
    { name: "Events", path: "/events" },
    { name: "Community", path: "/community" },
    { name: "Donate", path: "/donate" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground flex items-center gap-1.5">
              Alumni<span className="text-indigo-600 dark:text-indigo-400">Sphere</span>
              <Badge variant="outline" className="hidden sm:inline-flex text-[10px] px-1.5 py-0 h-4 font-normal">
                Platform
              </Badge>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {link.name}
                {link.highlight && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Theme Toggle & User Account */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative flex items-center gap-2 px-2 py-1.5 h-auto rounded-full hover:bg-muted/80 border border-border/50"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start text-left pr-1">
                    <span className="text-xs font-semibold text-foreground line-clamp-1 max-w-[120px]">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      {roleLabel}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
                <DropdownMenuLabel className="font-normal p-3 pb-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-foreground">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{displayEmail}</p>
                    <div className="pt-1.5">
                      <Badge
                        variant={isStudent ? "success" : "accent"}
                        className="text-[10px] uppercase font-bold"
                      >
                        {roleLabel} Account
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {isStudent ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/student/mentorship-dashboard" className="flex items-center gap-2 cursor-pointer font-medium text-emerald-600 dark:text-emerald-400">
                          <Sparkles className="h-4 w-4" />
                          <span>Student Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/gamification" className="flex items-center gap-2 cursor-pointer font-medium text-amber-500">
                          <Trophy className="h-4 w-4" />
                          <span>Gamification & XP</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/student/profile" className="flex items-center gap-2 cursor-pointer">
                          <User className="h-4 w-4" />
                          <span>My Student Profile</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link to="/personal" className="flex items-center gap-2 cursor-pointer font-medium text-indigo-600 dark:text-indigo-400">
                        <Briefcase className="h-4 w-4" />
                        <span>Alumni Dashboard & Profile</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link to="/mentorship/requests" className="flex items-center gap-2 cursor-pointer">
                      <MessageSquare className="h-4 w-4" />
                      <span>Mentorship Pipeline</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/mentorship/explore" className="flex items-center gap-2 cursor-pointer">
                      <Compass className="h-4 w-4" />
                      <span>Discover Mentors</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Admin Console</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/60 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border/60">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 rounded-lg bg-muted/40">
                  <p className="text-xs text-muted-foreground">Signed in as</p>
                  <p className="text-sm font-semibold text-foreground">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{displayEmail}</p>
                </div>
                {isStudent ? (
                  <Link
                    to="/student/mentorship-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  >
                    Student Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/personal"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  >
                    Alumni Dashboard
                  </Link>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full mt-2"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild size="sm" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
