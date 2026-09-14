import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CalendarCheck,
  Bell,
  Settings,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Heart,
  Activity,
  RefreshCw,
  Sparkles,
  Clock,
  ChevronRight,
  Stethoscope,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import client from "../api/client";

export default function ProviderDashboard() {
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isDermatologist = user?.role === "dermatologist";

  const providerType = isDermatologist
    ? "Dermatologist"
    : "Skincare Consultant";

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await client.get("/dashboard/consultant");

      console.log("PROVIDER DASHBOARD API:", response.data);

      setData(response.data);
    } catch (error) {
      console.error("Failed to load provider dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const clients = data?.clients || [];

  // --------------------------------
  // DERIVED CLIENT STATISTICS
  // --------------------------------

  const stats = useMemo(() => {
    const total = clients.length;

    const attention = clients.filter(
      (item) => item.needs_attention
    ).length;

    const stable = clients.filter(
      (item) => !item.needs_attention
    ).length;

    const scoredClients = clients.filter(
      (item) => item.latest_score != null
    );

    const average =
      data?.average_score != null
        ? Number(data.average_score)
        : scoredClients.length
        ? Math.round(
            scoredClients.reduce(
              (sum, item) => sum + Number(item.latest_score),
              0
            ) / scoredClients.length
          )
        : null;

    const healthyPercentage =
      total > 0 ? Math.round((stable / total) * 100) : 0;

    return {
      total,
      attention,
      stable,
      average,
      healthyPercentage,
    };
  }, [clients, data]);

  // --------------------------------
  // SCORE LABEL
  // --------------------------------

  const getScoreLabel = (score) => {
    if (score == null) return "Not assessed";
    if (score >= 80) return "Excellent";
    if (score >= 65) return "Good";
    if (score >= 50) return "Moderate";
    return "Needs attention";
  };

  // --------------------------------
  // SCORE WIDTH
  // --------------------------------

  const getScoreWidth = (score) => {
    if (score == null) return 0;

    return Math.min(Math.max(Number(score), 0), 100);
  };

  // --------------------------------
  // USER NAME
  // --------------------------------

  const providerName =
    user?.full_name ||
    user?.name ||
    user?.username ||
    "Consultant";

  return (
    <div className="min-h-screen bg-[#f7f8fc] p-5 md:p-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-8">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700">
                <Sparkles size={14} />
                SkinIQ Provider Portal
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Welcome back, {providerName} 👋
            </h1>

            <p className="mt-2 text-slate-500">
              Monitor your clients, review skin health trends and manage
              consultations from one place.
            </p>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-600 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <div className="hidden sm:flex items-center gap-3 rounded-xl bg-violet-600 px-4 py-3 text-white shadow-lg shadow-violet-200">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                {isDermatologist ? (
                  <Stethoscope size={19} />
                ) : (
                  <Sparkles size={19} />
                )}
              </div>

              <div>
                <p className="text-xs text-violet-200">
                  Provider type
                </p>

                <p className="text-sm font-semibold">
                  {providerType}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        {/* CLIENTS */}

        <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                My Clients
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "..." : stats.total}
              </h2>

              <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                <TrendingUp size={14} />
                Active client base
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition group-hover:scale-110">
              <Users size={24} />
            </div>

          </div>

        </div>

        {/* AVERAGE HEALTH */}

        <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Average Skin Health
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {loading
                  ? "..."
                  : stats.average != null
                  ? `${stats.average}%`
                  : "N/A"}
              </h2>

              <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                <Activity size={14} />
                Across assessed clients
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition group-hover:scale-110">
              <Heart size={24} />
            </div>

          </div>

        </div>

        {/* NEEDS ATTENTION */}

        <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Needs Attention
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "..." : stats.attention}
              </h2>

              <p className="mt-2 text-xs text-amber-600 font-medium flex items-center gap-1">
                <AlertTriangle size={14} />
                Requires follow-up
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition group-hover:scale-110">
              <AlertTriangle size={24} />
            </div>

          </div>

        </div>

        {/* STABLE CLIENTS */}

        <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Stable Clients
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "..." : stats.stable}
              </h2>

              <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle size={14} />
                {stats.healthyPercentage}% of client base
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 transition group-hover:scale-110">
              <CheckCircle size={24} />
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">

        {/* =================================================
            CLIENT OVERVIEW
        ================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 p-6">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Client Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monitor client skin health and recent activity
              </p>
            </div>

            <Link
              to="/clients"
              className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-800"
            >
              View all clients
              <ArrowRight size={16} />
            </Link>

          </div>

          {loading ? (

            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading client information...
              </p>
            </div>

          ) : clients.length === 0 ? (

            <div className="flex flex-col items-center justify-center py-16 px-6">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <Users size={28} />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No clients yet
              </h3>

              <p className="mt-1 text-sm text-slate-500 text-center max-w-sm">
                Your assigned clients will appear here once they are connected
                to your provider account.
              </p>

              <Link
                to="/clients"
                className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
              >
                View Clients
              </Link>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[760px]">

                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Client
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Last Active
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Skin Health
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {clients.slice(0, 8).map((clientData, index) => {

                    const score = clientData.latest_score;

                    const initials =
                      clientData.name
                        ?.split(" ")
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "C";

                    return (

                      <tr
                        key={clientData.id}
                        className="border-b border-slate-50 transition hover:bg-violet-50/40"
                      >

                        {/* CLIENT */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
                              {initials}
                            </div>

                            <div className="min-w-0">

                              <p className="font-semibold text-slate-900">
                                {clientData.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500 truncate max-w-[220px]">
                                {clientData.email}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* LAST ACTIVE */}

                        <td className="px-4 py-5">

                          <div className="flex items-center gap-2 text-sm text-slate-600">

                            <Clock
                              size={15}
                              className="text-slate-400"
                            />

                            {clientData.last_active
                              ? new Date(
                                  clientData.last_active
                                ).toLocaleDateString()
                              : "No activity"}

                          </div>

                        </td>

                        {/* SCORE */}

                        <td className="px-4 py-5">

                          {score != null ? (

                            <div className="w-32">

                              <div className="flex items-center justify-between mb-1">

                                <span className="text-sm font-bold text-slate-900">
                                  {score}%
                                </span>

                                <span className="text-[10px] text-slate-400">
                                  {getScoreLabel(score)}
                                </span>

                              </div>

                              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

                                <div
                                  className="h-full rounded-full bg-violet-500 transition-all"
                                  style={{
                                    width: `${getScoreWidth(score)}%`,
                                  }}
                                />

                              </div>

                            </div>

                          ) : (

                            <span className="text-sm text-slate-400">
                              Not assessed
                            </span>

                          )}

                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-5">

                          {clientData.needs_attention ? (

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                              <AlertTriangle size={13} />
                              Needs Attention
                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                              <CheckCircle size={13} />
                              Stable
                            </span>

                          )}

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-5 text-right">

                          <Link
                            to={`/clients/${clientData.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-violet-600 transition hover:bg-violet-100"
                          >
                            View
                            <ChevronRight size={16} />
                          </Link>

                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================== */}

        <div className="space-y-6">

          {/* HEALTH SUMMARY */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Client Health
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current client distribution
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Activity size={20} />
              </div>

            </div>

            <div className="mt-6">

              <div className="flex items-end justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Stable clients
                  </p>

                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {loading ? "..." : `${stats.healthyPercentage}%`}
                  </p>
                </div>

                <CheckCircle
                  size={28}
                  className="text-emerald-500"
                />

              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                  style={{
                    width: `${stats.healthyPercentage}%`,
                  }}
                />

              </div>

              <div className="mt-4 flex justify-between text-xs">

                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Stable {stats.stable}
                </span>

                <span className="flex items-center gap-1.5 text-amber-600">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Attention {stats.attention}
                </span>

              </div>

            </div>

          </div>

          {/* AI INSIGHT */}

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 p-6 text-white shadow-lg shadow-violet-200">

            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />

            <div className="relative">

              <div className="flex items-center gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <Sparkles size={20} />
                </div>

                <div>
                  <p className="text-xs font-medium text-white/70">
                    SkinIQ Intelligence
                  </p>

                  <h3 className="font-bold">
                    AI Provider Insight
                  </h3>
                </div>

              </div>

              <p className="mt-5 text-sm leading-6 text-white/90">

                {stats.attention > 0
                  ? `${stats.attention} client${
                      stats.attention > 1 ? "s are" : " is"
                    } currently showing signs that may require follow-up. Review their latest skin assessment and progress.`
                  : stats.total > 0
                  ? "Your client portfolio is currently stable. Continue monitoring skin health scores and recent activity."
                  : "Once clients are assigned, SkinIQ insights will appear here based on their skin health data."}

              </p>

              {stats.attention > 0 && (

                <Link
                  to="/clients"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-violet-600 hover:bg-violet-50"
                >
                  Review clients
                  <ArrowRight size={16} />
                </Link>

              )}

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="text-xl font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Frequently used provider tools
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* CLIENTS */}

          <Link
            to="/clients"
            className="group rounded-xl border border-slate-200 p-5 transition hover:border-violet-300 hover:bg-violet-50"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Users size={22} />
              </div>

              <ArrowRight
                size={18}
                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-600"
              />

            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              View Clients
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Review client profiles and progress
            </p>

          </Link>

          {/* APPOINTMENTS */}

          <Link
            to="/consultant"
            className="group rounded-xl border border-slate-200 p-5 transition hover:border-violet-300 hover:bg-violet-50"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <CalendarCheck size={22} />
              </div>

              <ArrowRight
                size={18}
                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-600"
              />

            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Appointments
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Manage consultation requests
            </p>

          </Link>

          {/* NOTIFICATIONS */}

          <Link
            to="/notifications"
            className="group rounded-xl border border-slate-200 p-5 transition hover:border-violet-300 hover:bg-violet-50"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Bell size={22} />
              </div>

              <ArrowRight
                size={18}
                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-600"
              />

            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Notifications
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Check important client updates
            </p>

          </Link>

          {/* SETTINGS */}

          <Link
            to="/settings"
            className="group rounded-xl border border-slate-200 p-5 transition hover:border-violet-300 hover:bg-violet-50"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Settings size={22} />
              </div>

              <ArrowRight
                size={18}
                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-600"
              />

            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Settings
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Manage your provider profile
            </p>

          </Link>

        </div>

      </div>

      {/* =====================================================
          FOOTER INFORMATION
      ====================================================== */}

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Sparkles size={19} />
          </div>

          <div>

            <h3 className="font-semibold text-slate-900">
              {providerType} Portal
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Skin health scores and client trends are calculated using the
              SkinIQ scoring engine.
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-violet-700">
          <CheckCircle size={15} />
          AI-powered monitoring
        </div>

      </div>

    </div>
  );
}