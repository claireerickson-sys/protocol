import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-md w-full space-y-10">
        <div className="space-y-3">
          <p className="text-xs tracking-widest text-stone-400 uppercase">Protocol</p>
          <h1 className="text-4xl font-semibold text-stone-900 leading-tight tracking-tight">
            Your personal wellness plan.{" "}
            <span className="text-stone-400">No fluff.</span>
          </h1>
        </div>

        <p className="text-stone-500 text-lg leading-relaxed">
          Answer 8 questions. Get a simple, actionable weekly plan built around
          how you actually live — not how you wish you lived.
        </p>

        <div className="space-y-3">
          <Link
            href="/intake"
            className="flex items-center justify-between w-full bg-stone-900 text-white py-4 px-6 rounded-xl text-base font-medium hover:bg-stone-800 transition-colors group"
          >
            <span>Build my protocol</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <p className="text-stone-400 text-sm text-center">
            Takes 3 minutes. No email required.
          </p>
        </div>

        <div className="pt-8 border-t border-stone-200">
          <p className="text-stone-400 text-sm leading-relaxed">
            Wellness doesn&apos;t require more information. It requires the right
            actions, consistently. This tool helps you find yours.
          </p>
        </div>
      </div>
    </main>
  );
}
