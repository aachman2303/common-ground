import React, { useState } from 'react';
import { CHECK_IN_OPTIONS } from '../constants';

interface CheckInProps {
  onComplete: (mood: string) => void;
}

export const CheckIn: React.FC<CheckInProps> = ({ onComplete }) => {
  return (
    <div className="space-y-8 animate-appear pb-24">
      {/* Visual Header */}
      <div className="relative h-48 rounded-[2rem] overflow-hidden shadow-lg mx-2 mt-2 group">
          <img 
            src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Calm Reflection" 
            className="w-full h-full object-cover opacity-80 transition-transform duration-[20s] ease-linear group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex flex-col justify-end p-6">
              <h2 className="text-3xl font-serif font-bold text-white mb-1 shadow-sm">Hello.</h2>
              <p className="text-stone-200 text-sm font-medium">How is your heart today?</p>
          </div>
      </div>

      <div className="text-center px-4">
        <p className="text-stone-500 text-sm font-medium leading-relaxed">
          Share your reality to unlock the heatmap. <br/> Your feelings are valid here.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 px-2">
        {CHECK_IN_OPTIONS.map((option, idx) => (
          <button
            key={option.id}
            onClick={() => onComplete(option.id)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:border-brand-200 hover:bg-brand-50/30 transition-all duration-300 group aspect-square relative overflow-hidden active:scale-95"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-brand-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <span className="text-5xl mb-4 transform transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6 filter drop-shadow-sm">{option.icon}</span>
            
            <span className="font-bold text-stone-600 text-sm text-center px-1 relative z-10 group-hover:text-brand-800 transition-colors duration-300">{option.label}</span>
            
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs shadow-md">→</div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center pt-2">
        <div className="inline-flex items-center space-x-3 bg-white px-5 py-2.5 rounded-full border border-stone-100 shadow-sm">
           <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
           </span>
           <p className="text-xs text-stone-500 font-bold tracking-wide">
             1,248 students checked in today
           </p>
        </div>
      </div>
    </div>
  );
};