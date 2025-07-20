export interface Post {
  id: string;
  userId: string;
  userName: string;
  userProfilePic?: string;
  timestamp: Date;
  text: string;
  bibleVerse?: BibleVerse;
  links?: LinkPreview[];
  hashtags: string[];
  mentions: string[];
  audience: 'public' | 'followers' | 'fellowship';
  fellowshipId?: string;
  commentCount: number;
  shareCount: number;
  isEdited?: boolean;
  editedAt?: Date;
}

export interface BibleVerse {
  reference: string;
  text: string;
  translation: string;
}

export interface LinkPreview {
  url: string;
  title: string;
  description: string;
  image?: string;
  domain: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userProfilePic?: string;
  text: string;
  timestamp: Date;
  mentions: string[];
  parentCommentId?: string;
  replies?: Comment[];
}

export interface FeedState {
  posts: Post[];
  isLoading: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  error: string | null;
  lastVisible: any;
}

export interface CreatePostData {
  text: string;
  bibleVerse?: BibleVerse;
  audience: 'public' | 'followers' | 'fellowship';
  fellowshipId?: string;
}

export interface FeedFilter {
  type: 'following' | 'discovery' | 'fellowship';
  fellowshipId?: string;
  userId?: string;
}