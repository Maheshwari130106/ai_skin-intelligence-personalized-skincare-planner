import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Camera,
  ArrowUpRight,
  User,
  Heart,
  ChevronRight,
} from "lucide-react";

export default function HeroBanner({ user, data }) {
  // Get the logged-in user's name
  const getUserName = () => {
    if (!user) return "there";

    // Try common user object formats
    if (user.name) return user.name;
    if (user.full_name) return user.full_name;
    if (user.fullName) return user.fullName;
    if (user.username) return user.username;

    // First name + last name
    if (user.first_name || user.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    }

    // Nested user object
    if (user.user) {
      if (user.user.name) return user.user.name;
      if (user.user.full_name) return user.user.full_name;
      if (user.user.fullName) return user.user.fullName;

      if (user.user.first_name || user.user.last_name) {
        return `${user.user.first_name || ""} ${
          user.user.last_name || ""
        }`.trim();
      }
    }

    return "there";
  };

  const userName = getUserName();

  // Get latest skin health score
  const score =
    data?.skin_health_score ??
    data?.latest_condition_score ??
    data?.latest_score ??
    data?.latest_score_value ??
    0;

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 p-8 md:p-10 mb-8 shadow-xl shadow-violet-200">

      {/* Decorative background circles */}
      <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-white/10" />

      <div className="absolute right-32 bottom-[-150px] h-96 w-96 rounded-full bg-white/10" />

      <div className="absolute left-[45%] bottom-[-100px] h-72 w-72 rounded-full bg-white/5" />

      <div className="relative z-10 grid lg:grid-cols-[1fr_420px] gap-8 items-center">

        {/* LEFT SIDE */}
        <div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white mb-6 backdrop-blur-sm">
            <Sparkles size={18} />
            AI Skin Intelligence
          </div>

          {/* Welcome */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
            Welcome back,
            <br />
            {userName} 👋
          </h1>

          <p className="mt-5 max-w-3xl text-base md:text-lg leading-8 text-white/90">
            Your personalized skincare assistant is ready. Check your latest
            skin insights, follow today's routine, and keep your skin healthy.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-wrap gap-3">

            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-violet-600 shadow-lg transition hover:bg-violet-50"
            >
              <Camera size={20} />
              New Skin Scan
              <ArrowUpRight size={18} />
            </Link>

            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <User size={20} />
              View Profile
            </Link>

          </div>
        </div>

        {/* RIGHT SIDE - SCORE */}
        <div className="relative">

          <div className="rounded-[28px] border border-white/20 bg-white/10 p-7 backdrop-blur-md shadow-lg">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-white/70">
                  Current skin health
                </p>

                <h2 className="mt-1 text-xl font-bold text-white">
                  Your overall score
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <Heart
                  size={28}
                  className="text-white"
                />
              </div>

            </div>

            {/* SCORE */}
            <div className="mt-7 flex items-end gap-2">

              <span className="text-6xl font-extrabold text-white">
                {score}
              </span>

              <span className="mb-2 text-xl text-white/60">
                /100
              </span>

            </div>

            {/* Progress bar */}
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/20">

              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{
                  width: `${Math.min(Math.max(Number(score) || 0, 0), 100)}%`,
                }}
              />

            </div>

            <div className="mt-3 flex justify-between text-sm text-white/70">
              <span>Needs attention</span>
              <span>Excellent</span>
            </div>

            {/* Detailed score */}
            <Link
              to="/scoring-engine"
              className="mt-6 flex items-center gap-2 font-semibold text-white hover:text-white/80"
            >
              View detailed score
              <ChevronRight size={18} />
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}