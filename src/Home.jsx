import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calendar,
  Users,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  Compass,
  Briefcase,
  GraduationCap,
  Heart,
  ChevronRight,
  ShieldCheck,
  Clock,
  ExternalLink,
} from "lucide-react";
import { AuthContext } from "./contexts/AuthContext";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { Button } from "./components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import HeroParallax from "./components/HeroParallax";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { user, isStudent } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const reunionRef = useRef(null);
  const featuresRef = useRef(null);

  // Countdown Timer to Annual Alumni Gathering
  useEffect(() => {
    const targetDate = new Date("2026-12-15T10:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Entrance & Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-badge", { y: -20, opacity: 0, duration: 0.6 })
        .from(".hero-title", { y: 30, opacity: 0, duration: 0.8 }, "-=0.3")
        .from(".hero-text", { y: 20, opacity: 0, duration: 0.7 }, "-=0.4")
        .from(".hero-btn", { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 }, "-=0.4");

      // Stats Bar ScrollTrigger
      gsap.from(".stat-box", {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "power2.out",
      });

      // Annual Reunion Section
      gsap.from(reunionRef.current, {
        scrollTrigger: {
          trigger: reunionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Features Cards Stagger
      gsap.from(".feature-card-anim", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { number: "45,500+", label: "Verified Graduates", icon: Users },
    { number: "1,200+", label: "Active Mentors", icon: Briefcase },
    { number: "98.4%", label: "Satisfaction Rate", icon: Award },
    { number: "350+", label: "Events & Workshops", icon: Calendar },
  ];

  const features = [
    {
      title: "1-on-1 Mentorship Matching",
      description:
        "Intelligent matchmaking pairing students with experienced alumni based on technical domains, career ambitions, and skills.",
      icon: Compass,
      badge: "Flagship Feature",
      link: "/mentorship/explore",
    },
    {
      title: "Verified Alumni Directory",
      description:
        "Explore a searchable global network of graduates working across Fortune 500 tech companies, research labs, and startups.",
      icon: Users,
      badge: "Global Network",
      link: "/directory",
    },
    {
      title: "Campus Events & Meetups",
      description:
        "Register for hackathons, career workshops, and reunions. Attend in-person or virtual sessions hosted by alumni.",
      icon: Calendar,
      badge: "Community",
      link: "/events",
    },
    {
      title: "Student Growth & XP Engine",
      description:
        "Earn experience points, unlock achievement badges, and climb the leaderboard as you engage with mentors and complete sessions.",
      icon: Sparkles,
      badge: "Gamified",
      link: user ? "/student/mentorship-dashboard" : "/login",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors overflow-x-hidden">
      <Nav />

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden border-b border-border/50 py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column (Hero Content) */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
              {/* Pill */}
              <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3.5 py-1 text-xs text-muted-foreground shadow-xs backdrop-blur-md mb-6 w-fit">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-foreground">AlumniSphere 2.0</span>
                <span className="text-border">|</span>
                <span>Next-Gen Networking & Mentorship</span>
              </div>

              <h1 className="hero-title text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-foreground leading-[1.14]">
                Empowering graduates and students to{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent">
                  grow together.
                </span>
              </h1>

              <p className="hero-text mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Connect directly with industry alumni for personalized mentorship, career roadmaps,
                exclusive campus opportunities, and enduring professional relationships.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {user ? (
                  isStudent ? (
                    <Button asChild size="lg" className="hero-btn gap-2 bg-primary text-primary-foreground shadow-sm">
                      <Link to="/student/mentorship-dashboard">
                        <Sparkles className="h-4 w-4" />
                        Go to Student Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild size="lg" className="hero-btn gap-2 bg-primary text-primary-foreground shadow-sm">
                      <Link to="/personal">
                        <Briefcase className="h-4 w-4" />
                        Go to Alumni Dashboard
                      </Link>
                    </Button>
                  )
                ) : (
                  <>
                    <Button asChild size="lg" className="hero-btn gap-2 bg-primary text-primary-foreground shadow-sm">
                      <Link to="/register">
                        Join the Network
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="hero-btn">
                      <Link to="/mentorship/explore">Explore Mentors</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Social Proof Indicator */}
              <div className="hero-text mt-10 pt-6 border-t border-border/40 flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex -space-x-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-background bg-blue-600 text-white font-bold text-[11px]">RS</div>
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-background bg-indigo-600 text-white font-bold text-[11px]">AC</div>
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-background bg-purple-600 text-white font-bold text-[11px]">PN</div>
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-background bg-slate-700 text-slate-100 font-bold text-[11px]">+1k</div>
                </div>
                <div>
                  <div className="flex items-center text-amber-400 font-semibold text-xs">
                    {"★★★★★"} <span className="ml-1 text-foreground">4.9 / 5.0</span>
                  </div>
                  <p className="text-[11px]">Over 2,500+ successful student sessions</p>
                </div>
              </div>
            </div>

            {/* Right Column (Hero Parallax Showcase) */}
            <div className="lg:col-span-6 xl:col-span-7 relative w-full overflow-hidden">
              <HeroParallax />
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Bar */}
      <section ref={statsRef} className="border-b border-border/50 bg-muted/20 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="stat-box flex flex-col space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                    {stat.number}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Annual Gathering Countdown Banner */}
      <section className="py-12 lg:py-16 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={reunionRef}
            className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card/90 to-primary/5 p-8 sm:p-10 shadow-lg"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="accent" className="mb-3">
                  Annual Milestone
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Global Alumni Reunion & Scholarship Conclave
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Join alumni leaders, student achievers, and faculty for keynote sessions, awards,
                  and direct networking.
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    December 15, 2026
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                    10:00 AM IST
                  </span>
                </div>
              </div>

              {/* Countdown Numbers */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full sm:w-auto">
                  {[
                    { label: "Days", val: timeLeft.days },
                    { label: "Hours", val: timeLeft.hours },
                    { label: "Minutes", val: timeLeft.minutes },
                    { label: "Seconds", val: timeLeft.seconds },
                  ].map((unit, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-border/80 bg-background/80 shadow-xs min-w-[70px]"
                    >
                      <span className="text-xl sm:text-2xl font-mono font-bold text-foreground">
                        {String(unit.val).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase font-medium mt-0.5">
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Button asChild size="lg" className="w-full sm:w-auto shrink-0 bg-primary text-primary-foreground">
                  <Link to="/events">
                    Register Event
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section ref={featuresRef} className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Built for Modern Networking
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Everything students and alumni need to connect, mentor, and succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Card
                  key={idx}
                  className="feature-card-anim group hover:border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {feat.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{feat.title}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed mt-1">
                      {feat.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link
                      to={feat.link}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mt-2"
                    >
                      <span>Explore</span>
                      <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
