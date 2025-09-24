
import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { PinLockScreen } from './components/PinLockScreen';
import { BottomNav } from './components/BottomNav';
import { useCycleData } from './hooks/useCycleData';
import type { UserProfile, Cycle, DailyLog } from './types';
import { AppState } from './types';
import { InsightsView } from './components/InsightsView';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingWizard } from './components/OnboardingWizard';
import { addDays, subDays, toISODateString } from './services/dateUtils';

type AppStatus = 'SPLASH' | 'ONBOARDING' | 'LOCKED' | 'READY';

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage('has-completed-onboarding', false);
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [pin, setPin] = useLocalStorage<string | null>('app-pin', null);
  
  const [appStatus, setAppStatus] = useState<AppStatus>('SPLASH');

  const [profile, setProfile] = useLocalStorage<UserProfile>('user-profile', { name: 'User', age: 28, weight: 65, height: 165 });
  const [cycles, setCycles] = useLocalStorage<Cycle[]>('user-cycles', []);
  const [dailyLogs, setDailyLogs] = useLocalStorage<Record<string, DailyLog>>('user-daily-logs', {});

  const cycleData = useCycleData(cycles, dailyLogs);
  const [activeView, setActiveView] = useState<AppState>(AppState.Calendar);

  useEffect(() => {
    if (!hasCompletedOnboarding) {
        const timer = setTimeout(() => setAppStatus('ONBOARDING'), 2500);
        return () => clearTimeout(timer);
    } else {
        setAppStatus(pin ? 'LOCKED' : 'READY');
    }
  }, [hasCompletedOnboarding, pin]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const handleOnboardingComplete = (data: { name: string; age: number; weight: number; height: number; lastPeriodDate: string; periodLength: number; cycleLength: number; }) => {
      setProfile({
        name: data.name,
        age: data.age,
        weight: data.weight,
        height: data.height,
      });

      const lastCycleStartDate = new Date(data.lastPeriodDate + 'T00:00:00');
      const lastCycleEndDate = addDays(lastCycleStartDate, data.periodLength - 1);
      
      const previousCycleStartDate = subDays(lastCycleStartDate, data.cycleLength);
      const previousCycleEndDate = addDays(previousCycleStartDate, data.periodLength - 1);

      const initialCycles: Cycle[] = [
        { startDate: toISODateString(previousCycleStartDate), endDate: toISODateString(previousCycleEndDate) },
        { startDate: toISODateString(lastCycleStartDate), endDate: toISODateString(lastCycleEndDate) },
      ];
      setCycles(initialCycles);
      setHasCompletedOnboarding(true);
  };


  const currentView = useMemo(() => {
    switch (activeView) {
      case AppState.Calendar:
        return <CalendarView cycleData={cycleData} setCycles={setCycles} setDailyLogs={setDailyLogs} />;
      case AppState.Analytics:
        return <AnalyticsView cycleData={cycleData} />;
      case AppState.Insights:
        return <InsightsView profile={profile} cycleData={cycleData} />;
      case AppState.Profile:
        return <ProfileView profile={profile} setProfile={setProfile} />;
      case AppState.Settings:
        return <SettingsView theme={theme} setTheme={setTheme} pin={pin} setPin={setPin} allData={{profile, cycles, dailyLogs}} />;
      default:
        return <CalendarView cycleData={cycleData} setCycles={setCycles} setDailyLogs={setDailyLogs} />;
    }
  }, [activeView, cycleData, profile, setProfile, setCycles, setDailyLogs, theme, setTheme, pin, setPin, cycles, dailyLogs]);
  
  if (appStatus === 'SPLASH') {
    return <SplashScreen />;
  }

  if (appStatus === 'ONBOARDING') {
      return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  if (appStatus === 'LOCKED') {
    return <PinLockScreen pin={pin!} onUnlock={() => setAppStatus('READY')} />;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200">
      <div className="container mx-auto max-w-lg h-screen flex flex-col p-0">
        <main className="flex-grow overflow-y-auto pb-20">
          {currentView}
        </main>
        <BottomNav activeView={activeView} setActiveView={setActiveView} />
      </div>
    </div>
  );
}