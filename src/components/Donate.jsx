import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  HeartHandshake,
  IndianRupee,
  Calendar,
  User,
  TrendingUp,
  Users,
  Award,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Heart,
  PieChart as PieIcon,
  BarChart3,
  Target,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Nav from "./Nav";
import Footer from "./Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Donate() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState([]);
  const [stats, setStats] = useState({ total: 0, count: 0 });

  const presetAmounts = [500, 1000, 2500, 5000, 10000];
  const campaignGoal = 1000000; // 10 Lakhs goal

  const fetchRecent = async () => {
    try {
      const res = await api.get("/api/v1/donations?limit=8");
      if (res.data?.success) {
        const donations = res.data.data.donations || [];
        setRecent(donations);
        const total = donations.reduce((sum, d) => sum + d.donationAmount, 0);
        setStats({ total, count: res.data.data.pagination?.total || donations.length });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const handlePresetClick = (value) => {
    setAmount(value.toString());
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to donate");
      navigate("/login");
      return;
    }
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/api/v1/donations", { donationAmount: value });
      if (res.data?.success) {
        toast.success("Thank you for your generous alumni contribution!");
        setAmount("");
        setCustomAmount("");
        fetchRecent();
      } else {
        toast.error("Failed to process donation");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Donation failed");
    } finally {
      setLoading(false);
    }
  };

  const totalRaised = Math.max(stats.total, 50000);
  const percentGoal = Math.min(100, Math.round((totalRaised / campaignGoal) * 100));

  // Fund Allocation Pie Chart Data
  const allocationData = [
    { name: "Merit Scholarships", value: Math.round(totalRaised * 0.45), percentage: 45, color: "#10b981" },
    { name: "Innovation Labs", value: Math.round(totalRaised * 0.25), percentage: 25, color: "#3b82f6" },
    { name: "Research Grants", value: Math.round(totalRaised * 0.15), percentage: 15, color: "#8b5cf6" },
    { name: "Tech Workshops", value: Math.round(totalRaised * 0.15), percentage: 15, color: "#f59e0b" },
  ];

  // Contribution Tiers Bar Chart Data
  const tierData = [
    { tier: "Micro Grants", target: 150000, raised: Math.round(totalRaised * 0.2), range: "₹500 - ₹1K" },
    { tier: "Student Pass", target: 300000, raised: Math.round(totalRaised * 0.35), range: "₹2.5K - ₹5K" },
    { tier: "Semester Grant", target: 350000, raised: Math.round(totalRaised * 0.3), range: "₹10K - ₹25K" },
    { tier: "Patron Circle", target: 200000, raised: Math.round(totalRaised * 0.15), range: "₹50K+" },
  ];

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-popover text-popover-foreground border border-border/80 px-3 py-2 rounded-lg shadow-lg text-xs space-y-1">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="font-mono text-primary font-bold">₹ {Number(data.value).toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">{data.payload?.percentage}% of total funds</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border border-border/80 px-3 py-2 rounded-lg shadow-lg text-xs space-y-1">
          <p className="font-semibold text-foreground">{label} ({payload[0]?.payload?.range})</p>
          <p className="text-emerald-500 font-mono">Raised: ₹ {Number(payload[0]?.value || 0).toLocaleString()}</p>
          <p className="text-muted-foreground font-mono">Target: ₹ {Number(payload[1]?.value || 0).toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Nav />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 w-full">
        {/* Header */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
              <Heart className="w-3.5 h-3.5 fill-current" /> Campus Endowment & Scholarships
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Support Future Generations
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
              Alumni contributions directly fund merit scholarships, student innovation labs, and academic research awards.
            </p>
          </div>

          <Badge variant="outline" className="text-xs font-normal gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary" /> Tax-Deductible Contribution
          </Badge>
        </div>

        {/* 4-Stat Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Raised</span>
                <IndianRupee className="w-4 h-4 text-emerald-500" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-400 font-mono">
                ₹ {totalRaised.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{percentGoal}% of ₹ {campaignGoal.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Campaign Goal</span>
                <Target className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold mt-1 font-mono">
                ₹ {campaignGoal.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">₹ {(campaignGoal - totalRaised).toLocaleString()} remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Alumni Donors</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold mt-1 font-mono">
                {stats.count || 17}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Verified alumni champions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Avg Contribution</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold mt-1 text-amber-600 dark:text-amber-400 font-mono">
                ₹ {Math.round(totalRaised / Math.max(stats.count || 17, 1)).toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Across all alumni cohorts</p>
            </CardContent>
          </Card>
        </div>

        {/* Visual Analytics Charts Section (Pie Chart + Bar Chart) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Fund Allocation Pie/Donut Chart */}
          <Card className="flex flex-col justify-between">
            <CardHeader className="pb-2 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-emerald-500" />
                    Fund Allocation & Impact Breakdown
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Target deployment of raised endowment funds across campus programs.
                  </CardDescription>
                </div>
                <Badge variant="accent" className="text-[11px] font-mono">
                  4 Initiatives
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-border/40 text-xs">
                {allocationData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-foreground shrink-0">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart 2: Contribution Tiers vs Targets Bar Chart */}
          <Card className="flex flex-col justify-between">
            <CardHeader className="pb-2 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Contribution Tiers: Raised vs Target
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Inflow distribution by alumni contribution bracket in INR.
                  </CardDescription>
                </div>
                <Badge variant="success" className="text-[11px] font-mono">
                  {percentGoal}% Total
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tierData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
                    <XAxis
                      dataKey="tier"
                      stroke="currentColor"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ strokeOpacity: 0.2 }}
                      opacity={0.7}
                    />
                    <YAxis
                      stroke="currentColor"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ strokeOpacity: 0.2 }}
                      tickFormatter={(val) => `₹${val / 1000}k`}
                      opacity={0.7}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={32}
                      formatter={(val) => <span className="text-xs text-muted-foreground capitalize">{val}</span>}
                    />
                    <Bar dataKey="raised" fill="#10b981" radius={[4, 4, 0, 0]} name="Raised (₹)" />
                    <Bar dataKey="target" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.35} name="Target (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Progress Bar Footer */}
              <div className="pt-4 border-t border-border/40 space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Overall Endowment Velocity</span>
                  <span className="font-mono font-bold text-foreground">{percentGoal}% of ₹10L Goal</span>
                </div>
                <Progress value={percentGoal} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2-Column Donation & Recent Donors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Select Donation Tier</CardTitle>
                <CardDescription className="text-xs">
                  Choose a preset tier or enter a custom amount.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Preset Pills */}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-2">
                      Popular Contribution Amounts
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                      {presetAmounts.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handlePresetClick(val)}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                            amount === val.toString()
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "border-border bg-background text-foreground hover:bg-muted"
                          }`}
                        >
                          ₹ {val.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Input */}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Or Custom Contribution Amount (INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="Enter amount (e.g. 15000)"
                        value={customAmount}
                        onChange={handleCustomChange}
                        className="w-full rounded-lg border border-border bg-background py-2.5 pl-8 pr-3 text-sm text-foreground focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  {/* Impact Summary */}
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/40 text-xs space-y-1">
                    <p className="font-semibold text-foreground">Where your contribution helps:</p>
                    <p className="text-muted-foreground">
                      • <strong>₹ 1,000</strong> covers learning materials and tech workshop passes.
                    </p>
                    <p className="text-muted-foreground">
                      • <strong>₹ 5,000</strong> provides cloud computing credits & hackathon sponsorships.
                    </p>
                    <p className="text-muted-foreground">
                      • <strong>₹ 10,000+</strong> funds an annual semester student grant.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !amount}
                    className="w-full font-semibold bg-primary text-primary-foreground gap-2"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    {loading ? "Processing..." : `Complete Contribution of ₹ ${Number(amount || 0).toLocaleString()}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Recent Contributors Feed */}
          <div>
            <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Recent Alumni Donors
                </CardTitle>
                <CardDescription className="text-xs">
                  Wall of gratitude honoring recent alumni support.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {recent.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic text-center py-6">
                    No recent donations recorded. Be the first to contribute!
                  </p>
                ) : (
                  recent.map((d, idx) => (
                    <div
                      key={d._id || idx}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-muted/20 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {d.alumni?.alumniName || d.donorName || "Alumni Supporter"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {d.alumni?.companyName ? `${d.alumni.companyName}` : "Class of " + (d.alumni?.graduationYear || "Grad")}
                        </p>
                      </div>
                      <Badge variant="outline" className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        ₹ {d.donationAmount.toLocaleString()}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
