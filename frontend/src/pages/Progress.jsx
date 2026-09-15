import React, { useEffect, useMemo, useState } from 'react'
import client from '../api/client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js'

import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
)

export default function Progress() {
  const [history, setHistory] = useState([])
  const [photos, setPhotos] = useState([])

  const [form, setForm] = useState({
    routine_followed_morning: false,
    routine_followed_evening: false,
    skin_condition_note: '',
  })

  const [uploadingBefore, setUploadingBefore] = useState(false)
  const [uploadingCurrent, setUploadingCurrent] = useState(false)
  const [savingLog, setSavingLog] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // =========================================================
  // LOAD DATA
  // =========================================================

  const load = async () => {
    try {
      setError('')

      const [historyRes, photosRes] = await Promise.all([
        client.get('/progress/history'),
        client.get('/progress/photos'),
      ])

      setHistory(historyRes.data || [])
      setPhotos(photosRes.data || [])
    } catch (err) {
      console.error('Progress loading error:', err)

      setError(
        err.response?.data?.detail ||
        'Failed to load progress data.'
      )
    }
  }

  useEffect(() => {
    load()
  }, [])

  // =========================================================
  // DOWNLOAD WEEKLY / MONTHLY PDF
  // =========================================================

  const downloadReport = async (type) => {
    try {
      setError('')
      setSuccess('')

      const response = await client.get(
        `/reports/${type}/pdf`,
        {
          responseType: 'blob',
        }
      )

      const blob = new Blob(
        [response.data],
        {
          type: 'application/pdf',
        }
      )

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')

      link.href = url

      link.download =
        type === 'weekly'
          ? 'skiniq_weekly_skin_health_report.pdf'
          : 'skiniq_monthly_skin_health_report.pdf'

      document.body.appendChild(link)

      link.click()

      link.remove()

      window.URL.revokeObjectURL(url)

      setSuccess(
        `${type === 'weekly' ? 'Weekly' : 'Monthly'} professional report downloaded successfully.`
      )
    } catch (err) {
      console.error(
        'Report download error:',
        err
      )

      setError(
        err.response?.data?.detail ||
        'Failed to download the report.'
      )
    }
  }

  // =========================================================
  // PHOTO ARRAYS
  // =========================================================

  const beforePhotos = useMemo(
    () =>
      photos
        .filter(
          (photo) =>
            photo.photo_type === 'before'
        )
        .sort(
          (a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at)
        ),
    [photos]
  )

  const currentPhotos = useMemo(
    () =>
      photos
        .filter(
          (photo) =>
            photo.photo_type === 'current'
        )
        .sort(
          (a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at)
        ),
    [photos]
  )

  const beforePhoto = beforePhotos[0]
  const currentPhoto = currentPhotos[0]

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (photoUrl) => {
    if (!photoUrl) {
      return ''
    }

    if (photoUrl.startsWith('http')) {
      return photoUrl
    }

    const apiBase =
      client.defaults.baseURL || ''

    const serverBase =
      apiBase.replace(/\/api\/?$/, '')

    return `${serverBase}${photoUrl}`
  }

  // =========================================================
  // PHOTO UPLOAD
  // =========================================================

  const uploadPhoto = async (file, type) => {
    if (!file) {
      return
    }

    setError('')
    setSuccess('')

    if (!file.type.startsWith('image/')) {
      setError(
        'Please select a JPG, PNG or WEBP image.'
      )
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        'Image size must be less than 5 MB.'
      )
      return
    }

    const formData = new FormData()

    formData.append(
      'file',
      file
    )

    try {
      if (type === 'before') {
        setUploadingBefore(true)
      } else {
        setUploadingCurrent(true)
      }

      const response = await client.post(
        `/progress/photos?photo_type=${type}`,
        formData
      )

      console.log(
        'AI photo analysis:',
        response.data
      )

      await load()

      setSuccess(
        `${type === 'before' ? 'Before' : 'Current'} photo analyzed successfully.`
      )
    } catch (err) {
      console.error(
        'Photo upload error:',
        err
      )

      setError(
        err.response?.data?.detail ||
        `Failed to analyze ${type} photo.`
      )
    } finally {
      setUploadingBefore(false)
      setUploadingCurrent(false)
    }
  }

  const handlePhotoSelect = (
    event,
    type
  ) => {
    const file =
      event.target.files?.[0]

    if (file) {
      uploadPhoto(
        file,
        type
      )
    }

    event.target.value = ''
  }

  // =========================================================
  // SCORES
  // =========================================================

  const beforeScore =
    beforePhoto?.skin_health_score != null
      ? Number(
          beforePhoto.skin_health_score
        )
      : null

  const currentScore =
    currentPhoto?.skin_health_score != null
      ? Number(
          currentPhoto.skin_health_score
        )
      : null

  const latestHistoryScore =
    history.length > 0 &&
    history[0]?.skin_health_score != null
      ? Number(
          history[0].skin_health_score
        )
      : null

  const overviewScore =
    currentScore ??
    latestHistoryScore ??
    null

  const photoImprovement =
    beforeScore != null &&
    currentScore != null
      ? currentScore - beforeScore
      : null

  const previousHistoryScore =
    history.length > 1 &&
    history[1]?.skin_health_score != null
      ? Number(
          history[1].skin_health_score
        )
      : null

  const scoreChange =
    overviewScore != null &&
    previousHistoryScore != null
      ? overviewScore -
        previousHistoryScore
      : photoImprovement

  // =========================================================
  // ROUTINE ADHERENCE
  // =========================================================

  const routineLogs =
    history.filter(
      (item) =>
        item.routine_followed_morning ||
        item.routine_followed_evening
    )

  const routineAdherence =
    history.length > 0
      ? Math.round(
          (
            routineLogs.length /
            history.length
          ) * 100
        )
      : 0

  // =========================================================
