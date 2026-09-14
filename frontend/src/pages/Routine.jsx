import React, { useEffect, useState } from 'react'
import client from '../api/client'

import {
  Sun,
  Moon,
  CalendarDays,
  Pencil,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Trash2,
  Plus,
  Save,
  X,
  Leaf,
  ShieldCheck,
  Droplets,
  Clock3,
  ChevronDown,
  ChevronUp,
  FileText,
  Settings2,
} from 'lucide-react'

export default function Routine() {
  const [routine, setRoutine] = useState(null)
  const [history, setHistory] = useState([])

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)

  const [editing, setEditing] = useState(false)
  const [editRoutine, setEditRoutine] = useState(null)

  // =========================================================
  // LOAD CURRENT ROUTINE
  // =========================================================

  const loadRoutine = async () => {
    try {
      const res = await client.get('/routine/me')
      setRoutine(res.data)
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(
          err.response?.data?.detail ||
            'Failed to load skincare routine'
        )
      }
    }
  }

  // =========================================================
  // LOAD HISTORY
  // =========================================================

  const loadHistory = async () => {
    try {
      const res = await client.get('/routine/history')
      setHistory(res.data || [])
    } catch (err) {
      console.error('Failed to load routine history:', err)
    }
  }

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')

      await Promise.all([
        loadRoutine(),
        loadHistory(),
      ])

      setLoading(false)
    }

    load()
  }, [])

  // =========================================================
  // GENERATE / REGENERATE
  // =========================================================

  const generate = async () => {
    setError('')
    setGenerating(true)

    try {
      const res = await client.post('/routine/generate')

      setRoutine(res.data)

      await loadHistory()

      setEditing(false)
      setEditRoutine(null)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Failed to generate routine'
      )
    } finally {
      setGenerating(false)
    }
  }

  // =========================================================
  // START EDITING
  // =========================================================

  const startEditing = () => {
    if (!routine) return

    const copy = JSON.parse(
      JSON.stringify({
        morning_routine:
          routine.morning_routine || [],
        evening_routine:
          routine.evening_routine || [],
        weekly_treatments:
          routine.weekly_treatments || [],
        season:
          routine.season || 'all',
        notes:
          routine.notes || '',
      })
    )

    setEditRoutine(copy)
    setEditing(true)
    setError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const cancelEditing = () => {
    setEditing(false)
    setEditRoutine(null)
    setError('')
  }

  // =========================================================
  // UPDATE FIELD
  // =========================================================

  const updateField = (field, value) => {
    setEditRoutine((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  // =========================================================
  // UPDATE ROUTINE STEP
  // =========================================================

  const updateStep = (
    routineType,
    index,
    field,
    value
  ) => {
    setEditRoutine((previous) => {
      const updated = [
        ...(previous[routineType] || []),
      ]

      updated[index] = {
        ...updated[index],
        [field]: value,
      }

      return {
        ...previous,
        [routineType]: updated,
      }
    })
  }

  // =========================================================
  // ADD STEP
  // =========================================================

  const addStep = (routineType) => {
    setEditRoutine((previous) => {
      const updated = [
        ...(previous[routineType] || []),
        {
          step:
            (previous[routineType]?.length || 0) + 1,
          category: '',
          instruction: '',
          product_suggestion: '',
        },
      ]

      return {
        ...previous,
        [routineType]: updated,
      }
    })
  }

  // =========================================================
  // DELETE STEP
  // =========================================================

  const deleteStep = (
    routineType,
    index
  ) => {
    setEditRoutine((previous) => {
      const updated = (
        previous[routineType] || []
      )
        .filter((_, i) => i !== index)
        .map((step, i) => ({
          ...step,
          step: i + 1,
        }))

      return {
        ...previous,
        [routineType]: updated,
      }
    })
  }

  // =========================================================
  // UPDATE WEEKLY
  // =========================================================

  const updateWeeklyTreatment = (
    index,
    field,
    value
  ) => {
    setEditRoutine((previous) => {
      const updated = [
        ...(previous.weekly_treatments || []),
      ]

      updated[index] = {
        ...updated[index],
        [field]: value,
      }

      return {
        ...previous,
        weekly_treatments: updated,
      }
    })
  }

  // =========================================================
  // ADD WEEKLY
  // =========================================================

  const addWeeklyTreatment = () => {
    setEditRoutine((previous) => ({
      ...previous,
      weekly_treatments: [
        ...(previous.weekly_treatments || []),
        {
          day: '',
          treatment: '',
          purpose: '',
        },
      ],
    }))
  }

  // =========================================================
  // DELETE WEEKLY
  // =========================================================

  const deleteWeeklyTreatment = (
    index
  ) => {
    setEditRoutine((previous) => ({
      ...previous,
      weekly_treatments: (
        previous.weekly_treatments || []
      ).filter((_, i) => i !== index),
    }))
  }

  // =========================================================
  // SAVE
  // =========================================================

  const saveChanges = async () => {
    if (!editRoutine) return

    setSaving(true)
    setError('')

    try {
      const res = await client.put(
        '/routine/me',
        editRoutine
      )

      setRoutine(res.data)

      setEditing(false)
      setEditRoutine(null)

      await loadHistory()
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Failed to save routine changes'
      )
    } finally {
      setSaving(false)
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">

          <div className="animate-pulse space-y-6">

            <div className="h-8 w-64 bg-gray-200 rounded-lg" />

            <div className="h-4 w-96 bg-gray-200 rounded" />

            <div className="grid lg:grid-cols-3 gap-6">

              <div className="lg:col-span-2 h-72 bg-white rounded-3xl" />

              <div className="h-72 bg-white rounded-3xl" />

            </div>

          </div>

        </div>
      </div>
    )
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                <Sparkles
                  size={19}
                  className="text-violet-600"
                />
              </div>

              <span className="text-sm font-semibold text-violet-600">
                AI Skin Intelligence
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Your Skincare Routine
            </h1>

            <p className="text-gray-500 mt-1">
              Your personalized routine for healthier,
              balanced skin.
            </p>

          </div>

          <div className="flex items-center gap-3 flex-wrap">

            {routine && !editing && (
              <button
                onClick={startEditing}
                className="
                  inline-flex items-center gap-2
                  px-5 py-3
                  rounded-xl
                  border border-gray-200
                  bg-white
                  text-gray-800
                  font-semibold
                  shadow-sm
                  hover:bg-gray-50
                  transition
                "
              >
                <Pencil size={17} />
                Edit Routine
              </button>
            )}

            {!editing && (
              <button
                onClick={generate}
                disabled={generating}
                className="
                  inline-flex items-center gap-2
                  px-5 py-3
                  rounded-xl
                  bg-gray-950
                  text-white
                  font-semibold
                  shadow-sm
                  hover:bg-gray-800
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <RefreshCw
                  size={17}
                  className={
                    generating
                      ? 'animate-spin'
                      : ''
                  }
                />

                {generating
                  ? 'Generating...'
                  : routine
                    ? 'Regenerate Routine'
                    : 'Generate Routine'}
              </button>
            )}

          </div>

        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="
            mb-6
            rounded-2xl
            border border-red-200
            bg-red-50
            px-5 py-4
            text-sm text-red-700
          ">
            {error}
          </div>
        )}

        {/* ================================================= */}
        {/* NO ROUTINE */}
        {/* ================================================= */}

        {!routine && !error && (
          <EmptyRoutine
            generating={generating}
            onGenerate={generate}
          />
        )}

        {/* ================================================= */}
        {/* EDIT MODE */}
        {/* ================================================= */}

        {routine &&
          editing &&
          editRoutine && (
            <EditRoutine
              data={editRoutine}
              saving={saving}
              onCancel={cancelEditing}
              onSave={saveChanges}
              onFieldChange={updateField}
              onStepChange={updateStep}
              onAddStep={addStep}
              onDeleteStep={deleteStep}
              onWeeklyChange={
                updateWeeklyTreatment
              }
              onAddWeekly={
                addWeeklyTreatment
              }
              onDeleteWeekly={
                deleteWeeklyTreatment
              }
            />
          )}

        {/* ================================================= */}
        {/* CURRENT ROUTINE */}
        {/* ================================================= */}

        {routine && !editing && (
          <>

            {/* --------------------------------------------- */}
            {/* ROUTINE SUMMARY */}
            {/* --------------------------------------------- */}

            <RoutineSummary routine={routine} />

            {/* --------------------------------------------- */}
            {/* MORNING + EVENING */}
            {/* --------------------------------------------- */}

            <div className="
              grid
              lg:grid-cols-2
              gap-6
              mt-6
            ">

              <RoutineCard
                title="Morning Routine"
                subtitle="Start your day with healthy skin"
                icon={
                  <Sun
                    size={22}
                    className="text-orange-500"
                  />
                }
                iconBg="bg-orange-50"
                steps={
                  routine.morning_routine || []
                }
              />

              <RoutineCard
                title="Evening Routine"
                subtitle="Repair and restore overnight"
                icon={
                  <Moon
                    size={22}
                    className="text-indigo-500"
                  />
                }
                iconBg="bg-indigo-50"
                steps={
                  routine.evening_routine || []
                }
              />

            </div>

            {/* --------------------------------------------- */}
            {/* WEEKLY TREATMENTS */}
            {/* --------------------------------------------- */}

            <WeeklyTreatments
              treatments={
                routine.weekly_treatments || []
              }
            />

            {/* --------------------------------------------- */}
            {/* NOTES */}
            {/* --------------------------------------------- */}

            {routine.notes && (
              <div className="
                mt-6
                bg-white
                rounded-3xl
                border border-gray-100
                shadow-sm
                p-6
              ">

                <div className="flex items-start gap-4">

                  <div className="
                    w-11 h-11
                    rounded-2xl
                    bg-violet-50
                    flex items-center justify-center
                    shrink-0
                  ">
                    <FileText
                      size={21}
                      className="text-violet-600"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Personalized Notes
                    </h2>

                    <p className="
                      text-sm
                      text-gray-600
                      leading-6
                      mt-2
                      whitespace-pre-line
                    ">
                      {routine.notes}
                    </p>
                  </div>

                </div>

              </div>
            )}

            {/* --------------------------------------------- */}
            {/* ROUTINE HISTORY */}
            {/* --------------------------------------------- */}

            <RoutineHistory
              history={history}
            />

          </>
        )}

      </div>

    </div>
  )
}


