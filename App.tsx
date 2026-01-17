
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './components/Onboarding';
import { Login } from './components/Login';
import { CheckIn } from './components/CheckIn';
import { Heatmap } from './components/Heatmap';
import { StudyRoom } from './components/StudyRoom';
import { Resources } from './components/Resources';
import { Chatbot } from './components/Chatbot';
import { CalendarView } from './components/CalendarView';
import { CommunityMap } from './components/CommunityMap';
import { CommunityHub } from './components/CommunityHub';
import { PulseChat } from './components/PulseChat';
import { OneOnOneChat } from './components/OneOnOneChat';
import { Profile } from './components/Profile';
import { AiCompanion } from './components/AiCompanion';
import { SocialLounge } from './components/SocialLounge';
import { ViewState, UserProfile, CalendarEvent, Community, ActiveReward } from './types';
import { MOCK_EVENTS, MOCK_COMMUNITIES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.CHECK_IN);
  const [history, setHistory] = useState<ViewState[]>([]); // Navigation History
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userMood, setUserMood] = useState<string | null>(null);
  const [isLoginView, setIsLoginView] = useState(true); // Default to login view

  // Global State for "Enabled" Features
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);

  // Navigation Logic
  const navigate = (view: ViewState) => {
    if (view === currentView) return;
    setHistory(prev => [...prev, currentView]);
    setCurrentView(view);
  };

  const goBack = () => {
    if (history.length > 0) {
      setHistory(prev => {
          const newHistory = [...prev];
          const lastView = newHistory.pop();
          if (lastView) setCurrentView(lastView);
          return newHistory;
      });
    } else if (currentView !== ViewState.CHECK_IN) {
        // Fallback: If no history but not on home screen, go home
        setCurrentView(ViewState.CHECK_IN);
    }
  };

  const handleOnboardingComplete = (newUser: UserProfile) => {
    // Initialize mock stats for ranking system
    const userWithStats = {
        ...newUser,
        stats: {
            focusMinutes: 120,
            streakDays: 3,
            communitiesJoined: 1,
            sessionsCompleted: 5,
            communityPoints: 450
        },
        activeRewards: []
    };
    setUser(userWithStats);
    setCurrentView(ViewState.CHECK_IN);
    setHistory([]);
  };

  const handleLogin = (returningUser: UserProfile) => {
    setUser(returningUser);
    setCurrentView(ViewState.CHECK_IN);
    setHistory([]);
  };

  const handleAddEvent = (newEvent: CalendarEvent) => {
    setEvents([...events, newEvent]);
  };

  const handleJoinCommunity = (id: string) => {
    setCommunities(prev => prev.map(c => 
      c.id === id ? { ...c, isJoined: !c.isJoined, members: c.isJoined ? c.members - 1 : c.members + 1 } : c
    ));
  };

  const handleCreateCommunity = (newCommunity: Community) => {
    setCommunities([newCommunity, ...communities]);
  };

  const handleSessionComplete = (minutes: number) => {
    setUser(prev => {
        if (!prev) return null;
        const pointsEarned = Math.floor(minutes) + 10; // 1 pt per min + 10 base
        
        // Reward Logic based on Duration
        let newReward: ActiveReward | null = null;
        
        if (minutes >= 60) {
            newReward = {
                id: Date.now().toString(),
                title: "Premium Lounge Access",
                description: "Ad-free lo-fi radio & exclusive themes unlocked.",
                icon: "🎧",
                unlockedAt: Date.now(),
                expiresInHours: 72, // 3 days
                type: 'theme'
            };
        } else if (minutes >= 25) {
             newReward = {
                id: Date.now().toString(),
                title: "Retro Arcade Pass",
                description: "Unlimited access to 'Distraction Pop' mini-game.",
                icon: "🎮",
                unlockedAt: Date.now(),
                expiresInHours: 24, // 1 day
                type: 'entertainment'
            };
        }

        const updatedRewards = newReward ? [newReward, ...(prev.activeRewards || [])] : (prev.activeRewards || []);

        return {
            ...prev,
            stats: {
                ...prev.stats,
                focusMinutes: prev.stats.focusMinutes + minutes,
                sessionsCompleted: prev.stats.sessionsCompleted + 1,
                communityPoints: prev.stats.communityPoints + pointsEarned
            },
            activeRewards: updatedRewards
        };
    });
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.CHECK_IN:
        return <CheckIn onComplete={(mood) => {
          setUserMood(mood);
          navigate(ViewState.HEATMAP);
        }} />;
      case ViewState.HEATMAP:
        return <Heatmap onViewChange={navigate} userSignal={userMood} />;
      case ViewState.STUDY_ROOM:
        return <StudyRoom user={user} onSessionComplete={handleSessionComplete} />;
      case ViewState.CALENDAR:
        return <CalendarView 
          events={events} 
          onAddEvent={handleAddEvent} 
          onJoinStudyChat={() => {
            setUserMood('heavy_load'); // Contextual mood
            navigate(ViewState.PULSE_CHAT);
          }}
        />;
      case ViewState.RESOURCES:
        return <Resources userMood={userMood} />;
      case ViewState.CHAT:
        return <Chatbot />;
      case ViewState.SOCIAL_LOUNGE:
        return user ? <SocialLounge user={user} /> : <div>Login required</div>;
      case ViewState.MAP:
        return user ? <CommunityMap user={user} communities={communities} onJoin={handleJoinCommunity} /> : <div>Please log in</div>;
      case ViewState.COMMUNITY_HUB:
        return <CommunityHub communities={communities} onJoin={handleJoinCommunity} onCreate={handleCreateCommunity} />;
      case ViewState.PULSE_CHAT:
        return <PulseChat userMood={userMood} onExit={() => {
            if (history.length > 0) goBack();
            else navigate(ViewState.HEATMAP);
        }} />;
      case ViewState.ONE_ON_ONE_CHAT:
        return <OneOnOneChat userMood={userMood} onExit={() => {
             if (history.length > 0) goBack();
             else navigate(ViewState.HEATMAP);
        }} />;
      case ViewState.PROFILE:
        return user ? <Profile user={user} onLogout={() => setUser(null)} /> : <div>Log in</div>;
      default:
        return <CheckIn onComplete={() => navigate(ViewState.HEATMAP)} />;
    }
  };

  // Auth Flow
  if (!user) {
    if (isLoginView) {
      return (
        <Login 
          onLogin={handleLogin} 
          onSwitchToSignup={() => setIsLoginView(false)} 
        />
      );
    } else {
      return (
        <div className="relative">
          {/* Back button for onboarding */}
          <button 
            onClick={() => setIsLoginView(true)}
            className="absolute top-4 left-4 z-50 text-stone-500 hover:text-stone-800 font-bold text-sm"
          >
            ← Back to Login
          </button>
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      );
    }
  }

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={navigate} 
      user={user}
      canGoBack={history.length > 0 || currentView !== ViewState.CHECK_IN}
      onBack={goBack}
    >
      {renderView()}
      <AiCompanion />
    </Layout>
  );
};

export default App;
