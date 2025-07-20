export interface PrayerRequest {
  id: string;
  userId: string;
  userName: string;
  userProfilePic?: string;
  title: string;
  description: string;
  category: PrayerCategory;
  isAnonymous: boolean;
  isUrgent: boolean;
  audience: 'public' | 'followers' | 'fellowship';
  fellowshipId?: string;
  timestamp: Date;
  expiresAt?: Date;
  status: 'active' | 'answered' | 'closed';
  prayerCount: number;
  supportCount: number;
  tags: string[];
}

export interface PrayerResponse {
  id: string;
  prayerRequestId: string;
  userId: string;
  userName: string;
  userProfilePic?: string;
  type: 'prayer' | 'support' | 'testimony';
  message?: string;
  timestamp: Date;
  isAnonymous: boolean;
}

export interface PrayerTestimony {
  id: string;
  prayerRequestId: string;
  userId: string;
  userName: string;
  userProfilePic?: string;
  testimony: string;
  timestamp: Date;
  isVerified: boolean;
}

export type PrayerCategory = 
  | 'healing'
  | 'family'
  | 'finances'
  | 'guidance'
  | 'salvation'
  | 'protection'
  | 'ministry'
  | 'relationships'
  | 'other';

export interface PrayerState {
  requests: PrayerRequest[];
  myRequests: PrayerRequest[];
  responses: PrayerResponse[];
  isLoading: boolean;
  error: string | null;
}

export interface CreatePrayerData {
  title: string;
  description: string;
  category: PrayerCategory;
  isAnonymous: boolean;
  isUrgent: boolean;
  audience: 'public' | 'followers' | 'fellowship';
  fellowshipId?: string;
  tags: string[];
  expiresAt?: Date;
}