/* ==========================================================
   EMPTY ROUTINE
========================================================== */

function EmptyRoutine({
  generating,
  onGenerate,
}) {
  return (
    <div className="
      relative
      overflow-hidden
      rounded-3xl
      bg-gradient-to-br
      from-violet-600
      via-purple-600
      to-fuchsia-500
      p-8
      lg:p-12
      text-white
      shadow-xl
    ">

      <div className="
        absolute
        -right-20
        -top-20
        w-72 h-72
        rounded-full
        bg-white/10
      " />

      <div className="
        absolute
        -bottom-24
        right-32
        w-64 h-64
        rounded-full
        bg-white/10
      " />

      <div className="relative max-w-2xl">

        <div className="
          w-14 h-14
          rounded-2xl
          bg-white/15
          flex items-center justify-center
          mb-6
        ">
          <Sparkles size={27} />
        </div>

        <h2 className="
          text-3xl
          lg:text-4xl
          font-bold
          mb-3
        ">
          Build your personalized routine
        </h2>

        <p className="
          text-white/80
          leading-7
          max-w-xl
          mb-7
        ">
          Generate an AI-powered skincare routine
          based on your skin profile, concerns,
          lifestyle and current needs.
        </p>

        <button
          onClick={onGenerate}
          disabled={generating}
          className="
            inline-flex
            items-center
            gap-2
            px-6 py-3.5
            rounded-xl
            bg-white
            text-violet-700
            font-bold
            hover:bg-violet-50
            transition
            disabled:opacity-60
          "
        >
          <Sparkles size={18} />

          {generating
            ? 'Creating your routine...'
            : 'Generate My Routine'}
        </button>

      </div>

    </div>
  )
}


