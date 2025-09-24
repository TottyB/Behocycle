import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Cycle, DailyLog, CycleAnalytics, CalendarDay } from '../types';
import { DayType, Symptom } from '../types';
import { toISODateString, addDays, isSameDay } from '../services/dateUtils';
import { ChevronLeftIcon, ChevronRightIcon } from './common/Icons';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Helper component for toggle switches
const ToggleSwitch: React.FC<{
    label: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    className?: string;
}> = ({ label, enabled, onChange, className = '' }) => (
    <label className={`flex items-center justify-between cursor-pointer ${className}`}>
        <span>{label}</span>
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </label>
);

// Helper component for symptom buttons
const SymptomButton: React.FC<{
    symptom: Symptom;
    isSelected: boolean;
    onToggle: () => void;
}> = ({ symptom, isSelected, onToggle }) => (
    <button
        type="button"
        onClick={onToggle}
        className={`px-3 py-2 text-sm rounded-full border transition-colors duration-200 ${
            isSelected
                ? 'bg-primary-100 dark:bg-primary-900/50 border-primary-500 text-primary-700 dark:text-primary-300'
                : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400'
        }`}
    >
        {symptom}
    </button>
);


const DailyLogModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    date: string,
    log: DailyLog | undefined,
    cycles: Cycle[],
    onSave: (date: string, log: DailyLog, isPeriodStart: boolean, isPeriodEnd: boolean) => void
}> = ({ isOpen, onClose, date, log, cycles, onSave }) => {
    const [currentLog, setCurrentLog] = useState<DailyLog>({ symptoms: [], sleep: 8, water: 8, exercise: false });
    const [isPeriodDay, setIsPeriodDay] = useState(false);
    const [isPeriodStart, setIsPeriodStart] = useState(false);
    const [isPeriodEnd, setIsPeriodEnd] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const existingLog = log || { symptoms: [], sleep: 8, water: 8, exercise: false };
            const isDayInCycle = cycles.some(c => date >= c.startDate && date <= c.endDate);
            
            setCurrentLog(existingLog);
            setIsPeriodDay(isDayInCycle);
            setIsPeriodStart(cycles.some(c => c.startDate === date));
            setIsPeriodEnd(cycles.some(c => c.endDate === date) && !cycles.some(c => c.startDate === date));
        }
    }, [isOpen, date, log, cycles]);

    if (!isOpen) return null;

    const handleSymptomToggle = (symptom: Symptom) => {
        setCurrentLog(prev => {
            const newSymptoms = prev.symptoms.includes(symptom)
                ? prev.symptoms.filter(s => s !== symptom)
                : [...prev.symptoms, symptom];
            return { ...prev, symptoms: newSymptoms };
        });
    };
    
    const handleSave = () => {
        const finalLog = { ...currentLog, isPeriodDay: isPeriodDay || isPeriodStart };
        onSave(date, finalLog, isPeriodStart, isPeriodEnd);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Log for {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">&times;</button>
                </div>
                
                <div className="space-y-6">
                    {/* Period Tracking */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <h3 className="font-semibold mb-3">Period Tracking</h3>
                        <div className="space-y-3">
                             <ToggleSwitch label="Period Day" enabled={isPeriodDay} onChange={setIsPeriodDay} />
                             {isPeriodDay && (
                                <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-600 space-y-3 pt-2">
                                    <ToggleSwitch label="First day of period" enabled={isPeriodStart} onChange={setIsPeriodStart} />
                                    <ToggleSwitch label="Last day of period" enabled={isPeriodEnd} onChange={setIsPeriodEnd} />
                                </div>
                             )}
                        </div>
                    </div>

                    {/* Symptoms */}
                    <div>
                        <h3 className="font-semibold mb-3">Symptoms</h3>
                        <div className="flex flex-wrap gap-2">
                            {Object.values(Symptom).map(symptom => (
                                <SymptomButton 
                                    key={symptom} 
                                    symptom={symptom} 
                                    isSelected={currentLog.symptoms.includes(symptom)} 
                                    onToggle={() => handleSymptomToggle(symptom)}
                                />
                            ))}
                        </div>
                    </div>
                    
                    {/* Lifestyle */}
                    <div>
                        <h3 className="font-semibold mb-3">Lifestyle</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label htmlFor="sleep">Sleep (hours)</label>
                                <input type="number" id="sleep" value={currentLog.sleep} onChange={e => setCurrentLog({...currentLog, sleep: Number(e.target.value)})} className="w-20 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                            </div>
                             <div className="flex items-center justify-between">
                                <label htmlFor="water">Water (glasses)</label>
                                <input type="number" id="water" value={currentLog.water} onChange={e => setCurrentLog({...currentLog, water: Number(e.target.value)})} className="w-20 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                            </div>
                            <ToggleSwitch label="Exercise" enabled={currentLog.exercise} onChange={val => setCurrentLog({...currentLog, exercise: val})} />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold">Save Log</button>
                </div>
            </div>
        </div>
    );
};


const generateCalendarDays = (
  date: Date,
  cycleData: CycleAnalytics,
  cycles: Cycle[],
  dailyLogs: Record<string, DailyLog>
): CalendarDay[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const days: CalendarDay[] = [];
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  for (let i = 0; i < 42; i++) {
    const currentDate = addDays(startDate, i);
    const dateStr = toISODateString(currentDate);

    let dayType = DayType.Future;
    if (currentDate < today) dayType = DayType.Past;
    if (isSameDay(currentDate, today)) dayType = DayType.Today;

    const inPeriod = cycles.some(c => {
        const cycleStart = new Date(c.startDate + 'T00:00:00');
        const cycleEnd = new Date(c.endDate + 'T00:00:00');
        return currentDate >= cycleStart && currentDate <= cycleEnd;
    });
    
    if (inPeriod) {
        dayType = DayType.Period;
    } else {
        if (cycleData.predictedNextPeriod) {
            const predStart = cycleData.predictedNextPeriod;
            predStart.setHours(0,0,0,0);
            const predEnd = addDays(predStart, cycleData.averagePeriodLength - 1);
            if(currentDate >= predStart && currentDate <= predEnd) {
                dayType = DayType.PredictedPeriod;
            }
        }
        if(cycleData.fertileWindow && cycleData.ovulationDay){
             const fertileStart = cycleData.fertileWindow.start;
             fertileStart.setHours(0,0,0,0);
             const fertileEnd = cycleData.fertileWindow.end;
             fertileEnd.setHours(0,0,0,0);
            if(currentDate >= fertileStart && currentDate <= fertileEnd){
                dayType = DayType.Fertile;
            }
             const ovulationDay = cycleData.ovulationDay;
             ovulationDay.setHours(0,0,0,0);
            if(isSameDay(currentDate, ovulationDay)){
                dayType = DayType.Ovulation;
            }
        }
    }


    days.push({
      date: dateStr,
      dayOfMonth: currentDate.getDate(),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: isSameDay(currentDate, today),
      dayType,
      log: dailyLogs[dateStr],
    });
  }
  return days;
};

const DayCell: React.FC<{ day: CalendarDay, onClick: () => void }> = ({ day, onClick }) => {
    const dayTypeClasses: Record<DayType, string> = {
        [DayType.Period]: 'bg-period dark:bg-period-dark text-red-900 dark:text-red-100',
        [DayType.PredictedPeriod]: 'bg-period/50 dark:bg-period-dark/50 border border-dashed border-red-400 dark:border-red-600 text-gray-700 dark:text-gray-300',
        [DayType.Fertile]: 'bg-fertile dark:bg-fertile-dark text-teal-900 dark:text-teal-100',
        [DayType.Ovulation]: 'bg-ovulation dark:bg-ovulation-dark ring-2 ring-teal-500 dark:ring-teal-300 text-teal-900 dark:text-teal-100 font-bold',
        [DayType.Past]: 'text-gray-600 dark:text-gray-400',
        [DayType.Today]: 'text-primary-600 dark:text-primary-400 font-bold',
        [DayType.Future]: 'text-gray-800 dark:text-gray-200',
    };

    const opacityClass = day.isCurrentMonth ? 'opacity-100' : 'opacity-40';
    const todayRingClass = day.isToday ? 'ring-2 ring-primary-500' : '';

    return (
        <div 
            className={`aspect-square flex items-center justify-center rounded-full text-sm transition-colors duration-200 cursor-pointer ${opacityClass}`}
            onClick={onClick}
        >
            <div className={`w-10 h-10 flex items-center justify-center rounded-full relative ${todayRingClass} ${dayTypeClasses[day.dayType]}`}>
                {day.dayOfMonth}
                {day.log && <div className="absolute w-1 h-1 bg-gray-500 dark:bg-gray-300 rounded-full bottom-1.5"></div>}
            </div>
        </div>
    );
}


export const CalendarView: React.FC<{
  cycleData: CycleAnalytics;
  setCycles: React.Dispatch<React.SetStateAction<Cycle[]>>;
  setDailyLogs: React.Dispatch<React.SetStateAction<Record<string, DailyLog>>>;
}> = ({ cycleData, setCycles, setDailyLogs }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [cyclesState] = useLocalStorage<Cycle[]>('user-cycles', []);
    const [dailyLogsState] = useLocalStorage<Record<string, DailyLog>>('user-daily-logs', {});

    const calendarDays = useMemo(() => generateCalendarDays(currentDate, cycleData, cyclesState, dailyLogsState), [currentDate, cycleData, cyclesState, dailyLogsState]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    
    const handleDayClick = (date: string) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleSaveLog = useCallback((date: string, log: DailyLog, isPeriodStart: boolean, isPeriodEnd:boolean) => {
        setDailyLogs(prev => ({...prev, [date]: log}));
        
        if (isPeriodStart) {
            setCycles(prev => {
                // Avoid creating a duplicate cycle for the same start date
                if (prev.some(c => c.startDate === date)) return prev;
                const newCycle = { startDate: date, endDate: date };
                const sortedCycles = [...prev, newCycle].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
                return sortedCycles;
            });
        } else if (log.isPeriodDay) {
            setCycles(prev => {
                const newCycles = [...prev];
                if (newCycles.length === 0) return newCycles; // Should not happen if isPeriodStart is handled
                
                newCycles.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
                const lastCycle = newCycles[newCycles.length - 1];

                if (lastCycle && new Date(date) > new Date(lastCycle.startDate)) {
                    lastCycle.endDate = date;
                }
                return newCycles;
            });
        }
        // A more complex implementation would handle un-marking period days, which could involve splitting or shortening cycles.
    }, [setCycles, setDailyLogs]);


    return (
        <div className="p-4">
            <header className="flex items-center justify-between mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-center">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h1>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </header>
            
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => <div key={day}>{day}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => (
                    <DayCell key={day.date} day={day} onClick={() => handleDayClick(day.date)} />
                ))}
            </div>

            <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-period mr-2"></div> Period</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-period/50 border border-dashed border-red-400 mr-2"></div> Predicted Period</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-fertile mr-2"></div> Fertile Window</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-ovulation mr-2"></div> Predicted Ovulation</div>
            </div>

            {selectedDate && (
                <DailyLogModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    date={selectedDate}
                    log={dailyLogsState[selectedDate]}
                    cycles={cyclesState}
                    onSave={handleSaveLog}
                />
            )}
        </div>
    );
};
