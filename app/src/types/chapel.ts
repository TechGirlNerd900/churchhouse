export interface Chapel {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  hostProfilePic?: string;
  moderatorIds: string[];
  speakerIds: string[];
  audienceIds: string[];
  isLive: boolean;
  isPrivate: boolean;
  fellowshipId?: string;
  category: ChapelCategory;
  tags: string[];
  maxParticipants?: number;
  currentParticipants: number;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  scheduledFor?: Date;
  language: string;
  recordingEnabled: boolean;
  recordingUrl?: string;
}

export interface ChapelParticipant {
  userId: string;
  userName: string;
  userProfilePic?: string;
  role: 'host' | 'moderator' | 'speaker' | 'audience';
  joinedAt: Date;
  isMuted: boolean;
  isHandRaised: boolean;
  lastActive: Date;
}

export interface ChapelMessage {
  id: string;
  chapelId: string;
  userId: string;
  userName: string;
  userProfilePic?: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'prayer_request';
}

export type ChapelCategory = 
  | 'worship'
  | 'bible_study'
  | 'prayer'
  | 'testimony'
  | 'youth'
  | 'ministry'
  | 'fellowship'
  | 'evangelism'
  | 'other';

export interface ChapelState {
  activeChapels: Chapel[];
  myChapels: Chapel[];
  currentChapel: Chapel | null;
  participants: ChapelParticipant[];
  messages: ChapelMessage[];
  isLoading: boolean;
  error: string | null;
  audioState: AudioState;
}

export interface AudioState {
  isConnected: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  isHandRaised: boolean;
  audioLevel: number;
}

export interface CreateChapelData {
  title: string;
  description: string;
  category: ChapelCategory;
  tags: string[];
  isPrivate: boolean;
  fellowshipId?: string;
  maxParticipants?: number;
  scheduledFor?: Date;
  recordingEnabled: boolean;
}