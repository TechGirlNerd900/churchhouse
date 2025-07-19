// Constants for ChurchHouse App

// App Configuration
export const APP_CONFIG = {
  name: 'ChurchHouse',
  version: '1.0.0',
  description: 'A faith-based community platform for spiritual connection',
};

// Firebase Configuration Keys
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  CHAPELS: 'chapels',
  POSTS: 'posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
  PRAYER_REQUESTS: 'prayerRequests',
  FELLOWSHIPS: 'fellowships',
  NOTIFICATIONS: 'notifications',
  BIBLE_BOOKMARKS: 'bibleBookmarks',
  USER_PREFERENCES: 'userPreferences',
} as const;

// Bible API Configuration
export const BIBLE_API = {
  BASE_URL: 'https://api.bible',
  ESV_BASE_URL: 'https://api.esv.org/v3',
  DEFAULT_TRANSLATION: 'de4e12af7f06f4f-01',
  TRANSLATIONS: {
    ESV: 'de4e12af7f06f4f-01',
    NIV: '71c6eab17ae5b667-01',
    NLT: '13fcb89b637a28a-01',
    NASB: '68d8e5bc5ae52a17-01',
  },
} as const;

// Audio Configuration
export const AUDIO_CONFIG = {
  AGORA_APP_ID: process.env.EXPO_PUBLIC_AGORA_APP_ID || '',
  MAX_PARTICIPANTS: 50,
  DEFAULT_VOLUME: 0.8,
  AUDIO_QUALITY: 'high',
} as const;

// UI Constants
export const COLORS = {
  // Primary Colors
  primary: '#6B46C1', // Purple
  primaryLight: '#8B5CF6',
  primaryDark: '#553C9A',
  
  // Secondary Colors
  secondary: '#F59E0B', // Amber
  secondaryLight: '#FCD34D',
  secondaryDark: '#D97706',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Background Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  surface: '#FFFFFF',
  
  // Text Colors
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Border Colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
} as const;

export const FONTS = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// Chapel Categories
export const CHAPEL_CATEGORIES = [
  { id: 'prayer', label: 'Prayer', icon: 'hands-pray', color: COLORS.primary },
  { id: 'bible-study', label: 'Bible Study', icon: 'book-open', color: COLORS.secondary },
  { id: 'worship', label: 'Worship', icon: 'music', color: COLORS.success },
  { id: 'fellowship', label: 'Fellowship', icon: 'users', color: COLORS.info },
  { id: 'youth', label: 'Youth', icon: 'child', color: COLORS.warning },
  { id: 'seniors', label: 'Seniors', icon: 'user-friends', color: COLORS.gray600 },
  { id: 'general', label: 'General', icon: 'comments', color: COLORS.gray500 },
] as const;

// Prayer Categories
export const PRAYER_CATEGORIES = [
  { id: 'health', label: 'Health & Healing', icon: 'heart', color: COLORS.error },
  { id: 'family', label: 'Family', icon: 'home', color: COLORS.primary },
  { id: 'work', label: 'Work & Career', icon: 'briefcase', color: COLORS.secondary },
  { id: 'spiritual', label: 'Spiritual Growth', icon: 'cross', color: COLORS.success },
  { id: 'relationships', label: 'Relationships', icon: 'heart-multiple', color: COLORS.info },
  { id: 'guidance', label: 'Guidance', icon: 'compass', color: COLORS.warning },
  { id: 'thanksgiving', label: 'Thanksgiving', icon: 'gift', color: COLORS.primary },
  { id: 'other', label: 'Other', icon: 'dots-horizontal', color: COLORS.gray500 },
] as const;

// Fellowship Categories
export const FELLOWSHIP_CATEGORIES = [
  { id: 'bible-study', label: 'Bible Study', icon: 'book-open' },
  { id: 'youth', label: 'Youth Group', icon: 'account-group' },
  { id: 'seniors', label: 'Seniors', icon: 'account-supervisor' },
  { id: 'women', label: 'Women\'s Ministry', icon: 'account-multiple-outline' },
  { id: 'men', label: 'Men\'s Ministry', icon: 'account-multiple' },
  { id: 'couples', label: 'Couples', icon: 'heart-multiple' },
  { id: 'singles', label: 'Singles', icon: 'account' },
  { id: 'ministry', label: 'Ministry Team', icon: 'hands-pray' },
  { id: 'outreach', label: 'Outreach', icon: 'hand-heart' },
  { id: 'general', label: 'General Fellowship', icon: 'account-group' },
] as const;

// Post Types
export const POST_TYPES = [
  { id: 'text', label: 'Share a Thought', icon: 'text', color: COLORS.gray600 },
  { id: 'image', label: 'Share a Photo', icon: 'image', color: COLORS.info },
  { id: 'verse', label: 'Share a Verse', icon: 'book-open', color: COLORS.secondary },
  { id: 'prayer', label: 'Prayer Request', icon: 'hands-pray', color: COLORS.primary },
] as const;

// Bible Books
export const BIBLE_BOOKS = {
  OLD_TESTAMENT: [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
    'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
    'Ecclesiastes', 'Song of Songs', 'Isaiah', 'Jeremiah', 'Lamentations',
    'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
    'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
  ],
  NEW_TESTAMENT: [
    'Matthew', 'Mark', 'Luke', 'John', 'Acts',
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
    '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
    '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
    'Jude', 'Revelation'
  ]
} as const;

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  DISPLAY_NAME_MIN_LENGTH: 2,
  DISPLAY_NAME_MAX_LENGTH: 50,
  POST_MAX_LENGTH: 500,
  COMMENT_MAX_LENGTH: 200,
  CHAPEL_NAME_MAX_LENGTH: 100,
  CHAPEL_DESCRIPTION_MAX_LENGTH: 300,
  PRAYER_TITLE_MAX_LENGTH: 100,
  PRAYER_DESCRIPTION_MAX_LENGTH: 500,
} as const;

// Pagination
export const PAGINATION = {
  POSTS_PER_PAGE: 10,
  COMMENTS_PER_PAGE: 20,
  CHAPELS_PER_PAGE: 20,
  PRAYERS_PER_PAGE: 15,
  NOTIFICATIONS_PER_PAGE: 25,
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  BIBLE_BOOKS: 'bible_books',
  RECENT_VERSES: 'recent_verses',
  CHAPEL_LIST: 'chapel_list',
  PRAYER_LIST: 'prayer_list',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please log in again.',
  PERMISSION_DENIED: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  POST_CREATED: 'Your post has been shared successfully!',
  COMMENT_ADDED: 'Your comment has been added.',
  PRAYER_CREATED: 'Your prayer request has been submitted.',
  CHAPEL_JOINED: 'You have joined the chapel successfully.',
  PROFILE_UPDATED: 'Your profile has been updated.',
} as const;

// Feature Flags
export const FEATURES = {
  AUDIO_CHAPELS: true,
  BIBLE_INTEGRATION: true,
  SOCIAL_FEED: true,
  PRAYER_REQUESTS: true,
  FELLOWSHIPS: true,
  PUSH_NOTIFICATIONS: true,
  OFFLINE_MODE: false, // Future feature
  VIDEO_CHAPELS: false, // Future feature
} as const;

// Environment
export const ENV = {
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
} as const;