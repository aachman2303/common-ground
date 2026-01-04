import React from 'react';
import { CHECK_IN_OPTIONS } from '../constants';

interface CheckInProps {
  onComplete: (mood: string) => void;
}

export const CheckIn: React.FC<CheckInProps> = ({ onComplete }) => {
  return (
    <div className="space-y-8 animate-appear">
      <div className="text-center space-y-4 py-8">
        <h2 className="text-3xl font-serif font-bold text-brand-900">How is your heart today?</h2>
        <p className="text-stone-500 text-sm max-w-[260px] mx-auto leading-relaxed font-medium">
          Share your reality. Find shared strength. <br/> Your feelings are valid here.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {CHECK_IN_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onComplete(option.id)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-white shadow-soft hover:shadow-lg hover:border-brand-100 hover:bg-brand-50/50 transition-all duration-300 group aspect-square relative overflow-hidden active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-brand-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="text-5xl mb-4 transform transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 filter drop-shadow-sm">{option.icon}</span>
            <span className="font-bold text-stone-600 text-sm text-center px-1 relative z-10 group-hover:text-brand-700 transition-colors duration-300">{option.label}</span>
          </button>
        ))}
      </div>

      <div className="text-center pt-4">
        <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white shadow-sm">
           <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
           <p className="text-xs text-stone-500 font-bold tracking-wide">
             1,248 students checked in today
           </p>
        </div>
      </div>
    </div>
  );
};