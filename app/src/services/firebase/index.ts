import { auth, db, storage } from './config';

// Export Firebase instances
export { auth, db, storage };

// Connect to emulators in development
if (__DEV__) {
  // Uncomment these lines if you want to use Firebase emulators in development
  // import { connectFirestoreEmulator, connectStorageEmulator } from 'firebase/firestore';
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectStorageEmulator(storage, 'localhost', 9199);
}
