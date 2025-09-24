
export interface UserProfile {
  name: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
}

export interface Cycle {
  startDate: string; // ISO string 'YYYY-MM-DD'
  endDate: string;   // ISO string 'YYYY-MM-DD'
}

export enum Symptom {
  Cramps = 'Cramps',
  Headache = 'Headache',
  MoodSwings = 'Mood Swings',
  Fatigue = 'Fatigue',
  Acne = 'Acne',
  TenderBreasts = 'Tender Breasts',
}

export interface DailyLog {
  symptoms: Symptom[];
  sleep: number; // hours
  water: number; // glasses
  exercise: boolean;
  isPeriodDay?: boolean;
}

export enum DayType {
  Past = 'Past',
  Today = 'Today',
  Future = 'Future',
  Period = 'Period',
  PredictedPeriod = 'PredictedPeriod',
  Fertile = 'Fertile',
  Ovulation = 'Ovulation',
}

export interface CalendarDay {
  date: string; // 'YYYY-MM-DD'
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayType: DayType;
  log?: DailyLog;
}

export interface CycleAnalytics {
  averageCycleLength: number;
  averagePeriodLength: number;

  cycleHistory: {
    startDate: string;
    periodLength: number;
    cycleLength: number;
  }[];
  predictedNextPeriod: Date | null;
  fertileWindow: { start: Date; end: Date } | null;
  ovulationDay: Date | null;
}

export enum AppState {
    Calendar = 'Calendar',
    Analytics = 'Analytics',
    Insights = 'Insights',
    Profile = 'Profile',
    Settings = 'Settings',
}