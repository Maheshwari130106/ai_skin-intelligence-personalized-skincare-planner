import React, { useEffect, useState } from 'react'
import client from '../api/client'

const CONCERNS = [
  "acne",
  "hyperpigmentation",
  "dark_spots",
  "dry_skin",
  "oily_skin",
  "sensitive_skin",
  "wrinkles",
  "fine_lines",
  "redness",
  "uneven_skin_tone"
]

const concernIcons = {
  acne: "✨",
  hyperpigmentation: "🎨",
  dark_spots: "🔵",
  dry_skin: "💧",
  oily_skin: "💦",
  sensitive_skin: "🌸",
  wrinkles: "〰️",
  fine_lines: "〰",
  redness: "🌺",
  uneven_skin_tone: "☀️"
}

export default function SkinProfile() {
  const [form, setForm] = useState({
    skin_type: 'normal',
    age_group: '20s',
    skin_concerns: [],
    allergies: '',
    sensitivities: '',
    sleep_quality: 'average',
    sleep_hours: 7,
    water_intake_liters: 2,
    lifestyle_habits: '',
    environmental_exposure: 'moderate',
    profile_visibility: 'nobody',
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    client.get('/skin-profile/me').then((res) => {
      const p = res.data

      setForm({
        ...p,
        allergies: (p.allergies || []).join(', '),
        sensitivities: (p.sensitivities || []).join(', '),
        lifestyle_habits: (p.lifestyle_habits || []).join(', '),
        profile_visibility: p.profile_visibility || 'nobody',
      })
    }).catch(() => {})
  }, [])

  const toggleConcern = (c) => {
    setForm((f) => ({
      ...f,
      skin_concerns: f.skin_concerns.includes(c)
        ? f.skin_concerns.filter((x) => x !== c)
        : [...f.skin_concerns, c],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...form,
      allergies: form.allergies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),

      sensitivities: form.sensitivities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),

      lifestyle_habits: form.lifestyle_habits
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),

      sleep_hours: Number(form.sleep_hours),
      water_intake_liters: Number(form.water_intake_liters),
    }

    await client.post('/skin-profile', payload)

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-6 px-4">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl p-6 text-white shadow-lg mb-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">
                PERSONALIZED SKINCARE
              </p>

              <h1 className="text-3xl font-bold">
                Your Skin Profile
              </h1>

              <p className="text-purple-100 text-sm mt-2">
                Tell us about your skin so SkinIQ can personalize your skincare journey.
              </p>
            </div>

            <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/20 items-center justify-center text-3xl backdrop-blur-sm">
              ✨
            </div>

          </div>
        </div>


        <form onSubmit={handleSubmit} className="space-y-5">

          {/* BASIC INFORMATION */}
          <section className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5">

            <div className="flex items-center gap-3 mb-4">

              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                👤
              </div>

              <div>
                <h2 className="font-bold text-gray-800">
                  Basic Information
                </h2>

                <p className="text-xs text-gray-500">
                  Help us understand your skin type
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <Field label="Skin Type">

                <select
                  value={form.skin_type}
                  onChange={(e) =>
                    setForm({ ...form, skin_type: e.target.value })
                  }
                  className="input"
                >
                  {[
                    'oily',
                    'dry',
                    'combination',
                    'normal',
                    'sensitive'
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>

              </Field>


              <Field label="Age Group">

                <select
                  value={form.age_group}
                  onChange={(e) =>
                    setForm({ ...form, age_group: e.target.value })
                  }
                  className="input"
                >
                  {[
                    'teen',
                    '20s',
                    '30s',
                    '40s',
                    '50+'
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>

              </Field>

            </div>

          </section>


          {/* SKIN CONCERNS */}
          <section className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5">

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  🧴
                </div>

                <div>
                  <h2 className="font-bold text-gray-800">
                    Skin Concerns
                  </h2>

                  <p className="text-xs text-gray-500">
                    Select all concerns that apply to you
                  </p>
                </div>

              </div>

              {form.skin_concerns.length > 0 && (
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  {form.skin_concerns.length} selected
                </span>
              )}

            </div>


            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">

              {CONCERNS.map((c) => {

                const selected = form.skin_concerns.includes(c)

                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => toggleConcern(c)}
                    className={`
                      p-3 rounded-xl border text-left transition-all duration-200
                      ${
                        selected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-[1.02]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }
                    `}
                  >

                    <div className="text-lg mb-1">
                      {concernIcons[c]}
                    </div>

                    <div className="text-xs font-semibold capitalize">
                      {c.replaceAll('_', ' ')}
                    </div>

                  </button>
                )
              })}

            </div>

          </section>


          {/* ALLERGIES & SENSITIVITIES */}
          <section className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5">

            <div className="flex items-center gap-3 mb-4">

              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                🛡️
              </div>

              <div>
                <h2 className="font-bold text-gray-800">
                  Skin Safety
                </h2>

                <p className="text-xs text-gray-500">
                  Tell us what your skin reacts to
                </p>
              </div>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Field label="Allergies">

                <input
                  value={form.allergies}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      allergies: e.target.value
                    })
                  }
                  className="input"
                  placeholder="e.g. Retinoid, fragrance"
                />

              </Field>


              <Field label="Sensitivities">

                <input
                  value={form.sensitivities}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sensitivities: e.target.value
                    })
                  }
                  className="input"
                  placeholder="e.g. sensitive to fragrance"
                />

              </Field>

            </div>

          </section>


          {/* LIFESTYLE */}
          <section className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5">

            <div className="flex items-center gap-3 mb-4">

              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                🌿
              </div>

              <div>
                <h2 className="font-bold text-gray-800">
                  Lifestyle & Environment
                </h2>

                <p className="text-xs text-gray-500">
                  These factors can affect your skin health
                </p>
              </div>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

              <Field label="Sleep Quality">

                <select
                  value={form.sleep_quality}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sleep_quality: e.target.value
                    })
                  }
                  className="input"
                >
                  {['poor', 'average', 'good'].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>

              </Field>


              <Field label="Sleep Hours">

                <input
                  type="number"
                  step="0.5"
                  value={form.sleep_hours}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sleep_hours: e.target.value
                    })
                  }
                  className="input"
                  min="0"
                  max="24"
                />

              </Field>


              <Field label="Water / Day">

                <div className="relative">

                  <input
                    type="number"
                    step="0.1"
                    value={form.water_intake_liters}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        water_intake_liters: e.target.value
                      })
                    }
                    className="input pr-12"
                    min="0"
                  />

                  <span className="absolute right-3 top-2.5 text-xs text-gray-400">
                    L
                  </span>

                </div>

              </Field>


              <Field label="Environment">

                <select
                  value={form.environmental_exposure}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      environmental_exposure: e.target.value
                    })
                  }
                  className="input"
                >
                  {['low', 'moderate', 'high'].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>

              </Field>

            </div>


            <div className="mt-4">

              <Field label="Lifestyle Habits">

                <input
                  value={form.lifestyle_habits}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      lifestyle_habits: e.target.value
                    })
                  }
                  className="input"
                  placeholder="e.g. exercise, high-stress, smoking"
                />

              </Field>

            </div>
            {/* Profile Visibility */}
