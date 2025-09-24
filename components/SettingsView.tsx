
import React, { useState, useRef } from 'react';
import type { UserProfile, Cycle, DailyLog } from '../types';
import { Card } from './common/Card';

interface SettingsViewProps {
  theme: string;
  setTheme: (theme: string) => void;
  pin: string | null;
  setPin: (pin: string | null) => void;
  allData: {
      profile: UserProfile;
      cycles: Cycle[];
      dailyLogs: Record<string, DailyLog>;
  };
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme, setTheme, pin, setPin, allData }) => {
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleThemeChange = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleSetPin = () => {
        if (newPin && newPin === confirmPin && newPin.length >= 4) {
            setPin(newPin);
            setNewPin('');
            setConfirmPin('');
            alert('PIN set successfully!');
        } else {
            alert('PINs do not match or are too short (minimum 4 digits).');
        }
    };
    
    const handleRemovePin = () => {
        setPin(null);
        alert('PIN removed.');
    };

    const handleBackup = () => {
        const dataStr = JSON.stringify(allData);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'aura_cycle_backup.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("Invalid file content");
                const restoredData = JSON.parse(text);
                if (restoredData.profile && restoredData.cycles && restoredData.dailyLogs) {
                    // In a real app with global state management, you'd dispatch an action here.
                    // For now, we'll just reload with the new data in localStorage.
                    localStorage.setItem('user-profile', JSON.stringify(restoredData.profile));
                    localStorage.setItem('user-cycles', JSON.stringify(restoredData.cycles));
                    localStorage.setItem('user-daily-logs', JSON.stringify(restoredData.dailyLogs));
                    alert('Data restored successfully! The app will now reload.');
                    window.location.reload();
                } else {
                    throw new Error("Invalid data structure in backup file.");
                }
            } catch (error) {
                alert(`Failed to restore data: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        };
        reader.readAsText(file);
    };


    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            
            <Card>
                <h2 className="text-lg font-semibold mb-3">Appearance</h2>
                <div className="flex items-center justify-between">
                    <span>Dark Mode</span>
                    <button onClick={handleThemeChange} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'}`}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </Card>

            <Card>
                <h2 className="text-lg font-semibold mb-3">Privacy</h2>
                {pin ? (
                    <div>
                        <p className="text-green-600 dark:text-green-400 mb-4">PIN lock is active.</p>
                        <button onClick={handleRemovePin} className="w-full px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Remove PIN</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                         <input type="password" placeholder="Enter 4-digit PIN" value={newPin} onChange={e => setNewPin(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                         <input type="password" placeholder="Confirm PIN" value={confirmPin} onChange={e => setConfirmPin(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                         <button onClick={handleSetPin} className="w-full px-4 py-2 font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700">Set PIN</button>
                    </div>
                )}
            </Card>
            
             <Card>
                <h2 className="text-lg font-semibold mb-3">Data Management</h2>
                <div className="flex gap-4">
                    <button onClick={handleBackup} className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Backup Data</button>
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Restore Data</button>
                    <input type="file" ref={fileInputRef} onChange={handleRestore} className="hidden" accept=".json" />
                </div>
            </Card>
        </div>
    );
};
