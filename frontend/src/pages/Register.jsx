import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  ArrowRight,
  Stethoscope,
  HeartPulse,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setForm({
      ...form,
      role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);

      await register(form);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3edff] flex items-center justify-center px-4 py-6">

  <div className="w-full max-w-5xl bg-white rounded-[28px] shadow-2xl overflow-hidden">

    <div className="grid md:grid-cols-[0.9fr_1.1fr]">

            {/* ================= LEFT SIDE ================= */}

            <div className="hidden md:flex bg-gradient-to-br from-purple-600 via-purple-600 to-fuchsia-500 p-8 text-white flex-col justify-between">

              <div>

                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1.5 text-xs font-medium mb-7">
                  <Sparkles size={14} />
                  Personalized skincare
                </div>

                <h2 className="text-3xl font-bold leading-tight">
                  Your skin.
                  <br />
                  Your journey.
                  <br />
                  Your plan.
                </h2>

                <p className="text-purple-100 text-sm leading-6 mt-5 max-w-xs">
                  Create your SkinIQ account and get personalized
                  skincare insights, routines, recommendations,
                  and progress tracking.
                </p>

              </div>

              {/* Mini feature cards */}

              <div className="space-y-3">

                <div className="bg-white/10 border border-white/15 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      AI Skin Analysis
                    </p>
                    <p className="text-xs text-purple-100">
                      Understand your skin better
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 border border-white/15 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                    <HeartPulse size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Personalized Routine
                    </p>
                    <p className="text-xs text-purple-100">
                      Recommendations made for you
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* ================= RIGHT SIDE ================= */}

            <div className="p-7 md:p-8">

              <div className="mb-5">

                <div className="flex items-center gap-2 text-purple-600 text-xs font-semibold uppercase tracking-wide">
                  <Sparkles size={15} />
                  Get started
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Create your account
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Start your personalized skincare journey.
                </p>

              </div>

              {/* ERROR */}

              {error && (
                <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* NAME + EMAIL */}

                <div className="grid sm:grid-cols-2 gap-4">

                  <div>

                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Full name
                    </label>

                    <div className="relative">

                      <User
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        name="full_name"
                        type="text"
                        placeholder="Your full name"
                        value={form.full_name}
                        onChange={handleChange}
                        required
                        className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none transition focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                      />

                    </div>

                  </div>

                  <div>

                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email address
                    </label>

                    <div className="relative">

                      <Mail
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none transition focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                      />

                    </div>

                  </div>

                </div>

                {/* PASSWORD */}

                <div className="mt-4">

                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      name="password"
                      type="password"
                      placeholder="Create a secure password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none transition focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                    />

                  </div>

                  <div className="flex items-center justify-between mt-1.5">

                    <p className="text-[11px] text-gray-400">
                      Use at least 8 characters
                    </p>

                    {form.password.length >= 8 && (
                      <span className="text-[11px] text-green-600 font-medium">
                        ✓ Strong enough
                      </span>
                    )}

                  </div>

                </div>

                {/* ACCOUNT TYPE */}

                <div className="mt-4">

                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Account type
                  </label>

                  <div className="grid grid-cols-3 gap-2">

                    {/* USER */}

                    <button
                      type="button"
                      onClick={() => handleRoleChange("user")}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        form.role === "user"
                          ? "border-purple-400 bg-purple-50 ring-2 ring-purple-100"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >

                      <User
                        size={17}
                        className={
                          form.role === "user"
                            ? "text-purple-600"
                            : "text-gray-400"
                        }
                      />

                      <p className="text-xs font-semibold mt-1">
                        User
                      </p>

                    </button>

                    {/* CONSULTANT */}

                    <button
                      type="button"
                      onClick={() =>
                        handleRoleChange("consultant")
                      }
                      className={`p-2.5 rounded-xl border text-left transition ${
                        form.role === "consultant"
                          ? "border-purple-400 bg-purple-50 ring-2 ring-purple-100"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >

                      <HeartPulse
                        size={17}
                        className={
                          form.role === "consultant"
                            ? "text-purple-600"
                            : "text-gray-400"
                        }
                      />

                      <p className="text-xs font-semibold mt-1">
                        Consultant
                      </p>

                    </button>

                    {/* DERMATOLOGIST */}

                    <button
                      type="button"
                      onClick={() =>
                        handleRoleChange("dermatologist")
                      }
                      className={`p-2.5 rounded-xl border text-left transition ${
                        form.role === "dermatologist"
                          ? "border-purple-400 bg-purple-50 ring-2 ring-purple-100"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >

                      <Stethoscope
                        size={17}
                        className={
                          form.role === "dermatologist"
                            ? "text-purple-600"
                            : "text-gray-400"
                        }
                      />

                      <p className="text-xs font-semibold mt-1">
                        Dermatologist
                      </p>

                    </button>

                  </div>

                </div>

                {/* CREATE ACCOUNT */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 text-white text-sm font-semibold shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >

                  {loading ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create account
                      <ArrowRight size={17} />
                    </>
                  )}

                </button>

              </form>

              {/* DIVIDER */}

              <div className="flex items-center gap-3 my-4">

                <div className="flex-1 h-px bg-gray-200" />

                <span className="text-[11px] text-gray-400">
                  OR
                </span>

                <div className="flex-1 h-px bg-gray-200" />

              </div>

              {/* GOOGLE */}

              <a
        
                href={`${import.meta.env.VITE_API_URL}/auth/google/login`}
                className="w-full h-10 flex items-center justify-center gap-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 18 18"
                >
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
                    d="M3.97 10.72c-.18-.54-.28-1.11-.28-1.72s.1-1.18.28-1.72V4.95H.96C.35 6.17 0 7.55.96 4.05l3.01 2.33z"
                  />

                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
                  />
                </svg>

                Continue with Google

              </a>

              <p className="text-[11px] text-gray-400 text-center mt-2">
                Google signup creates a standard User account.
              </p>

              {/* LOGIN */}

              <p className="text-sm text-center text-gray-500 mt-4">

                Already have an account?

                <Link
                  to="/login"
                  className="text-purple-600 font-semibold hover:text-purple-700 ml-1"
                >
                  Log in
                </Link>

              </p>

            </div>

          </div>

        </div>

        

      </div>

  
  );
}