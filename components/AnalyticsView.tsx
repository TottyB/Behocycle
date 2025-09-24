
import React from 'react';
import type { CycleAnalytics } from '../types';
import { Card } from './common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export const AnalyticsView: React.FC<{ cycleData: CycleAnalytics }> = ({ cycleData }) => {
    
    const chartData = cycleData.cycleHistory.slice().reverse().map((cycle, index) => ({
        name: `Cycle ${index + 1}`,
        'Cycle Length': cycle.cycleLength,
        'Period Length': cycle.periodLength,
    })).filter(d => d['Cycle Length'] > 0);
    
    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>

            <div className="grid grid-cols-2 gap-4">
                <Card className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Cycle Length</p>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{cycleData.averageCycleLength}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">days</p>
                </Card>
                <Card className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Period Length</p>
                    <p className="text-3xl font-bold text-rose-500 dark:text-rose-400">{cycleData.averagePeriodLength}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">days</p>
                </Card>
            </div>

            <Card>
                <h2 className="text-lg font-semibold mb-4">Cycle Length Variation</h2>
                {chartData.length > 1 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="name" stroke="rgba(128, 128, 128, 0.5)" />
                            <YAxis stroke="rgba(128, 128, 128, 0.5)"/>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                    borderColor: 'rgba(75, 85, 99, 0.8)'
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="Cycle Length" stroke="#f43f5e" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <p>Not enough cycle data to show a chart. Log at least two full cycles.</p>
                    </div>
                )}
            </Card>

            <Card>
                <h2 className="text-lg font-semibold mb-4">Cycle History</h2>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cycleData.cycleHistory.length > 0 ? cycleData.cycleHistory.map((cycle, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div>
                                <p className="font-medium">{new Date(cycle.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Period: {cycle.periodLength} days</p>
                            </div>
                            {cycle.cycleLength > 0 && <p className="font-semibold">{cycle.cycleLength} days</p>}
                        </div>
                    )) : (
                        <p className="text-center py-4 text-gray-500">No cycle history yet.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};
