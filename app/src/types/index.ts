// Core Types for ChurchHouse App

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isVerified: boolean;
  createdAt: Date;
  lastSeen: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: {
    chapelInvites: boolean;
    prayerRequests: boolean;
    feedActivity: boolean;
    bibleReminders: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    allowDirectMessages: boolean;
  };
  bible: {
    preferredTranslation: string;
    dailyVerseEnabled: boolean;
  };
}

export interface Chapel {
  id: string;
  name: string;
  description: string;
  hostId: string;
  hostName: string;
  isActive: boolean;
  isPrivate: boolean;
  maxParticipants: number;
  currentParticipants: number;
  participants: ChapelParticipant[];
  createdAt: Date;
  tags: string[];
  category: ChapelCategory;
}

export interface ChapelParticipant {
  userId: string;
  displayName: string;
  photoURL?: string;
  joinedAt: Date;
  isMuted: boolean;
  role: 'host' | 'moderator' | 'participant';
}

export type ChapelCategory = 
  | 'prayer' 
  | 'bible-study' 
  | 'worship' 
  | 'fellowship' 
  | 'youth' 
  | 'seniors' 
  | 'general';

export interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  reference: string;
}

export interface BibleBook {
  id: string;
  name: string;
  abbreviation: string;
  chapters: number;
  testament: 'old' | 'new';
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  content: string;
  type: 'text' | 'image' | 'verse' | 'prayer';
  imageURL?: string;
  verseReference?: string;
  verseText?: string;
  hashtags: string[];
  mentions: string[];
  audience: 'public' | 'friends' | 'chapel';
  chapelId?: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  content: string;
  createdAt: Date;
  likesCount: number;
  isLiked: boolean;
}

export interface PrayerRequest {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  isAnonymous: boolean;
  isUrgent: boolean;
  category: PrayerCategory;
  prayersCount: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'answered' | 'closed';
}

export type PrayerCategory = 
  | 'health' 
  | 'family' 
  | 'work' 
  | 'spiritual' 
  | 'relationships' 
  | 'guidance' 
  | 'thanksgiving' 
  | 'other';

export interface Fellowship {
  id: string;
  name: string;
  description: string;
  adminId: string;
  adminName: string;
  memberCount: number;
  isPrivate: boolean;
  category: FellowshipCategory;
  location?: string;
  meetingTime?: string;
  createdAt: Date;
  imageURL?: string;
}

export type FellowshipCategory = 
  | 'bible-study' 
  | 'youth' 
  | 'seniors' 
  | 'women' 
  | 'men' 
  | 'couples' 
  | 'singles' 
  | 'ministry' 
  | 'outreach' 
  | 'general';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'chapel_invite' 
  | 'prayer_request' 
  | 'post_like' 
  | 'post_comment' 
  | 'post_share' 
  | 'fellowship_invite' 
  | 'bible_reminder' 
  | 'friend_request';

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Bible: undefined;
  Chapels: undefined;
  Prayer: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  Feed: undefined;
  CreatePost: undefined;
  PostDetails: { postId: string };
  UserProfile: { userId: string };
};

export type BibleStackParamList = {
  BibleHome: undefined;
  BibleReader: { book: string; chapter: number };
  VerseDetails: { verseId: string };
  BibleSearch: undefined;
  Bookmarks: undefined;
};

export type ChapelStackParamList = {
  ChapelList: undefined;
  ChapelDetails: { chapelId: string };
  CreateChapel: undefined;
  ChapelRoom: { chapelId: string };
};

export type PrayerStackParamList = {
  PrayerList: undefined;
  PrayerDetails: { prayerId: string };
  CreatePrayer: undefined;
  MyPrayers: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
  total?: number;
}

// Audio/Real-time Types
export interface AudioState {
  isConnected: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  volume: number;
  participants: AudioParticipant[];
}

export interface AudioParticipant {
  userId: string;
  displayName: string;
  isMuted: boolean;
  isSpeaking: boolean;
  volume: number;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Feed Types
export interface FeedState {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  lastVisible?: any;
  error?: string;
}

export interface CreatePostData {
  content: string;
  type: Post['type'];
  imageURL?: string;
  verseReference?: string;
  verseText?: string;
  audience: Post['audience'];
  chapelId?: string;
}