/* ==========================================================
   ROUTINE SUMMARY
========================================================== */

function RoutineSummary({ routine }) {
  const morning =
    routine.morning_routine?.length || 0

  const evening =
    routine.evening_routine?.length || 0

  const weekly =
    routine.weekly_treatments?.length || 0

  return (
    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      xl:grid-cols-4
      gap-5
    ">

      <SummaryCard
        icon={<Sun size={21} />}
        iconBg="bg-orange-50"
        iconColor="text-orange-500"
        title="Morning Steps"
        value={morning}
        subtitle="Daily care"
      />

      <SummaryCard
        icon={<Moon size={21} />}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-500"
        title="Evening Steps"
        value={evening}
        subtitle="Night care"
      />

      <SummaryCard
        icon={<CalendarDays size={21} />}
        iconBg="bg-cyan-50"
        iconColor="text-cyan-500"
        title="Weekly Treatments"
        value={weekly}
        subtitle="This routine"
      />

      <SummaryCard
        icon={<Leaf size={21} />}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-500"
        title="Current Season"
        value={
          routine.season
            ? capitalize(routine.season)
            : 'All'
        }
        subtitle="Personalized"
      />

    </div>
  )
}


/* ==========================================================
   SUMMARY CARD
========================================================== */

function SummaryCard({
  icon,
  iconBg,
  iconColor,
  title,
  value,
  subtitle,
}) {
  return (
    <div className="
      bg-white
      rounded-3xl
      border border-gray-100
      shadow-sm
      p-5
      hover:shadow-md
      transition
    ">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="
            text-2xl
            font-bold
            text-gray-900
            mt-2
          ">
            {value}
          </p>

          <p className="
            text-xs
            text-gray-400
            mt-1
          ">
            {subtitle}
          </p>
        </div>

        <div className={`
          w-11 h-11
          rounded-2xl
          ${iconBg}
          ${iconColor}
          flex items-center justify-center
        `}>
          {icon}
        </div>

      </div>

    </div>
  )
}


