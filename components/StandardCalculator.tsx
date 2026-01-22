import React, { useState, useEffect } from 'react';
import { Delete, RotateCcw, Equal } from 'lucide-react';

const StandardCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(`${display} ${op} `);
    setIsNewNumber(true);
  };

  const calculate = () => {
    if (!equation) return;
    try {
      // Note: In a production app, use a safe math parser instead of eval.
      // For this simple demo, we sanitize rigidly.
      const fullExpression = equation + display;
      // Basic sanitization to allow only numbers and operators
      if (!/^[0-9+\-*/. ]+$/.test(fullExpression)) {
        throw new Error("Invalid characters");
      }
      
      // eslint-disable-next-line no-eval
      const result = eval(fullExpression);
      
      // Handle floating point precision errors roughly
      const formattedResult = parseFloat(result.toFixed(8)).toString();
      
      setDisplay(formattedResult);
      setEquation('');
      setIsNewNumber(true);
    } catch (e) {
      setDisplay('Error');
      setEquation('');
      setIsNewNumber(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  };

  const deleteLast = () => {
    if (isNewNumber) return;
    if (display.length === 1) {
      setDisplay('0');
      setIsNewNumber(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      
      if (/[0-9]/.test(key)) {
        handleNumber(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key);
      } else if (key === 'Enter' || key === '=') {
        calculate();
      } else if (key === 'Backspace') {
        deleteLast();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clear();
      } else if (key === '.') {
        if (!display.includes('.') || isNewNumber) {
            handleNumber('.');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, equation, isNewNumber]);

  const Button = ({ 
    label, 
    onClick, 
    className = "", 
    icon = null 
  }: { 
    label?: string; 
    onClick: () => void; 
    className?: string; 
    icon?: React.ReactNode 
  }) => (
    <button
      onClick={onClick}
      className={`
        h-16 sm:h-20 rounded-2xl text-xl sm:text-2xl font-medium transition-all duration-150 active:scale-95 flex items-center justify-center shadow-sm select-none
        ${className}
      `}
    >
      {icon ? icon : label}
    </button>
  );

  return (
    <div className="flex flex-col h-full max-w-md mx-auto">
      {/* Display Area */}
      <div className="bg-slate-800 p-6 rounded-3xl mb-6 shadow-inner flex flex-col items-end justify-end h-40">
        <div className="text-slate-400 text-sm sm:text-base h-6 font-mono mb-1">{equation}</div>
        <div className="text-white text-5xl sm:text-6xl font-light tracking-tight overflow-x-auto w-full text-right scrollbar-hide">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 flex-1">
        <Button onClick={clear} className="bg-slate-200 text-slate-900 hover:bg-slate-300" label="AC" />
        <Button onClick={deleteLast} className="bg-slate-200 text-slate-900 hover:bg-slate-300" icon={<Delete size={24}/>} />
        <Button onClick={() => handleOperator('/')} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200" label="÷" />
        <Button onClick={() => handleOperator('*')} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200" label="×" />

        <Button onClick={() => handleNumber('7')} className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200" label="7" />
        <Button onClick={() => handleNumber('8')} className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200" label="8" />
        <Button onClick={() => handleNumber('9')} className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200" label="9" />
        <Button onClick={() => handleOperator('-')} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200" label="-" />

        <Button onClick={() => handleNumber('4')} className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200" label="4" />
        <Button onClick={() => handleNumber('5')} className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200" label="5" />
        <Button onClick={() => handleNumber('6')} className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200" label="6" />
        <Button onClick={() => handleOperator('+')} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200" label="+" />

        <Button onClick={() => handleNumber('1')} className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200" label="1" />
        <Button onClick={() => handleNumber('2')} className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200" label="2" />
        <Button onClick={() => handleNumber('3')} className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200" label="3" />
        
        {/* Equal button spans 2 rows visually in some designs, but grid here is simpler */}
        <Button onClick={() => calculate()} className="bg-indigo-600 text-white hover:bg-indigo-700 row-span-2 shadow-indigo-200 shadow-lg" icon={<Equal size={32} />} />

        <Button onClick={() => handleNumber('0')} className="col-span-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200" label="0" />
        <Button onClick={() => handleNumber('.')} className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200" label="." />
      </div>
    </div>
  );
};

export default StandardCalculator;