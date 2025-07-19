import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase Configuration
// Note: Replace these with your actual project-779090479224 Firebase config values

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "churchhouse-app.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "churchhouse-app",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "churchhouse-app.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Firestore Security Rules (for reference)
export const FIRESTORE_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts are readable by authenticated users, writable by author
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == resource.data.authorId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    
    // Comments are readable by authenticated users, writable by author
    match /comments/{commentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == resource.data.authorId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    
    // Likes are readable by authenticated users, writable by author
    match /likes/{likeId} {
      allow read: if request.auth != null;
      allow create, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Chapels are readable by authenticated users
    match /chapels/{chapelId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == resource.data.hostId;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.hostId || 
         request.auth.uid in resource.data.moderators);
    }
    
    // Prayer requests are readable by authenticated users
    match /prayerRequests/{prayerId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == resource.data.authorId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    
    // Notifications are readable/writable by the recipient
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
`;

// Storage Security Rules (for reference)
export const STORAGE_RULES = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload to their own folder
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public images (posts, chapels) are readable by authenticated users
    match /public/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.resource.size < 5 * 1024 * 1024 && // 5MB limit
        request.resource.contentType.matches('image/.*');
    }
  }
}
`;
