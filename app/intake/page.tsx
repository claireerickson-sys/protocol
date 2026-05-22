"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IntakeAnswers } from "@/lib/protocol";

type Step = {
  id: keyof IntakeAnswers;
  question: string;
  type?: "text";
  options?: { value: string; label: string; desc?: string }[];
};

const STEPS: Step[] = [
  {
    id: "name",
    question: "What’s your first name?",
    type: "text",
  },
  {
    id: "challenge",
    question: "What’s your biggest wellness challenge right now?",
    options: [
      { value: "burnout", label: "Burnout / exhaustion", desc: "Running on empty, struggling to recover" },
      { value: "poor-sleep", label: "Poor sleep", desc: "Can’t fall asleep, stay asleep, or wake rested" },
      { value: "high-stress", label: "High stress", desc: "Chronically overwhelmed, anxious, or on edge" },
      { value: "low-energy", label: "Low energy", desc: "Dragging through the day, relying on caffeine" },
      { value: "disconnected", label: "Disconnected from my body", desc: "Ignoring signals, operating on autopilot" },
      { value: "all", label: "Honestly, all of it", desc: "Multiple things are off at once" },
    ],
  },
  {
    id: "sleepHours",
    question: "How many hours of sleep do you typically get?",
    options: [
      { value: "under5", label: "Less than 5 hours" },
      { value: "5to6", label: "5–6 hours" },
      { value: "6to7", label: "6–7 hours" },
      { value: "7to8", label: "7–8 hours" },
      { value: "over8", label: "8+ hours" },
    ],
  },
  {
    id: "movement",
    question: "How often do you move your body intentionally?",
    options: [
      { value: "rarely", label: "Rarely or never" },
      { value: "1to2", label: "1–2 times per week" },
      { value: "3to4", label: "3–4 times per week" },
      { value: "daily", label: "Daily" },
    ],
  },
  {
    id: "stressLevel",
    question: "How would you rate your current stress level?",
    options: [
      { value: "low", label: "Low", desc: "Generally calm and in control" },
      { value: "moderate", label: "Moderate", desc: "Managing, but noticeable tension" },
      { value: "high", label: "High", desc: "Frequently overwhelmed" },
      { value: "overwhelming", label: "Overwhelming", desc: "Hard to function, constant pressure" },
    ],
  },
  {
    id: "morningType",
    question: "What does your morning typically look like?",
    options: [
      { value: "rush", label: "Rush out the door", desc: "Phone first, coffee, go — barely time to breathe" },
      { value: "somewhat-rushed", label: "Somewhat rushed", desc: "Getting there, but not intentional" },
      { value: "intentional", label: "Intentional and calm", desc: "I have morning structure I protect" },
    ],
  },
  {
    id: "availableTime",
    question: "How much time can you realistically give to wellness daily?",
    options: [
      { value: "5min", label: "5 minutes", desc: "Truly bare minimum — life is full right now" },
      { value: "15min", label: "15 minutes", desc: "I can carve this out consistently" },
      { value: "30min", label: "30 minutes", desc: "This is doable most days" },
      { value: "60min", label: "60+ minutes", desc: "I have space to invest in this" },
    ],
  },
  {
    id: "priority",
    question: "What matters most to you right now?",
    options: [
      { value: "energy", label: "More energy", desc: "Getting through the day without crashing" },
      { value: "sleep", label: "Better sleep", desc: "Waking up actually rested" },
      { value: "stress", label: "Less stress", desc: "A calmer nervous system" },
      { value: "clarity", label: "Mental clarity", desc: "Focus, presence, less brain fog" },
      { value: "strength", label: "Physical strength", desc: "Building a stronger, more capable body" },
      { value: "all", label: "All of the above", desc: "A holistic reset" },
    ],
  },
];

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<IntakeAnswers>>({});
  const [textInput, setTextInput] = useState("");

  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  function handleOptionSelect(value: string) {
    const updated = { ...answers, [currentStep.id]: value };
    setAnswers(updated);
    if (step < STEPS.length - 1) {
      setTimeout(() => setStep(step + 1), 180);
    } else {
      finish(updated);
    }
  }

  function handleTextNext() {
    if (!textInput.trim()) return;
    const updated = { ...answers, [currentStep.id]: textInput.trim() };
    setAnswers(updated);
    setTextInput("");
    setStep(step + 1);
  }

  function finish(finalAnswers: Partial<IntakeAnswers>) {
    localStorage.setItem("protocol_answers", JSON.stringify(finalAnswers));
    router.push("/protocol");
  }

  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <main className="min-h-screen flex flex-col px-6 py-10">
      {/* Progress */}
      <div className="max-w-md w-full mx-auto mb-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-stone-400">
            {step + 1} of {STEPS.length}
          </span>
          {step > 0 && (
            <button
              onClick={goBack}
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              ← back
            </button>
          )}
        </div>
        <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-stone-900 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center space-y-8">
        <h2 className="text-2xl font-semibold text-stone-900 leading-snug">
          {currentStep.question}
        </h2>

        {currentStep.type === "text" ? (
          <div className="space-y-4">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTextNext()}
              placeholder="Your name"
              autoFocus
              className="w-full border-b-2 border-stone-200 focus:border-stone-900 bg-transparent py-3 text-xl text-stone-900 placeholder:text-stone-300 outline-none transition-colors"
            />
            <button
              onClick={handleTextNext}
              disabled={!textInput.trim()}
              className="w-full bg-stone-900 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Continue →
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {currentStep.options?.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleOptionSelect(opt.value)}
                className="w-full text-left px-5 py-4 rounded-xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 transition-all group"
              >
                <div className="font-medium text-stone-900 group-hover:text-stone-900">
                  {opt.label}
                </div>
                {opt.desc && (
                  <div className="text-sm text-stone-400 mt-0.5">{opt.desc}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
