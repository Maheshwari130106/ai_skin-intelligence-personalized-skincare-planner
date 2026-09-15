import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import {
  Heart,
  Droplets,
  Flame,
  ScanFace,
  Camera,
  UserRound,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import client from "../api/client";
import { useAuth } from "../context/AuthContext";

import PremiumStatCard from "../components/dashboard/PremiumStatCard";
import AIInsights from "../components/Dashboard/AIInsights";
import RoutineCard from "../components/dashboard/RoutineCard";
import ProductCard from "../components/dashboard/ProductCard";
import ProgressChart from "../components/dashboard/ProgressChart";

export default function Dashboard() {
  // ============================================================
  // AUTH
  // ============================================================

  const { user } = useAuth();
  const navigate = useNavigate();

  // ============================================================
  // STATE
  // ============================================================

  const [data, setData] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // ============================================================
  // GET USER DISPLAY NAME
  // ============================================================

  const userName =
    user?.name ||
    user?.full_name ||
    user?.fullName ||
    user?.username ||
    user?.first_name ||
    user?.firstName ||
    "there";

  // ============================================================
  // LOAD DASHBOARD
  // ============================================================

  const loadDashboard = async () => {
    try {
      const response = await client.get("/dashboard/user");

      console.log("DASHBOARD API RESPONSE:", response.data);

      setData(response.data);
    } catch (error) {
      console.error("Dashboard API error:", error);
    }
  };

  // ============================================================
  // LOAD CHECKLIST
  // ============================================================

  const loadChecklist = async () => {
    try {
      const response = await client.get("/checklist/today");

      setChecklist(response.data);
    } catch (error) {
      console.error("Checklist error:", error);
    }
  };

  // ============================================================
  // LOAD RECOMMENDATIONS
  // ============================================================

  const loadRecommendations = async () => {
    try {
      const response = await client.get("/recommendations/me");

      setRecommendations(response.data || []);
    } catch (error) {
      console.error("Recommendations error:", error);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadDashboard();
    loadChecklist();
    loadRecommendations();
  }, []);

  // ============================================================
  // CHECKLIST TOGGLE
  // ============================================================

  const toggleItem = async (step_key) => {
    try {
      await client.post("/checklist/toggle", {
        step_key,
      });

      await loadChecklist();
    } catch (error) {
      console.error("Checklist toggle error:", error);
    }
  };

  // ============================================================
  // ROLE REDIRECT
  // ============================================================

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (
    user &&
    ["consultant", "dermatologist"].includes(user.role)
  ) {
    return <Navigate to="/clients" replace />;
  }

  // ============================================================
  // SKIN SCORE
  //
  // API can return:
  //
  // skin_health_score: null
  // latest_condition_score: 78
  //
  // Therefore latest_condition_score is used first.
  // ============================================================

  const rawScore =
    data?.latest_condition_score ??
    data?.skin_health_score ??
    data?.latest_score ??
    0;

  const skinScore = Number(rawScore) || 0;

  // Keep score between 0 and 100
  const safeScore = Math.min(
    Math.max(skinScore, 0),
    100
  );

  // ============================================================
  // SCORE STATUS
  // ============================================================

  const getScoreStatus = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs attention";
    return "Needs improvement";
  };

  const scoreStatus = getScoreStatus(safeScore);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* =====================================================
            HERO SECTION
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-violet-200 mb-8">

          {/* Background Decorations */}

          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10" />

          <div className="absolute -bottom-32 right-1/3 w-80 h-80 rounded-full bg-fuchsia-300/10" />

          <div className="absolute top-20 right-1/4 w-32 h-32 rounded-full bg-white/5" />

          <div className="relative z-10 grid lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-12 items-center">

            {/* =================================================
                LEFT SIDE
            ================================================== */}

            <div>

              {/* Badge */}

              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm mb-5">

                <Sparkles size={17} />

                AI Skin Intelligence

              </div>

              {/* Welcome */}

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">

                Welcome back,

                <br />

                <span className="text-white">
                  {userName}
                </span>

                <span className="ml-2">
                  👋
                </span>

              </h1>

              {/* Description */}

              <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/90 leading-7">

                Your personalized skincare assistant is ready.
                Check your latest skin insights, follow today's
                routine, and keep your skin healthy.

              </p>

              {/* Buttons */}

              <div className="flex flex-wrap gap-3 mt-7">

                <button
                  type="button"
                  onClick={() => navigate("/assessment")}
                  className="group inline-flex items-center gap-2 rounded-2xl bg-white text-violet-600 px-6 py-3.5 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >

                  <Camera size={19} />

                  New Skin Scan

                  <ArrowUpRight
                    size={18}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
                  />

                </button>

                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
                >

                  <UserRound size={19} />

                  View Profile

                </button>

              </div>

            </div>

            {/* =================================================
                OVERALL SCORE CARD
            ================================================== */}

            <div className="relative">

              <div className="rounded-[28px] border border-white/20 bg-white/10 backdrop-blur-xl p-6 sm:p-7 shadow-2xl">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm text-white/70">
                      Current skin health
                    </p>

                    <h2 className="text-xl sm:text-2xl font-bold mt-1">
                      Your overall score
                    </h2>

                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">

                    <Heart
                      size={25}
                      className="text-white"
                    />

                  </div>

                </div>

                {/* SCORE */}

                <div className="mt-6 flex items-end gap-2">

                  <span className="text-6xl sm:text-7xl font-extrabold leading-none">

                    {safeScore}

                  </span>

                  <span className="text-xl text-white/60 mb-2">
                    /100
                  </span>

                </div>

                {/* SCORE PROGRESS */}

                <div className="mt-5">

                  <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">

                    <div
                      className="h-full rounded-full bg-white transition-all duration-700"
                      style={{
                        width: `${safeScore}%`,
                      }}
                    />

                  </div>

                  <div className="flex justify-between text-xs text-white/70 mt-2">

                    <span>
                      Needs attention
                    </span>

                    <span>
                      Excellent
                    </span>

                  </div>

                </div>

                {/* STATUS */}

                <div className="mt-3 text-sm font-medium text-white/80">

                  {scoreStatus}

                </div>

                {/* DETAILS */}

                <button
                  type="button"
                  onClick={() => navigate("/scoring-engine")}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-white hover:text-white/80 transition"
                >

                  View detailed score

                  <ChevronRight size={16} />

                </button>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

          {/* SKIN HEALTH */}

          <PremiumStatCard
            title="Skin Health"
            value={`${safeScore}%`}
            subtitle={
              data?.latest_condition_score != null ||
              data?.skin_health_score != null
                ? "Latest AI assessment"
                : "Complete your skin assessment"
            }
            icon={<Heart size={27} />}
            color="bg-emerald-500"
          />

          {/* HYDRATION */}

          <PremiumStatCard
            title="Hydration"
            value="86%"
            subtitle="Well hydrated"
            icon={<Droplets size={27} />}
            color="bg-cyan-500"
          />

          {/* SKIN TYPE */}

          <PremiumStatCard
            title="Skin Type"
            value={
              data?.skin_type ||
              data?.profile?.skin_type ||
              "Combination"
            }
            subtitle="AI detected"
            icon={<ScanFace size={27} />}
            color="bg-violet-500"
          />

          {/* ROUTINE STREAK */}

          <PremiumStatCard
            title="Routine Streak"
            value={
              data?.routine_streak ??
              data?.streak ??
              12
            }
            subtitle="Days completed"
            icon={<Flame size={27} />}
            color="bg-orange-500"
          />

        </div>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}

        <div className="mb-8">

          <div className="flex items-center justify-between mb-4">

            <div>

              <p className="text-sm font-bold text-violet-600 uppercase tracking-wide">
                Quick Actions
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Take care of your skin
              </h2>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* NEW SKIN SCAN */}

            <button
              type="button"
              onClick={() => navigate("/assessment")}
              className="group text-left bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >

              <div className="flex items-center justify-between">

                <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">

                  <Camera size={23} />

                </div>

                <ArrowUpRight
                  size={20}
                  className="text-slate-300 group-hover:text-violet-600 transition"
                />

              </div>

              <h3 className="font-bold text-lg text-slate-900 mt-4">
                New Skin Scan
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Analyze your current skin condition with AI.
              </p>

            </button>

            {/* PROFILE */}

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="group text-left bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >

              <div className="flex items-center justify-between">

                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

                  <UserRound size={23} />

                </div>

                <ArrowUpRight
                  size={20}
                  className="text-slate-300 group-hover:text-blue-600 transition"
                />

              </div>

              <h3 className="font-bold text-lg text-slate-900 mt-4">
                Skin Profile
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Review and update your personal skin information.
              </p>

            </button>

            {/* SKIN SCORE */}

            <button
              type="button"
              onClick={() => navigate("/scoring-engine")}
              className="group text-left bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >

              <div className="flex items-center justify-between">

                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

                  <TrendingUp size={23} />

                </div>

                <ArrowUpRight
                  size={20}
                  className="text-slate-300 group-hover:text-emerald-600 transition"
                />

              </div>

              <h3 className="font-bold text-lg text-slate-900 mt-4">
                Skin Score
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Understand what is improving or needs attention.
              </p>

            </button>

          </div>

        </div>

        {/* =====================================================
            PROGRESS
        ====================================================== */}

        <div className="mb-8">

          <ProgressChart />

        </div>

        {/* =====================================================
            ROUTINE WARNING
        ====================================================== */}

        {data?.routine_needs_review && (

          <div className="mb-6 rounded-3xl border border-yellow-200 bg-yellow-50 p-5">

            <div className="flex gap-4">

              <div className="w-11 h-11 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-700 shrink-0">

                <ShieldCheck size={22} />

              </div>

              <div>

                <h3 className="font-bold text-yellow-800 mb-1">
                  Routine Review Recommended
                </h3>

                <p className="text-sm text-yellow-700">
                  Your skin health has changed recently.
                  We recommend updating your Skin Profile
                  and generating a new skincare routine.
                </p>

              </div>

            </div>

          </div>

        )}

        {/* =====================================================
            COMPLETE PROFILE
        ====================================================== */}

        {!data?.has_profile && (

          <div className="mb-6 rounded-3xl border border-violet-200 bg-violet-50 p-5">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>

                <h3 className="font-bold text-violet-800 mb-1">
                  Complete Your Skin Profile
                </h3>

                <p className="text-sm text-violet-700">
                  Create your profile to unlock personalized
                  skincare recommendations and AI analysis.
                </p>

              </div>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="shrink-0 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-700 transition"
              >
                Complete Profile
              </button>

            </div>

          </div>

        )}

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT */}

          <div className="lg:col-span-2 space-y-6">

            <AIInsights
              data={data}
            />

            <RoutineCard
              checklist={checklist}
              onToggle={toggleItem}
            />

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            <ProductCard
              products={data?.top_products || []}
            />

            {/* CARE TEAM */}

            {recommendations.length > 0 && (

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">

                <div className="flex items-center gap-3 mb-5">

                  <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">

                    <Heart size={20} />

                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Notes From Your Care Team
                    </h2>

                    <p className="text-sm text-slate-500">
                      Personalized guidance for you
                    </p>

                  </div>

                </div>

                <div className="space-y-4">

                  {recommendations.map((item) => (

                    <div
                      key={item.id}
                      className="rounded-2xl bg-slate-50 p-4"
                    >

                      <div className="flex gap-3">

                        <div className="w-1 rounded-full bg-violet-500 shrink-0" />

                        <div>

                          <p className="text-sm leading-6 text-slate-700">
                            {item.note}
                          </p>

                          <p className="text-xs text-slate-400 mt-2">
                            {item.author_name} ({item.author_role})
                          </p>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}