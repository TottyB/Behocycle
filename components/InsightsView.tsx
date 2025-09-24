
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { UserProfile, CycleAnalytics } from '../types';
import { Card } from './common/Card';
import { SparklesIcon } from './common/Icons';

export const InsightsView: React.FC<{ profile: UserProfile, cycleData: CycleAnalytics }> = ({ profile, cycleData }) => {
    const [insights, setInsights] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const generateInsights = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setInsights('');
        
        if (!process.env.API_KEY) {
            setError("API key is not configured.");
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `
                Analyze the following menstrual cycle data for a user and provide personalized, supportive, and actionable health insights.
                The user's profile is: Age ${profile.age}, Weight ${profile.weight}kg, Height ${profile.height}cm.
                Their cycle analytics are:
                - Average Cycle Length: ${cycleData.averageCycleLength} days
                - Average Period Length: ${cycleData.averagePeriodLength} days
                - Cycle history (last 5): ${JSON.stringify(cycleData.cycleHistory.slice(0, 5))}
                
                Based on this data, provide 3-4 concise bullet points with insights. Focus on potential patterns, general wellness tips related to their cycle length, and suggestions for symptom management if applicable. Keep the tone positive and informative. Do not give medical advice, but rather general wellness suggestions. Start with a brief, encouraging sentence. Format the output as a simple string, using markdown for bullet points (e.g., "* Insight 1...").
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setInsights(response.text);

        } catch (e) {
            console.error(e);
            setError('Failed to generate insights. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [profile, cycleData]);

    const formattedInsights = insights.split('* ').filter(s => s.trim() !== '').map((s, i) => (
      <li key={i} className="mb-2 pl-2 border-l-2 border-primary-400">{s.trim()}</li>
    ));

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <SparklesIcon className="w-7 h-7 text-primary-500" />
                AI-Powered Insights
            </h1>
            
            <Card>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Get personalized health tips and insights based on your logged cycle data. Our AI analyzes your patterns to provide supportive guidance for your well-being.
                </p>
                <button
                    onClick={generateInsights}
                    disabled={isLoading || cycleData.cycleHistory.length < 2}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                       "Generate My Insights"
                    )}
                </button>
                {cycleData.cycleHistory.length < 2 && (
                    <p className="text-xs text-center text-gray-500 mt-2">Log at least two full cycles to enable insights.</p>
                )}
            </Card>

            {error && (
                <Card className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700">
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                </Card>
            )}

            {insights && !isLoading && (
                <Card>
                    <h2 className="text-lg font-semibold mb-3">Your Personalized Insights</h2>
                    <ul className="text-gray-700 dark:text-gray-300 list-none">
                        {formattedInsights}
                    </ul>
                </Card>
            )}
        </div>
    );
};
