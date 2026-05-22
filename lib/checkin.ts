import { Protocol } from './protocol';

export interface DailyCheckin {
  date: string; // YYYY-MM-DD
  morning: boolean | null;
  movement: boolean | null;
  stress: boolean | null;
  energy: number | null; // 1-5
  note: string;
}

export interface ActiveProtocol {
  startDate: string; // YYYY-MM-DD
  protocol: Protocol;
  checkins: DailyCheckin[];
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadActiveProtocol(): ActiveProtocol | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('active_protocol');
  return raw ? (JSON.parse(raw) as ActiveProtocol) : null;
}

export function saveActiveProtocol(ap: ActiveProtocol): void {
  localStorage.setItem('active_protocol', JSON.stringify(ap));
}

export function activateProtocol(protocol: Protocol): ActiveProtocol {
  const ap: ActiveProtocol = {
    startDate: todayStr(),
    protocol,
    checkins: [],
  };
  saveActiveProtocol(ap);
  return ap;
}

export function getTodayCheckin(ap: ActiveProtocol): DailyCheckin | null {
  return ap.checkins.find((c) => c.date === todayStr()) ?? null;
}

export function upsertCheckin(ap: ActiveProtocol, checkin: DailyCheckin): ActiveProtocol {
  const idx = ap.checkins.findIndex((c) => c.date === checkin.date);
  const updated = { ...ap };
  if (idx >= 0) {
    updated.checkins = ap.checkins.map((c, i) => (i === idx ? checkin : c));
  } else {
    updated.checkins = [...ap.checkins, checkin];
  }
  saveActiveProtocol(updated);
  return updated;
}

export function getLast7Days(ap: ActiveProtocol): { date: string; checkin: DailyCheckin | null }[] {
  const days: { date: string; checkin: DailyCheckin | null }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const checkin = ap.checkins.find((c) => c.date === dateStr) ?? null;
    days.push({ date: dateStr, checkin });
  }
  return days;
}

export function dayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export function completionScore(checkin: DailyCheckin): number {
  const habits = [checkin.morning, checkin.movement, checkin.stress];
  const done = habits.filter(Boolean).length;
  return Math.round((done / habits.length) * 100);
}

export function weeklyInsight(ap: ActiveProtocol): string {
  const last7 = getLast7Days(ap);
  const withData = last7.filter((d) => d.checkin !== null);
  if (withData.length === 0) return "No check-ins yet this week.";

  const morningRate = withData.filter((d) => d.checkin?.morning).length / withData.length;
  const movementRate = withData.filter((d) => d.checkin?.movement).length / withData.length;
  const stressRate = withData.filter((d) => d.checkin?.stress).length / withData.length;
  const avgEnergy =
    withData.filter((d) => d.checkin?.energy).reduce((s, d) => s + (d.checkin?.energy ?? 0), 0) /
    (withData.filter((d) => d.checkin?.energy).length || 1);

  const lowest = [
    { label: 'morning anchor', rate: morningRate },
    { label: 'movement', rate: movementRate },
    { label: 'stress practice', rate: stressRate },
  ].sort((a, b) => a.rate - b.rate)[0];

  if (avgEnergy >= 4) return `Strong week. Your energy is tracking high. Keep the ${lowest.label} going — it's your hardest habit.`;
  if (morningRate >= 0.7) return `Your morning anchor is sticking. That's the hardest part. The rest will follow.`;
  if (lowest.rate < 0.3) return `The ${lowest.label} is slipping. Pick one day this week and make it non-negotiable.`;
  return `You checked in ${withData.length} of 7 days. Showing up is the practice — keep going.`;
}
