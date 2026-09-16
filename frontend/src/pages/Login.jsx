import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const loggedInUser = await login(email, password)

      console.log("Role:", loggedInUser.role)
      console.log(loggedInUser)

      switch (loggedInUser.role) {
        case "admin":
          navigate("/admin")
          break

        case "consultant":
        case "dermatologist":
          navigate("/provider-dashboard")
          break

        case "user":
        default:
          navigate("/dashboard")
          break
      }

    } catch (err) {
      setError(err.response?.data?.detail || "Login failed")
    }
  }

  return (
    <div className="min-h-screen bg-[#f3edff] flex items-center justify-center p-4 md:p-6">

      {/* Main Card */}
      <div className="w-full max-w-6xl h-[calc(100vh-48px)] max-h-[760px] min-h-[620px] bg-white rounded-[28px] shadow-2xl overflow-hidden flex">

        {/* ================= LEFT PANEL ================= */}
        <div className="hidden md:flex md:w-[45%] bg-gradient-to-br from-[#7135e8] via-[#8739e9] to-[#a03bea] text-white relative overflow-hidden p-8 lg:p-10 flex-col justify-between">

          {/* Decorative circles */}
          <div className="absolute -top-28 -right-28 w-72 h-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 -left-28 w-80 h-80 rounded-full bg-white/10" />
          <div className="absolute top-1/2 -right-20 w-44 h-44 rounded-full bg-white/5" />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-lg">
              ✧
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                SkinIQ
              </h2>
              <p className="text-sm text-purple-100">
                AI Skin Intelligence
              </p>
            </div>
          </div>

          {/* Main Text */}
          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/10 text-sm mb-5">
              ✨ AI-Powered Skincare
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold leading-[1.08] tracking-tight">
              Understand your skin.
              <br />
              Improve your routine.
            </h1>

            <p className="mt-5 text-base lg:text-lg text-purple-100 leading-relaxed max-w-lg">
              Get personalized skincare insights, routines, and progress
              tracking — all powered by intelligent skin analysis.
            </p>

            {/* Mini Skin Analysis Card */}
            <div className="mt-7 bg-white/15 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-100 uppercase tracking-wide">
                    AI Skin Analysis
                  </p>

                  <p className="font-semibold text-lg mt-1">
                    Your skin health
                  </p>
                </div>

                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                  86
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-2">
                  <span>Skin Health</span>
                  <span>Excellent</span>
                </div>

                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-[86%] bg-white rounded-full" />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-white/15 text-xs">
                  ✓ Clear
                </span>

                <span className="px-3 py-1 rounded-full bg-white/15 text-xs">
                  ✓ Hydrated
                </span>

                <span className="px-3 py-1 rounded-full bg-white/15 text-xs">
                  ✓ Healthy
                </span>
              </div>

            </div>
          </div>

          {/* Bottom text */}
          <p className="relative z-10 text-xs text-purple-100">
            ✦ Personalized skincare powered by AI
          </p>

        </div>


        {/* ================= RIGHT PANEL ================= */}
        <div className="w-full md:w-[55%] flex items-center justify-center bg-white">

          <div className="w-full max-w-lg px-8 py-7 lg:px-12 lg:py-8">

            {/* Mobile Logo */}
            <div className="flex md:hidden items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xl">
                ✧
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  SkinIQ
                </h2>

                <p className="text-xs text-gray-500">
                  AI Skin Intelligence
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6">

              <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">
                Welcome back
              </p>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Welcome back 👋
              </h1>

              <p className="text-gray-500 mt-2">
                Sign in to continue your personalized skincare journey.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Email address
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    ✉
                  </span>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-11 pr-4 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm font-medium text-purple-600 hover:text-purple-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🔒
                  </span>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 pl-11 pr-4 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                    required
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold text-base shadow-lg shadow-purple-200 hover:shadow-xl transition-all duration-200"
              >
                Sign in →
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">
                OR CONTINUE WITH
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            <a
             
              href={`${import.meta.env.VITE_API_URL}/auth/google/login`}
              className="w-full h-14 flex items-center justify-center gap-3 border border-gray-200 rounded-xl text-gray-800 font-medium hover:bg-gray-50 hover:border-gray-300 transition"
            >
              <svg width="20" height="20" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
                />

                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33C2.44 15.98 5.48 18 9 18z"
                />

                <path
                  fill="#FBBC05"
                  d="M3.97 10.72c-.18-.54-.28-1.11-.28-1.72s.1-1.18.28-1.72V4.95H.96C.35 6.17 0 7.55 0 9s.35 2.83.96 4.05l3.01-2.33z"
                />

                <path
                  fill="#EA4335"
                  d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
                />
              </svg>

              Continue with Google
            </a>

            {/* Register */}
            <p className="text-sm text-gray-500 text-center mt-6">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-purple-600 hover:text-purple-700"
              >
                Create an account
              </Link>
            </p>

            {/* Security */}
            <p className="text-xs text-gray-400 text-center mt-5">
              🔒 Your information is securely protected
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}