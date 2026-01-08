
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
import { ViewState, UserProfile, CalendarEvent, Community } from './types';
import { MOCK_EVENTS, MOCK_COMMUNITIES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.CHECK_IN);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userMood, setUserMood] = useState<string | null>(null);
  const [isLoginView, setIsLoginView] = useState(true); // Default to login view

  // Global State for "Enabled" Features
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);

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
        }
    };
    setUser(userWithStats);
    setCurrentView(ViewState.CHECK_IN);
  };

  const handleLogin = (returningUser: UserProfile) => {
    setUser(returningUser);
    setCurrentView(ViewState.CHECK_IN);
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
        return {
            ...prev,
            stats: {
                ...prev.stats,
                focusMinutes: prev.stats.focusMinutes + minutes,
                sessionsCompleted: prev.stats.sessionsCompleted + 1,
                communityPoints: prev.stats.communityPoints + pointsEarned
            }
        };
    });
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.CHECK_IN:
        return <CheckIn onComplete={(mood) => {
          setUserMood(mood);
          setCurrentView(ViewState.HEATMAP);
        }} />;
      case ViewState.HEATMAP:
        return <Heatmap onViewChange={setCurrentView} userSignal={userMood} />;
      case ViewState.STUDY_ROOM:
        return <StudyRoom user={user} onSessionComplete={handleSessionComplete} />;
      case ViewState.CALENDAR:
        return <CalendarView events={events} onAddEvent={handleAddEvent} />;
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
        return <PulseChat userMood={userMood} onExit={() => setCurrentView(ViewState.HEATMAP)} />;
      case ViewState.ONE_ON_ONE_CHAT:
        return <OneOnOneChat userMood={userMood} onExit={() => setCurrentView(ViewState.HEATMAP)} />;
      case ViewState.PROFILE:
        return user ? <Profile user={user} onLogout={() => setUser(null)} /> : <div>Log in</div>;
      default:
        return <CheckIn onComplete={() => setCurrentView(ViewState.HEATMAP)} />;
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
    <Layout currentView={currentView} onViewChange={setCurrentView} user={user}>
      {renderView()}
      <AiCompanion />
    </Layout>
  );
};

export default App;