/* ==========================================================
   ROUTINE CARD
========================================================== */

function RoutineCard({
  title,
  subtitle,
  icon,
  iconBg,
  steps = [],
}) {
  return (
    <div className="
      bg-white
      rounded-3xl
      border border-gray-100
      shadow-sm
      overflow-hidden
    ">

      {/* Header */}

      <div className="
        px-6
        py-5
        border-b border-gray-100
        flex items-center justify-between
      ">

        <div className="flex items-center gap-3">

          <div className={`
            w-11 h-11
            rounded-2xl
            ${iconBg}
            flex items-center justify-center
          `}>
            {icon}
          </div>

          <div>
            <h2 className="
              text-lg
              font-bold
              text-gray-900
            ">
              {title}
            </h2>

            <p className="
              text-xs
              text-gray-500
              mt-0.5
            ">
              {subtitle}
            </p>
          </div>

        </div>

        <div className="
          hidden sm:flex
          items-center gap-1.5
          text-xs
          font-semibold
          text-emerald-600
          bg-emerald-50
          px-3 py-1.5
          rounded-full
        ">
          <CheckCircle2 size={14} />
          Daily
        </div>

      </div>

      {/* Steps */}

      <div className="p-5 space-y-3">

        {steps.length > 0 ? (
          steps.map((step, index) => (
            <DisplayStep
              key={index}
              step={step}
              index={index}
            />
          ))
        ) : (
          <div className="
            rounded-2xl
            bg-gray-50
            border border-dashed
            border-gray-200
            p-6
            text-center
          ">
            <p className="text-sm text-gray-500">
              No steps available.
            </p>
          </div>
        )}

      </div>

    </div>
  )
}


/* ==========================================================
   DISPLAY STEP
========================================================== */

function DisplayStep({
  step,
  index,
}) {
  return (
    <div className="
      group
      relative
      rounded-2xl
      bg-slate-50
      border border-transparent
      hover:border-violet-100
      hover:bg-violet-50/30
      p-4
      transition
    ">

      <div className="flex gap-4">

        {/* Number */}

        <div className="
          w-9 h-9
          rounded-xl
          bg-white
          border border-gray-200
          flex items-center justify-center
          shrink-0
          text-sm
          font-bold
          text-violet-600
          shadow-sm
        ">
          {step.step ?? index + 1}
        </div>

        {/* Content */}

        <div className="min-w-0 flex-1">

          <div className="
            flex
            items-center
            gap-2
            flex-wrap
          ">

            <h3 className="
              font-bold
              text-gray-900
            ">
              {step.category ||
                `Step ${index + 1}`}
            </h3>

            {step.product_suggestion && (
              <span className="
                text-[11px]
                font-semibold
                text-violet-700
                bg-violet-100
                px-2 py-1
                rounded-full
              ">
                {step.product_suggestion}
              </span>
            )}

          </div>

          <p className="
            text-sm
            text-gray-600
            leading-6
            mt-1.5
          ">
            {step.instruction ||
              'Follow this step as recommended.'}
          </p>

        </div>

      </div>

    </div>
  )
}


/* ==========================================================
   WEEKLY TREATMENTS
========================================================== */