// CHRONOLOGICAL HISTORY
// =========================================================

// Keep the original history for Progress History.
// Sort newest first.
const sortedHistory = [...history].sort((a, b) => {
  const dateA = new Date(
    a.log_date || a.created_at || 0
  )

  const dateB = new Date(
    b.log_date || b.created_at || 0
  )

  return dateB - dateA
})

// Only records that actually contain a skin-health score
// are used in the trend chart.
const scoredHistory = sortedHistory.filter(
  (item) =>
    item.skin_health_score !== null &&
    item.skin_health_score !== undefined &&
    !Number.isNaN(Number(item.skin_health_score))
)

// Chart needs oldest → newest
const chronological = [...scoredHistory].reverse()

  // =========================================================
  // CHART DATA
  // =========================================================

  const chartData = {
  labels: chronological.map((item) =>
    new Date(
      item.log_date || item.created_at
    ).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })
  ),

  datasets: [
    {
      label: 'Skin Health Score',

      data: chronological.map((item) =>
        Number(item.skin_health_score)
      ),

      borderColor: '#7c3aed',

      backgroundColor:
        'rgba(124, 58, 237, 0.10)',

      fill: true,

      tension: 0.3,

      pointRadius: 5,

      pointHoverRadius: 7,

      pointBorderWidth: 2,

      pointBackgroundColor: '#ffffff',

      pointBorderColor: '#7c3aed',
    },
  ],
}

  const chartOptions = {
  responsive: true,

  maintainAspectRatio: false,

  interaction: {
    mode: 'index',
    intersect: false,
  },

  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      callbacks: {
        title: (items) => {
          if (!items.length) return ''

          return items[0].label
        },

        label: (context) => {
          const value = context.raw

          return value != null
            ? ` Skin Health Score: ${Number(value).toFixed(1)}/100`
            : ''
        },
      },
    },
  },

  scales: {
    x: {
      ticks: {
        autoSkip: false,
        maxRotation: 0,
      },
    },

    y: {
      min: 0,
      max: 100,

      title: {
        display: true,
        text: 'Score',
      },

      ticks: {
        stepSize: 10,
      },
    },
  },
}

  // =========================================================
  // AI INSIGHT
  // =========================================================

  let progressInsight =
    'Keep recording your progress to receive personalized skin-health insights.'

  if (photoImprovement !== null) {
    if (photoImprovement > 5) {
      progressInsight =
        'Your AI skin-health score has improved significantly between the Before and Current photos. Continue following your skincare routine consistently.'
    } else if (photoImprovement > 0) {
      progressInsight =
        'Your AI skin-health score shows improvement. Continue your skincare routine and keep tracking your progress.'
    } else if (photoImprovement < 0) {
      progressInsight =
        'Your Current photo has a lower AI skin-health score than your Before photo. Continue monitoring your routine and skin changes.'
    } else {
      progressInsight =
        'Your AI skin-health score is currently stable. Continue your routine and keep tracking your progress.'
    }
  }

  // =========================================================
  // DAILY PROGRESS
  // =========================================================

  const submit = async (event) => {
    event.preventDefault()

    if (savingLog) {
      return
    }

    setError('')
    setSuccess('')

    try {
      setSavingLog(true)

      await client.post(
        '/progress/log',
        form
      )

      setForm({
        routine_followed_morning: false,
        routine_followed_evening: false,
        skin_condition_note: '',
      })

      await load()

      setSuccess(
        "Today's progress was saved successfully."
      )
    } catch (err) {
      console.error(
        'Progress log error:',
        err
      )

      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to save progress log. Please try again.'
      )
    } finally {
      setSavingLog(false)
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Progress Tracking
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Track your skin health, improvement and skincare
            consistency over time.
          </p>
        </div>

      </div>

      {/* =====================================================
          MESSAGES
      ====================================================== */}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* =====================================================
          1. SKIN HEALTH SUMMARY
      ====================================================== */}

      <section className="mb-6">

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            📊
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Skin Health Summary
            </h2>

            <p className="text-xs text-gray-500">
              Your latest skin-health and routine information.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* CURRENT SCORE */}

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">

            <p className="text-xs text-gray-500">
              Current Skin Health
            </p>

            <div className="flex items-end gap-1 mt-1">
              <p className="text-3xl font-bold text-gray-900">
                {overviewScore != null
                  ? overviewScore.toFixed(1)
                  : '—'}
              </p>

              <span className="text-xs text-gray-400 mb-1">
                /100
              </span>
            </div>

            <p className="text-xs text-gray-400 mt-1">
              Latest recorded AI score
            </p>

          </div>

          {/* SCORE CHANGE */}

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">

            <p className="text-xs text-gray-500">
              Score Change
            </p>

            <p
              className={`text-3xl font-bold mt-1 ${
                scoreChange == null
                  ? 'text-gray-400'
                  : scoreChange >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
              }`}
            >
              {scoreChange != null
                ? `${scoreChange >= 0 ? '+' : ''}${scoreChange.toFixed(1)}`
                : '—'}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Compared with previous recorded score
            </p>

          </div>

          {/* ROUTINE */}

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">

            <p className="text-xs text-gray-500">
              Routine Adherence
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-1">
              {routineAdherence}%
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Based on recorded routine logs
            </p>

          </div>

        </div>

        {/* AI INSIGHT */}

        <div className="mt-3 bg-purple-50 border border-purple-100 rounded-xl p-4">

          <div className="flex items-start gap-3">

            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
              ✨
            </div>

            <div>
              <p className="font-semibold text-gray-900 text-sm">
                AI Progress Insight
              </p>

              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {progressInsight}
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          2. BEFORE / CURRENT PHOTOS
      ====================================================== */}

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Before & Current Photos
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Compare your skin progress using AI-analyzed images.
            </p>
          </div>

          {photoImprovement !== null && (
            <div
              className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                photoImprovement >= 0
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {photoImprovement >= 0 ? '+' : ''}
              {photoImprovement.toFixed(1)}
              {' '}points
            </div>
          )}

        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <PhotoCard
            title="Before"
            photo={beforePhoto}
            uploading={uploadingBefore}
            onSelect={(event) =>
              handlePhotoSelect(
                event,
                'before'
              )
            }
            getImageUrl={getImageUrl}
          />

          <PhotoCard
            title="Current"
            photo={currentPhoto}
            uploading={uploadingCurrent}
            onSelect={(event) =>
              handlePhotoSelect(
                event,
                'current'
              )
            }
            getImageUrl={getImageUrl}
          />

        </div>

      </section>

      {/* =====================================================
    SKIN HEALTH TREND
====================================================== */}

