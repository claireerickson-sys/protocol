export interface IntakeAnswers {
  name: string;
  challenge: 'burnout' | 'poor-sleep' | 'high-stress' | 'low-energy' | 'disconnected' | 'all';
  sleepHours: 'under5' | '5to6' | '6to7' | '7to8' | 'over8';
  movement: 'rarely' | '1to2' | '3to4' | 'daily';
  stressLevel: 'low' | 'moderate' | 'high' | 'overwhelming';
  morningType: 'rush' | 'somewhat-rushed' | 'intentional';
  availableTime: '5min' | '15min' | '30min' | '60min';
  priority: 'energy' | 'sleep' | 'stress' | 'clarity' | 'strength' | 'all';
}

export interface ProtocolItem {
  category: string;
  title: string;
  description: string;
  frequency: string;
}

export interface Protocol {
  morningAnchor: ProtocolItem;
  movement: ProtocolItem;
  stressRegulation: ProtocolItem;
  sleepOptimization: ProtocolItem;
  nutritionNudge: ProtocolItem;
  letItGo: ProtocolItem;
}

export function generateProtocol(answers: IntakeAnswers): Protocol {
  return {
    morningAnchor: getMorningAnchor(answers),
    movement: getMovement(answers),
    stressRegulation: getStressRegulation(answers),
    sleepOptimization: getSleepOptimization(answers),
    nutritionNudge: getNutritionNudge(answers),
    letItGo: getLetItGo(answers),
  };
}

function getMorningAnchor(a: IntakeAnswers): ProtocolItem {
  const timeMap: Record<string, Omit<ProtocolItem, 'category'>> = {
    '5min': {
      title: 'Two-minute breath reset',
      description:
        'Before checking your phone, sit up and take 10 slow breaths — in through your nose, out through your mouth. This is your anchor. Everything else builds from here.',
      frequency: 'Every morning',
    },
    '15min': {
      title: '10-minute walk + 5-minute sit',
      description:
        'Step outside for 10 minutes with no podcast and no phone. Return and sit quietly for 5 minutes. Simple and non-negotiable.',
      frequency: 'Every morning',
    },
    '30min': {
      title: 'Movement + journaling',
      description:
        '15 minutes of gentle movement — stretching, yoga, or a walk — then 10 minutes of freewriting with no agenda. Just what\'s on your mind.',
      frequency: 'Every morning',
    },
    '60min': {
      title: 'Full morning ritual',
      description:
        'Movement, quiet sitting, journaling, and an intentional breakfast. Protect this hour. It sets the tone for everything that follows.',
      frequency: 'Every morning',
    },
  };

  const base = timeMap[a.availableTime];

  if (a.morningType === 'rush') {
    return {
      category: 'Morning',
      title: base.title,
      description: `Start with just this one thing: ${base.title.toLowerCase()}. Do it before anything else. Consistency beats complexity — especially when mornings are chaotic.`,
      frequency: base.frequency,
    };
  }

  return { category: 'Morning', ...base };
}

function getMovement(a: IntakeAnswers): ProtocolItem {
  const movementMap: Record<string, Omit<ProtocolItem, 'category'>> = {
    rarely: {
      title: '10-minute walks, 3× this week',
      description:
        'No gym. No gear. Just walk outside for 10 minutes, three times this week. This is the foundation — build from here, not from an ideal version of yourself.',
      frequency: '3× this week',
    },
    '1to2': {
      title: 'Add one more session',
      description:
        'You\'re already moving — that matters. Add one more session this week and keep it under 30 minutes so it doesn\'t feel like a commitment you can\'t keep.',
      frequency: '3× this week',
    },
    '3to4': {
      title: 'One intentional recovery session',
      description:
        'Your movement is solid. This week, replace one workout with intentional recovery: a slow walk, light stretching, or yoga. Recovery is not skipping — it\'s training.',
      frequency: '3–4× this week',
    },
    daily: {
      title: 'One session with no agenda',
      description:
        'You\'re consistent — that\'s rare. This week, do one session where you ignore metrics. Move by feel. Notice how your body actually responds without performance pressure.',
      frequency: 'Daily + 1 intuitive session',
    },
  };

  return { category: 'Movement', ...movementMap[a.movement] };
}

function getStressRegulation(a: IntakeAnswers): ProtocolItem {
  const stressMap: Record<string, Omit<ProtocolItem, 'category'>> = {
    low: {
      title: 'Maintain your nervous system baseline',
      description:
        'You\'re managing stress well. Keep one practice that grounds you — even 5 minutes of quiet daily protects you as demands inevitably increase.',
      frequency: 'Daily',
    },
    moderate: {
      title: 'Box breathing, once daily',
      description:
        'Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4 times. Do this before a big meeting, after a hard conversation, or before bed. It works.',
      frequency: 'Daily',
    },
    high: {
      title: 'Daily decompression window',
      description:
        'Block 10 minutes on your calendar — not optional. Walk, breathe, or write. No screens, no input. Your nervous system needs this runway every single day.',
      frequency: 'Daily — non-negotiable',
    },
    overwhelming: {
      title: 'Remove one stressor this week',
      description:
        'Identify one commitment or obligation that is draining you and remove, defer, or delegate it. Then add a 10-minute daily walk. These two things, nothing else.',
      frequency: 'Daily walk + one elimination',
    },
  };

  return { category: 'Stress', ...stressMap[a.stressLevel] };
}

