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
} from "lucide-react";
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

  const percentGoal = Math.min(100, Math.round((stats.total / campaignGoal) * 100));

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

        {/* Campaign Goal Progress */}
        <Card className="border-border/60">
          <CardContent className="p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  Annual Scholarship Endowment Campaign
                </span>
                <h3 className="text-2xl font-extrabold text-foreground mt-0.5">
                  ₹ {stats.total.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">raised of ₹ {campaignGoal.toLocaleString()} goal</span>
                </h3>
              </div>
              <Badge variant="success" className="text-xs font-mono font-semibold self-start sm:self-center">
                {percentGoal}% Goal Reached
              </Badge>
            </div>
            <Progress value={percentGoal} className="h-2.5" />
            <p className="text-[11px] text-muted-foreground">
              Supported by {stats.count} alumni champions. Every rupee goes directly into verified student scholarship grants.
            </p>
          </CardContent>
        </Card>

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
