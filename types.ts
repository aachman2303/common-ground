
export enum ViewState {
  ONBOARDING = 'ONBOARDING',
  CHECK_IN = 'CHECK_IN',
  HEATMAP = 'HEATMAP',
  STUDY_ROOM = 'STUDY_ROOM',
  RESOURCES = 'RESOURCES',
  CHAT = 'CHAT',
  CALENDAR = 'CALENDAR',
  MAP = 'MAP',
  COMMUNITY_HUB = 'COMMUNITY_HUB',
  PULSE_CHAT = 'PULSE_CHAT',
  ONE_ON_ONE_CHAT = 'ONE_ON_ONE_CHAT',
  PROFILE = 'PROFILE',
  SOCIAL_LOUNGE = 'SOCIAL_LOUNGE', // New View
}

export interface UserStats {
  focusMinutes: number;
  streakDays: number;
  communitiesJoined: number;
  sessionsCompleted: number;
  communityPoints: number; // New metric
}

export interface UserProfile {
  email: string;
  nickname: string;
  avatarId: number;
  location: { lat: number; lng: number } | null;
  uniqueId: string;
  stats: UserStats;
}

export interface Community {
  id: string;
  code: string;
  name: string;
  description: string;
  members: number;
  lat?: number;
  lng?: number;
  isPrivate: boolean;
  avatar: string;
  isJoined?: boolean;
}

export interface CheckInOption {
  id: string;
  label: string;
  icon: string;
  count: number;
}

export interface BuildingStatus {
  id: string;
  name: string;
  stressLevel: 'low' | 'moderate' | 'high';
  occupancy: number;
  activity: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: 'micro' | 'peer' | 'campus' | 'crisis';
  waitlist?: string;
  attendees?: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  attachment?: { // New attachment support
    type: 'image';
    data: string; // base64
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string; // HH:mm for Day view
  date?: string; // YYYY-MM-DD for Month view
  duration: number; // in minutes
  type: 'academic' | 'social' | 'wellness';
  attendees: number[]; // indices of AVATARS
  color: string;
}

export interface RankInfo {
  title: string;
  icon: string;
  minMinutes: number;
  nextRank?: string;
}

// New Types for Social Lounge
export interface Meme {
  id: string;
  imageUrl: string;
  caption: string;
  uploader: string;
  likes: number;
  laughs: number;
  hearts: number;
  timestamp: Date;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  nickname: string;
  points: number;
  badges: string[]; // e.g., ["Top Helper", "Meme God"]
  avatarId: number;
}