function getSleepOptimization(a: IntakeAnswers): ProtocolItem {
  const sleepMap: Record<string, Omit<ProtocolItem, 'category'>> = {
    under5: {
      title: 'Sleep is your #1 priority this week',
      description:
        'Set a hard bedtime 30 minutes earlier tonight. No negotiation. Everything else on this protocol is secondary until sleep improves — it underlies every other system.',
      frequency: 'Every night',
    },
    '5to6': {
      title: 'Add 30 minutes',
      description:
        'Pick a consistent bedtime and protect it like a meeting you cannot miss. Even 30 more minutes will meaningfully change how you feel within 3 days.',
      frequency: 'Every night',
    },
    '6to7': {
      title: 'Protect the last hour before bed',
      description:
        'No screens for 45 minutes before sleep. Dim the lights. This signals your brain to produce melatonin naturally. You\'re close — small changes here pay off quickly.',
      frequency: 'Every night',
    },
    '7to8': {
      title: 'Optimize for quality',
      description:
        'Your duration is good. Focus on quality now: keep your room cool (65–68°F), maintain a consistent wake time even on weekends, and cut caffeine by 1pm.',
      frequency: 'Every night',
    },
    over8: {
      title: 'Check if it\'s restorative',
      description:
        'You\'re giving sleep enough time. If you still feel tired, focus on quality — consistent schedule, cool dark room, and limiting alcohol which fragments deep sleep.',
      frequency: 'Every night',
    },
  };

  return { category: 'Sleep', ...sleepMap[a.sleepHours] };
}

function getNutritionNudge(a: IntakeAnswers): ProtocolItem {
  if (a.challenge === 'burnout' || a.challenge === 'low-energy' || a.priority === 'energy') {
    return {
      category: 'Nutrition',
      title: 'Protein at breakfast',
      description:
        'Aim for 20–30g of protein within an hour of waking. Eggs, Greek yogurt, cottage cheese. This stabilizes blood sugar and prevents the mid-morning energy crash.',
      frequency: 'Every morning',
    };
  }

  if (a.challenge === 'poor-sleep' || a.priority === 'sleep') {
    return {
      category: 'Nutrition',
      title: 'Caffeine off at 1pm',
      description:
        'Caffeine has a 5–6 hour half-life. Cutting it at 1pm means half is still in your system at 7pm. Try this for 5 days and notice the difference in your sleep.',
      frequency: 'Daily this week',
    };
  }

  if (a.challenge === 'high-stress' || a.priority === 'stress') {
    return {
      category: 'Nutrition',
      title: 'One anti-inflammatory food daily',
      description:
        'Add one of these each day: berries, leafy greens, walnuts, salmon, or olive oil. Chronic stress depletes key nutrients — this is targeted replenishment.',
      frequency: 'Daily',
    };
  }

  return {
    category: 'Nutrition',
    title: 'One more vegetable per day',
    description:
      'Simple rule this week: eat one more vegetable per day than you did last week. No tracking, no macros, no optimization. Just add one thing.',
    frequency: 'Daily',
  };
}

function getLetItGo(a: IntakeAnswers): ProtocolItem {
  const letGoMap: Record<string, Omit<ProtocolItem, 'category'>> = {
    burnout: {
      title: 'The belief that rest is earned',
      description:
        'Rest is not a reward for productivity. It\'s a biological requirement. You don\'t earn the right to sleep or decompress — you require it, like water.',
      frequency: 'This week\'s mindset shift',
    },
    'poor-sleep': {
      title: 'Late-night screen scrolling',
      description:
        'Your brain needs a runway to wind down. Screens signal daytime to your nervous system. The content can wait — your sleep cannot.',
      frequency: 'This week\'s one change',
    },
    'high-stress': {
      title: 'Thinking your way out of stress',
      description:
        'Stress lives in the body, not just the mind. You cannot think your way through it — you need to move and breathe your way through it.',
      frequency: 'This week\'s mindset shift',
    },
    'low-energy': {
      title: 'Caffeine as your primary energy source',
      description:
        'Caffeine masks fatigue — it doesn\'t resolve it. This week, notice when you reach for it and ask what the underlying need actually is: sleep, food, movement, or a break.',
      frequency: 'This week\'s awareness practice',
    },
    disconnected: {
      title: 'Waiting to feel motivated',
      description:
        'Motivation follows action, not the other way around. Start the walk before you feel like it. Start the breath before you feel calm. The feeling comes after you begin.',
      frequency: 'This week\'s mindset shift',
    },
    all: {
      title: 'Trying to fix everything at once',
      description:
        'Pick one thing from this protocol. Just one. Do it every day this week. Depth beats breadth — always.',
      frequency: 'This week\'s focus',
    },
  };

  return { category: 'Let go of', ...(letGoMap[a.challenge] ?? letGoMap['all']) };
}
