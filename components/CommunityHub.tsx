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
    { id: 1, text: "You are stronger than this midterm.", color: "bg-yellow-100", rotate: "rotate-1" },
    { id: 2, text: "Don't forget to drink water!", color: "bg-blue-100", rotate: "-rotate-2" },
    { id: 3, text: "One assignment at a time.", color: "bg-pink-100", rotate: "rotate-3" },
    { id: 4, text: "Almost there, keep pushing!", color: "bg-green-100", rotate: "-rotate-1" },
    { id: 5, text: "Grades don't define your worth.", color: "bg-purple-100", rotate: "rotate-2" },
  ]);
  const [newNote, setNewNote] = useState('');

  const postNote = () => {
      if(!newNote.trim()) return;
      const colors = ["bg-yellow-100", "bg-blue-100", "bg-pink-100", "bg-green-100", "bg-purple-100"];
      const rotations = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-3", "-rotate-3"];
      setNotes([{
          id: Date.now(),
          text: newNote,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotate: rotations[Math.floor(Math.random() * rotations.length)]
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
    <div className="space-y-6 pb-20">
      {/* Header Image */}
      <div className="relative h-32 rounded-3xl overflow-hidden shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80" 
            alt="Community Vibes" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 to-transparent flex flex-col justify-center px-6">
              <h1 className="text-2xl font-serif font-bold text-white">Community Hub</h1>
              <p className="text-brand-100 text-xs">Find your tribe. Share the journey.</p>
          </div>
      </div>

      {/* Header Tabs */}
      <div className="bg-white p-1.5 rounded-2xl flex text-xs font-bold overflow-x-auto shadow-sm border border-stone-100">
        <button 
          onClick={() => setActiveTab('browse')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all whitespace-nowrap ${activeTab === 'browse' ? 'bg-brand-50 text-brand-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
        >
          Explore
        </button>
        <button 
          onClick={() => setActiveTab('wall')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all whitespace-nowrap ${activeTab === 'wall' ? 'bg-pink-50 text-pink-700 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
        >
          Love Wall ❤️
        </button>
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all whitespace-nowrap ${activeTab === 'search' ? 'bg-brand-50 text-brand-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
        >
          Enter Code
        </button>
        <button 
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all whitespace-nowrap ${activeTab === 'create' ? 'bg-brand-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
        >
          + Create
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'browse' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Popular on Campus</h2>
             <span className="text-xs text-brand-600 font-bold cursor-pointer hover:underline">View All</span>
          </div>
          
          <div className="grid gap-3">
            {communities.map((comm) => (
              <div key={comm.id} className={`bg-white p-4 rounded-2xl border shadow-sm flex items-center space-x-4 transition-all duration-300 group ${comm.isJoined ? 'border-brand-300 ring-1 ring-brand-100 bg-brand-50/30' : 'border-stone-100 hover:border-brand-200'}`}>
                <div className="text-3xl bg-stone-50 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  {comm.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-stone-800 truncate">{comm.name}</h3>
                    {comm.isPrivate && <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded ml-2">🔒</span>}
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{comm.description}</p>
                  <div className="mt-2 flex items-center text-[10px] text-stone-400 font-medium">
                    <span className="bg-stone-100 px-1.5 py-0.5 rounded mr-2 font-mono text-stone-500">{comm.code}</span>
                    <span className="flex items-center">👥 {comm.members}</span>
                  </div>
                </div>
                <button 
                    onClick={() => onJoin(comm.id)}
                    className={`font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm ${comm.isJoined ? 'bg-white border border-brand-200 text-brand-700' : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-md'}`}
                >
                  {comm.isJoined ? 'Joined' : 'Join'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'wall' && (
        <div className="space-y-6 animate-fade-in">
           <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 p-6 rounded-3xl text-center shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-pink-100 rounded-full blur-xl opacity-50"></div>
               <h2 className="text-xl font-serif font-bold text-pink-900 relative z-10">Encouragement Wall</h2>
               <p className="text-xs text-pink-700 mb-4 relative z-10">Leave an anonymous note to lift someone up.</p>
               
               <div className="flex space-x-2 relative z-10 bg-white p-2 rounded-2xl shadow-sm border border-pink-100">
                   <input 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type a kind message..."
                    className="flex-1 text-sm p-2 bg-transparent focus:outline-none text-stone-700 placeholder:text-stone-400"
                   />
                   <button onClick={postNote} className="bg-pink-500 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md hover:bg-pink-600 transition-colors">
                       Post
                   </button>
               </div>
           </div>
           
           <div className="columns-2 gap-4 space-y-4">
               {notes.map((note) => (
                   <div key={note.id} className={`${note.color} p-5 rounded-tr-none rounded-bl-none rounded-tl-2xl rounded-br-2xl shadow-md break-inside-avoid transform ${note.rotate} hover:rotate-0 hover:scale-105 transition-all duration-300`}>
                       <div className="w-2 h-2 rounded-full bg-black/10 mx-auto mb-2"></div>
                       <p className="text-sm font-handwriting font-medium text-stone-800 leading-snug text-center">"{note.text}"</p>
                   </div>
               ))}
           </div>
        </div>
      )}

      {activeTab === 'search' && (
        <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-fade-in">
          <div className="w-20 h-20 bg-white rounded-[2rem] shadow-soft border border-stone-100 flex items-center justify-center text-4xl mb-2 animate-float">
            🔑
          </div>
          <div className="text-center">
             <h2 className="text-xl font-bold text-stone-800">Have a Code?</h2>
             <p className="text-sm text-stone-500 max-w-[250px] mt-1">
               Enter the 6-character unique ID to join a private community.
             </p>
          </div>
          
          <div className="w-full max-w-xs">
            <input 
              type="text" 
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
              placeholder="e.g. A8B9C"
              maxLength={6}
              className="w-full p-4 text-center font-mono text-2xl uppercase tracking-[0.5em] rounded-2xl border-2 border-stone-200 focus:border-brand-500 outline-none transition-all focus:shadow-lg focus:shadow-brand-100"
            />
          </div>
          
          <button 
            disabled={searchCode.length < 3}
            onClick={handleSearch}
            className="w-full max-w-xs py-4 bg-stone-800 text-white rounded-2xl font-bold disabled:opacity-50 hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Find Community
          </button>
          
          {searchError && <p className="text-red-500 text-xs font-bold bg-red-50 px-3 py-1 rounded-full">{searchError}</p>}

          {foundCommunity && (
              <div className="w-full max-w-xs bg-white border border-brand-200 rounded-2xl p-5 mt-4 animate-pop shadow-lg ring-4 ring-brand-50">
                  <div className="flex items-center space-x-4">
                      <div className="text-3xl">{foundCommunity.avatar}</div>
                      <div className="flex-1">
                          <h3 className="font-bold text-stone-800">{foundCommunity.name}</h3>
                          <p className="text-xs text-stone-500">{foundCommunity.members} members</p>
                      </div>
                      <button 
                        onClick={() => {
                            onJoin(foundCommunity.id);
                            setActiveTab('browse');
                        }}
                        className={`font-bold text-xs px-4 py-2 rounded-xl transition-colors ${foundCommunity.isJoined ? 'bg-green-100 text-green-700' : 'bg-brand-600 text-white shadow-md'}`}
                      >
                         {foundCommunity.isJoined ? 'Joined' : 'Join'}
                      </button>
                  </div>
              </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-br from-brand-50 to-white p-6 rounded-3xl border border-brand-100 shadow-sm">
             <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center text-2xl mb-4">🌱</div>
             <h3 className="font-bold text-brand-900 text-lg">Start a Movement</h3>
             <p className="text-sm text-brand-700/80 mt-1 leading-relaxed">Communities can be for study groups, hobbies, or mental health support. You'll be the admin.</p>
          </div>
          
          <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
             <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Community Name</label>
                <input 
                  value={newCommName}
                  onChange={(e) => setNewCommName(e.target.value)}
                  placeholder="e.g. Midnight Coders"
                  className="w-full mt-2 p-4 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-brand-500 outline-none transition-all"
                />
             </div>
             <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">Description</label>
                <textarea 
                  value={newCommDesc}
                  onChange={(e) => setNewCommDesc(e.target.value)}
                  placeholder="What's this group about?"
                  rows={3}
                  className="w-full mt-2 p-4 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-brand-500 outline-none resize-none transition-all"
                />
             </div>
             
             <button 
                onClick={handleCreate}
                disabled={!newCommName || !newCommDesc}
                className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-xl shadow-brand-200 mt-4 disabled:opacity-50 transition-all hover:-translate-y-1"
             >
               Create & Generate Code
             </button>
          </div>
        </div>
      )}
    </div>
  );
};