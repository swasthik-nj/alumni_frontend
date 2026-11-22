import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, CheckCircle, Sparkles, Building, Briefcase, Calendar, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

gsap.registerPlugin(ScrollTrigger);

const row1Items = [
  {
    name: "Ramya Suresh",
    role: "Senior System Architect",
    company: "Amazon",
    domain: "Cloud & AWS",
    exp: "8 yrs exp",
    rating: "5.0",
    reviews: "32 reviews",
    badge: "Active Mentor",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    initials: "RS",
    avatarBg: "from-amber-500 to-orange-600",
  },
  {
    name: "Alex Chen",
    role: "Staff Software Engineer",
    company: "Google",
    domain: "Distributed Systems",
    exp: "10 yrs exp",
    rating: "5.0",
    reviews: "45 reviews",
    badge: "Alumni '16",
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    initials: "AC",
    avatarBg: "from-blue-500 to-indigo-600",
  },
  {
    name: "Priya Nair",
    role: "AI Research Lead",
    company: "Microsoft",
    domain: "PyTorch & LLMs",
    exp: "7 yrs exp",
    rating: "4.9",
    reviews: "28 reviews",
    badge: "Top Rated",
    badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    initials: "PN",
    avatarBg: "from-purple-500 to-pink-600",
  },
  {
    name: "David Kim",
    role: "DevOps & Platform Lead",
    company: "Netflix",
    domain: "Kubernetes & CI/CD",
    exp: "9 yrs exp",
    rating: "5.0",
    reviews: "19 reviews",
    badge: "Active Mentor",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    initials: "DK",
    avatarBg: "from-red-500 to-pink-600",
  },
  {
    name: "Campus Tech Hackathon '26",
    role: "Annual Flagship Innovation",
    company: "65 Teams • ₹2.5L Grants",
    domain: "Hackathon & Expo",
    exp: "Live Registrations",
    rating: "Featured",
    reviews: "Dec 2026",
    badge: "Upcoming Event",
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    initials: "TH",
    avatarBg: "from-yellow-500 to-amber-600",
    isEvent: true,
  },
];

const row2Items = [
  {
    name: "Sneha Rao",
    role: "Principal Product Designer",
    company: "Figma",
    domain: "UI/UX & Design Systems",
    exp: "6 yrs exp",
    rating: "4.9",
    reviews: "38 reviews",
    badge: "Design Mentor",
    badgeColor: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    initials: "SR",
    avatarBg: "from-pink-500 to-rose-600",
  },
  {
    name: "Vikram Malhotra",
    role: "VP of Engineering",
    company: "Stripe",
    domain: "Fintech & High Scalability",
    exp: "12 yrs exp",
    rating: "5.0",
    reviews: "52 reviews",
    badge: "Mentor Fellow",
    badgeColor: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    initials: "VM",
    avatarBg: "from-indigo-600 to-blue-700",
  },
  {
    name: "Ananya Patel",
    role: "Cyber Security Architect",
    company: "Cisco Systems",
    domain: "Zero Trust & AppSec",
    exp: "8 yrs exp",
    rating: "4.9",
    reviews: "22 reviews",
    badge: "Alumni '18",
    badgeColor: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    initials: "AP",
    avatarBg: "from-cyan-500 to-blue-600",
  },
  {
    name: "Marcus Vance",
    role: "Mobile Engineering Lead",
    company: "Uber",
    domain: "React Native & iOS",
    exp: "7 yrs exp",
    rating: "5.0",
    reviews: "17 reviews",
    badge: "Active Mentor",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    initials: "MV",
    avatarBg: "from-emerald-500 to-teal-700",
  },
  {
    name: "Endowment Scholarship",
    role: "Student Innovation Fund",
    company: "48 Scholars Funded",
    domain: "₹1,000,000 Target",
    exp: "Alumni Funded",
    rating: "Impact",
    reviews: "Active Campaign",
    badge: "Campus Grant",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    initials: "EF",
    avatarBg: "from-teal-500 to-emerald-600",
    isGrant: true,
  },
];

