
import { useMemo } from 'react';
import type { Cycle, DailyLog, CycleAnalytics } from '../types';
import { addDays, differenceInDays, subDays, toISODateString } from '../services/dateUtils';

const DEFAULT_CYCLE_LENGTH = 28;
const DEFAULT_PERIOD_LENGTH = 5;

export const useCycleData = (cycles: Cycle[], dailyLogs: Record<string, DailyLog>): CycleAnalytics => {

  const sortedCycles = useMemo(() => {
    return [...cycles].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [cycles]);
  
  const analytics = useMemo((): CycleAnalytics => {
    if (sortedCycles.length === 0) {
      return {
        averageCycleLength: DEFAULT_CYCLE_LENGTH,
        averagePeriodLength: DEFAULT_PERIOD_LENGTH,
        cycleHistory: [],
        predictedNextPeriod: null,
        fertileWindow: null,
        ovulationDay: null,
      };
    }

    const cycleLengths: number[] = [];
    const periodLengths: number[] = [];
    const cycleHistory: { startDate: string; periodLength: number; cycleLength: number; }[] = [];

    for (let i = 0; i < sortedCycles.length; i++) {
      const currentCycle = sortedCycles[i];
      const periodLength = differenceInDays(new Date(currentCycle.endDate), new Date(currentCycle.startDate)) + 1;
      periodLengths.push(periodLength);

      let cycleLength = 0;
      if (i < sortedCycles.length - 1) {
        const nextCycle = sortedCycles[i + 1];
        cycleLength = differenceInDays(new Date(nextCycle.startDate), new Date(currentCycle.startDate));
        cycleLengths.push(cycleLength);
      }
      
      cycleHistory.push({
          startDate: currentCycle.startDate,
          periodLength,
          cycleLength,
      });
    }

    const averagePeriodLength = periodLengths.length > 0
      ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
      : DEFAULT_PERIOD_LENGTH;

    const averageCycleLength = cycleLengths.length > 0
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
      : DEFAULT_CYCLE_LENGTH;

    const lastCycle = sortedCycles[sortedCycles.length - 1];
    const predictedNextPeriod = addDays(new Date(lastCycle.startDate), averageCycleLength);
    const ovulationDay = subDays(predictedNextPeriod, 14);
    const fertileWindow = {
      start: subDays(ovulationDay, 5),
      end: ovulationDay,
    };
    
    return {
      averageCycleLength,
      averagePeriodLength,
      cycleHistory: cycleHistory.reverse(),
      predictedNextPeriod,
      fertileWindow,
      ovulationDay,
    };
  }, [sortedCycles]);

  return analytics;
};
