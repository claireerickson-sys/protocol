"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ActiveProtocol,
  loadActiveProtocol,
  getLast7Days,
  dayLabel,
  completionScore,
  weeklyInsight,
} from "@/lib/checkin";

export default function ProgressPage() {
  const router = useRouter();
  const [ap, setAp] = useState<ActiveProtocol | null>(null);

  useEffect(() => {
    const loaded = loadActiveProtocol();
    if (!loaded) {
      router.replace("/intake");
      return;
    }
    setAp(loaded);
  }, [router]);

  if (!ap) return null;

  const last7 = getLast7Days(ap);
  const insight = weeklyInsight(ap);
  const totalCheckins = ap.checkins.length;

  const morningRate = ap.checkins.length
    ? Math.round((ap.checkins.filter((c) => c.morning).length / ap.checkins.length) * 100)
    : 0;
  const movementRate = ap.checkins.length
    ? Math.round((ap.checkins.filter((c) => c.movement).length / ap.checkins.length) * 100)
    : 0;
  const stressRate = ap.checkins.length
    ? Math.round((ap.checkins.filter((c) => c.stress).length / ap.checkins.length) * 100)
    : 0;

  const avgEnergy =
    ap.checkins.filter((c) => c.energy).length > 0
      ? (
          ap.checkins.reduce((s, c) => s + (c.energy ?? 0), 0) /
          ap.checkins.filter((c) => c.energy).length
        ).toFixed(1)
      : null;

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-md mx-auto space-y-10">

        {/* Header */}
        <div className="space-y-1">
          <p className="text-xs tracking-widest text-stone-400 uppercase">Your progress</p>
          <h1 className="text-2xl font-semibold text-stone-900">This week</h1>
        </div>

        {/* Insight card */}
        <div className="rounded-2xl bg-stone-900 px-6 py-5">
          <p className="text-stone-400 text-xs uppercase tracking-wide mb-2">Weekly insight</p>
          <p className="text-white text-base leading-relaxed">{insight}</p>
        </div>

        {/* 7-day calendar */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-stone-700">Last 7 days</p>
          <div className="space-y-2">
            {last7.map(({ date, checkin }) => {
              const score = checkin ? completionScore(checkin) : null;
              const notes = checkin?.note;
              return (
                <div
                  key={date}
                  className="flex items-center gap-4 rounded-xl border border-stone-100 bg-white px-4 py-3"
                >
                  <div className="w-10 text-center shrink-0">
                    <p className="text-xs text-stone-400">{dayLabel(date)}</p>
                    <p className="text-base font-semibold text-stone-900">
                      {new Date(date + "T12:00:00").getDate()}
                    </p>
                  </div>
                  {checkin ? (
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {(["morning", "movement", "stress"] as const).map((k) => (
                            <span
                              key={k}
                              className={`w-2 h-2 rounded-full ${
                                checkin[k] ? "bg-emerald-500" : "bg-stone-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-stone-400">{score}% complete</span>
                        {checkin.energy && (
                          <span className="text-xs text-stone-400 ml-auto">
                            Energy: {checkin.energy}/5
                          </span>
                        )}
                      </div>
                      {notes && (
                        <p className="text-xs text-stone-400 italic truncate">&ldquo;{notes}&rdquo;</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-300 flex-1">No check-in</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Habit rates */}
        {totalCheckins > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-stone-700">Habit consistency</p>
            <div className="space-y-3">
              {[
                { label: "Morning anchor", rate: morningRate, color: "bg-amber-400" },
                { label: "Movement", rate: movementRate, color: "bg-emerald-400" },
                { label: "Stress practice", rate: stressRate, color: "bg-blue-400" },
              ].map(({ label, rate, color }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">{label}</span>
                    <span className="text-stone-400">{rate}%</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-500`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {avgEnergy && (
              <p className="text-sm text-stone-400 pt-1">
                Average energy this week: <span className="text-stone-700 font-medium">{avgEnergy} / 5</span>
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2 border-t border-stone-100">
          <Link
            href="/checkin"
            className="flex items-center justify-between w-full bg-stone-900 text-white py-4 px-6 rounded-xl font-medium text-sm hover:bg-stone-800 transition-colors"
          >
            <span>Check in today</span>
            <span>→</span>
          </Link>
          <Link
            href="/protocol"
            className="text-sm text-stone-400 hover:text-stone-700 text-center transition-colors"
          >
            View your protocol
          </Link>
        </div>
      </div>
    </main>
  );
}
