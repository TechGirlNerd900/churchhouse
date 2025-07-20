import { firestore } from './firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp, 
  query, 
  where, 
  orderBy,
  doc,
  updateDoc,
  increment,
  limit,
  startAfter,
  getDoc
} from 'firebase/firestore';
import { PrayerRequest, CreatePrayerData, PrayerResponse, PrayerTestimony } from '../types/prayer';

const prayersCollection = collection(firestore, 'prayers');
const prayerResponsesCollection = collection(firestore, 'prayerResponses');
const prayerTestimoniesCollection = collection(firestore, 'prayerTestimonies');

export const createPrayerRequest = async (
  prayerData: CreatePrayerData, 
  userId: string, 
  userName: string, 
  userProfilePic?: string
) => {
  try {
    const docRef = await addDoc(prayersCollection, {
      ...prayerData,
      userId,
      userName: prayerData.isAnonymous ? 'Anonymous' : userName,
      userProfilePic: prayerData.isAnonymous ? '' : (userProfilePic || ''),
      status: 'active',
      prayerCount: 0,
      supportCount: 0,
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getPrayerRequests = async (filter?: { 
  category?: string; 
  audience?: string; 
  fellowshipId?: string;
  status?: string;
}, lastVisible?: any, limitCount: number = 20) => {
  try {
    let q = query(prayersCollection, orderBy('timestamp', 'desc'), limit(limitCount));
    
    // Apply filters
    if (filter?.category) {
      q = query(prayersCollection, 
        where('category', '==', filter.category),
        orderBy('timestamp', 'desc'), 
        limit(limitCount)
      );
    }
    
    if (filter?.audience) {
      q = query(q, where('audience', '==', filter.audience));
    }
    
    if (filter?.fellowshipId) {
      q = query(q, where('fellowshipId', '==', filter.fellowshipId));
    }
    
    if (filter?.status) {
      q = query(q, where('status', '==', filter.status));
    }
    
    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }
    
    const snapshot = await getDocs(q);
    const prayers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
      expiresAt: doc.data().expiresAt?.toDate(),
    })) as PrayerRequest[];
    
    return { 
      success: true, 
      prayers,
      lastVisible: snapshot.docs[snapshot.docs.length - 1],
      hasMore: snapshot.docs.length === limitCount
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getMyPrayers = async (userId: string) => {
  try {
    const q = query(
      prayersCollection, 
      where('userId', '==', userId), 
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    const prayers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
      expiresAt: doc.data().expiresAt?.toDate(),
    })) as PrayerRequest[];
    
    return { success: true, prayers };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const prayForRequest = async (
  prayerRequestId: string, 
  userId: string, 
  userName: string, 
  message?: string,
  isAnonymous: boolean = false,
  userProfilePic?: string
) => {
  try {
    // Add prayer response
    await addDoc(prayerResponsesCollection, {
      prayerRequestId,
      userId,
      userName: isAnonymous ? 'Anonymous' : userName,
      userProfilePic: isAnonymous ? '' : (userProfilePic || ''),
      type: 'prayer',
      message: message || '',
      isAnonymous,
      timestamp: serverTimestamp(),
    });
    
    // Increment prayer count
    const prayerRef = doc(prayersCollection, prayerRequestId);
    await updateDoc(prayerRef, {
      prayerCount: increment(1)
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const supportPrayerRequest = async (
  prayerRequestId: string, 
  userId: string, 
  userName: string, 
  message: string,
  isAnonymous: boolean = false,
  userProfilePic?: string
) => {
  try {
    // Add support response
    await addDoc(prayerResponsesCollection, {
      prayerRequestId,
      userId,
      userName: isAnonymous ? 'Anonymous' : userName,
      userProfilePic: isAnonymous ? '' : (userProfilePic || ''),
      type: 'support',
      message,
      isAnonymous,
      timestamp: serverTimestamp(),
    });
    
    // Increment support count
    const prayerRef = doc(prayersCollection, prayerRequestId);
    await updateDoc(prayerRef, {
      supportCount: increment(1)
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const addTestimony = async (
  prayerRequestId: string, 
  userId: string, 
  userName: string, 
  testimony: string,
  userProfilePic?: string
) => {
  try {
    const docRef = await addDoc(prayerTestimoniesCollection, {
      prayerRequestId,
      userId,
      userName,
      userProfilePic: userProfilePic || '',
      testimony,
      isVerified: false,
      timestamp: serverTimestamp(),
    });
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updatePrayerStatus = async (prayerRequestId: string, status: 'active' | 'answered' | 'closed') => {
  try {
    const prayerRef = doc(prayersCollection, prayerRequestId);
    await updateDoc(prayerRef, { status });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getPrayerResponses = async (prayerRequestId: string) => {
  try {
    const q = query(
      prayerResponsesCollection,
      where('prayerRequestId', '==', prayerRequestId),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const responses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as PrayerResponse[];
    
    return { success: true, responses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getPrayerTestimonies = async (prayerRequestId: string) => {
  try {
    const q = query(
      prayerTestimoniesCollection,
      where('prayerRequestId', '==', prayerRequestId),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const testimonies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as PrayerTestimony[];
    
    return { success: true, testimonies };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};