<div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-8">

  <div className="flex items-center justify-between mb-4">

    <div>
      <h2 className="font-semibold text-lg text-gray-800">
        Skin Health Trend
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Monitor how your recorded skin-health score changes over time.
      </p>
    </div>

    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-2 rounded-full">
      Score / 100
    </span>

  </div>

  {scoredHistory.length > 0 ? (

    <div className="h-[360px]">

      <Line
        data={chartData}
        options={chartOptions}
      />

    </div>

  ) : (

    <div className="h-[180px] flex items-center justify-center text-sm text-gray-500">
      No skin-health scores have been recorded yet.
    </div>

  )}

  {/* RECORDED SCORES */}

  {scoredHistory.length > 0 && (

    <div className="mt-6 pt-5 border-t border-gray-100">

      <div className="flex items-center justify-between mb-3">

        <h3 className="font-semibold text-gray-800">
          Recorded Scores
        </h3>

        <span className="text-xs text-gray-400">
          Latest entries
        </span>

      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">

        {scoredHistory.map((item) => (

          <div
            key={`score-${item.id}`}
            className="bg-gray-50 border border-gray-100 rounded-lg p-3"
          >

            <p className="text-xs text-gray-500">
              {new Date(
                item.log_date || item.created_at
              ).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </p>

            <p className="text-xl font-bold text-purple-600 mt-1">
              {Number(item.skin_health_score).toFixed(1)}
            </p>

            <p className="text-xs text-gray-400">
              /100
            </p>

          </div>

        ))}

      </div>

    </div>

  )}

</div>
      

      {/* =====================================================
          4. DAILY ROUTINE TRACKING
      ====================================================== */}

      <form
        onSubmit={submit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-6"
      >

        <div className="mb-4">

          <h2 className="text-lg font-semibold text-gray-900">
            Daily Routine Tracking
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Record whether you followed your skincare routine today.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-3 mb-3">

          {/* MORNING */}

          <label className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer hover:border-purple-200">

            <input
              type="checkbox"
              checked={
                form.routine_followed_morning
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  routine_followed_morning:
                    event.target.checked,
                })
              }
              className="w-4 h-4 accent-purple-600"
            />

            <div>
              <p className="font-medium text-gray-800">
                Morning Routine
              </p>

              <p className="text-xs text-gray-500 mt-0.5">
                Cleansing, treatment, moisturizer and sun protection.
              </p>
            </div>

          </label>

          {/* EVENING */}

          <label className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer hover:border-purple-200">

            <input
              type="checkbox"
              checked={
                form.routine_followed_evening
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  routine_followed_evening:
                    event.target.checked,
                })
              }
              className="w-4 h-4 accent-purple-600"
            />

            <div>
              <p className="font-medium text-gray-800">
                Evening Routine
              </p>

              <p className="text-xs text-gray-500 mt-0.5">
                Cleansing, treatment, moisturizer and night care.
              </p>
            </div>

          </label>

        </div>

        <textarea
          placeholder="Notes on how your skin feels today..."
          value={
            form.skin_condition_note
          }
          onChange={(event) =>
            setForm({
              ...form,
              skin_condition_note:
                event.target.value,
            })
          }
          maxLength={500}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">

          <span className="text-xs text-gray-400">
            {form.skin_condition_note.length}/500
          </span>

          <button
            type="submit"
            disabled={savingLog}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          >
            {savingLog
              ? 'Saving...'
              : "Save Today's Progress"}
          </button>

        </div>

      </form>

      {/* =====================================================
          5 & 6. REPORTS
      ====================================================== */}

      <section className="mb-6">

        <div className="mb-3">

          <h2 className="text-lg font-semibold text-gray-900">
            Reports & Insights
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Download your existing professional skincare reports as PDF.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-4">

          {/* WEEKLY REPORT */}

          <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">

            <div className="bg-blue-50 p-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  📄
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Weekly Professional Report
                  </h3>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Last 7 days of skin health and routine progress.
                  </p>
                </div>

              </div>

            </div>

            <div className="p-4">

              <div className="grid grid-cols-2 gap-3 mb-4">

                <div>
                  <p className="text-xs text-gray-500">
                    Current Score
                  </p>

                  <p className="font-bold text-gray-900 mt-1">
                    {overviewScore != null
                      ? `${overviewScore.toFixed(1)}/100`
                      : '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Routine
                  </p>

                  <p className="font-bold text-gray-900 mt-1">
                    {routineAdherence}%
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  downloadReport('weekly')
                }
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold"
              >
                <span>⬇</span>
                Download Weekly PDF
              </button>

            </div>

          </div>

          {/* MONTHLY REPORT */}

          <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">

            <div className="bg-green-50 p-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  📅
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Monthly Professional Report
                  </h3>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Last 30 days of skin health and progress.
                  </p>
                </div>

              </div>

            </div>

            <div className="p-4">

              <div className="grid grid-cols-2 gap-3 mb-4">

                <div>
                  <p className="text-xs text-gray-500">
                    Current Score
                  </p>

                  <p className="font-bold text-gray-900 mt-1">
                    {overviewScore != null
                      ? `${overviewScore.toFixed(1)}/100`
                      : '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Improvement
                  </p>

                  <p
                    className={`font-bold mt-1 ${
                      photoImprovement == null
                        ? 'text-gray-900'
                        : photoImprovement >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                    }`}
                  >
                    {photoImprovement != null
                      ? `${photoImprovement >= 0 ? '+' : ''}${photoImprovement.toFixed(1)}`
                      : '—'}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  downloadReport('monthly')
                }
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold"
              >
                <span>⬇</span>
                Download Monthly PDF
              </button>

            </div>

          </div>

        </div>

        <div className="mt-3 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg">

          <p className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700">
              Note:
            </span>{' '}
            Reports are generated from your recorded skincare information
            and AI-assisted analysis. They are intended for progress
            tracking and informational purposes, not medical diagnosis.
          </p>

        </div>

      </section>

      {/* =====================================================
          7. PROGRESS HISTORY
      ====================================================== */}

      <section className="mb-4">

        <div className="mb-3">

          <h2 className="text-lg font-semibold text-gray-900">
            Progress History
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Your previous daily progress records and skin-health scores.
          </p>

        </div>

        {history.length === 0 ? (

          <div className="bg-white rounded-xl p-5 border border-gray-100 text-sm text-gray-500">
            No progress records yet.
          </div>

        ) : (

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

            {sortedHistory.map(
              (item, index) => {

                const previousScoredItem =
  sortedHistory
    .slice(index + 1)
    .find(
      (entry) =>
        entry.skin_health_score !== null &&
        entry.skin_health_score !== undefined &&
        !Number.isNaN(
          Number(entry.skin_health_score)
        )
    )

const change =
  item.skin_health_score != null &&
  previousScoredItem?.skin_health_score != null
    ? Number(item.skin_health_score) -
      Number(previousScoredItem.skin_health_score)
    : null

                return (
                  <div
                    key={item.id}
                    className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                  >

                    <div className="flex items-center justify-between gap-4">

                      {/* LEFT */}

                      <div className="min-w-0">

                        <p className="font-medium text-gray-900 text-sm">
                          {new Date(
                            item.log_date
                          ).toLocaleDateString(
                            undefined,
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-1.5 text-xs">

                          {item.routine_followed_morning && (
                            <span className="text-green-600">
                              ✓ Morning
                            </span>
                          )}

                          {item.routine_followed_evening && (
                            <span className="text-green-600">
                              ✓ Evening
                            </span>
                          )}

                          {!item.routine_followed_morning &&
                            !item.routine_followed_evening && (
                              <span className="text-gray-400">
                                No routine recorded
                              </span>
                            )}

                        </div>

                        {item.skin_condition_note && (
                          <p className="text-xs text-gray-500 mt-1 truncate max-w-[500px]">
                            {item.skin_condition_note}
                          </p>
                        )}

                      </div>

                      {/* RIGHT */}

                      <div className="text-right shrink-0 min-w-[90px]">

  {item.skin_health_score != null ? (

    <>
      <p className="text-lg font-bold text-purple-600">
        {Number(item.skin_health_score).toFixed(1)}
        <span className="text-xs font-medium text-gray-400">
          /100
        </span>
      </p>

      {change !== null && (
        <p
          className={`text-xs mt-1 font-medium ${
            change >= 0
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {change >= 0 ? '+' : ''}
          {change.toFixed(1)}
        </p>
      )}
    </>

  ) : (

    <p className="text-sm text-gray-400">
      No score
    </p>

  )}

</div>

                    </div>

                  </div>
                )
              }
            )}

          </div>

        )}

      </section>

    </div>
  )
}


// =========================================================
// PHOTO CARD
// =========================================================

function PhotoCard({
  title,
  photo,
  uploading,
  onSelect,
  getImageUrl,
}) {

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">

      {/* IMAGE */}

      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">

        {photo?.photo_url ? (

          <img
            src={getImageUrl(
              photo.photo_url
            )}
            alt={`${title} skin progress`}
            className="w-full h-full object-cover"
          />

        ) : (

          <div className="text-center px-5">

            <div className="text-4xl mb-2">
              📷
            </div>

            <p className="text-sm text-gray-500">
              No {title.toLowerCase()} photo
            </p>

          </div>

        )}

      </div>

      {/* DETAILS */}

      <div className="p-4">

        <div className="flex items-center justify-between mb-1">

          <h3 className="font-semibold text-gray-900">
            {title}
          </h3>

          {photo?.skin_health_score != null && (

            <span className="text-sm font-bold text-purple-700">
              {Number(
                photo.skin_health_score
              ).toFixed(1)}
              /100
            </span>

          )}

        </div>

        {photo?.skin_health_score != null && (

          <p className="text-xs text-gray-500">
            AI skin-health score
          </p>

        )}

        {photo?.created_at && (

          <p className="text-xs text-gray-400 mt-1 mb-3">
            Analyzed on{' '}
            {new Date(
              photo.created_at
            ).toLocaleDateString()}
          </p>

        )}

        <label className="block">

          <span className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-black text-white text-sm font-medium cursor-pointer hover:bg-gray-800">

            {uploading
              ? 'Analyzing with AI...'
              : photo
                ? `Replace ${title} Photo`
                : `Upload ${title} Photo`}

          </span>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onSelect}
            disabled={uploading}
          />

        </label>

      </div>

    </div>
  )
}