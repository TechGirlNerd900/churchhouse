export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: NotificationData;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export type NotificationType = 
  | 'comment'
  | 'mention'
  | 'share'
  | 'follow'
  | 'prayer_response'
  | 'prayer_answered'
  | 'chapel_invite'
  | 'chapel_started'
  | 'fellowship_invite'
  | 'fellowship_approved'
  | 'system';

export interface NotificationData {
  postId?: string;
  commentId?: string;
  prayerId?: string;
  chapelId?: string;
  fellowshipId?: string;
  userId?: string;
  userName?: string;
  userProfilePic?: string;
  [key: string]: any;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  comments: boolean;
  mentions: boolean;
  shares: boolean;
  follows: boolean;
  prayerResponses: boolean;
  chapelInvites: boolean;
  fellowshipUpdates: boolean;
  systemUpdates: boolean;
}