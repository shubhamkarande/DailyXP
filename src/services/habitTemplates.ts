import { HabitTemplate } from '../types';

export const HABIT_TEMPLATES: HabitTemplate[] = [
  // Health & Fitness
  {
    id: 'drink_water',
    title: 'Drink 8 glasses of water',
    category: 'Health',
    emoji: '💧',
    difficulty: 'easy',
    description: 'Stay hydrated throughout the day',
    tips: [
      'Keep a water bottle nearby',
      'Set hourly reminders',
      'Add lemon for flavor',
      'Track with an app'
    ],
    isPopular: true,
  },
  {
    id: 'exercise',
    title: 'Exercise for 30 minutes',
    category: 'Fitness',
    emoji: '💪',
    difficulty: 'medium',
    description: 'Get your body moving with any physical activity',
    tips: [
      'Start with 10 minutes if new to exercise',
      'Find activities you enjoy',
      'Schedule it like an appointment',
      'Have a backup indoor routine'
    ],
    isPopular: true,
  },
  {
    id: 'walk_steps',
    title: 'Walk 10,000 steps',
    category: 'Fitness',
    emoji: '🚶',
    difficulty: 'medium',
    description: 'Take a daily walk to reach your step goal',
    tips: [
      'Use a step counter app',
      'Take stairs instead of elevators',
      'Park further away',
      'Walk during phone calls'
    ],
    isPopular: true,
  },
  {
    id: 'sleep_early',
    title: 'Sleep before 11 PM',
    category: 'Health',
    emoji: '😴',
    difficulty: 'medium',
    description: 'Get quality sleep by maintaining a consistent bedtime',
    tips: [
      'Set a bedtime alarm',
      'Avoid screens 1 hour before bed',
      'Create a relaxing routine',
      'Keep bedroom cool and dark'
    ],
    isPopular: true,
  },

  // Learning & Growth
  {
    id: 'read_book',
    title: 'Read for 20 minutes',
    category: 'Learning',
    emoji: '📚',
    difficulty: 'easy',
    description: 'Expand your knowledge through daily reading',
    tips: [
      'Always have a book ready',
      'Read during commute',
      'Join a book club',
      'Try audiobooks if busy'
    ],
    isPopular: true,
  },
  {
    id: 'learn_language',
    title: 'Practice a new language',
    category: 'Learning',
    emoji: '🗣️',
    difficulty: 'medium',
    description: 'Spend time learning or practicing a foreign language',
    tips: [
      'Use language learning apps',
      'Watch movies with subtitles',
      'Find a language exchange partner',
      'Practice speaking daily'
    ],
    isPopular: false,
  },
  {
    id: 'journal',
    title: 'Write in journal',
    category: 'Mindfulness',
    emoji: '📝',
    difficulty: 'easy',
    description: 'Reflect on your day and thoughts through writing',
    tips: [
      'Write first thing in the morning',
      'Use prompts if stuck',
      'Focus on gratitude',
      'Keep it private and honest'
    ],
    isPopular: true,
  },

  // Productivity
  {
    id: 'plan_day',
    title: 'Plan tomorrow today',
    category: 'Productivity',
    emoji: '📅',
    difficulty: 'easy',
    description: 'Prepare for tomorrow by planning your day',
    tips: [
      'Review calendar and tasks',
      'Set 3 main priorities',
      'Prepare clothes and meals',
      'Do it before bed'
    ],
    isPopular: false,
  },
  {
    id: 'no_phone_morning',
    title: 'No phone for first hour',
    category: 'Mindfulness',
    emoji: '📱',
    difficulty: 'hard',
    description: 'Start your day without immediately checking your phone',
    tips: [
      'Use a physical alarm clock',
      'Keep phone in another room',
      'Have a morning routine ready',
      'Replace with positive activities'
    ],
    isPopular: false,
  },
  {
    id: 'clean_space',
    title: 'Tidy living space',
    category: 'Lifestyle',
    emoji: '🧹',
    difficulty: 'easy',
    description: 'Maintain a clean and organized environment',
    tips: [
      'Do a little each day',
      'Put things back after use',
      'Declutter regularly',
      'Make it part of routine'
    ],
    isPopular: false,
  },

  // Social & Relationships
  {
    id: 'call_family',
    title: 'Call family or friends',
    category: 'Social',
    emoji: '📞',
    difficulty: 'easy',
    description: 'Stay connected with loved ones',
    tips: [
      'Schedule regular calls',
      'Send voice messages',
      'Remember important dates',
      'Be present during conversations'
    ],
    isPopular: false,
  },
  {
    id: 'compliment_someone',
    title: 'Give someone a compliment',
    category: 'Social',
    emoji: '💝',
    difficulty: 'easy',
    description: 'Spread positivity by complimenting others',
    tips: [
      'Be genuine and specific',
      'Notice small things',
      'Include colleagues and strangers',
      'Write thank you notes'
    ],
    isPopular: false,
  },

  // Creative & Hobbies
  {
    id: 'practice_instrument',
    title: 'Practice musical instrument',
    category: 'Creative',
    emoji: '🎵',
    difficulty: 'medium',
    description: 'Develop musical skills through daily practice',
    tips: [
      'Start with 15 minutes',
      'Use a metronome',
      'Learn songs you enjoy',
      'Record yourself playing'
    ],
    isPopular: false,
  },
  {
    id: 'draw_sketch',
    title: 'Draw or sketch',
    category: 'Creative',
    emoji: '🎨',
    difficulty: 'easy',
    description: 'Express creativity through drawing',
    tips: [
      'Carry a sketchbook',
      'Draw from observation',
      'Try different mediums',
      'Join online art challenges'
    ],
    isPopular: false,
  },

  // Mindfulness & Spirituality
  {
    id: 'meditate',
    title: 'Meditate for 10 minutes',
    category: 'Mindfulness',
    emoji: '🧘',
    difficulty: 'medium',
    description: 'Practice mindfulness and reduce stress',
    tips: [
      'Use guided meditation apps',
      'Find a quiet space',
      'Start with 5 minutes',
      'Focus on breathing'
    ],
    isPopular: true,
  },
  {
    id: 'gratitude',
    title: 'Write 3 things you\'re grateful for',
    category: 'Mindfulness',
    emoji: '🙏',
    difficulty: 'easy',
    description: 'Practice gratitude to improve mental well-being',
    tips: [
      'Be specific in your gratitude',
      'Include small things',
      'Feel the emotion',
      'Share with others'
    ],
    isPopular: true,
  },
];

export const getTemplatesByCategory = (category?: string): HabitTemplate[] => {
  if (!category) return HABIT_TEMPLATES;
  return HABIT_TEMPLATES.filter(template => template.category === category);
};

export const getPopularTemplates = (): HabitTemplate[] => {
  return HABIT_TEMPLATES.filter(template => template.isPopular);
};

export const getTemplateById = (id: string): HabitTemplate | undefined => {
  return HABIT_TEMPLATES.find(template => template.id === id);
};

export const getCategories = (): string[] => {
  const categories = new Set(HABIT_TEMPLATES.map(template => template.category));
  return Array.from(categories).sort();
};