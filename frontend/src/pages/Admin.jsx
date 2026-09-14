import React, { useEffect, useMemo, useState } from 'react'
import client from '../api/client'

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [users, setUsers] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  const loadUsers = async () => {
    try {
      const res = await client.get('/admin/users')
      setUsers(res.data || [])
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const loadDashboard = async () => {
    try {
      setLoading(true)

      const [statsRes, analyticsRes, recommendationsRes, usersRes] =
        await Promise.all([
          client.get('/dashboard/admin'),
          client.get('/admin/analytics'),
          client.get('/admin/recommendations'),
          client.get('/admin/users'),
        ])

      setStats(statsRes.data)
      setAnalytics(analyticsRes.data)
      setRecommendations(recommendationsRes.data || [])
      setUsers(usersRes.data || [])
    } catch (error) {
      console.error('Failed to load admin dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  // ---------------------------------------
  // ACTIVATE / DEACTIVATE USER
  // ---------------------------------------
  const toggleActive = async (u) => {
    try {
      const action = u.is_active ? 'deactivate' : 'activate'

      await client.post(`/admin/users/${u.id}/${action}`)

      await loadUsers()
    } catch (error) {
      console.error('Failed to update user status:', error)
      alert('Unable to update user status.')
    }
  }

  // ---------------------------------------
  // DOWNLOAD EXCEL REPORT
  // ---------------------------------------
  const downloadReport = async () => {
    try {
      setDownloading(true)

      const res = await client.get('/admin/reports/excel', {
        responseType: 'blob',
      })

      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'platform_report.xlsx'

      document.body.appendChild(a)
      a.click()
      a.remove()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Report download failed:', error)
      alert('Unable to download the report.')
    } finally {
      setDownloading(false)
    }
  }

  // ---------------------------------------
  // ROLE COUNTS
  // ---------------------------------------
  const roleCounts = analytics?.role_counts || {}

  const totalRoleUsers = Object.values(roleCounts).reduce(
    (sum, value) => sum + Number(value || 0),
    0
  )

  // ---------------------------------------
  // TOP CONCERNS
  // ---------------------------------------
  const concerns = analytics?.top_concerns || []

  const maxConcernCount = Math.max(
    ...concerns.map((c) => Number(c.count || 0)),
    1
  )

  // ---------------------------------------
  // RECENT USERS
  // ---------------------------------------
  const recentUsers = useMemo(() => {
    return [...users].reverse().slice(0, 6)
  }, [users])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-white rounded-xl w-64"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-36 bg-white rounded-2xl"
                />
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-80 bg-white rounded-2xl"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
              Administration
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
              Admin Dashboard
            </h1>

            <p className="text-slate-500 mt-1">
              Monitor and manage your SkinIQ platform
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden sm:flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <span className="text-sm font-medium text-green-700">
                System Operational
              </span>
            </div>

            <button
              onClick={downloadReport}
              disabled={downloading}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-purple-200 transition"
            >
              <span className="text-lg">↓</span>

              {downloading
                ? 'Preparing Report...'
                : 'Download Report'}
            </button>
          </div>
        </div>

        {/* =====================================================
            STAT CARDS
        ====================================================== */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

            {/* TOTAL USERS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Users
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {stats.total_users ?? 0}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    Registered users on platform
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-xl">
                  👥
                </div>

              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-green-600">
                <span>↗</span>
                <span>
                  {users.filter((u) => u.is_active).length} active now
                </span>
              </div>

            </div>

            {/* TOTAL PROFILES */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Profiles
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {stats.total_profiles ?? 0}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    Skin profiles created
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
                  👤
                </div>

              </div>

              <div className="mt-4 text-xs font-semibold text-blue-600">
                ● Platform profiles
              </div>

            </div>

            {/* ASSESSMENTS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Assessments
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {stats.total_assessments ?? 0}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    Skin assessments completed
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-xl">
                  📄
                </div>

              </div>

              <div className="mt-4 text-xs font-semibold text-purple-600">
                ↗ Platform assessments
              </div>

            </div>

            {/* ROUTINES */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Routines
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {stats.total_routines ?? 0}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    Personalized routines generated
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 text-xl">
                  ✨
                </div>

              </div>

              <div className="mt-4 text-xs font-semibold text-pink-600">
                ↗ Generated routines
              </div>

            </div>

          </div>
        )}

        {/* =====================================================
            PLATFORM ANALYTICS
        ====================================================== */}

        <div className="flex items-center justify-between mb-4">

          <div>
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              Insights
            </p>

            <h2 className="text-2xl font-bold text-slate-900">
              Platform Analytics
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-xs font-semibold text-green-700">
              Live Data
            </span>
          </div>

        </div>

        <div className="grid lg:grid-cols-3 gap-5 mb-8">

          {/* SKIN HEALTH */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="flex justify-between items-start">

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Skin Health Overview
                </h3>

                <p className="text-sm text-slate-400">
                  Average platform score
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                📊
              </div>

            </div>

            <div className="mt-7">

              <div className="flex items-end gap-2">

                <span className="text-3xl font-bold text-slate-900">
                  {analytics?.average_skin_health_score ?? '—'}
                </span>

                <span className="text-sm text-slate-400 mb-1">
                  / 100
                </span>

              </div>

              <div className="h-3 bg-slate-100 rounded-full mt-4 overflow-hidden">

                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      Number(
                        analytics?.average_skin_health_score || 0
                      ),
                      100
                    )}%`,
                  }}
                />

              </div>

              <p className="text-sm text-slate-400 mt-4">
                Based on{' '}
                <span className="font-semibold text-slate-600">
                  {analytics?.users_with_progress_logs ?? 0}
                </span>{' '}
                users with progress logs
              </p>

            </div>

          </div>

          {/* USERS BY ROLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="flex justify-between items-start mb-6">

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Users by Role
                </h3>

                <p className="text-sm text-slate-400">
                  Distribution across roles
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                👤
              </div>

            </div>

            <div className="space-y-5">

              {Object.entries(roleCounts).map(
                ([role, count], index) => {

                  const percentage =
                    totalRoleUsers > 0
                      ? Math.round(
                          (Number(count) / totalRoleUsers) * 100
                        )
                      : 0

                  return (
                    <div key={role}>

                      <div className="flex justify-between mb-2">

                        <span className="text-sm font-medium text-slate-700 capitalize">
                          {role}
                        </span>

                        <span className="text-sm text-slate-500">
                          <b className="text-slate-800">
                            {count}
                          </b>{' '}
                          ({percentage}%)
                        </span>

                      </div>

                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className={`h-full rounded-full ${
                            index % 4 === 0
                              ? 'bg-purple-500'
                              : index % 4 === 1
                              ? 'bg-blue-500'
                              : index % 4 === 2
                              ? 'bg-fuchsia-500'
                              : 'bg-pink-500'
                          }`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  )
                }
              )}

            </div>

          </div>

          {/* TOP CONCERNS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="flex justify-between items-start mb-6">

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Top Skin Concerns
                </h3>

                <p className="text-sm text-slate-400">
                  Most common concerns
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                💜
              </div>

            </div>

            <div className="space-y-5">

              {concerns.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No concern data available.
                </p>
              ) : (
                concerns.slice(0, 5).map((c, index) => {

                  const percentage =
                    (Number(c.count || 0) / maxConcernCount) * 100

                  return (
                    <div key={c.concern}>

                      <div className="flex items-center gap-3">

                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>

                        <div className="flex-1">

                          <div className="flex justify-between">

                            <span className="text-sm font-medium text-slate-700 capitalize">
                              {c.concern.replace(/_/g, ' ')}
                            </span>

                            <span className="text-sm font-bold text-slate-800">
                              {c.count}
                            </span>

                          </div>

                          <div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">

                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />

                          </div>

                        </div>

                      </div>

                    </div>
                  )
                })
              )}

            </div>

          </div>

        </div>

        {/* =====================================================
            LOWER DASHBOARD
        ====================================================== */}

        <div className="grid lg:grid-cols-3 gap-5">

          {/* ===================================================
              USER MANAGEMENT
          ==================================================== */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-5 border-b border-slate-100 flex justify-between items-center">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  User Management
                </h2>

                <p className="text-sm text-slate-400">
                  Activate or deactivate accounts
                </p>
              </div>

              <span className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold">
                {users.length}
              </span>

            </div>

            <div className="max-h-[420px] overflow-y-auto">

              {users.length === 0 ? (
                <p className="p-5 text-sm text-slate-400">
                  No users found.
                </p>
              ) : (
                users.map((u) => (

                  <div
                    key={u.id}
                    className="p-4 border-b border-slate-100 hover:bg-slate-50 transition"
                  >

                    <div className="flex items-center justify-between gap-3">

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-10 h-10 shrink-0 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                          {(u.full_name || '?')
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-sm text-slate-800 truncate">
                            {u.full_name}
                          </p>

                          <p className="text-xs text-slate-400 truncate">
                            {u.email}
                          </p>

                        </div>

                      </div>

                      <button
                        onClick={() => toggleActive(u)}
                        className={`shrink-0 text-xs font-semibold px-3 py-2 rounded-lg transition ${
                          u.is_active
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {u.is_active
                          ? 'Deactivate'
                          : 'Activate'}
                      </button>

                    </div>

                    <div className="flex items-center justify-between mt-3 ml-13">

                      <span className="text-xs text-slate-500 capitalize">
                        {u.role}
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          u.is_active
                            ? 'text-green-600'
                            : 'text-red-500'
                        }`}
                      >
                        ● {u.is_active ? 'Active' : 'Inactive'}
                      </span>

                    </div>

                  </div>

                ))
              )}

            </div>

          </div>

          {/* ===================================================
              RECOMMENDATION MONITORING
          ==================================================== */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-5 border-b border-slate-100 flex justify-between items-center">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recommendation Monitoring
                </h2>

                <p className="text-sm text-slate-400">
                  Latest AI and expert recommendations
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                🤖
              </div>

            </div>

            <div className="max-h-[420px] overflow-y-auto">

              {recommendations.length === 0 ? (

                <div className="p-8 text-center">

                  <div className="text-3xl mb-3">
                    ✨
                  </div>

                  <p className="text-sm text-slate-400">
                    No recommendations issued yet.
                  </p>

                </div>

              ) : (

                recommendations.slice(0, 8).map((r) => (

                  <div
                    key={r.id}
                    className="p-5 border-b border-slate-100 hover:bg-slate-50 transition"
                  >

                    <div className="flex gap-3">

                      <div className="w-9 h-9 shrink-0 rounded-full bg-purple-50 flex items-center justify-center">
                        ✨
                      </div>

                      <div className="flex-1">

                        <p className="text-sm font-semibold text-slate-800">
                          {r.note}
                        </p>

                        <p className="text-xs text-slate-400 mt-2">
                          To{' '}
                          <span className="font-medium text-slate-600">
                            {r.client_name}
                          </span>
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          By {r.author_name} ({r.author_role})
                        </p>

                        <p className="text-xs text-slate-300 mt-1">
                          {new Date(
                            r.created_at
                          ).toLocaleDateString()}
                        </p>

                      </div>

                    </div>

                  </div>

                ))

              )}

            </div>

            {recommendations.length > 0 && (
              <div className="p-4 bg-slate-50 text-center">

                <span className="text-xs font-medium text-slate-500">
                  {recommendations.length} recommendations issued
                </span>

              </div>
            )}

          </div>

          {/* ===================================================
              RECENT USERS
          ==================================================== */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-5 border-b border-slate-100">

              <h2 className="text-lg font-bold text-slate-900">
                Recent Users
              </h2>

              <p className="text-sm text-slate-400">
                Latest registered users
              </p>

            </div>

            <div>

              {recentUsers.length === 0 ? (

                <p className="p-5 text-sm text-slate-400">
                  No users available.
                </p>

              ) : (

                recentUsers.map((u) => (

                  <div
                    key={u.id}
                    className="flex items-center gap-3 p-4 border-b border-slate-100"
                  >

                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                      {(u.full_name || '?')
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">

                      <p className="font-semibold text-sm text-slate-800 truncate">
                        {u.full_name}
                      </p>

                      <p className="text-xs text-slate-400 truncate">
                        {u.email}
                      </p>

                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        u.role === 'admin'
                          ? 'bg-pink-50 text-pink-600'
                          : u.role === 'dermatologist'
                          ? 'bg-blue-50 text-blue-600'
                          : u.role === 'consultant'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {u.role}
                    </span>

                  </div>

                ))

              )}

            </div>

            <div className="p-4 bg-slate-50 text-center">
              <span className="text-xs text-slate-500">
                {users.length} total registered users
              </span>
            </div>

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="mt-6 bg-gradient-to-r from-purple-600 to-violet-500 rounded-2xl p-5 text-white flex items-center justify-between">

          <div>
            <p className="font-bold">
              “Better Data. Brighter Skin.”
            </p>

            <p className="text-sm text-purple-100 mt-1">
              SkinIQ Platform Intelligence
            </p>
          </div>

          <div className="text-3xl">
            ✨
          </div>

        </div>

      </div>
    </div>
  )
}