const row3Items = [
  {
    name: "Kavita Desai",
    role: "Senior Data Scientist",
    company: "Meta",
    domain: "Graph AI & RecSys",
    exp: "6 yrs exp",
    rating: "5.0",
    reviews: "29 reviews",
    badge: "Alumni '19",
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    initials: "KD",
    avatarBg: "from-sky-500 to-indigo-600",
  },
  {
    name: "Alumni Reunion Gala '26",
    role: "Annual Homecoming Dinner",
    company: "1,200+ Attending Graduates",
    domain: "Grand Ballroom Campus",
    exp: "Campus Reunion",
    rating: "Gathering",
    reviews: "Dec 15",
    badge: "Global Network",
    badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    initials: "RG",
    avatarBg: "from-purple-600 to-indigo-700",
    isEvent: true,
  },
  {
    name: "Rohan Sharma",
    role: "Engineering Director",
    company: "Adobe",
    domain: "Enterprise SaaS & Cloud",
    exp: "14 yrs exp",
    rating: "5.0",
    reviews: "60 reviews",
    badge: "Distinguished",
    badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    initials: "RS",
    avatarBg: "from-rose-500 to-red-600",
  },
  {
    name: "Zackary Morris",
    role: "Smart Contract Engineer",
    company: "Coinbase",
    domain: "Web3 & Protocol Security",
    exp: "5 yrs exp",
    rating: "4.8",
    reviews: "15 reviews",
    badge: "Active Mentor",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    initials: "ZM",
    avatarBg: "from-amber-600 to-orange-700",
  },
  {
    name: "Career Accelerator 2026",
    role: "Live Mock Interviews & Reviews",
    company: "Top Alumni Tech Panels",
    domain: "Placement Prep",
    exp: "Tier-1 SDE Ready",
    rating: "98.4%",
    reviews: "Success Rate",
    badge: "Workshop",
    badgeColor: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    initials: "CA",
    avatarBg: "from-violet-500 to-purple-600",
    isEvent: true,
  },
];

function ParallaxCard({ item }) {
  return (
    <Link
      to="/mentorship/explore"
      className="group relative flex w-[280px] sm:w-[320px] shrink-0 flex-col justify-between rounded-2xl border border-border/70 bg-card/90 p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-primary/50 hover:shadow-primary/10 hover:shadow-2xl"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.avatarBg} text-white font-bold text-sm shadow-md`}
          >
            {item.initials}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {item.name}
            </h4>
            <p className="truncate text-xs text-muted-foreground flex items-center gap-1">
              <Building className="h-3 w-3 shrink-0 text-muted-foreground/70" />
              <span>{item.company}</span>
            </p>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${item.badgeColor}`}
        >
          {item.badge}
        </span>
      </div>

      {/* Role / Description */}
      <p className="mt-3 text-xs text-foreground/85 line-clamp-1 font-medium">
        {item.role}
      </p>

      {/* Domain Tag */}
      <div className="mt-2.5 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[11px] font-normal text-muted-foreground border border-border/40">
          <Sparkles className="h-2.5 w-2.5 text-primary" />
          {item.domain}
        </span>
      </div>

      {/* Footer Metrics */}
      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 text-[11px] text-muted-foreground">
        <span>{item.exp}</span>
        <div className="flex items-center gap-1 font-medium text-foreground">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span>{item.rating}</span>
          <span className="text-[10px] text-muted-foreground font-normal">
            ({item.reviews})
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HeroParallax() {
  const containerRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const row3Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Line 1: Right to Left on scroll down (to go down right to left)
      gsap.fromTo(
        row1Ref.current,
        { x: 0 },
        {
          x: -260,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );

      // Line 2: Left to Right on scroll down (then next line left to right)
      gsap.fromTo(
        row2Ref.current,
        { x: -280 },
        {
          x: 40,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );

      // Line 3: Right to Left on scroll down
      if (row3Ref.current) {
        gsap.fromTo(
          row3Ref.current,
          { x: -40 },
          {
            x: -300,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Double items for seamless infinite horizontal width
  const row1List = [...row1Items, ...row1Items];
  const row2List = [...row2Items, ...row2Items];
  const row3List = [...row3Items, ...row3Items];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-4 select-none [perspective:1000px]"
    >
      {/* Subtle edge fade overlays for glassmorphism blending */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-background to-transparent z-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent z-20" />

      {/* 3D Tilted Wrapper */}
      <div
        className="flex flex-col gap-5 sm:gap-6 origin-top-left transition-transform duration-500"
        style={{
          transform: "rotateX(14deg) rotateZ(-6deg) skewX(4deg) translateY(-20px)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Line 1: Right to Left */}
        <div className="flex overflow-visible">
          <div ref={row1Ref} className="flex gap-4 sm:gap-5 will-change-transform">
            {row1List.map((item, idx) => (
              <ParallaxCard key={`r1-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Line 2: Left to Right */}
        <div className="flex overflow-visible">
          <div ref={row2Ref} className="flex gap-4 sm:gap-5 will-change-transform">
            {row2List.map((item, idx) => (
              <ParallaxCard key={`r2-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Line 3: Right to Left */}
        <div className="flex overflow-visible">
          <div ref={row3Ref} className="flex gap-4 sm:gap-5 will-change-transform">
            {row3List.map((item, idx) => (
              <ParallaxCard key={`r3-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
