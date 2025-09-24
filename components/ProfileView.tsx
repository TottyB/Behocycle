
import React, { useState, useMemo, useEffect } from 'react';
import type { UserProfile } from '../types';
import { Card } from './common/Card';

export const ProfileView: React.FC<{ profile: UserProfile, setProfile: (profile: UserProfile) => void }> = ({ profile, setProfile }) => {
    const [localProfile, setLocalProfile] = useState(profile);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setLocalProfile(profile);
    }, [profile]);
    
    const bmi = useMemo(() => {
        if (localProfile.height > 0) {
            const heightInMeters = localProfile.height / 100;
            return (localProfile.weight / (heightInMeters * heightInMeters)).toFixed(1);
        }
        return 'N/A';
    }, [localProfile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setLocalProfile(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleSave = () => {
        setProfile(localProfile);
        setIsEditing(false);
    }
    
    const handleCancel = () => {
        setLocalProfile(profile);
        setIsEditing(false);
    }

    const renderBmiInfo = () => {
        const bmiValue = parseFloat(bmi);
        if (isNaN(bmiValue)) return null;

        let category = '';
        let colorClass = '';

        if (bmiValue < 18.5) {
            category = 'Underweight';
            colorClass = 'text-blue-500';
        } else if (bmiValue < 25) {
            category = 'Normal weight';
            colorClass = 'text-green-500';
        } else if (bmiValue < 30) {
            category = 'Overweight';
            colorClass = 'text-yellow-500';
        } else {
            category = 'Obesity';
            colorClass = 'text-red-500';
        }

        return <p className={`text-sm font-medium ${colorClass}`}>{category}</p>;
    }


    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {profile.name}!</h1>

            <Card className="text-center">
                 <p className="text-sm text-gray-500 dark:text-gray-400">Your Body Mass Index (BMI)</p>
                 <p className="text-4xl font-bold my-1 text-primary-600 dark:text-primary-400">{bmi}</p>
                 {renderBmiInfo()}
            </Card>
            
            <Card>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={localProfile.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={localProfile.age}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={localProfile.weight}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Height (cm)</label>
                        <input
                            type="number"
                            name="height"
                            value={localProfile.height}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="flex-1 px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700">Save</button>
                            <button onClick={handleCancel} className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        </>
                    ) : (
                         <button onClick={() => setIsEditing(true)} className="w-full px-4 py-2 font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                            Edit Profile
                         </button>
                    )}
                </div>
            </Card>
        </div>
    );
};