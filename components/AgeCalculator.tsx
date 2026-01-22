import React, { useState } from 'react';
import { AgeDetails, NextBirthday, BirthdayInsights } from '../types';
import { getBirthdayInsights } from '../services/geminiService';
import { Calendar, Cake, Sparkles, BrainCircuit, RefreshCw } from 'lucide-react';

const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<AgeDetails | null>(null);
  const [nextBirthday, setNextBirthday] = useState<NextBirthday | null>(null);
  const [insights, setInsights] = useState<BirthdayInsights | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateAge = async () => {
    if (!birthDate) return;

    const today = new Date();
    const birth = new Date(birthDate);

    if (isNaN(birth.getTime())) return;
    if (birth > today) {
        alert("You haven't been born yet!");
        return;
    }

    // --- Precise Age Calculation ---
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      // Days in previous month
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setAge({ years, months, days });

    // --- Next Birthday Calculation ---
    const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (today > nextBday) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = Math.abs(nextBday.getTime() - today.getTime());
    const diffDaysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Approximation for months/days breakdown for next bday
    let nbMonths = nextBday.getMonth() - today.getMonth();
    let nbDays = nextBday.getDate() - today.getDate();

    if (nbDays < 0) {
        nbMonths--;
        const prevMonth = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0);
        nbDays += prevMonth.getDate();
    }
    if (nbMonths < 0) {
        nbMonths += 12;
    }

    const weekday = nextBday.toLocaleString('en-US', { weekday: 'long' });
    setNextBirthday({ months: nbMonths, days: nbDays, weekday });

    // --- AI Insights ---
    setLoading(true);
    setInsights(null); // Clear previous insights
    try {
      const data = await getBirthdayInsights(birthDate);
      setInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
      setBirthDate('');
      setAge(null);
      setNextBirthday(null);
      setInsights(null);
  };

  return (
    <div className="max-w-md mx-auto h-full overflow-y-auto pb-20 no-scrollbar">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar className="text-indigo-500" size={24} />
                Enter your Date of Birth
            </h2>
            <div className="flex gap-3">
                <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 bg-slate-50"
                />
                <button 
                    onClick={calculateAge}
                    disabled={!birthDate || loading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                    {loading ? <RefreshCw className="animate-spin" /> : 'Calculate'}
                </button>
            </div>
        </div>

        {age && (
            <div className="space-y-4 animate-fade-in-up">
                {/* Age Result */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
                    <div className="text-indigo-100 font-medium mb-2">You are exactly</div>
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-5xl font-bold">{age.years}</span>
                        <span className="text-xl text-indigo-100">years</span>
                    </div>
                    <div className="flex gap-4 text-lg">
                        <div className="flex items-baseline gap-1">
                            <span className="font-bold text-2xl">{age.months}</span>
                            <span className="text-indigo-100 text-sm">months</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="font-bold text-2xl">{age.days}</span>
                            <span className="text-indigo-100 text-sm">days old</span>
                        </div>
                    </div>
                </div>

                {/* Next Birthday */}
                {nextBirthday && (
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                            <Cake size={28} />
                        </div>
                        <div>
                            <div className="text-slate-500 text-sm font-medium">Next Birthday</div>
                            <div className="text-slate-800 font-semibold text-lg">
                                {nextBirthday.months} months, {nextBirthday.days} days
                            </div>
                            <div className="text-slate-400 text-xs">
                                It will be on a <span className="text-indigo-500 font-medium">{nextBirthday.weekday}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Insights Section */}
                {loading ? (
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
                        <RefreshCw className="animate-spin text-indigo-400 mx-auto mb-3" size={32} />
                        <p className="text-slate-500 text-sm">Consulting the stars...</p>
                    </div>
                ) : insights ? (
                    <div className="space-y-4">
                         <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl shadow-md">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="text-yellow-400" size={20} />
                                <h3 className="font-semibold text-lg">Zodiac Insights</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800 p-4 rounded-2xl">
                                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Sign</div>
                                    <div className="text-xl font-bold text-white">{insights.zodiac}</div>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-2xl">
                                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Trait</div>
                                    <div className="text-sm font-medium text-white leading-snug">{insights.zodiacTrait}</div>
                                </div>
                            </div>
                         </div>

                         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                             <div className="flex items-center gap-2 mb-4">
                                <BrainCircuit className="text-purple-500" size={20} />
                                <h3 className="font-semibold text-lg text-slate-800">Did You Know?</h3>
                            </div>
                            <ul className="space-y-3">
                                {insights.historicalFacts.map((fact, idx) => (
                                    <li key={idx} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                                        <span className="text-indigo-400 font-bold">•</span>
                                        {fact}
                                    </li>
                                ))}
                            </ul>
                         </div>
                         
                         <button onClick={reset} className="w-full py-3 text-slate-400 hover:text-slate-600 font-medium text-sm transition-colors">
                            Check Another Date
                         </button>
                    </div>
                ) : null}
            </div>
        )}
    </div>
  );
};

export default AgeCalculator;