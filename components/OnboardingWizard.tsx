
import React, { useState } from 'react';
import { toISODateString } from '../services/dateUtils';

interface OnboardingData {
    name: string;
    age: number;
    weight: number;
    height: number;
    lastPeriodDate: string;
    periodLength: number;
    cycleLength: number;
}

interface OnboardingWizardProps {
    onComplete: (data: OnboardingData) => void;
}

const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
    const percentage = (current / total) * 100;
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

const OnboardingStep: React.FC<{ children: React.ReactNode; title: string; onNext?: () => void; onBack?: () => void; nextDisabled?: boolean; isLastStep?: boolean; }> = 
({ children, title, onNext, onBack, nextDisabled = false, isLastStep = false }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm animate-fade-in-up">
            <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
            <div className="space-y-4 mb-8">{children}</div>
            <div className="flex gap-4">
                {onBack && (
                    <button onClick={onBack} className="w-full px-4 py-3 font-semibold bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        Back
                    </button>
                )}
                {onNext && (
                    <button onClick={onNext} disabled={nextDisabled} className="w-full px-4 py-3 font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed">
                        {isLastStep ? 'Finish' : 'Next'}
                    </button>
                )}
            </div>
             <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
            `}</style>
        </div>
    );
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<OnboardingData>({
        name: '',
        age: 28,
        weight: 65,
        height: 165,
        lastPeriodDate: toISODateString(new Date()),
        periodLength: 5,
        cycleLength: 28,
    });
    
    const totalSteps = 4;

    const next = () => setStep(s => Math.min(s + 1, totalSteps + 1));
    const back = () => setStep(s => Math.max(s - 1, 1));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setData(d => ({ ...d, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleFinish = () => {
        onComplete(data);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <OnboardingStep title="Welcome to BEHO Cycle!" onNext={next} nextDisabled={!data.name || data.age <= 0}>
                        <p className="text-center text-gray-600 dark:text-gray-300">Let's get your profile set up to personalize your experience.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">What should we call you?</label>
                            <input type="text" name="name" value={data.name} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                            <input type="number" name="age" value={data.age} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                        </div>
                    </OnboardingStep>
                );
            case 2:
                 return (
                    <OnboardingStep title="Body Metrics" onNext={next} onBack={back} nextDisabled={data.weight <= 0 || data.height <= 0}>
                         <p className="text-center text-sm text-gray-600 dark:text-gray-300">This helps us calculate things like your BMI. This data stays on your device.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
                            <input type="number" name="weight" value={data.weight} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Height (cm)</label>
                            <input type="number" name="height" value={data.height} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                        </div>
                    </OnboardingStep>
                );
            case 3:
                return (
                    <OnboardingStep title="Cycle Details" onNext={next} onBack={back} nextDisabled={data.periodLength <= 0 || data.cycleLength <= 0}>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-300">Provide your recent cycle info for accurate predictions.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First day of your last period</label>
                            <input type="date" name="lastPeriodDate" value={data.lastPeriodDate} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Typical period duration (days)</label>
                            <input type="number" name="periodLength" value={data.periodLength} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Average cycle length (days)</label>
                            <input type="number" name="cycleLength" value={data.cycleLength} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                        </div>
                    </OnboardingStep>
                );
            case 4:
                return (
                     <OnboardingStep title="All Set!" onNext={handleFinish} onBack={back} isLastStep={true}>
                         <p className="text-center text-gray-600 dark:text-gray-300">You're ready to start your journey with BEHO Cycle. Tap 'Finish' to go to your personalized calendar.</p>
                        <div className="text-center mt-6">
                            <svg className="w-24 h-24 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                     </OnboardingStep>
                )
        }
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 h-screen flex flex-col justify-center items-center text-gray-800 dark:text-gray-200 p-4">
            <div className="w-full max-w-sm mb-4">
                <ProgressBar current={step} total={totalSteps} />
            </div>
            {renderStep()}
        </div>
    );
};