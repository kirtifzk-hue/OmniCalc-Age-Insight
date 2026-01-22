import React, { useState } from 'react';
import { Calculator, Hourglass } from 'lucide-react';
import StandardCalculator from './components/StandardCalculator';
import AgeCalculator from './components/AgeCalculator';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CALCULATOR);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center bg-slate-50 relative">
      <div className="w-full h-full max-w-lg bg-white sm:h-[90vh] sm:rounded-[3rem] sm:shadow-2xl sm:border sm:border-slate-200 overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <header className="px-6 pt-6 pb-2 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                    {mode === AppMode.CALCULATOR ? 'Standard Calc' : 'Age Insight'}
                </h1>
                <div className="bg-slate-100 p-1 rounded-full flex gap-1">
                    <button
                        onClick={() => setMode(AppMode.CALCULATOR)}
                        className={`p-2 rounded-full transition-all duration-200 ${mode === AppMode.CALCULATOR ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Calculator size={20} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={() => setMode(AppMode.AGE)}
                        className={`p-2 rounded-full transition-all duration-200 ${mode === AppMode.AGE ? 'bg-white shadow text-purple-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Hourglass size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
            <div className="h-px w-full bg-slate-100" />
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden p-6 relative">
            <div className={`transition-opacity duration-300 h-full ${mode === AppMode.CALCULATOR ? 'opacity-100 z-10' : 'opacity-0 absolute top-0 left-0 w-full pointer-events-none'}`}>
                 <StandardCalculator />
            </div>
            <div className={`transition-opacity duration-300 h-full ${mode === AppMode.AGE ? 'opacity-100 z-10' : 'opacity-0 absolute top-0 left-0 w-full pointer-events-none'}`}>
                 <AgeCalculator />
            </div>
        </main>
      </div>
      
      {/* Disclaimer for desktop view */}
      <div className="fixed bottom-4 text-slate-400 text-xs hidden sm:block">
        Powered by Gemini • OmniCalc 2024
      </div>
    </div>
  );
};

export default App;