import React, { useEffect, useState } from 'react';
import { MOCK_RESOURCES } from '../constants';
import { CHECK_IN_OPTIONS } from '../constants';
import { getCopingStrategy } from '../services/geminiService';

interface ResourcesProps {
  userMood: string | null;
}

export const Resources: React.FC<ResourcesProps> = ({ userMood }) => {
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [expandedResource, setExpandedResource] = useState<string | null>(null);

  const currentMoodLabel = CHECK_IN_OPTIONS.find(o => o.id === userMood)?.label || "stressed";

  useEffect(() => {
    if (userMood) {
      setLoading(true);
      getCopingStrategy(currentMoodLabel)
        .then(tip => {
          setAiTip(tip);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [userMood, currentMoodLabel]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <h2 className="text-lg font-medium opacity-90 mb-1">Based on your check-in</h2>
        <h1 className="text-2xl font-bold mb-4">Try this today:</h1>
        
        {loading ? (
          <div className="h-16 flex items-center justify-center">
            <div className="animate-pulse bg-white/20 h-2 w-3/4 rounded"></div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <p className="text-lg font-medium leading-relaxed">
              {aiTip || "Take a 5-minute walk without your phone to reset your mind."}
            </p>
          </div>
        )}
        <div className="mt-4 flex items-center text-xs opacity-70">
           <span className="mr-1">✨</span> Suggested by Gemini Intelligence
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Campus Resources</h3>
        <div className="space-y-3">
          {MOCK_RESOURCES.map((resource) => {
            const isExpanded = expandedResource === resource.id;
            return (
              <div 
                key={resource.id} 
                onClick={() => setExpandedResource(isExpanded ? null : resource.id)}
                className={`bg-white p-4 rounded-xl border shadow-sm transition-all duration-300 cursor-pointer ${isExpanded ? 'border-brand-300 ring-1 ring-brand-100' : 'border-slate-100 hover:border-brand-200'}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        resource.type === 'campus' ? 'bg-blue-100 text-blue-700' : 
                        resource.type === 'micro' ? 'bg-green-100 text-green-700' : 
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {resource.type}
                      </span>
                      {resource.attendees && (
                        <span className="text-xs text-slate-400 flex items-center">
                          👥 {resource.attendees}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-slate-800">{resource.title}</h4>
                    {!isExpanded && <p className="text-sm text-slate-500 line-clamp-1">{resource.description}</p>}
                  </div>
                  <div className="pl-4">
                    <button className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-90 bg-brand-50 text-brand-600' : ''}`}>
                      →
                    </button>
                  </div>
                </div>
                {/* Expanded Details */}
                {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 animate-fade-in">
                        <p className="text-sm text-slate-600 leading-relaxed mb-3">{resource.description}</p>
                        <div className="flex space-x-2 text-xs">
                             <div className="bg-slate-100 px-2 py-1 rounded text-slate-500">📍 Student Center, Room 204</div>
                             {resource.waitlist && <div className="bg-orange-100 px-2 py-1 rounded text-orange-600">⏳ {resource.waitlist} Wait</div>}
                        </div>
                        <button className="w-full mt-3 py-2 bg-brand-600 text-white rounded-lg font-bold text-xs hover:bg-brand-700">
                            Register Now
                        </button>
                    </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
        <h4 className="font-bold text-orange-800 text-sm mb-1">Need immediate help?</h4>
        <p className="text-xs text-orange-700 mb-3">
          Crisis counselors are available 24/7. You are not alone.
        </p>
        <button 
            onClick={() => setShowCrisisModal(true)}
            className="w-full py-2 bg-white border border-orange-200 text-orange-700 font-bold text-xs rounded-lg hover:bg-orange-100 transition-colors"
        >
          View Crisis Options
        </button>
      </div>

      {/* Crisis Modal */}
      {showCrisisModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-slide-up border-t-4 border-orange-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Emergency Support</h3>
                        <p className="text-sm text-slate-500">Confidential & 24/7</p>
                    </div>
                    <button onClick={() => setShowCrisisModal(false)} className="text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full">✕</button>
                  </div>

                  <div className="space-y-3">
                      <a href="#" className="flex items-center p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors">
                          <span className="text-2xl mr-3">📞</span>
                          <div>
                              <div className="font-bold text-orange-900">Campus Crisis Line</div>
                              <div className="text-xs text-orange-700">555-0123 • Available Now</div>
                          </div>
                      </a>
                      <a href="#" className="flex items-center p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                          <span className="text-2xl mr-3">💬</span>
                          <div>
                              <div className="font-bold text-slate-800">Crisis Text Line</div>
                              <div className="text-xs text-slate-500">Text "HOME" to 741741</div>
                          </div>
                      </a>
                      <a href="#" className="flex items-center p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                          <span className="text-2xl mr-3">🏥</span>
                          <div>
                              <div className="font-bold text-slate-800">UHS Urgent Care</div>
                              <div className="text-xs text-slate-500">123 University Ave • Open 24/7</div>
                          </div>
                      </a>
                  </div>
                  
                  <button onClick={() => setShowCrisisModal(false)} className="w-full mt-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">
                      Close
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};