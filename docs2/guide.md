You got it\! Here's the revised ChurchHouse Development Plan, meticulously formatted to match your provided structure, with the backend entirely refactored for "no SQL" and "free prototype" hosting using Firebase and dedicated real-time audio services.

-----

# ChurchHouse - Clubhouse Clone Development Plan (Free, No-SQL )

## Project Overview

ChurchHouse is a cross-platform mobile application that replicates the core functionality of Clubhouse with custom branding and UI modifications. The app will support both iOS and Android platforms using React Native with Expo. The prototype will leverage entirely free tiers of cloud services for data storage and real-time communication, avoiding traditional SQL databases and custom backend server management.

## Technology Stack (Revised for Free Prototype/Version)

  - **Framework**: React Native with Expo
  - **Language**: TypeScript
  - **State Management**: Redux Toolkit + RTK Query
  - **Navigation**: React Navigation v6
  - **Audio (Real-time)**: **Agora.io SDK / Twilio Programmable Voice SDK** (essential for actual live audio streaming; leverages their free tiers for prototyping)
  - **Audio (Playback/Recording)**: Expo AV (for non-real-time audio features like playing short devotional clips, local recordings if any)
  - **Real-time Communication (Data/Signaling)**: **Firebase Realtime Database / Cloud Firestore** (for all structured and real-time data synchronization like room metadata, user presence, "raise hand" requests, chat messages)
  - **Backend (Serverless / BaaS)**: **Firebase**
      * **Firebase Authentication:** For user sign-up, sign-in, and identity management.
      * **Firebase Realtime Database / Cloud Firestore:** Primary data store (NoSQL).
      * **Firebase Storage:** For user-uploaded content (e.g., profile photos).
      * **Firebase Cloud Functions (optional for prototype):** For server-side triggers like sending advanced push notifications or complex data validation that can't be handled by security rules.
      * **Firebase Hosting:** For static assets or any web-based components (e.g., dynamic link landing pages).
  - **Database**: **Firebase Realtime Database / Cloud Firestore** (NoSQL, real-time, managed, fully integrated with client SDKs)
  - **Authentication**: **Firebase Authentication** (Supports Email/Password, Phone Number, Google, Apple)
  - **Push Notifications**: **Expo Notifications** (seamlessly integrates with Firebase Cloud Messaging)
  - **UI Components**: React Native Elements + Custom Components
  - **Icons**: React Native Vector Icons
  - **Styling**: Styled Components

## Core Features to Implement (with Serverless/NoSQL Focus)

### 1\. Authentication System (Firebase Authentication)

  - [ ] Phone number verification (via Firebase Authentication)
  - [ ] Social login (Google, Apple via Firebase Authentication)
  - [ ] Profile creation and editing (user data stored in Firebase Realtime Database/Firestore)
  - [ ] User onboarding flow

