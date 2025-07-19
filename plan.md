# ChurchHouse - Clubhouse Clone Development Plan (Free, No-SQL)

## Project Overview
ChurchHouse is a cross-platform mobile application that replicates the core functionality of Clubhouse with custom branding and UI modifications. The app will support both iOS and Android platforms using React Native with Expo. The prototype leverages entirely free tiers of cloud services for data storage and real-time communication, avoiding traditional SQL databases and custom backend server management.

**ChurchHouse Core Concept:** A real-time social audio platform fostering a vibrant, interactive, and spiritually enriching community around the Bible and faith, facilitating live audio discussions, Bible studies, prayer groups, and spiritual reflection.

## Technology Stack (Revised for Free Prototype/Version)
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Navigation**: React Navigation v6 (Bottom Tab + Stack Navigation)
- **Audio (Real-time)**: **Agora.io SDK / Twilio Programmable Voice SDK** (essential for actual live audio streaming; leverages their free tiers for prototyping)
- **Audio (Playback/Recording)**: Expo AV (for non-real-time audio features like playing short devotional clips, local recordings if any)
- **Real-time Communication (Data/Signaling)**: **Firebase Realtime Database / Cloud Firestore** (for all structured and real-time data synchronization like room metadata, user presence, "raise hand" requests, chat messages)
- **Backend (Serverless / BaaS)**: **Firebase**
  * **Firebase Authentication:** For user sign-up, sign-in, and identity management
  * **Firebase Realtime Database / Cloud Firestore:** Primary data store (NoSQL)
  * **Firebase Storage:** For user-uploaded content (e.g., profile photos)
  * **Firebase Cloud Functions (optional for prototype):** For server-side triggers like sending advanced push notifications or complex data validation that can't be handled by security rules
  * **Firebase Hosting:** For static assets or any web-based components (e.g., dynamic link landing pages)
- **Database**: **Firebase Realtime Database / Cloud Firestore** (NoSQL, real-time, managed, fully integrated with client SDKs)
- **Authentication**: **Firebase Authentication** (Supports Email/Password, Phone Number, Google, Apple)
- **Push Notifications**: **Expo Notifications** (seamlessly integrates with Firebase Cloud Messaging)
- **Bible API**: **Bible API (api.bible)** or **ESV API** for Bible text retrieval and verse lookup
- **UI Components**: React Native Elements + Custom Components
- **Icons**: React Native Vector Icons + Expo Vector Icons
- **Styling**: Styled Components

## Core Features to Implement (with Serverless/NoSQL Focus)

### 1. Authentication System (Firebase Authentication)
- [ ] Phone number verification (via Firebase Authentication)
- [ ] Social login (Google, Apple via Firebase Authentication)
- [ ] Profile creation and editing (user data stored in Firebase Realtime Database/Firestore)
- [ ] User onboarding flow with spiritual interests selection

