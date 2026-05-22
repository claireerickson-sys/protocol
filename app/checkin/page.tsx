"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ActiveProtocol,
  DailyCheckin,
  loadActiveProtocol,
  upsertCheckin,
  getTodayCheckin,
  todayStr,
  dayLabel,
  getLast7Days,
} from "@/lib/checkin";

type HabitKey = "morning" | "movement" | "stress";

const HABIT_LABELS: Record<HabitKey, { label: string; question: string }> = {
  morning: {
    label: "Morning anchor",
    question: "Did you do your morning anchor?",
  },
  movement: {
    label: "Movement",
    question: "Did you move your body today?",
  },
  stress: {
    label: "Stress practice",
    question: "Did you do your stress regulation practice?",
  },
};

const ENERGY_LABELS = ["", "Drained", "Low", "Okay", "Good", "Energized"];

export default function CheckinPage() {
  const router = useRouter();
  const [ap, setAp] = useState<ActiveProtocol | null>(null);
  const [checkin, setCheckin] = useState<DailyCheckin>({
    date: todayStr(),
    morning: null,
    movement: null,
    stress: null,
    energy: null,
    note: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded = loadActiveProtocol();
    if (!loaded) {
      router.replace("/intake");
      return;
    }
    setAp(loaded);
    const existing = getTodayCheckin(loaded);
    if (existing) {
      setCheckin(existing);
      setSaved(true);
    }
  }, [router]);

  function setHabit(key: HabitKey, value: boolean) {
    setCheckin((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function setEnergy(val: number) {
    setCheckin((prev) => ({ ...prev, energy: val }));
    setSaved(false);
  }

  function handleSave() {
    if (!ap) return;
    const updated = upsertCheckin(ap, checkin);
    setAp(updated);
    setSaved(true);
  }

  if (!ap) return null;

  const last7 = getLast7Days(ap);
  const today = todayStr();
  const protocol = ap.protocol;
  const habitDescriptions: Record<HabitKey, string> = {
    morning: protocol.morningAnchor.title,
    movement: protocol.movement.title,
    stress: protocol.stressRegulation.title,
  };

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-md mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs tracking-widest text-stone-400 uppercase">Daily check-in</p>
            <h1 className="text-2xl font-semibold text-stone-900">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </h1>
          </div>
          <Link href="/progress" className="text-sm text-stone-400 hover:text-stone-700 transition-colors pt-1">
            7-day view →
          </Link>
        </div>

        {/* 7-day mini strip */}
        <div className="flex gap-1.5">
          {last7.map(({ date, checkin: c }) => {
            const isToday = date === today;
            const done = c ? [c.morning, c.movement, c.stress].filter(Boolean).length : 0;
            const bgColor =
              isToday
                ? "bg-stone-900 text-white"
                : c
                ? done === 3
                  ? "bg-emerald-100 text-emerald-700"
                  : done > 0
                  ? "bg-amber-100 text-amber-700"
                  : "bg-rose-100 text-rose-600"
                : "bg-stone-100 text-stone-300";
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${bgColor}`}>
                  {c ? done : isToday ? "·" : "–"}
                </div>
                <span className="text-xs text-stone-400">{dayLabel(date)}</span>
              </div>
            );
          })}
        </div>

        {/* Habit check-ins */}
        <div className="space-y-4">
          {(["morning", "movement", "stress"] as HabitKey[]).map((key) => (
            <div key={key} className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3">
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wide mb-0.5">
                  {HABIT_LABELS[key].label}
                </p>
                <p className="text-sm font-medium text-stone-700">{habitDescriptions[key]}</p>
              </div>
              <p className="text-sm text-stone-500">{HABIT_LABELS[key].question}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setHabit(key, true)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                    checkin[key] === true
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-stone-200 text-stone-500 hover:border-stone-400"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setHabit(key, false)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                    checkin[key] === false
                      ? "bg-stone-200 text-stone-700 border-stone-200"
                      : "border-stone-200 text-stone-500 hover:border-stone-400"
                  }`}
                >
                  Not today
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Energy rating */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-stone-700">How&apos;s your energy today?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setEnergy(n)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors border ${
                  checkin.energy === n
                    ? "bg-stone-900 text-white border-stone-900"
                    : "border-stone-200 text-stone-400 hover:border-stone-400"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {checkin.energy && (
            <p className="text-xs text-stone-400 text-center">{ENERGY_LABELS[checkin.energy]}</p>
          )}
        </div>

        {/* Optional note */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-stone-700">Anything to note? <span className="text-stone-400 font-normal">(optional)</span></p>
          <textarea
            value={checkin.note}
            onChange={(e) => {
              setCheckin((prev) => ({ ...prev, note: e.target.value }));
              setSaved(false);
            }}
            placeholder="What got in the way? What felt good?"
            rows={3}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 resize-none"
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className={`w-full py-4 rounded-xl font-medium text-sm transition-colors ${
            saved
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-stone-900 text-white hover:bg-stone-800"
          }`}
        >
          {saved ? "Saved ✓" : "Save check-in"}
        </button>

        {/* Protocol reminder */}
        <div className="pt-2 border-t border-stone-100">
          <Link
            href="/protocol"
            className="text-sm text-stone-400 hover:text-stone-700 transition-colors"
          >
            ← View your full protocol
          </Link>
        </div>
      </div>
    </main>
  );
}