function WeeklyTreatments({
  treatments = [],
}) {
  return (
    <div className="
      mt-6
      bg-white
      rounded-3xl
      border border-gray-100
      shadow-sm
      p-6
    ">

      <div className="
        flex
        items-center
        justify-between
        mb-5
      ">

        <div className="flex items-center gap-3">

          <div className="
            w-11 h-11
            rounded-2xl
            bg-cyan-50
            flex items-center justify-center
          ">
            <CalendarDays
              size={21}
              className="text-cyan-600"
            />
          </div>

          <div>
            <h2 className="
              text-lg
              font-bold
              text-gray-900
            ">
              Weekly Treatments
            </h2>

            <p className="
              text-xs
              text-gray-500
              mt-0.5
            ">
              Additional care throughout the week
            </p>
          </div>

        </div>

      </div>

      {treatments.length > 0 ? (
        <div className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-4
        ">

          {treatments.map((item, index) => (
            <div
              key={index}
              className="
                rounded-2xl
                border border-gray-100
                bg-slate-50
                p-5
                hover:bg-white
                hover:shadow-sm
                transition
              "
            >

              <div className="
                flex
                items-center
                justify-between
                mb-4
              ">

                <span className="
                  inline-flex
                  items-center
                  gap-1.5
                  text-xs
                  font-bold
                  text-violet-700
                  bg-violet-100
                  px-3 py-1.5
                  rounded-full
                ">
                  <Clock3 size={13} />
                  {item.day || 'As needed'}
                </span>

                <span className="
                  w-8 h-8
                  rounded-xl
                  bg-white
                  flex items-center justify-center
                  text-sm
                  font-bold
                  text-gray-500
                ">
                  {index + 1}
                </span>

              </div>

              <h3 className="
                font-bold
                text-gray-900
              ">
                {item.treatment ||
                  'Weekly treatment'}
              </h3>

              {item.purpose && (
                <p className="
                  text-sm
                  text-gray-500
                  leading-6
                  mt-2
                ">
                  {item.purpose}
                </p>
              )}

            </div>
          ))}

        </div>
      ) : (
        <div className="
          rounded-2xl
          bg-gray-50
          border border-dashed
          border-gray-200
          p-7
          text-center
        ">
          <CalendarDays
            size={26}
            className="
              mx-auto
              text-gray-300
              mb-2
            "
          />

          <p className="text-sm text-gray-500">
            No weekly treatments recommended.
          </p>
        </div>
      )}

    </div>
  )
}


/* ==========================================================
   EDIT ROUTINE
========================================================== */