<div className="mt-6 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-5">

  <div className="flex items-start gap-3 mb-4">
    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
      🔐
    </div>

    <div>
      <h2 className="font-semibold text-gray-800">
        Profile Visibility
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Choose who can view your complete skin profile.
      </p>
    </div>
  </div>

  <div className="space-y-3">

    {/* Nobody */}
    <label
      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
        form.profile_visibility === 'nobody'
          ? 'border-purple-500 bg-purple-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-purple-300'
      }`}
    >
      <input
        type="radio"
        name="profile_visibility"
        value="nobody"
        checked={form.profile_visibility === 'nobody'}
        onChange={(e) =>
          setForm({
            ...form,
            profile_visibility: e.target.value
          })
        }
        className="accent-purple-600"
      />

      <div>
        <p className="font-medium text-gray-800">
          Keep my profile private
        </p>
        <p className="text-xs text-gray-500">
          Only you can view your complete profile.
        </p>
      </div>
    </label>

    {/* Dermatologist */}
    <label
      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
        form.profile_visibility === 'dermatologist'
          ? 'border-purple-500 bg-purple-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-purple-300'
      }`}
    >
      <input
        type="radio"
        name="profile_visibility"
        value="dermatologist"
        checked={form.profile_visibility === 'dermatologist'}
        onChange={(e) =>
          setForm({
            ...form,
            profile_visibility: e.target.value
          })
        }
        className="accent-purple-600"
      />

      <div>
        <p className="font-medium text-gray-800">
          Dermatologist
        </p>
        <p className="text-xs text-gray-500">
          Allow dermatologists to view your complete profile.
        </p>
      </div>
    </label>

    {/* Consultant */}
    <label
      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
        form.profile_visibility === 'consultant'
          ? 'border-purple-500 bg-purple-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-purple-300'
      }`}
    >
      <input
        type="radio"
        name="profile_visibility"
        value="consultant"
        checked={form.profile_visibility === 'consultant'}
        onChange={(e) =>
          setForm({
            ...form,
            profile_visibility: e.target.value
          })
        }
        className="accent-purple-600"
      />

      <div>
        <p className="font-medium text-gray-800">
          Skincare Consultant
        </p>
        <p className="text-xs text-gray-500">
          Allow skincare consultants to view your complete profile.
        </p>
      </div>
    </label>

    {/* Both */}
    <label
      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
        form.profile_visibility === 'both'
          ? 'border-purple-500 bg-purple-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-purple-300'
      }`}
    >
      <input
        type="radio"
        name="profile_visibility"
        value="both"
        checked={form.profile_visibility === 'both'}
        onChange={(e) =>
          setForm({
            ...form,
            profile_visibility: e.target.value
          })
        }
        className="accent-purple-600"
      />

      <div>
        <p className="font-medium text-gray-800">
          Dermatologist & Consultant
        </p>
        <p className="text-xs text-gray-500">
          Allow both professionals to view your complete profile.
        </p>
      </div>
    </label>

  </div>

  <div className="mt-4 flex items-center gap-2 text-xs text-purple-700 bg-purple-100/60 rounded-lg p-3">
    <span>🔒</span>
    <span>
      Your information is only shared with the professional type you select.
    </span>
  </div>

</div>

          </section>


          {/* SAVE AREA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-2xl border border-purple-100 shadow-sm p-4">

            <div>

              <p className="font-semibold text-gray-800 text-sm">
                Ready to personalize your skincare?
              </p>

              <p className="text-xs text-gray-500">
                Your information helps SkinIQ provide better recommendations.
              </p>

            </div>


            <button
              type="submit"
              className="
                w-full sm:w-auto
                px-8 py-3
                bg-gradient-to-r from-purple-600 to-purple-500
                hover:from-purple-700 hover:to-purple-600
                text-white font-semibold
                rounded-xl
                shadow-lg shadow-purple-200
                transition-all duration-200
                hover:-translate-y-0.5
              "
            >
              Save Skin Profile →
            </button>

          </div>


          {saved && (

            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm text-center font-medium">
              ✓ Your skin profile has been saved successfully!
            </div>

          )}

        </form>

      </div>

    </div>
  )
}


function Field({ label, children }) {
  return (
    <label className="block">

      <span className="text-xs font-semibold text-gray-700 mb-1.5 block">
        {label}
      </span>

      {children}

    </label>
  )
}