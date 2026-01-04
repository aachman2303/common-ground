import React, { useState, useRef } from 'react';
import { AVATARS } from '../constants';
import { analyzeCampusSchedule, analyzeSyllabusImage } from '../services/geminiService';
import { CalendarEvent } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onAddEvent }) => {
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');
  const [analyzing, setAnalyzing] = useState(false);
  const [insight, setInsight] = useState<{ title: string; insight: string } | null>(null);
  
  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('20:00');
  const [newEventType, setNewEventType] = useState<'academic' | 'social' | 'wellness'>('academic');

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const result = await analyzeCampusSchedule();
    setInsight(result);
    setAnalyzing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
          alert("File too large. Please upload < 2MB.");
          return;
      }

      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
          const base64 = reader.result as string;
          const content = base64.split(',')[1]; // Remove data:image/...;base64, prefix
          
          try {
             // Simulate or Call AI Service
             const newEvents = await analyzeSyllabusImage(content);
             newEvents.forEach(ev => onAddEvent(ev));
             setViewMode('month'); // Switch to month view to see results
          } catch (err) {
              console.error(err);
              alert("Could not analyze document.");
          } finally {
              setUploading(false);
          }
      };
      reader.readAsDataURL(file);
  };

  const submitEvent = () => {
    if (!newEventTitle) return;
    const colors = {
        academic: 'bg-blue-100 border-blue-200',
        social: 'bg-green-100 border-green-200',
        wellness: 'bg-orange-100 border-orange-200'
    };
    const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: newEventTitle,
        time: newEventTime,
        duration: 60,
        type: newEventType,
        attendees: [0],
        color: colors[newEventType]
    };
    onAddEvent(newEvent);
    setShowAddModal(false);
    setNewEventTitle('');
  };

  const sortedEvents = [...events].sort((a, b) => a.time.localeCompare(b.time));

  // Mock Days for Month View
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold font-serif text-stone-800">Schedule</h2>
         <div className="flex bg-stone-100 rounded-lg p-1">
             <button 
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'day' ? 'bg-white shadow-sm text-brand-700' : 'text-stone-400'}`}
             >
                 Day
             </button>
             <button 
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'month' ? 'bg-white shadow-sm text-brand-700' : 'text-stone-400'}`}
             >
                 Month
             </button>
         </div>
      </div>

      {/* AI Document Upload */}
      <div className="bg-brand-50 border-2 border-dashed border-brand-200 rounded-xl p-4 text-center cursor-pointer hover:bg-brand-100 transition-colors relative overflow-hidden" onClick={() => fileInputRef.current?.click()}>
          <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/*,.pdf" // Accepting images for demo, PDF assumes native capability
             onChange={handleFileUpload}
          />
          {uploading ? (
             <div className="flex flex-col items-center justify-center py-2 animate-pulse">
                <span className="text-2xl mb-1">🧠</span>
                <span className="text-xs font-bold text-brand-700">AI Analyzing Syllabus...</span>
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center py-2">
                <span className="text-2xl mb-1">📄</span>
                <span className="text-xs font-bold text-brand-700">Upload Syllabus / Schedule</span>
                <span className="text-[9px] text-brand-500 mt-1">AI will extract dates automatically (Max 2MB)</span>
             </div>
          )}
      </div>

      {viewMode === 'day' && (
        <div className="space-y-6 animate-fade-in">
            {/* Analysis Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative transition-all duration-300 hover:shadow-md">
                <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                    <span className="text-xl animate-bounce" style={{ animationDuration: '2s' }}>📅</span>
                    <h2 className="font-bold text-slate-800">Daily Insight</h2>
                    </div>
                    {analyzing ? (
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-brand-600 animate-pulse">Gemini Reading...</span>
                    </div>
                    ) : (
                    <button 
                        onClick={handleAnalyze}
                        className="text-xs bg-brand-50 text-brand-600 px-3 py-1.5 rounded-full font-bold hover:bg-brand-100 transition-colors"
                    >
                        Analyze Pattern
                    </button>
                    )}
                </div>
                {insight && (
                    <div className="bg-brand-50/50 rounded-xl p-4 animate-fade-in border border-brand-100">
                    <h3 className="text-sm font-bold text-brand-800 mb-1">{insight.title}</h3>
                    <p className="text-xs text-brand-700">{insight.insight}</p>
                    </div>
                )}
                </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-4 space-y-4 pb-20">
                <div className="absolute left-[23px] top-2 bottom-0 w-0.5 bg-slate-100"></div>
                {sortedEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-start space-x-4 animate-appear" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex flex-col items-center min-w-[48px] pt-1 z-10 bg-slate-50">
                        <span className="text-xs font-bold text-slate-500">{event.time}</span>
                        <div className={`w-3 h-3 rounded-full border-2 border-white mt-1 shadow-sm ${analyzing ? 'bg-brand-400' : 'bg-slate-300'}`}></div>
                    </div>
                    <div className={`flex-1 rounded-xl p-4 border shadow-sm ${event.color}`}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-slate-800 text-sm">{event.title}</h3>
                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">{event.type}</span>
                        </div>
                        {/* Similar Stress / Chat Button */}
                        {event.type === 'academic' && (
                             <button className="mt-2 w-full py-2 bg-white/50 hover:bg-white text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 border border-black/5">
                                 <span>💬</span>
                                 <span>Find Study Buddy</span>
                             </button>
                        )}
                        <div className="flex -space-x-2 overflow-hidden py-1 pl-1 mt-2">
                            {event.attendees.map((avatarIdx, i) => (
                            <div key={i} className="relative z-0 hover:z-20">
                                <div className={`w-6 h-6 rounded-full border border-white ${AVATARS[avatarIdx]?.color || 'bg-gray-200'} flex items-center justify-center text-[10px]`}>
                                {AVATARS[avatarIdx]?.icon}
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
                ))}
                 <button onClick={() => setShowAddModal(true)} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold hover:border-brand-400 hover:text-brand-600 transition-colors">
                     + Add Event manually
                 </button>
            </div>
        </div>
      )}

      {viewMode === 'month' && (
          <div className="animate-fade-in pb-20">
              <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                  {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-xs font-bold text-stone-400">{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                  {daysInMonth.map(day => {
                      const isStress = day === 15 || day === 22; // Mock AI Prediction
                      const hasEvent = events.length > 0 && day % 3 === 0; // Mock events
                      return (
                          <div key={day} className={`aspect-square rounded-xl flex flex-col items-center justify-center relative border transition-all ${isStress ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100'}`}>
                              <span className={`text-xs font-bold ${isStress ? 'text-red-500' : 'text-slate-600'}`}>{day}</span>
                              {hasEvent && <div className="w-1.5 h-1.5 bg-brand-500 rounded-full mt-1"></div>}
                              {isStress && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                              )}
                          </div>
                      );
                  })}
              </div>
              <div className="mt-6 bg-red-50 p-4 rounded-xl border border-red-100 flex items-start space-x-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                      <h3 className="font-bold text-red-800 text-sm">AI Stress Prediction</h3>
                      <p className="text-xs text-red-600 mt-1">
                          Based on syllabus analysis, the 3rd week looks heavy for Computer Science students. 
                          <span className="font-bold underline ml-1 cursor-pointer">Join the 'Crunch Time' chat?</span>
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-slide-up">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Add to Schedule</h3>
                  <div className="space-y-4">
                      <input 
                          type="text" 
                          value={newEventTitle}
                          onChange={(e) => setNewEventTitle(e.target.value)}
                          placeholder="Event Title"
                          className="w-full p-3 rounded-xl border border-slate-200 focus:border-brand-500 outline-none"
                      />
                      <div className="flex space-x-2">
                            <input 
                                type="time" 
                                value={newEventTime}
                                onChange={(e) => setNewEventTime(e.target.value)}
                                className="flex-1 p-3 rounded-xl border border-slate-200 outline-none"
                            />
                            <select 
                                value={newEventType}
                                onChange={(e) => setNewEventType(e.target.value as any)}
                                className="flex-1 p-3 rounded-xl border border-slate-200 outline-none bg-white"
                            >
                                <option value="academic">Academic</option>
                                <option value="social">Social</option>
                                <option value="wellness">Wellness</option>
                            </select>
                      </div>
                      <div className="flex space-x-3 pt-2">
                          <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
                          <button onClick={submitEvent} disabled={!newEventTitle} className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-xl disabled:opacity-50">Add</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