function EditRoutine({
  data,
  saving,
  onCancel,
  onSave,
  onFieldChange,
  onStepChange,
  onAddStep,
  onDeleteStep,
  onWeeklyChange,
  onAddWeekly,
  onDeleteWeekly,
}) {
  return (
    <div className="space-y-6">

      {/* Edit banner */}

      <div className="
        rounded-3xl
        bg-gradient-to-r
        from-violet-600
        to-fuchsia-500
        p-6
        text-white
        shadow-lg
      ">

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        ">

          <div className="flex items-center gap-4">

            <div className="
              w-12 h-12
              rounded-2xl
              bg-white/15
              flex items-center justify-center
            ">
              <Pencil size={22} />
            </div>

            <div>
              <h2 className="
                text-xl
                font-bold
              ">
                Edit Your Routine
              </h2>

              <p className="
                text-sm
                text-white/75
                mt-1
              ">
                Make changes to your personalized
                skincare plan.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-4 py-2.5
              rounded-xl
              bg-white/15
              hover:bg-white/25
              transition
              disabled:opacity-50
            "
          >
            <X size={17} />
            Cancel
          </button>

        </div>

      </div>

      {/* Morning */}

      <EditableRoutineSection
        title="Morning Routine"
        subtitle="Your morning skincare steps"
        icon={<Sun size={21} />}
        iconBg="bg-orange-50"
        iconColor="text-orange-500"
        routineType="morning_routine"
        steps={data.morning_routine}
        onStepChange={onStepChange}
        onAddStep={onAddStep}
        onDeleteStep={onDeleteStep}
      />

      {/* Evening */}

      <EditableRoutineSection
        title="Evening Routine"
        subtitle="Your nighttime skincare steps"
        icon={<Moon size={21} />}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-500"
        routineType="evening_routine"
        steps={data.evening_routine}
        onStepChange={onStepChange}
        onAddStep={onAddStep}
        onDeleteStep={onDeleteStep}
      />

      {/* Weekly */}

      <div className="
        bg-white
        rounded-3xl
        shadow-sm
        border border-gray-100
        p-6
      ">

        <div className="
          flex
          items-center
          justify-between
          gap-3
          mb-5
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-11 h-11
              rounded-2xl
              bg-cyan-50
              flex items-center justify-center
            ">
              <CalendarDays
                size={21}
                className="text-cyan-600"
              />
            </div>

            <div>
              <h2 className="
                text-lg
                font-bold
                text-gray-900
              ">
                Weekly Treatments
              </h2>

              <p className="
                text-xs
                text-gray-500
              ">
                Add additional weekly care
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onAddWeekly}
            className="
              inline-flex
              items-center
              gap-1.5
              px-3.5 py-2
              rounded-xl
              bg-violet-50
              text-violet-700
              text-sm
              font-semibold
              hover:bg-violet-100
            "
          >
            <Plus size={16} />
            Add Treatment
          </button>

        </div>

        <div className="space-y-4">

          {data.weekly_treatments?.length > 0 ? (
            data.weekly_treatments.map(
              (item, index) => (
                <div
                  key={index}
                  className="
                    rounded-2xl
                    bg-slate-50
                    border border-gray-100
                    p-5
                  "
                >

                  <div className="
                    grid
                    md:grid-cols-3
                    gap-4
                  ">

                    <Input
                      label="Day"
                      value={item.day || ''}
                      onChange={(value) =>
                        onWeeklyChange(
                          index,
                          'day',
                          value
                        )
                      }
                      placeholder="Monday"
                    />

                    <Input
                      label="Treatment"
                      value={
                        item.treatment || ''
                      }
                      onChange={(value) =>
                        onWeeklyChange(
                          index,
                          'treatment',
                          value
                        )
                      }
                      placeholder="Exfoliation"
                    />

                    <Input
                      label="Purpose"
                      value={
                        item.purpose || ''
                      }
                      onChange={(value) =>
                        onWeeklyChange(
                          index,
                          'purpose',
                          value
                        )
                      }
                      placeholder="Remove dead skin"
                    />

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onDeleteWeekly(index)
                    }
                    className="
                      mt-4
                      inline-flex
                      items-center
                      gap-1.5
                      text-sm
                      font-medium
                      text-red-500
                      hover:text-red-700
                    "
                  >
                    <Trash2 size={15} />
                    Remove treatment
                  </button>

                </div>
              )
            )
          ) : (
            <p className="
              text-sm
              text-gray-500
              text-center
              py-5
            ">
              No weekly treatments.
            </p>
          )}

        </div>

      </div>

      {/* Settings */}

      <div className="
        bg-white
        rounded-3xl
        shadow-sm
        border border-gray-100
        p-6
      ">

        <div className="flex items-center gap-3 mb-5">

          <div className="
            w-11 h-11
            rounded-2xl
            bg-gray-100
            flex items-center justify-center
          ">
            <Settings2
              size={21}
              className="text-gray-600"
            />
          </div>

          <div>
            <h2 className="
              text-lg
              font-bold
              text-gray-900
            ">
              Routine Settings
            </h2>

            <p className="
              text-xs
              text-gray-500
            ">
              Adjust your routine information
            </p>
          </div>

        </div>

        <Input
          label="Season"
          value={data.season || ''}
          onChange={(value) =>
            onFieldChange(
              'season',
              value
            )
          }
          placeholder="all"
        />

        <div className="mt-5">

          <label className="
            block
            text-sm
            font-semibold
            text-gray-700
            mb-2
          ">
            Notes
          </label>

          <textarea
            value={data.notes || ''}
            onChange={(e) =>
              onFieldChange(
                'notes',
                e.target.value
              )
            }
            rows={5}
            className="
              w-full
              rounded-2xl
              border border-gray-200
              bg-gray-50
              px-4 py-3
              text-sm
              text-gray-800
              outline-none
              focus:bg-white
              focus:border-violet-400
              focus:ring-4
              focus:ring-violet-100
              transition
            "
            placeholder="Add notes about your routine..."
          />

        </div>

      </div>

      {/* Save buttons */}

      <div className="
        flex
        justify-end
        gap-3
        pb-6
      ">

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="
            inline-flex
            items-center
            gap-2
            px-5 py-3
            rounded-xl
            border border-gray-200
            bg-white
            text-gray-700
            font-semibold
            hover:bg-gray-50
            disabled:opacity-50
          "
        >
          <X size={17} />
          Cancel
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="
            inline-flex
            items-center
            gap-2
            px-6 py-3
            rounded-xl
            bg-violet-600
            text-white
            font-semibold
            shadow-sm
            hover:bg-violet-700
            disabled:opacity-50
          "
        >
          <Save size={17} />

          {saving
            ? 'Saving...'
            : 'Save Changes'}
        </button>

      </div>

    </div>
  )
}


/* ==========================================================
   EDITABLE ROUTINE SECTION
========================================================== */

