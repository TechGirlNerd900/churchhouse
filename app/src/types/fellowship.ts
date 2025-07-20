export interface Fellowship {
  id: string;
  name: string;
  description: string;
  profilePicture?: string;
  coverImage?: string;
  founderId: string;
  moderatorIds: string[];
  memberIds: string[];
  memberCount: number;
  isPrivate: boolean;
  requiresApproval: boolean;
  category: FellowshipCategory;
  tags: string[];
  rules: string[];
  createdAt: Date;
  lastActivity: Date;
  location?: string;
  website?: string;
  contactEmail?: string;
}

export interface FellowshipMember {
  userId: string;
  userName: string;
  userProfilePic?: string;
  role: 'founder' | 'moderator' | 'member';
  joinedAt: Date;
  lastActive: Date;
  contributions: number;
}

export interface FellowshipInvite {
  id: string;
  fellowshipId: string;
  fellowshipName: string;
  inviterId: string;
  inviterName: string;
  inviteeId: string;
  inviteeEmail?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

export type FellowshipCategory = 
  | 'church'
  | 'bible_study'
  | 'youth'
  | 'ministry'
  | 'missions'
  | 'worship'
  | 'prayer'
  | 'fellowship'
  | 'other';

export interface FellowshipState {
  fellowships: Fellowship[];
  myFellowships: Fellowship[];
  currentFellowship: Fellowship | null;
  members: FellowshipMember[];
  invites: FellowshipInvite[];
  isLoading: boolean;
  error: string | null;
}

export interface CreateFellowshipData {
  name: string;
  description: string;
  category: FellowshipCategory;
  tags: string[];
  isPrivate: boolean;
  requiresApproval: boolean;
  rules: string[];
  location?: string;
  website?: string;
  contactEmail?: string;
}

export interface JoinFellowshipData {
  fellowshipId: string;
  message?: string;
}