"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IntakeAnswers, Protocol, generateProtocol } from "@/lib/protocol";
import { activateProtocol, loadActiveProtocol } from "@/lib/checkin";

const CATEGORY_COLORS: Record<string, string> = {
  Morning: "bg-amber-50 text-amber-700 border-amber-100",
  Movement: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Stress: "bg-blue-50 text-blue-700 border-blue-100",
  Sleep: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Nutrition: "bg-lime-50 text-lime-700 border-lime-100",
  "Let go of": "bg-rose-50 text-rose-700 border-rose-100",
};

export default function ProtocolPage() {
  const router = useRouter();
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("protocol_answers");
    if (!raw) {
      router.replace("/intake");
      return;
    }
    const answers = JSON.parse(raw) as IntakeAnswers;
    setName(answers.name || "");
    const generated = generateProtocol(answers);
    setProtocol(generated);
    setIsActive(loadActiveProtocol() !== null);
  }, [router]);

  function handleActivate() {
    if (!protocol) return;
    activateProtocol(protocol);
    router.push("/checkin");
  }

  if (!protocol) return null;

  const items = [
    protocol.morningAnchor,
    protocol.movement,
    protocol.stressRegulation,
    protocol.sleepOptimization,
    protocol.nutritionNudge,
    protocol.letItGo,
  ];

  return (
    <main className="min-h-screen px-6 py-14 pb-28">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-xs tracking-widest text-stone-400 uppercase">Protocol</p>
          <h1 className="text-3xl font-semibold text-stone-900 leading-tight">
            {name ? `Your protocol, ${name}.` : "Your protocol."}
          </h1>
          <p className="text-stone-500 text-base">
            Six things. This week. That&apos;s it.
          </p>
        </div>

        {/* Protocol cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => {
            const colorClass =
              CATEGORY_COLORS[item.category] ?? "bg-stone-50 text-stone-600 border-stone-100";
            return (
              <div
                key={item.category}
                className="rounded-2xl border border-stone-200 bg-white p-6 space-y-3 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${colorClass}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-stone-300">{item.frequency}</span>
                </div>
                <h3 className="text-base font-semibold text-stone-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed flex-1">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Activate CTA */}
        <div className="rounded-2xl bg-stone-900 px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <p className="text-white font-semibold">Ready to actually do this?</p>
            <p className="text-stone-400 text-sm">
              Activate your protocol and check in daily. 30 seconds a day.
            </p>
          </div>
          {isActive ? (
            <Link
              href="/checkin"
              className="shrink-0 bg-white text-stone-900 px-6 py-3 rounded-xl font-medium text-sm hover:bg-stone-100 transition-colors whitespace-nowrap"
            >
              Go to check-in →
            </Link>
          ) : (
            <button
              onClick={handleActivate}
              className="shrink-0 bg-white text-stone-900 px-6 py-3 rounded-xl font-medium text-sm hover:bg-stone-100 transition-colors whitespace-nowrap"
            >
              Activate my protocol →
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
            Pick the one that feels most urgent. Start there.
          </p>
          <Link
            href="/intake"
            onClick={() => {
              localStorage.removeItem("protocol_answers");
              localStorage.removeItem("active_protocol");
            }}
            className="text-sm text-stone-400 hover:text-stone-900 underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Start over
          </Link>
        </div>
      </div>
    </main>
  );
}