function EditableRoutineSection({
  title,
  subtitle,
  icon,
  iconBg,
  iconColor,
  routineType,
  steps = [],
  onStepChange,
  onAddStep,
  onDeleteStep,
}) {
  return (
    <div className="
      bg-white
      rounded-3xl
      shadow-sm
      border border-gray-100
      p-6
    ">

      <div className="
        flex
        items-center
        justify-between
        gap-3
        mb-5
      ">

        <div className="flex items-center gap-3">

          <div className={`
            w-11 h-11
            rounded-2xl
            ${iconBg}
            ${iconColor}
            flex items-center justify-center
          `}>
            {icon}
          </div>

          <div>
            <h2 className="
              text-lg
              font-bold
              text-gray-900
            ">
              {title}
            </h2>

            <p className="
              text-xs
              text-gray-500
            ">
              {subtitle}
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            onAddStep(routineType)
          }
          className="
            inline-flex
            items-center
            gap-1.5
            px-3.5 py-2
            rounded-xl
            bg-violet-50
            text-violet-700
            text-sm
            font-semibold
            hover:bg-violet-100
          "
        >
          <Plus size={16} />
          Add Step
        </button>

      </div>

      <div className="space-y-4">

        {steps.length > 0 ? (
          steps.map((step, index) => (
            <div
              key={index}
              className="
                rounded-2xl
                bg-slate-50
                border border-gray-100
                p-5
              "
            >

              <div className="
                flex
                items-center
                justify-between
                mb-4
              ">

                <div className="
                  flex
                  items-center
                  gap-2
                ">

                  <span className="
                    w-8 h-8
                    rounded-xl
                    bg-violet-100
                    text-violet-700
                    flex items-center justify-center
                    text-xs
                    font-bold
                  ">
                    {index + 1}
                  </span>

                  <span className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-gray-500
                  ">
                    Routine Step
                  </span>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    onDeleteStep(
                      routineType,
                      index
                    )
                  }
                  className="
                    inline-flex
                    items-center
                    gap-1
                    text-xs
                    font-semibold
                    text-red-500
                    hover:text-red-700
                  "
                >
                  <Trash2 size={14} />
                  Remove
                </button>

              </div>

              <div className="
                grid
                md:grid-cols-2
                gap-4
              ">

                <Input
                  label="Category"
                  value={step.category || ''}
                  onChange={(value) =>
                    onStepChange(
                      routineType,
                      index,
                      'category',
                      value
                    )
                  }
                  placeholder="Cleansing"
                />

                <Input
                  label="Suggested Ingredient"
                  value={
                    step.product_suggestion ||
                    ''
                  }
                  onChange={(value) =>
                    onStepChange(
                      routineType,
                      index,
                      'product_suggestion',
                      value
                    )
                  }
                  placeholder="Niacinamide"
                />

              </div>

              <div className="mt-4">

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-gray-700
                  mb-2
                ">
                  Instruction
                </label>

                <textarea
                  value={step.instruction || ''}
                  onChange={(e) =>
                    onStepChange(
                      routineType,
                      index,
                      'instruction',
                      e.target.value
                    )
                  }
                  rows={3}
                  className="
                    w-full
                    rounded-2xl
                    border border-gray-200
                    bg-white
                    px-4 py-3
                    text-sm
                    outline-none
                    focus:border-violet-400
                    focus:ring-4
                    focus:ring-violet-100
                    transition
                  "
                  placeholder="Describe how to perform this step..."
                />

              </div>

            </div>
          ))
        ) : (
          <div className="
            text-center
            rounded-2xl
            bg-gray-50
            border border-dashed
            border-gray-200
            p-7
          ">
            <p className="
              text-sm
              text-gray-500
            ">
              No steps yet. Click "Add Step".
            </p>
          </div>
        )}

      </div>

    </div>
  )
}


/* ==========================================================
   INPUT
========================================================== */

function Input({
  label,
  value,
  onChange,
  placeholder = '',
}) {
  return (
    <div>

      <label className="
        block
        text-sm
        font-semibold
        text-gray-700
        mb-2
      ">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="
          w-full
          rounded-2xl
          border border-gray-200
          bg-white
          px-4 py-3
          text-sm
          text-gray-800
          outline-none
          focus:border-violet-400
          focus:ring-4
          focus:ring-violet-100
          transition
        "
      />

    </div>
  )
}


/* ==========================================================
   ROUTINE HISTORY
========================================================== */