### 2\. User Profile Management (Firebase Realtime Database/Firestore & Storage)

  - [ ] Profile photo upload (to Firebase Storage, URL stored in user's Firestore/RTDB profile)
  - [ ] Bio and interests (stored in Firebase Realtime Database/Firestore)
  - [ ] Following/Followers system (managed through specific data structures/collections in Firebase Realtime Database/Firestore)
  - [ ] User verification badges (a simple boolean flag on the user document in Firebase)

### 3\. Room Management (Firebase Realtime Database/Firestore & Agora/Twilio)

  - [ ] Create audio rooms ("Chapels"):
      * Room metadata (title, topic, host UID, current speakers, room status) stored in Firebase Realtime Database/Firestore.
      * Unique Agora/Twilio room ID generated and linked to the Firebase room entry.
  - [ ] Join existing rooms:
      * Listeners subscribe to real-time updates of room status from Firebase.
      * Client integrates with Agora/Twilio SDK to join the specific audio channel using the generated room ID.
  - [ ] Room categories and topics (metadata stored in Firebase for filtering and discovery)
  - [ ] Scheduled rooms (entries in Firebase, possibly with Firebase Cloud Functions to trigger reminders using Expo Notifications)
  - [ ] Room moderation tools (Host actions update Firebase data, which triggers UI changes and corresponding Agora/Twilio SDK calls for muting, promoting speakers, removing users)

### 4\. Audio Features (Agora.io SDK / Twilio Programmable Voice SDK)

  - [ ] Real-time audio streaming:
      * Core audio communication handled by the chosen third-party SDK (Agora.io or Twilio).
      * Clients connect directly to their optimized infrastructure.
  - [ ] Mute/unmute functionality (controlled via the Agora/Twilio SDK within the client application)
  - [ ] Raise hand feature (a boolean state change for the user's presence within the room in Firebase, which the Host observes in real-time)
  - [ ] Speaker management (Host updates the list of active speakers in Firebase; Agora/Twilio SDK manages actual speaking permissions based on this data)
  - [ ] Audio quality controls (typically managed by the audio SDK, or relies on the service's built-in optimization)

### 5\. Social Features (Firebase Realtime Database/Firestore & Expo Notifications)

  - [ ] Follow/unfollow users (updates user documents/collections in Firebase)
  - [ ] Invite friends (via standard share sheets, potentially integrated with Firebase Dynamic Links for deep linking)
  - [ ] Share rooms (shareable links generated from Firebase room IDs, using Firebase Dynamic Links for better UX)
  - [ ] User discovery (querying Firebase based on user profiles, interests, and follow graphs)
  - [ ] Notifications system (Expo Notifications, triggered by Firebase data changes or via Firebase Cloud Functions for more complex event-based alerts like "followed you," "room started")

### 6\. UI/UX Features

  - [ ] Dark/Light theme support
  - [ ] Custom ChurchHouse branding
  - [ ] Smooth animations
  - [ ] Responsive design
  - [ ] Accessibility features

## Development Phases (Adjusted for Serverless/NoSQL)

### Phase 1: Project Setup & Basic Structure (Days 1-2)

1.  Initialize React Native Expo project.
2.  Set up TypeScript configuration.
3.  Install and configure essential dependencies, including **Firebase SDKs** (`@react-native-firebase/app`, `@react-native-firebase/auth`, `@react-native-firebase/firestore` or `@react-native-firebase/database`, `@react-native-firebase/storage`), **Agora.io / Twilio SDKs**, and **Expo Notifications**.
4.  Create basic folder structure.
5.  Set up navigation structure using React Navigation.
6.  Implement basic UI theme with ChurchHouse colors.
7.  **Crucial: Set up Firebase Project in Google Cloud Console:** Create project, enable necessary services (Authentication, Realtime Database/Cloud Firestore, Storage, Hosting). Configure Firebase `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) files within your Expo project.

### Phase 2: Authentication & User Management (Days 3-5)

1.  Implement **Firebase Phone verification**, Google, and Apple social login using Firebase Authentication.
2.  Create login/signup screens, handling authentication state changes with Firebase listeners.
3.  Set up user profile creation/editing, storing all user-specific data (bio, interests, profile pic URL) in **Firebase Realtime Database or Cloud Firestore**.
4.  Implement robust **Firebase Security Rules** for data access control (e.g., users can only read/write their own profiles, room hosts can modify their rooms).
5.  Create onboarding flow for new users.

### Phase 3: Core Room Features (Days 6-10)

1.  Design and implement room creation: Store room metadata (name, topic, host UID, initial speakers, timestamps) in Firebase.
2.  Build room listing and discovery: Efficiently query Firebase for active and scheduled rooms.
3.  **Integrate Agora.io / Twilio SDK:** Set up the SDK for basic audio channel connection and management. Obtain necessary API keys.
4.  Create room joining mechanism: User joins a room in your app, which triggers joining the corresponding Agora/Twilio audio channel; update user's presence within the room in Firebase.
5.  Add speaker/listener roles: Define how Firebase data reflects these roles; Agora/Twilio SDK will use this to manage actual audio streams.

### Phase 4: Advanced Audio & Real-time Features 

1.  Implement real-time audio streaming (continue optimizing Agora/Twilio integration for performance and stability within free tier limits).
2.  Add raise hand functionality: A user action updates their presence status in Firebase (e.g., `isHandRaised: true`), the Host's UI reflects this in real-time via Firebase listeners.
3.  Create speaker management system: Host actions (e.g., promoting a listener to speaker) update the speaker list in Firebase; Agora/Twilio SDK's capabilities are then used to grant/revoke speaking permissions.
4.  Implement room moderation tools: Host can update statuses in Firebase (e.g., `isMuted: true` for a user) and call corresponding Agora/Twilio API methods.
5.  **Implement Push Notifications:** Set up Expo Notifications. For event-driven notifications (e.g., "A room you follow just started"), consider basic **Firebase Cloud Functions** as triggers, though some simpler notifications can be managed client-side.

### Phase 5: Social Features & Polish 

1.  Implement follow/following system: Update user-specific "followers" and "following" lists in Firebase.
2.  Add user discovery features: Implement search and recommendation logic by querying user data in Firebase.
3.  Create sharing functionality: Leverage Firebase Dynamic Links to create shareable links for rooms and user profiles that open directly in the app.
4.  Implement notifications system: Display various types of notifications (new follower, scheduled room reminder, mention in chat) using Expo Notifications.
5.  Add final UI polish and animations to enhance the user experience.

### Phase 6: Testing & Deployment 

1.  Comprehensive testing on both iOS and Android devices, focusing on real-time audio performance, data synchronization, and Firebase Security Rules.
2.  Performance optimization: Analyze React Native rendering, Firebase query efficiency, and Agora/Twilio stream quality.
3.  Bug fixes and refinements.
4.  App store preparation (App Store Connect, Google Play Console setup).
5.  Deployment:
      * **Expo EAS Build:** To generate native app binaries for iOS and Android for distribution to app stores (leveraging the free tier's build minutes).
      * **Expo EAS Update:** For over-the-air (OTA) updates for quick iterations after initial deployment (free for up to 1,000 MAU).
      * **Firebase Hosting:** For any static web content or Firebase Dynamic Links landing pages.

## File Structure

```
churchhouse/
├── src/
│   ├── components/           # Reusable UI components
│   ├── screens/             # Screen components (e.g., HomeScreen, RoomScreen, ProfileScreen)
│   ├── navigation/          # React Navigation configuration (Stack, Tab Navigators)
│   ├── services/            # Firebase API interactions, Agora/Twilio SDK wrappers
│   ├── store/               # Redux store, slices, and RTK Query API definitions
│   ├── utils/               # Utility functions, constants, helper methods
│   ├── types/               # TypeScript type definitions for data models
│   ├── hooks/               # Custom React hooks (e.g., useFirebaseUser, useRoomAudio)
│   ├── constants/           # App constants (Firebase config, Agora/Twilio keys)
│   └── assets/              # Images, fonts, icons
├── firebase/                # Firebase Cloud Functions (if used, optional for initial prototype)
├── docs/                    # Project documentation, design notes
└── tests/                   # Unit and integration tests
```

## ChurchHouse Branding Guidelines

### Color Palette

  - **Primary**: \#8B4513 (Saddle Brown) - replacing Clubhouse green
  - **Secondary**: \#D2691E (Chocolate)
  - **Accent**: \#F4A460 (Sandy Brown)
  - **Background**: \#FFF8DC (Cornsilk) for light theme
  - **Dark Background**: \#2F1B14 (Dark Brown) for dark theme
  - **Text Primary**: \#3C2414 (Dark Brown)
  - **Text Secondary**: \#8B7355 (Medium Brown)

### Typography

  - **Primary Font**: System default (San Francisco on iOS, Roboto on Android)
  - **Headers**: Bold, larger sizes
  - **Body**: Regular weight
  - **Captions**: Light weight, smaller sizes

### Logo & Branding

  - Replace Clubhouse logo with ChurchHouse logo.
  - Use church/community themed iconography (e.g., a cross, a dove, praying hands, stylized church building).
  - Maintain similar layout structure but with warmer, community-focused colors.

## Key Differences from Clubhouse

1.  **Name**: ChurchHouse instead of Clubhouse.
2.  **Color Scheme**: Brown/warm tones instead of green.
3.  **Iconography**: Church/community themed.
4.  **Branding**: Focus on spiritual/community gatherings.
5.  **Additional Features**: Prayer rooms, sermon discussions, community events, integrated Bible viewer.

## Technical Considerations (Crucial for Free Prototype)

  - **Firebase Security Rules are paramount:** They are your *only* backend logic for data access and validation. Design them meticulously to prevent unauthorized reads/writes and ensure data integrity.
  - **Firebase Free Tier Limits:** Be aware of daily read/write/delete limits for Firestore/Realtime Database, storage limits for Storage, and invocation limits for Cloud Functions. Design data structures and queries to minimize operations.
  - **Agora.io / Twilio Free Tier Limits:** Monitor usage carefully. Agora offers **10,000 free-of-charge minutes per month** for Voice Calling, which is a good starting point for a prototype. Twilio also has free credits or initial free usage for Programmable Voice.
  - **Expo EAS Build/Update Free Tier:** The free tier provides sufficient build minutes and OTA updates for prototyping (30 builds/month, updates to 1,000 MAUs).
  - Ensure real-time audio performance: Optimize React Native component rendering, state management, and interaction with the audio SDKs to minimize latency and dropped frames.
  - Implement proper error handling for all Firebase and audio SDK interactions.
  - Add robust offline capabilities (Firebase SDKs offer this automatically for data persistence).
  - Optimize for both iOS and Android performance.
  - Implement proper security measures (e.g., never hardcode API keys, use environment variables).
  - Add analytics and crash reporting (Firebase Analytics, Crashlytics).
  - Ensure GDPR/data privacy compliance (especially for user data and content).
  - Implement proper audio recording and playback permissions handling on both platforms.

## Success Metrics

  - Smooth audio streaming with minimal latency for small groups (within free tier limits).
  - Reliable cross-platform compatibility.
  - Intuitive and spiritually uplifting user experience.
  - Stable performance under prototype load.
  - Successful app store deployment and ability to receive OTA updates via Expo.

## Next Steps

1.  **Critical First Step:** Create and configure a **Firebase Project** in the Google Cloud Console, enabling all necessary services (Auth, DB, Storage).
2.  Set up your local React Native development environment.
3.  Initialize the React Native Expo project.
4.  Begin Phase 1 implementation, focusing on Firebase integration.
5.  Regular testing on both iOS and Android devices from the outset.
6.  Set up continuous integration and deployment (Expo EAS Build for app store builds, Expo publish for OTA updates).

