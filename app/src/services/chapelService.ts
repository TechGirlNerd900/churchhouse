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
  arrayUnion,
  arrayRemove,
  onSnapshot,
  limit,
  getDoc
} from 'firebase/firestore';
import { Chapel, CreateChapelData, ChapelParticipant, ChapelMessage } from '../types/chapel';

const chapelsCollection = collection(firestore, 'chapels');
const chapelParticipantsCollection = collection(firestore, 'chapelParticipants');
const chapelMessagesCollection = collection(firestore, 'chapelMessages');

export const createChapel = async (
  chapelData: CreateChapelData, 
  hostId: string, 
  hostName: string, 
  hostProfilePic?: string
) => {
  try {
    const docRef = await addDoc(chapelsCollection, {
      ...chapelData,
      hostId,
      hostName,
      hostProfilePic: hostProfilePic || '',
      moderatorIds: [hostId],
      speakerIds: [hostId],
      audienceIds: [],
      isLive: false,
      currentParticipants: 0,
      language: 'en',
      createdAt: serverTimestamp(),
    });
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getActiveChapels = async (fellowshipId?: string) => {
  try {
    let q = query(
      chapelsCollection, 
      where('isLive', '==', true),
      orderBy('currentParticipants', 'desc'),
      limit(50)
    );
    
    if (fellowshipId) {
      q = query(
        chapelsCollection,
        where('fellowshipId', '==', fellowshipId),
        where('isLive', '==', true),
        orderBy('currentParticipants', 'desc')
      );
    }
    
    const snapshot = await getDocs(q);
    const chapels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      startedAt: doc.data().startedAt?.toDate(),
      endedAt: doc.data().endedAt?.toDate(),
      scheduledFor: doc.data().scheduledFor?.toDate(),
    })) as Chapel[];
    
    return { success: true, chapels };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const joinChapel = async (
  chapelId: string, 
  userId: string, 
  userName: string, 
  userProfilePic?: string
) => {
  try {
    // Add participant
    await addDoc(chapelParticipantsCollection, {
      chapelId,
      userId,
      userName,
      userProfilePic: userProfilePic || '',
      role: 'audience',
      joinedAt: serverTimestamp(),
      isMuted: true,
      isHandRaised: false,
      lastActive: serverTimestamp(),
    });
    
    // Update chapel participant count
    const chapelRef = doc(chapelsCollection, chapelId);
    await updateDoc(chapelRef, {
      currentParticipants: increment(1),
      audienceIds: arrayUnion(userId)
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const leaveChapel = async (chapelId: string, userId: string) => {
  try {
    // Remove from participant arrays
    const chapelRef = doc(chapelsCollection, chapelId);
    await updateDoc(chapelRef, {
      currentParticipants: increment(-1),
      audienceIds: arrayRemove(userId),
      speakerIds: arrayRemove(userId),
      moderatorIds: arrayRemove(userId)
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const raiseHand = async (chapelId: string, userId: string) => {
  try {
    const q = query(
      chapelParticipantsCollection,
      where('chapelId', '==', chapelId),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const participantRef = doc(chapelParticipantsCollection, snapshot.docs[0].id);
      await updateDoc(participantRef, {
        isHandRaised: true,
        lastActive: serverTimestamp()
      });
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const inviteToSpeak = async (chapelId: string, userId: string, inviterId: string) => {
  try {
    const chapelRef = doc(chapelsCollection, chapelId);
    await updateDoc(chapelRef, {
      speakerIds: arrayUnion(userId)
    });
    
    // Update participant role
    const q = query(
      chapelParticipantsCollection,
      where('chapelId', '==', chapelId),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const participantRef = doc(chapelParticipantsCollection, snapshot.docs[0].id);
      await updateDoc(participantRef, {
        role: 'speaker',
        isMuted: false,
        isHandRaised: false
      });
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const sendChapelMessage = async (
  chapelId: string, 
  userId: string, 
  userName: string, 
  message: string,
  type: 'text' | 'system' | 'prayer_request' = 'text',
  userProfilePic?: string
) => {
  try {
    await addDoc(chapelMessagesCollection, {
      chapelId,
      userId,
      userName,
      userProfilePic: userProfilePic || '',
      message,
      type,
      timestamp: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getChapelMessages = async (chapelId: string, limitCount: number = 50) => {
  try {
    const q = query(
      chapelMessagesCollection,
      where('chapelId', '==', chapelId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as ChapelMessage[];
    
    return { success: true, messages: messages.reverse() };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getChapelParticipants = async (chapelId: string) => {
  try {
    const q = query(
      chapelParticipantsCollection,
      where('chapelId', '==', chapelId),
      orderBy('joinedAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    const participants = snapshot.docs.map(doc => ({
      ...doc.data(),
      joinedAt: doc.data().joinedAt?.toDate() || new Date(),
      lastActive: doc.data().lastActive?.toDate() || new Date(),
    })) as ChapelParticipant[];
    
    return { success: true, participants };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const startChapel = async (chapelId: string) => {
  try {
    const chapelRef = doc(chapelsCollection, chapelId);
    await updateDoc(chapelRef, {
      isLive: true,
      startedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const endChapel = async (chapelId: string) => {
  try {
    const chapelRef = doc(chapelsCollection, chapelId);
    await updateDoc(chapelRef, {
      isLive: false,
      endedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};