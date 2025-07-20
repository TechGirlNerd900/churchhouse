export interface User {
  id: string;
  email: string;
  displayName: string;
  profilePicture?: string;
  bio?: string;
  phoneNumber?: string;
  churchAffiliation?: string;
  spiritualGifts?: string[];
  externalLinks?: ExternalLink[];
  followersCount: number;
  followingCount: number;
  createdAt: Date;
  lastActive: Date;
  isVerified: boolean;
  nominatedBy?: string;
}

export interface ExternalLink {
  type: 'website' | 'ministry' | 'youtube' | 'social';
  url: string;
  title: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
}

export interface ProfileUpdateData {
  displayName?: string;
  bio?: string;
  profilePicture?: string;
  churchAffiliation?: string;
  spiritualGifts?: string[];
  externalLinks?: ExternalLink[];
}