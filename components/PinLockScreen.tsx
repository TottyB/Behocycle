
import React, { useState } from 'react';

interface PinLockScreenProps {
  pin: string;
  onUnlock: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({ pin, onUnlock }) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState(false);

  const handlePinChange = (value: string) => {
    if (error) setError(false);
    if (enteredPin.length < 4) {
      const newPin = enteredPin + value;
      setEnteredPin(newPin);
      if (newPin.length === 4) {
        if (newPin === pin) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setEnteredPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    if (error) setError(false);
  };

  const PinDots: React.FC<{ length: number, error: boolean }> = ({ length, error }) => {
    const errorClass = error ? 'animate-shake border-red-500' : 'border-gray-400 dark:border-gray-600';
    return (
      <div className={`flex justify-center gap-4 mb-8 ${errorClass}`}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-colors duration-200 ${i < length ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-700'}`}
          />
        ))}
      </div>
    );
  };
  
  const Key: React.FC<{ value: string, onClick: (val: string) => void }> = ({ value, onClick }) => (
    <button onClick={() => onClick(value)} className="w-20 h-20 rounded-full bg-gray-200/50 dark:bg-gray-800/50 text-3xl font-light flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500">
        {value}
    </button>
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 h-screen flex flex-col justify-center items-center text-gray-800 dark:text-gray-200 p-4">
        <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Enter PIN</h1>
            <PinDots length={enteredPin.length} error={error}/>
        </div>
        <div className="grid grid-cols-3 gap-6">
            {'123456789'.split('').map(val => <Key key={val} value={val} onClick={handlePinChange} />)}
            <div className="w-20 h-20"></div> {/* Placeholder */}
            <Key value="0" onClick={handlePinChange} />
            <button onClick={handleDelete} className="w-20 h-20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 12M3 12l6.414-6.414a2 2 0 012.828 0L21 12" />
                </svg>
            </button>
        </div>
        <style>{`
          @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
          }
          .animate-shake { animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both; }
        `}</style>
    </div>
  );
};