### 2. User Profile Management ("My Testimony")
- [ ] Profile photo upload (to Firebase Storage, URL stored in user's Firestore/RTDB profile)
- [ ] Customizable bio with rich text support for favorite verses, spiritual journey, church affiliation
- [ ] Following/Followers system (managed through specific data structures/collections in Firebase)
- [ ] User verification badges (a simple boolean flag on the user document in Firebase)
- [ ] "Nominated By" display (who invited the user to ChurchHouse)
- [ ] Fellowships/Clubs membership display
- [ ] Recently active rooms display
- [ ] External links (personal website, ministry, YouTube channel for sermons)
- [ ] Spiritual gifts/ministry tags (Teacher, Intercessor, Worship Leader, Evangelist, etc.)

### 3. Navigation Structure & Bible App Integration
- [ ] **Bottom Tab Navigation:**
  * **Home Tab ("Daily Bread")**: Room discovery, trending safespace, personalized feed with social features
  * **Bible Tab ("The Holy Text")**: Integrated Bible viewer and study tools
  * **safespace Tab**: Active and scheduled audio rooms
  * **Prayer Tab ("Prayer Altar")**: Prayer requests and community prayer
  * **Profile Tab ("My Testimony")**: User profile and settings
- [ ] **"Daily Scroll" Social Feed Features:**
  * Post creation ("Share a Blessing") with text, images, Bible verses
  * Rich content support: hashtags (#DailyDevotion, #PrayerRequest), mentions (@username)
  * Audience control: Public, followers-only, fellowship-specific posts
  * Post interactions: "Amen" button (like), commenting, resharing ("Re-Bless")
  * Infinite scrolling with efficient FlatList implementation
- [ ] **Bible App Features:**
  * Multiple Bible translations (KJV, NIV, ESV, NLT, etc.)
  * Verse search and lookup functionality
  * Highlighting and bookmarking verses
  * Personal notes on verses
  * Sharing verses to ChurchHouse chat or external apps
  * Daily devotionals integration
  * Bible reading plans

### 4. Room Management ("safespace") - Firebase Realtime Database/Firestore & Agora/Twilio
- [ ] Create audio rooms ("safespace"):
  * Room metadata (title, topic, host UID, current speakers, room status) stored in Firebase
  * Unique Agora/Twilio room ID generated and linked to the Firebase room entry
  * Room privacy settings (Open, Community, Private)
  * Bible verse references in room descriptions
  * Faith-based categories (Daily Devotion, Biblical Study, Prayer & Intercession, etc.)
- [ ] Join existing rooms:
  * Listeners subscribe to real-time updates of room status from Firebase
  * Client integrates with Agora/Twilio SDK to join the specific audio channel
  * Dynamic stage with clear role separation (Host/Pastor, Speaker/Disciple, Listener/Congregation)
- [ ] Room moderation tools (Host/Pastor actions):
  * Invite to stage, move to audience
  * Mute/unmute speakers
  * Remove from room
  * Turn off/on hand raising
  * Search within room
  * View profile before promotion
- [ ] Listener interactions:
  * "Raise Hand" icon (stylized praying hands)
  * "Quiet Leave" / "Amen & Exit" button
- [ ] Scheduled events ("Sermons & Studies"):
  * Event creation with co-hosts/co-teachers
  * Calendar view ("Bulletin Board")
  * Reminders and notifications
  * Shareable event links

### 5. Fellowships (Clubs) System
- [ ] Community creation around faith interests, ministries, denominations
- [ ] Fellowship roles:
  * Elder (Admin): Full control over Fellowship settings
  * Leader (Moderator): Can create Fellowship-branded rooms
  * Member: Can join private Fellowship rooms
- [ ] Membership types (Open, By Approval, Closed)
- [ ] Fellowship profile pages with member lists and upcoming safespace
- [ ] Fellowship-specific notifications

### 6. Audio Features (Agora.io SDK / Twilio Programmable Voice SDK)
- [ ] Real-time audio streaming with optimized infrastructure
- [ ] Mute/unmute functionality
- [ ] Raise hand feature (Firebase state management)
- [ ] Speaker management system
- [ ] Audio quality controls
- [ ] "Followed by the Speakers" visual grouping
- [ ] Real-time notifications within rooms

### 7. Bible Integration & API Configuration
- [ ] **Bible API Setup:**
  * Configure Bible API (api.bible) or ESV API credentials
  * Environment variables for API keys
  * API service wrapper for Bible text retrieval
- [ ] **In-Room Verse Lookup:**
  * Automatic detection of Bible references in chat
  * Tap-to-view verse functionality
  * Real-time verse display during discussions
- [ ] **Bible Study Tools:**
  * Cross-references and commentaries
  * Verse comparison across translations
  * Study notes and annotations
- [ ] **Verse Sharing:**
  * Share to ChurchHouse chat
  * Share to external social media
  * Create image quotes from verses

### 8. Prayer Features ("Prayer Altar")
- [ ] Prayer request wall with public/private options
- [ ] "Amen" / "Prayed For" button functionality
- [ ] Prayer request categorization (Health, Guidance, Finances, Family)
- [ ] Prayer request safespace (live audio prayer sessions)
- [ ] Accountability partners feature for spiritual accountability

### 9. Social Features (Firebase Realtime Database/Firestore & Expo Notifications)
- [ ] Follow/unfollow users
- [ ] User discovery and recommendations
- [ ] Direct messaging ("Fellowship Chat"):
  * One-on-one private text chat
  * Group private text chat
  * Message requests inbox
  * Bible verse sharing in chat
- [ ] "Ping" to room (invite followers to active chapel)
- [ ] Contact sync for finding friends
- [ ] Share rooms with Firebase Dynamic Links

### 10. Notifications System ("Divine Alerts")
- [ ] Real-time push notifications:
  * Followed user starts a chapel
  * Scheduled event reminders
  * New Fellowship chapel alerts
  * New followers
  * Direct messages
  * Private chapel invitations
- [ ] In-app notification feed
- [ ] Granular notification settings

### 11. Content & Safety ("Sanctuary Shield")
- [ ] Reporting system for inappropriate content
- [ ] User blocking functionality
- [ ] Community guidelines enforcement
- [ ] Content filters and moderation tools
- [ ] Firebase Security Rules for data protection

### 12. Additional Faith-Based Features
- [ ] **Devotional Content ("Daily Manna"):**
  * Curated daily devotionals
  * Themed devotional series
  * User-submitted devotionals (moderated)
- [ ] **Resource Library ("The Scroll"):**
  * Christian books, podcasts, courses
  * Ministry recommendations
  * Bible study tools
- [ ] **Spiritual Gifts Integration:**
  * Profile tags for ministry focus
  * Chapel tags for spiritual focus
  * Ministry-based user discovery

### 13. UI/UX Features
- [ ] Dark/Light theme support
- [ ] Custom ChurchHouse branding with warm brown color palette
- [ ] Church/community themed iconography (cross, dove, praying hands)
- [ ] Smooth animations and transitions
- [ ] Responsive design for all screen sizes
- [ ] Accessibility features (VoiceOver, TalkBack support)

## Development Phases (Adjusted for Serverless/NoSQL)

### Phase 1: Project Setup & Basic Structure 
1. Initialize React Native Expo project with TypeScript
2. Set up TypeScript configuration and ESLint/Prettier
3. Install and configure essential dependencies:
   - **Firebase SDKs** (`@react-native-firebase/app`, `@react-native-firebase/auth`, `@react-native-firebase/firestore`, `@react-native-firebase/storage`)
   - **Agora.io / Twilio SDKs** for real-time audio
   - **Expo Notifications** for push notifications
   - **React Navigation v6** for navigation
   - **Redux Toolkit** for state management
4. Create comprehensive folder structure with services, hooks, and types
5. Set up navigation structure (Bottom Tab + Stack Navigation)
6. Implement ChurchHouse UI theme with brown color palette
7. **Critical: Set up Firebase Project:**
   - Create Firebase project in Google Cloud Console
   - Enable Authentication, Firestore/Realtime Database, Storage, Hosting
   - Configure `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Set up environment variables for API keys

### Phase 2: Authentication & Social Feed Foundation 
1. Implement Firebase Authentication:
   - Phone number verification
   - Google and Apple social login
   - Authentication state management with Redux
2. Create login/signup screens with ChurchHouse branding
3. Set up user profile creation/editing:
   - Store user data in Firebase Firestore
   - Profile photo upload to Firebase Storage
   - Spiritual interests and ministry tags selection
4. **Implement "Daily Scroll" Social Feed Infrastructure:**
   - Design Firebase Firestore data structure for posts, likes, comments
   - Create `posts` collection with comprehensive fields (text, images, Bible verses, hashtags, mentions)
   - Set up composite indexes for efficient feed queries
   - Implement post creation UI ("Share a Blessing") with rich content support
   - Build feed display with FlatList optimization and pagination
5. **Social Feed Features:**
   - Post interactions: "Amen" button, commenting system, resharing ("Re-Bless")
   - Hashtag and mention functionality (#DailyDevotion, @username)
   - Audience control (Public, Followers, Fellowship-specific)
   - Link preview generation for external URLs
6. Implement Firebase Security Rules for data access control
7. Create comprehensive onboarding flow for new users
8. Set up user profile screens ("My Testimony")

### Phase 3: Bible Integration & Feed Enhancement 
1. **Configure Bible API:**
   - Set up Bible API (api.bible) or ESV API credentials
   - Create API service wrapper for Bible text retrieval
   - Implement environment variable management for API keys
2. **Build Bible App Tab ("The Holy Text"):**
   - Multiple Bible translation support (KJV, NIV, ESV, NLT)
   - Verse search and lookup functionality
   - Bible book/chapter navigation
3. **Implement Bible Study Features:**
   - Verse highlighting and bookmarking (stored in Firebase)
   - Personal notes on verses
   - Cross-references and study tools
4. **Bible-Feed Integration:**
   - Verse snippet sharing directly to Daily Scroll
   - Automatic Bible reference detection and parsing in posts
   - Quick verse lookup from hashtags and mentions
   - Bible verse cards with rich formatting in feed
5. **Bible Sharing Integration:**
   - Share verses to external apps
   - Create verse image quotes
   - Prepare for in-room verse lookup integration

### Phase 4: Core Room Features ("safespace") 
1. Design and implement room creation:
   - Store room metadata in Firebase Firestore
   - Room privacy settings (Open, Community, Private)
   - Faith-based categories and Bible verse references
2. Build room listing and discovery ("Daily Bread" tab):
   - Personalized feed based on followed users and interests
   - Trending safespace algorithm
   - Search functionality for rooms and users
3. **Integrate Agora.io / Twilio SDK:**
   - Set up SDK for audio channel management
   - Obtain and configure API keys securely
4. Create room joining mechanism:
   - Firebase real-time room status updates
   - Audio channel connection via Agora/Twilio
   - Dynamic stage with role separation (Pastor/Disciple/Congregation)
5. Implement basic speaker/listener roles and UI

### Phase 5: Advanced Audio & Real-time Features 
1. Optimize real-time audio streaming performance
2. Implement comprehensive room moderation tools:
   - Invite to stage, move to audience
   - Mute/unmute speakers
   - Remove from room functionality
   - Hand raising with Firebase state management
3. Add listener interactions:
   - "Raise Hand" icon (praying hands design)
   - "Amen & Exit" quiet leave functionality
4. **In-Room Bible Integration:**
   - Automatic Bible reference detection in chat
   - Tap-to-view verse functionality
   - Real-time verse display during discussions
5. **Feed Notifications Integration:**
   - Push notifications for post likes, comments, mentions
   - Real-time feed updates and engagement alerts
   - Notification preferences for feed interactions
6. Implement push notifications with Expo Notifications
7. Set up Firebase Cloud Functions for complex notifications

### Phase 6: Fellowships & Social Features 
1. Implement Fellowships (Clubs) system:
   - Community creation with Firebase collections
   - Fellowship roles (Elder, Leader, Member)
   - Membership management and approval workflows
2. Build social features:
   - Follow/unfollow system with Firebase
   - User discovery and recommendations
   - Contact sync for finding friends
3. **Direct Messaging ("Fellowship Chat"):**
   - One-on-one and group private chat
   - Message requests inbox
   - Bible verse sharing in chat
   - Real-time messaging with Firebase
4. **Fellowship Feed Integration:**
   - Fellowship-specific post feeds
   - Fellowship announcements and events in feed
   - Member-only content sharing
5. Implement "Ping" to room functionality
6. Create shareable links with Firebase Dynamic Links

### Phase 7: Prayer & Faith Features
1. **Build Prayer Tab ("Prayer Altar"):**
   - Prayer request wall with public/private options
   - "Amen" / "Prayed For" button functionality
   - Prayer categorization system
   - Prayer request safespace (live audio prayer)
2. **Prayer-Feed Integration:**
   - Prayer requests shared to Daily Scroll
   - Prayer testimonies and answered prayers posts
   - Prayer circle invitations through feed
3. **Implement Additional Faith Features:**
   - Daily devotionals ("Daily Manna")
   - Resource library ("The Scroll")
   - Accountability partners feature
4. **Scheduled Events System:**
   - Event creation with co-hosts
   - Calendar view ("Bulletin Board")
   - Event reminders and notifications
5. Integrate spiritual gifts/ministry tags throughout the app

### Phase 8: Content Safety & Polish 
1. **Implement "Sanctuary Shield" safety features:**
   - Reporting system for inappropriate content (including feed posts)
   - User blocking functionality
   - Community guidelines enforcement
   - Content filters and moderation tools for feed
2. **Comprehensive Notifications System:**
   - Real-time push notifications for all events
   - In-app notification feed
   - Granular notification settings for feed interactions
3. **UI/UX Polish:**
   - Dark/Light theme implementation
   - Smooth animations and transitions for feed interactions
   - Accessibility features (VoiceOver, TalkBack)
   - Responsive design optimization
4. Performance optimization and bug fixes

### Phase 9: Testing & Deployment 
1. Comprehensive testing on both iOS and Android:
   - Real-time audio performance testing
   - Firebase data synchronization testing
   - Bible API integration testing
   - Security rules validation
   - **Social Feed Testing:**
     - Feed performance with large datasets
     - Post creation and interaction flows
     - Hashtag and mention functionality
     - Image upload and display optimization
     - Real-time feed updates and notifications
2. Performance optimization:
   - React Native rendering optimization
   - Firebase query efficiency
   - Audio streaming quality assurance
3. App store preparation:
   - App Store Connect and Google Play Console setup
   - App metadata, screenshots, and descriptions
   - Privacy policy and terms of service
4. **Deployment:**
   - Expo EAS Build for native app binaries
   - Expo EAS Update for OTA updates
   - Firebase Hosting for web components
5. Final testing and launch preparation

## File Structure
```
churchhouse/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Generic components (Button, Input, etc.)
│   │   ├── bible/           # Bible-specific components (VerseCard, BibleReader, etc.)
│   │   ├── audio/           # Audio-related components (AudioControls, SpeakerList, etc.)
│   │   ├── prayer/          # Prayer components (PrayerCard, PrayerForm, etc.)
│   │   ├── fellowship/      # Fellowship components (FellowshipCard, MemberList, etc.)
│   │   └── feed/            # Social feed components (PostCard, PostComposer, FeedList, etc.)
│   ├── screens/             # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── home/           # Home/Daily Bread screens with feed
│   │   ├── bible/          # Bible app screens
│   │   ├── safespace/        # Audio room screens
│   │   ├── prayer/         # Prayer altar screens
│   │   ├── profile/        # Profile/Testimony screens
│   │   ├── fellowship/     # Fellowship screens
│   │   ├── feed/           # Dedicated feed screens (PostDetail, UserFeed, etc.)
│   │   └── settings/       # Settings screens
│   ├── navigation/          # Navigation configuration
│   │   ├── TabNavigator.tsx # Bottom tab navigation
│   │   ├── StackNavigator.tsx # Stack navigation
│   │   └── index.tsx       # Root navigator
│   ├── services/            # API and external services
│   │   ├── firebase/       # Firebase service wrappers
│   │   │   ├── auth.ts     # Authentication service
│   │   │   ├── firestore.ts # Firestore database service
│   │   │   ├── storage.ts  # Firebase Storage service
│   │   │   └── functions.ts # Cloud Functions service
│   │   ├── bible/          # Bible API services
│   │   │   ├── bibleApi.ts # Bible API wrapper
│   │   │   ├── translations.ts # Translation management
│   │   │   └── verses.ts   # Verse lookup and parsing
│   │   ├── audio/          # Audio services
│   │   │   ├── agora.ts    # Agora SDK wrapper
│   │   │   └── audioManager.ts # Audio state management
│   │   ├── feed/           # Social feed services
│   │   │   ├── feedApi.ts  # Feed data management
│   │   │   ├── postService.ts # Post creation and management
│   │   │   ├── interactionService.ts # Likes, comments, shares
│   │   │   └── hashtagService.ts # Hashtag and mention parsing
│   │   └── notifications/  # Push notification service
│   ├── store/               # Redux store and slices
│   │   ├── slices/         # Redux slices
│   │   │   ├── authSlice.ts
│   │   │   ├── bibleSlice.ts
│   │   │   ├── safespaceSlice.ts
│   │   │   ├── prayerSlice.ts
│   │   │   ├── fellowshipSlice.ts
│   │   │   └── feedSlice.ts # Social feed state management
│   │   ├── api/            # RTK Query API definitions
│   │   └── index.ts        # Store configuration
│   ├── utils/               # Utility functions
│   │   ├── constants.ts    # App constants
│   │   ├── helpers.ts      # Helper functions
│   │   ├── validators.ts   # Form validation
│   │   ├── formatters.ts   # Data formatters
│   │   └── feedUtils.ts    # Feed-specific utilities (hashtag parsing, link preview, etc.)
│   ├── types/               # TypeScript type definitions
│   │   ├── auth.ts         # Authentication types
│   │   ├── bible.ts        # Bible-related types
│   │   ├── chapel.ts       # Chapel/room types
│   │   ├── prayer.ts       # Prayer types
│   │   ├── fellowship.ts   # Fellowship types
│   │   ├── feed.ts         # Social feed types (Post, Comment, Like, etc.)
│   │   └── navigation.ts   # Navigation types
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts      # Authentication hook
│   │   ├── useBible.ts     # Bible functionality hook
│   │   ├── useAudio.ts     # Audio management hook
│   │   ├── usePrayer.ts    # Prayer features hook
│   │   ├── useFeed.ts      # Social feed hook
│   │   └── useFirebase.ts  # Firebase utilities hook
│   ├── constants/           # App constants and configuration
│   │   ├── theme.ts        # ChurchHouse theme configuration
│   │   ├── colors.ts       # Color palette
│   │   ├── fonts.ts        # Typography configuration
│   │   ├── api.ts          # API endpoints and keys
│   │   ├── firebase.ts     # Firebase configuration
│   │   └── feed.ts         # Feed-specific constants (character limits, hashtags, etc.)
│   └── assets/              # Images, fonts, icons
│       ├── images/         # App images and logos
│       ├── icons/          # Custom icons
│       └── fonts/          # Custom fonts
├── firebase/                # Firebase Cloud Functions (optional)
│   ├── functions/          # Cloud Functions source (for feed notifications, etc.)
│   ├── firestore.rules     # Firestore security rules
│   └── firebase.json       # Firebase configuration
├── config/                  # Configuration files
│   ├── env/                # Environment configurations
│   │   ├── .env.development
│   │   ├── .env.staging
│   │   └── .env.production
│   └── api/                # API configuration
│       ├── bible.config.ts # Bible API configuration
│       └── agora.config.ts # Agora configuration
├── docs/                    # Documentation
│   ├── api/                # API documentation
│   ├── features/           # Feature specifications
│   ├── deployment/         # Deployment guides
│   └── feed-architecture.md # Social feed technical documentation
└── tests/                   # Test files
    ├── __mocks__/          # Mock files
    ├── components/         # Component tests
    ├── services/           # Service tests
    └── utils/              # Utility tests
```

## API Configuration & Environment Setup

### Bible API Configuration
```typescript
// config/api/bible.config.ts
export const BIBLE_API_CONFIG = {
  // Option 1: Bible API (api.bible)
  BIBLE_API: {
    BASE_URL: 'https://api.scripture.api.bible/v1',
    API_KEY: process.env.BIBLE_API_KEY, // Get from api.bible
    DEFAULT_TRANSLATION: 'de4e12af7f28f599-02', // NIV
    SUPPORTED_TRANSLATIONS: {
      NIV: 'de4e12af7f28f599-02',
      ESV: '59dcc9265eca2eae-01',
      KJV: 'de4e12af7f28f599-01',
      NLT: '71c6eab17ae5b667-01',
    }
  },
  
  // Option 2: ESV API (alternative)
  ESV_API: {
    BASE_URL: 'https://api.esv.org/v3',
    API_KEY: process.env.ESV_API_KEY, // Get from ESV API
    DEFAULT_OPTIONS: {
      'include-headings': false,
      'include-footnotes': false,
      'include-verse-numbers': true,
      'include-short-copyright': false,
    }
  }
};
```

### Environment Variables Setup
```bash
# .env.development
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Bible API Keys
BIBLE_API_KEY=your_bible_api_key
ESV_API_KEY=your_esv_api_key

# Audio Service Keys
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_certificate
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# Other API Keys
EXPO_PUSH_TOKEN=your_expo_push_token
```

### Bible API Service Implementation
```typescript
// src/services/bible/bibleApi.ts
import { BIBLE_API_CONFIG } from '../../../config/api/bible.config';

export class BibleApiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = BIBLE_API_CONFIG.BIBLE_API.API_KEY;
    this.baseUrl = BIBLE_API_CONFIG.BIBLE_API.BASE_URL;
  }

  async getVerse(reference: string, translation?: string): Promise<VerseData> {
    const translationId = translation || BIBLE_API_CONFIG.BIBLE_API.DEFAULT_TRANSLATION;
    const response = await fetch(
      `${this.baseUrl}/bibles/${translationId}/search?query=${encodeURIComponent(reference)}`,
      {
        headers: {
          'api-key': this.apiKey,
        },
      }
    );
    return response.json();
  }

  async getChapter(book: string, chapter: number, translation?: string): Promise<ChapterData> {
    // Implementation for getting full chapters
  }

  async searchVerses(query: string, translation?: string): Promise<SearchResults> {
    // Implementation for verse search
  }
}
```

## ChurchHouse Branding Guidelines

### Color Palette
- **Primary**: #8B4513 (Saddle Brown) - replacing Clubhouse green
- **Secondary**: #D2691E (Chocolate)
- **Accent**: #F4A460 (Sandy Brown)
- **Background**: #FFF8DC (Cornsilk) for light theme
- **Dark Background**: #2F1B14 (Dark Brown) for dark theme
- **Text Primary**: #3C2414 (Dark Brown)
- **Text Secondary**: #8B7355 (Medium Brown)

### Typography
- **Primary Font**: System default (San Francisco on iOS, Roboto on Android)
- **Headers**: Bold, larger sizes
- **Body**: Regular weight
- **Captions**: Light weight, smaller sizes

### Logo & Branding
- Replace Clubhouse logo with ChurchHouse logo
- Use church/community themed iconography
- Maintain similar layout structure but with warmer, community-focused colors

## Key Differences from Clubhouse
1. **Name**: ChurchHouse instead of Clubhouse
2. **Color Scheme**: Brown/warm tones instead of green
3. **Iconography**: Church/community themed
4. **Branding**: Focus on spiritual/community gatherings
5. **Additional Features**: Prayer rooms, sermon discussions, community events

## Technical Considerations (Crucial for Free Prototype)

### Firebase & Backend Considerations
- **Firebase Security Rules are paramount:** They are your *only* backend logic for data access and validation. Design them meticulously to prevent unauthorized reads/writes and ensure data integrity
- **Firebase Free Tier Limits:** Be aware of daily read/write/delete limits for Firestore/Realtime Database, storage limits for Storage, and invocation limits for Cloud Functions. Design data structures and queries to minimize operations
- **Data Structure Optimization:** Design Firebase collections efficiently to support real-time updates for safespace, prayer requests, and social features
- **Social Feed Data Architecture:**
  - **`posts` Collection:** Core feed posts with fields: `postId`, `userId`, `userName`, `userProfilePic`, `timestamp`, `text`, `imageUrl`, `videoUrl`, `bibleVerse` (object), `links` (array), `hashtags`, `mentions`, `audience`, engagement counts
  - **`likes` & `comments` Collections:** Efficient subcollections or top-level collections for post interactions
  - **Feed Construction Strategy:** Start with "pull" method (query posts from followed users) for prototype, consider "push" (fan-out) strategy for scale
  - **Composite Indexes:** Essential for feed queries combining `where` and `orderBy` clauses
  - **Denormalization:** Duplicate user info in posts to minimize read operations

### Audio & Real-time Communication
- **Agora.io / Twilio Free Tier Limits:** Monitor usage carefully. Agora offers **10,000 free-of-charge minutes per month** for Voice Calling, which is a good starting point for a prototype. Twilio also has free credits or initial free usage for Programmable Voice
- **Audio Performance:** Optimize React Native component rendering, state management, and interaction with the audio SDKs to minimize latency and dropped frames
- **Real-time Synchronization:** Ensure seamless integration between Firebase real-time data (room metadata, user presence) and audio SDK state management

### Bible API Integration
- **API Rate Limits:** Both Bible API and ESV API have rate limits. Implement caching strategies for frequently accessed verses and chapters
- **Offline Bible Access:** Consider implementing offline Bible storage for core translations to reduce API dependency
- **Verse Parsing:** Implement robust Bible reference parsing (e.g., "John 3:16", "1 Corinthians 13:4-8") for automatic verse lookup in chat and discussions
- **Translation Management:** Efficiently handle multiple Bible translations and user preferences

### Development & Deployment
- **Expo EAS Build/Update Free Tier:** The free tier provides sufficient build minutes and OTA updates for prototyping (30 builds/month, updates to 1,000 MAUs)
- **Environment Management:** Properly manage API keys and sensitive configuration across development, staging, and production environments
- **Security Best Practices:** Never hardcode API keys, use environment variables, implement proper Firebase Security Rules

### Performance & Optimization
- **React Native Performance:** Optimize rendering for real-time features like live chapel participant lists and chat
- **Firebase Query Optimization:** Design efficient queries to minimize read operations and costs
- **Image Optimization:** Optimize profile photos and other images for mobile performance
- **Offline Capabilities:** Leverage Firebase's automatic offline persistence for better user experience
- **Social Feed Performance:**
  - **FlatList Optimization:** Implement efficient rendering with `React.memo`, proper `keyExtractor`, and optimized `renderItem`
  - **Pagination Strategy:** Use `orderBy('timestamp', 'desc').limit(20)` with `startAfter()` for smooth infinite scrolling
  - **Image Caching:** Implement proper image caching for feed posts and user avatars
  - **Real-time Updates:** Balance real-time feed updates with read operation costs using strategic `onSnapshot()` listeners

### Compliance & Safety
- **Data Privacy:** Ensure GDPR/data privacy compliance, especially for user data, prayer requests, and audio content
- **Content Moderation:** Implement robust reporting and moderation systems for maintaining a safe spiritual community
- **Audio Permissions:** Implement proper audio recording and playback permissions handling on both iOS and Android platforms
- **Child Safety:** Consider additional safety measures if the app will be used by minors

### Analytics & Monitoring
- **Firebase Analytics:** Track user engagement, chapel participation, and Bible usage patterns
- **Crashlytics:** Monitor app stability and performance issues
- **Audio Quality Monitoring:** Track audio connection quality and user experience metrics

## Success Metrics

### Technical Metrics
- Smooth audio streaming with minimal latency for small groups (within free tier limits)
- Reliable cross-platform compatibility on iOS and Android
- Stable performance under prototype load (up to 1,000 monthly active users)
- Successful app store deployment and ability to receive OTA updates via Expo
- Firebase Security Rules properly protecting user data and preventing unauthorized access

### User Experience Metrics
- Intuitive and spiritually uplifting user experience
- Seamless Bible integration with fast verse lookup and sharing
- Effective prayer request and fellowship community features
- High user engagement in safespace and spiritual discussions
- Positive feedback on ChurchHouse branding and spiritual focus
- **Social Feed Engagement:**
  - Daily active users creating and interacting with posts
  - Average time spent in Daily Scroll feed
  - Post engagement rates (likes, comments, shares)
  - Bible verse sharing frequency and interaction
  - Hashtag usage and trending spiritual topics

### Community Metrics
- Active chapel participation and meaningful spiritual discussions
- Growing fellowship communities around various faith topics
- Regular use of prayer features and Bible study tools
- Positive community interactions and spiritual growth
- Effective content moderation maintaining a safe environment

## Next Steps

### Immediate Setup (Week 1)
1. **Critical First Step:** Create and configure a **Firebase Project** in the Google Cloud Console:
   - Enable Authentication, Firestore/Realtime Database, Storage, Hosting
   - Set up Firebase Security Rules for initial data protection
   - Configure authentication providers (Phone, Google, Apple)

2. **API Account Setup:**
   - Register for Bible API (api.bible) or ESV API account
   - Obtain Agora.io or Twilio account for audio services
   - Set up Expo account for build and deployment services

3. **Development Environment:**
   - Set up local React Native development environment
   - Install Expo CLI and configure development tools
   - Set up version control with Git and establish branching strategy

### Project Initialization (Week 1-2)
4. **Initialize React Native Expo Project:**
   - Create project with TypeScript template
   - Configure Firebase SDKs and authentication
   - Set up basic navigation structure and ChurchHouse theming

5. **Environment Configuration:**
   - Set up environment variables for all API keys
   - Configure different environments (development, staging, production)
   - Implement secure API key management

### Development Process (Weeks 2-5)
6. **Follow Development Phases:**
   - Begin Phase 1 implementation, focusing on Firebase integration
   - Implement Bible API integration early for core functionality
   - Regular testing on both iOS and Android devices from the outset

7. **Continuous Integration:**
   - Set up Expo EAS Build for app store builds
   - Configure Expo EAS Update for OTA updates
   - Implement automated testing and code quality checks

### Testing & Launch Preparation (Week 5-6)
8. **Comprehensive Testing:**
   - Test all Firebase Security Rules thoroughly
   - Validate Bible API integration and offline functionality
   - Test audio features with multiple users and devices
   - Ensure proper error handling and edge cases

9. **App Store Preparation:**
   - Prepare app metadata, screenshots, and descriptions
   - Create privacy policy and terms of service
   - Set up App Store Connect and Google Play Console accounts

10. **Community Launch:**
    - Plan soft launch with beta testers from faith community
    - Gather feedback and iterate on user experience
    - Prepare for wider community launch and growth

---

**Note**: This comprehensive plan serves as a roadmap for building a full-featured ChurchHouse application. The plan may be adjusted based on development progress, user feedback, and technical requirements. Priority should be given to core audio features, Bible integration, and community safety features for the initial prototype.