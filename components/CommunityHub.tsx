import React, { useState } from 'react';
import { Community } from '../types';

interface CommunityHubProps {
  communities: Community[];
  onJoin: (id: string) => void;
  onCreate: (community: Community) => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ communities, onJoin, onCreate }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'search' | 'wall'>('browse');
  const [searchCode, setSearchCode] = useState('');
  const [foundCommunity, setFoundCommunity] = useState<Community | null>(null);
  const [searchError, setSearchError] = useState('');
  
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');
  
  const [notes, setNotes] = useState([
    { id: 1, text: "You are stronger than this midterm.", color: "bg-yellow-100" },
    { id: 2, text: "Don't forget to drink water!", color: "bg-blue-100" },
    { id: 3, text: "One assignment at a time.", color: "bg-pink-100" },
    { id: 4, text: "Almost there, keep pushing!", color: "bg-green-100" },
    { id: 5, text: "Grades don't define your worth.", color: "bg-purple-100" },
  ]);
  const [newNote, setNewNote] = useState('');

  const postNote = () => {
      if(!newNote.trim()) return;
      const colors = ["bg-yellow-100", "bg-blue-100", "bg-pink-100", "bg-green-100", "bg-purple-100"];
      setNotes([{
          id: Date.now(),
          text: newNote,
          color: colors[Math.floor(Math.random() * colors.length)]
      }, ...notes]);
      setNewNote('');
  };

  const handleCreate = () => {
    if (!newCommName || !newCommDesc) return;
    
    const newCommunity: Community = {
        id: Date.now().toString(),
        name: newCommName,
        description: newCommDesc,
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        members: 1,
        lat: Math.random() * 80 + 10, // Random pos on mock map
        lng: Math.random() * 80 + 10,
        isPrivate: false,
        avatar: '🆕',
        isJoined: true
    };

    onCreate(newCommunity);
    setNewCommName('');
    setNewCommDesc('');
    setActiveTab('browse');
  };

  const handleSearch = () => {
     const found = communities.find(c => c.code === searchCode);
     if (found) {
         setFoundCommunity(found);
         setSearchError('');
     } else {
         setFoundCommunity(null);
         setSearchError('Invalid code. Try again.');
     }
  };

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-bold overflow-x-auto">
        <button 
          onClick={() => setActiveTab('browse')}
          className={`flex-1 py-2 px-2 rounded-lg transition-all whitespace-nowrap ${activeTab === 'browse' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-600'}`}
        >
          Explore
        </button>
        <button 
          onClick={() => setActiveTab('wall')}
          className={`flex-1 py-2 px-2 rounded-lg transition-all whitespace-nowrap ${activeTab === 'wall' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-600'}`}
        >
          Wall ❤️
        </button>
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-2 px-2 rounded-lg transition-all whitespace-nowrap ${activeTab === 'search' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-600'}`}
        >
          Enter Code
        </button>
        <button 
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-2 px-2 rounded-lg transition-all whitespace-nowrap ${activeTab === 'create' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-600'}`}
        >
          + Create
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'browse' && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-lg font-bold text-slate-800">Popular on Campus</h2>
          <div className="grid gap-3">
            {communities.map((comm) => (
              <div key={comm.id} className={`bg-white p-4 rounded-xl border shadow-sm flex items-center space-x-4 transition-all duration-300 ${comm.isJoined ? 'border-brand-300 ring-1 ring-brand-100' : 'border-slate-100 hover:border-brand-200'}`}>
                <div className="text-2xl bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center">
                  {comm.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">{comm.name}</h3>
                    {comm.isPrivate && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">🔒</span>}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{comm.description}</p>
                  <div className="mt-1 flex items-center text-[10px] text-slate-400">
                    <span className="font-mono bg-slate-50 px-1 rounded mr-2">Code: {comm.code}</span>
                    <span>👤 {comm.members} Members</span>
                  </div>
                </div>
                <button 
                    onClick={() => onJoin(comm.id)}
                    className={`font-bold text-xs px-3 py-1.5 rounded-lg transition-colors ${comm.isJoined ? 'bg-green-100 text-green-700' : 'bg-brand-50 text-brand-600 hover:bg-brand-100'}`}
                >
                  {comm.isJoined ? 'Joined' : 'Join'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'wall' && (
        <div className="space-y-4 animate-fade-in">
           <div className="bg-pink-50 border border-pink-100 p-4 rounded-xl text-center">
               <h2 className="text-lg font-bold text-pink-800">Encouragement Wall</h2>
               <p className="text-xs text-pink-600 mb-3">Leave an anonymous note to lift someone up.</p>
               <div className="flex space-x-2">
                   <input 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type a kind message..."
                    className="flex-1 text-sm p-2 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                   />
                   <button onClick={postNote} className="bg-pink-500 text-white px-3 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-pink-600">
                       Post
                   </button>
               </div>
           </div>
           
           <div className="columns-2 gap-3 space-y-3 pb-20">
               {notes.map((note) => (
                   <div key={note.id} className={`${note.color} p-4 rounded-xl shadow-sm break-inside-avoid rotate-1 hover:rotate-0 transition-transform duration-300`}>
                       <p className="text-sm font-handwriting font-medium text-slate-700 leading-snug">"{note.text}"</p>
                   </div>
               ))}
           </div>
        </div>
      )}

      {activeTab === 'search' && (
        <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-fade-in">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl mb-2">
            🔑
          </div>
          <h2 className="text-xl font-bold text-slate-800">Have a Code?</h2>
          <p className="text-center text-sm text-slate-500 max-w-[250px]">
            Enter the 6-character unique ID to join a private community.
          </p>
          <div className="flex w-full max-w-xs space-x-2">
            <input 
              type="text" 
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
              placeholder="e.g. A8B9C"
              maxLength={6}
              className="flex-1 p-3 text-center font-mono text-lg uppercase tracking-widest rounded-xl border-2 border-slate-200 focus:border-brand-500 outline-none"
            />
          </div>
          <button 
            disabled={searchCode.length < 3}
            onClick={handleSearch}
            className="w-full max-w-xs py-3 bg-slate-800 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-slate-900 transition-colors"
          >
            Find Community
          </button>
          
          {searchError && <p className="text-red-500 text-xs font-bold">{searchError}</p>}

          {foundCommunity && (
              <div className="w-full max-w-xs bg-white border border-slate-200 rounded-xl p-4 mt-4 animate-slide-up">
                  <div className="flex items-center space-x-3">
                      <div className="text-2xl">{foundCommunity.avatar}</div>
                      <div className="flex-1">
                          <h3 className="font-bold text-slate-800">{foundCommunity.name}</h3>
                          <p className="text-xs text-slate-500">{foundCommunity.members} members</p>
                      </div>
                      <button 
                        onClick={() => {
                            onJoin(foundCommunity.id);
                            setActiveTab('browse');
                        }}
                        className={`font-bold text-xs px-3 py-1.5 rounded-lg ${foundCommunity.isJoined ? 'bg-green-100 text-green-700' : 'bg-brand-600 text-white'}`}
                      >
                         {foundCommunity.isJoined ? 'Joined' : 'Join'}
                      </button>
                  </div>
              </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 mb-4">
             <h3 className="font-bold text-brand-800 text-sm">Start a Movement</h3>
             <p className="text-xs text-brand-700 mt-1">Communities can be for study groups, hobbies, or mental health support.</p>
          </div>
          
          <div className="space-y-3">
             <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Community Name</label>
                <input 
                  value={newCommName}
                  onChange={(e) => setNewCommName(e.target.value)}
                  placeholder="e.g. Midnight Coders"
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-brand-500 outline-none"
                />
             </div>
             <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                <textarea 
                  value={newCommDesc}
                  onChange={(e) => setNewCommDesc(e.target.value)}
                  placeholder="What's this group about?"
                  rows={3}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-brand-500 outline-none resize-none"
                />
             </div>
             
             <button 
                onClick={handleCreate}
                disabled={!newCommName || !newCommDesc}
                className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-200 mt-2 disabled:opacity-50"
             >
               Create & Generate Code
             </button>
          </div>
        </div>
      )}
    </div>
  );
};