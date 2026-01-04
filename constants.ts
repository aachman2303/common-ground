import { BuildingStatus, CheckInOption, ResourceItem, CalendarEvent, Community } from './types';

export const CHECK_IN_OPTIONS: CheckInOption[] = [
  { id: 'heavy_load', label: 'Heavy Academic Load', icon: '⚖️', count: 312 },
  { id: 'deadline_mode', label: 'Deadline Mode', icon: '⏳', count: 245 },
  { id: 'catching_up', label: 'Catching Up', icon: '🏃', count: 184 },
  { id: 'steady_pace', label: 'Steady Pace', icon: '🚶', count: 98 },
  { id: 'collaborating', label: 'Group Work', icon: '🤝', count: 156 },
  { id: 'resetting', label: 'Resetting', icon: '🔋', count: 112 },
];

export const BUILDINGS: BuildingStatus[] = [
  { id: 'lib', name: 'Main Library', stressLevel: 'high', occupancy: 342, activity: 'Late Night Study', trend: 'up' },
  { id: 'eng', name: 'Engineering Hall', stressLevel: 'high', occupancy: 128, activity: 'Project Deadlines', trend: 'up' },
  { id: 'student_union', name: 'Student Union', stressLevel: 'moderate', occupancy: 215, activity: 'Social/Eating', trend: 'stable' },
  { id: 'dorms_north', name: 'North Dorms', stressLevel: 'moderate', occupancy: 450, activity: 'Resting', trend: 'down' },
  { id: 'green_space', name: 'Campus Green', stressLevel: 'low', occupancy: 45, activity: 'Walking', trend: 'stable' },
  { id: 'rec_center', name: 'Rec Center', stressLevel: 'low', occupancy: 85, activity: 'Exercise', trend: 'down' },
];

export const MOCK_RESOURCES: ResourceItem[] = [
  { id: '1', title: '3-Minute Library Stretch', description: 'Audio guided stretch to release neck tension.', type: 'micro', attendees: 47 },
  { id: '2', title: 'Engineering Cafe Tea', description: 'Free herbal tea until 4 PM today.', type: 'campus' },
  { id: '3', title: 'Late Night CS Study', description: 'Virtual room for silent accountability.', type: 'peer', attendees: 12 },
  { id: '4', title: 'Counseling Walk-in', description: '2 slots available between 2-4 PM.', type: 'campus', waitlist: 'Low' },
];

export const AVATARS = [
  { icon: '🦊', color: 'bg-orange-100', border: 'border-orange-200', subject: 'Calculus' },
  { icon: '🐼', color: 'bg-slate-100', border: 'border-slate-200', subject: 'History' },
  { icon: '🐨', color: 'bg-zinc-100', border: 'border-zinc-200', subject: 'Physics' },
  { icon: '🦁', color: 'bg-yellow-100', border: 'border-yellow-200', subject: 'Law' },
  { icon: '🐸', color: 'bg-green-100', border: 'border-green-200', subject: 'Biology' },
  { icon: '🦉', color: 'bg-amber-100', border: 'border-amber-200', subject: 'Coding' },
  { icon: '🐯', color: 'bg-red-50', border: 'border-red-100', subject: 'Music' },
  { icon: '🐰', color: 'bg-pink-50', border: 'border-pink-100', subject: 'Art' },
];

export const MOCK_EVENTS: CalendarEvent[] = [
  { 
    id: 'e1', title: 'Deep Work Session', time: '09:00', duration: 90, type: 'academic', color: 'bg-blue-100 border-blue-200',
    attendees: [0, 2, 5] // Fox, Koala, Owl (STEM heavy)
  },
  { 
    id: 'e2', title: 'Community Lunch', time: '12:00', duration: 60, type: 'social', color: 'bg-green-100 border-green-200',
    attendees: [0, 1, 2, 3, 4, 5, 6, 7] // Everyone
  },
  { 
    id: 'e3', title: 'Ethics Debate Club', time: '14:00', duration: 60, type: 'academic', color: 'bg-purple-100 border-purple-200',
    attendees: [1, 3, 5] // Panda, Lion, Owl (Humanities/Law/CS)
  },
  { 
    id: 'e4', title: 'Sunset Yoga', time: '17:30', duration: 45, type: 'wellness', color: 'bg-orange-100 border-orange-200',
    attendees: [4, 6, 7] // Frog, Tiger, Rabbit
  }
];

export const MOCK_COMMUNITIES: Community[] = [
  { id: 'c1', code: 'NTOWLS', name: 'Night Owls', description: 'For those who study best after 10pm.', members: 142, lat: 50, lng: 50, isPrivate: false, avatar: '🦉' },
  { id: 'c2', code: 'GMERS', name: 'Campus Gamers', description: 'Casual LoL and Valo matches.', members: 89, lat: 20, lng: 70, isPrivate: false, avatar: '🎮' },
  { id: 'c3', code: 'QUIET', name: 'Silent Reading', description: 'No talking, just reading.', members: 56, lat: 80, lng: 30, isPrivate: true, avatar: '🤫' },
  { id: 'c4', code: 'COFFEE', name: 'Caffeine Addicts', description: 'Reviewing every coffee shop.', members: 210, lat: 40, lng: 20, isPrivate: false, avatar: '☕' },
];