function RoutineHistory({
  history = [],
}) {
  const [expanded, setExpanded] =
    useState(null)

  if (!history.length) {
    return null
  }

  return (
    <div className="mt-10">

      <div className="mb-5">

        <div className="flex items-center gap-3">

          <div className="
            w-11 h-11
            rounded-2xl
            bg-violet-50
            flex items-center justify-center
          ">
            <Clock3
              size={21}
              className="text-violet-600"
            />
          </div>

          <div>

            <h2 className="
              text-2xl
              font-bold
              text-gray-900
            ">
              Routine History
            </h2>

            <p className="
              text-sm
              text-gray-500
              mt-1
            ">
              Previous personalized routines
              and changes
            </p>

          </div>

        </div>

      </div>

      <div className="space-y-4">

        {history.map((item, index) => {

          const key =
            item.id ?? index

          const isOpen =
            expanded === key

          return (
            <div
              key={key}
              className="
                bg-white
                rounded-3xl
                border border-gray-100
                shadow-sm
                overflow-hidden
              "
            >

              <button
                type="button"
                onClick={() =>
                  setExpanded(
                    isOpen
                      ? null
                      : key
                  )
                }
                className="
                  w-full
                  p-5
                  text-left
                  flex
                  items-center
                  justify-between
                  gap-4
                  hover:bg-gray-50
                  transition
                "
              >

                <div className="min-w-0">

                  <div className="
                    flex
                    items-center
                    gap-2
                    flex-wrap
                  ">

                    <span className="
                      text-sm
                      font-bold
                      text-gray-900
                    ">
                      Routine from{' '}
                      {item.created_at
                        ? new Date(
                            item.created_at
                          ).toLocaleString()
                        : 'Previous date'}
                    </span>

                    <span className="
                      text-[11px]
                      font-semibold
                      px-2 py-1
                      rounded-full
                      bg-violet-50
                      text-violet-700
                    ">
                      {capitalize(
                        item.season ||
                          'all'
                      )}
                    </span>

                  </div>

                  <div className="
                    flex
                    items-center
                    gap-3
                    flex-wrap
                    mt-2
                  ">

                    <span className="
                      text-xs
                      text-gray-500
                    ">
                      Skin health score:{' '}
                      <strong className="text-gray-700">
                        {item.condition_score ??
                          'N/A'}
                      </strong>
                    </span>

                    {item.change_summary && (
                      <span className="
                        text-xs
                        text-gray-400
                      ">
                        {item.change_summary}
                      </span>
                    )}

                  </div>

                </div>

                <div className="
                  w-9 h-9
                  rounded-xl
                  bg-gray-100
                  flex items-center justify-center
                  shrink-0
                ">
                  {isOpen ? (
                    <ChevronUp
                      size={18}
                      className="text-gray-600"
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      className="text-gray-600"
                    />
                  )}
                </div>

              </button>

              {isOpen && (
                <div className="
                  border-t border-gray-100
                  p-5
                  bg-gray-50/50
                  space-y-5
                ">

                  <div className="
                    grid
                    lg:grid-cols-2
                    gap-5
                  ">

                    <RoutineCard
                      title="Morning Routine"
                      subtitle="Previous morning routine"
                      icon={
                        <Sun
                          size={21}
                          className="text-orange-500"
                        />
                      }
                      iconBg="bg-orange-50"
                      steps={
                        item.morning_routine ||
                        []
                      }
                    />

                    <RoutineCard
                      title="Evening Routine"
                      subtitle="Previous evening routine"
                      icon={
                        <Moon
                          size={21}
                          className="text-indigo-500"
                        />
                      }
                      iconBg="bg-indigo-50"
                      steps={
                        item.evening_routine ||
                        []
                      }
                    />

                  </div>

                  <WeeklyTreatments
                    treatments={
                      item.weekly_treatments ||
                      []
                    }
                  />

                  {item.notes && (
                    <div className="
                      bg-white
                      rounded-3xl
                      border border-gray-100
                      p-5
                    ">

                      <div className="
                        flex
                        gap-3
                      ">

                        <FileText
                          size={20}
                          className="
                            text-violet-600
                            mt-0.5
                            shrink-0
                          "
                        />

                        <div>

                          <h3 className="
                            font-bold
                            text-gray-900
                          ">
                            Notes
                          </h3>

                          <p className="
                            text-sm
                            text-gray-600
                            leading-6
                            mt-1
                            whitespace-pre-line
                          ">
                            {item.notes}
                          </p>

                        </div>

                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>
          )
        })}

      </div>

    </div>
  )
}


/* ==========================================================
   CAPITALIZE
========================================================== */

function capitalize(value) {
  if (!value) return ''

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  )
}