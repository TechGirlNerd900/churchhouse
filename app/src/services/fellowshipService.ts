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
  limit,
  getDoc
} from 'firebase/firestore';
import { Fellowship, CreateFellowshipData, FellowshipMember, FellowshipInvite, JoinFellowshipData } from '../types/fellowship';

const fellowshipsCollection = collection(firestore, 'fellowships');
const fellowshipMembersCollection = collection(firestore, 'fellowshipMembers');
const fellowshipInvitesCollection = collection(firestore, 'fellowshipInvites');

export const createFellowship = async (
  fellowshipData: CreateFellowshipData, 
  founderId: string, 
  founderName: string, 
  founderProfilePic?: string
) => {
  try {
    const docRef = await addDoc(fellowshipsCollection, {
      ...fellowshipData,
      founderId,
      moderatorIds: [founderId],
      memberIds: [founderId],
      memberCount: 1,
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
    });
    
    // Add founder as first member
    await addDoc(fellowshipMembersCollection, {
      fellowshipId: docRef.id,
      userId: founderId,
      userName: founderName,
      userProfilePic: founderProfilePic || '',
      role: 'founder',
      joinedAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      contributions: 0,
    });
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getFellowships = async (category?: string, isPrivate?: boolean) => {
  try {
    let q = query(fellowshipsCollection, orderBy('memberCount', 'desc'), limit(50));
    
    if (category) {
      q = query(
        fellowshipsCollection,
        where('category', '==', category),
        orderBy('memberCount', 'desc'),
        limit(50)
      );
    }
    
    if (isPrivate !== undefined) {
      q = query(q, where('isPrivate', '==', isPrivate));
    }
    
    const snapshot = await getDocs(q);
    const fellowships = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      lastActivity: doc.data().lastActivity?.toDate() || new Date(),
    })) as Fellowship[];
    
    return { success: true, fellowships };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getMyFellowships = async (userId: string) => {
  try {
    const q = query(
      fellowshipsCollection,
      where('memberIds', 'array-contains', userId),
      orderBy('lastActivity', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const fellowships = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      lastActivity: doc.data().lastActivity?.toDate() || new Date(),
    })) as Fellowship[];
    
    return { success: true, fellowships };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const joinFellowship = async (
  joinData: JoinFellowshipData, 
  userId: string, 
  userName: string, 
  userProfilePic?: string
) => {
  try {
    const fellowshipRef = doc(fellowshipsCollection, joinData.fellowshipId);
    const fellowshipDoc = await getDoc(fellowshipRef);
    
    if (!fellowshipDoc.exists()) {
      return { success: false, error: 'Fellowship not found' };
    }
    
    const fellowship = fellowshipDoc.data() as Fellowship;
    
    if (fellowship.requiresApproval) {
      // Create join request
      await addDoc(fellowshipInvitesCollection, {
        fellowshipId: joinData.fellowshipId,
        fellowshipName: fellowship.name,
        inviterId: userId,
        inviterName: userName,
        inviteeId: userId,
        message: joinData.message || '',
        status: 'pending',
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
      
      return { success: true, requiresApproval: true };
    } else {
      // Direct join
      await updateDoc(fellowshipRef, {
        memberIds: arrayUnion(userId),
        memberCount: increment(1),
        lastActivity: serverTimestamp()
      });
      
      // Add member record
      await addDoc(fellowshipMembersCollection, {
        fellowshipId: joinData.fellowshipId,
        userId,
        userName,
        userProfilePic: userProfilePic || '',
        role: 'member',
        joinedAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        contributions: 0,
      });
      
      return { success: true, requiresApproval: false };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const leaveFellowship = async (fellowshipId: string, userId: string) => {
  try {
    const fellowshipRef = doc(fellowshipsCollection, fellowshipId);
    await updateDoc(fellowshipRef, {
      memberIds: arrayRemove(userId),
      moderatorIds: arrayRemove(userId),
      memberCount: increment(-1),
      lastActivity: serverTimestamp()
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const inviteToFellowship = async (
  fellowshipId: string, 
  inviterId: string, 
  inviterName: string,
  inviteeId: string, 
  inviteeEmail?: string,
  message?: string
) => {
  try {
    const fellowshipRef = doc(fellowshipsCollection, fellowshipId);
    const fellowshipDoc = await getDoc(fellowshipRef);
    
    if (!fellowshipDoc.exists()) {
      return { success: false, error: 'Fellowship not found' };
    }
    
    const fellowship = fellowshipDoc.data() as Fellowship;
    
    await addDoc(fellowshipInvitesCollection, {
      fellowshipId,
      fellowshipName: fellowship.name,
      inviterId,
      inviterName,
      inviteeId,
      inviteeEmail: inviteeEmail || '',
      message: message || '',
      status: 'pending',
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getFellowshipMembers = async (fellowshipId: string) => {
  try {
    const q = query(
      fellowshipMembersCollection,
      where('fellowshipId', '==', fellowshipId),
      orderBy('joinedAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    const members = snapshot.docs.map(doc => ({
      ...doc.data(),
      joinedAt: doc.data().joinedAt?.toDate() || new Date(),
      lastActive: doc.data().lastActive?.toDate() || new Date(),
    })) as FellowshipMember[];
    
    return { success: true, members };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getMyFellowshipInvites = async (userId: string) => {
  try {
    const q = query(
      fellowshipInvitesCollection,
      where('inviteeId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const invites = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      expiresAt: doc.data().expiresAt?.toDate() || new Date(),
    })) as FellowshipInvite[];
    
    return { success: true, invites };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const respondToFellowshipInvite = async (
  inviteId: string, 
  response: 'accepted' | 'declined',
  userId: string,
  userName: string,
  userProfilePic?: string
) => {
  try {
    const inviteRef = doc(fellowshipInvitesCollection, inviteId);
    const inviteDoc = await getDoc(inviteRef);
    
    if (!inviteDoc.exists()) {
      return { success: false, error: 'Invite not found' };
    }
    
    const invite = inviteDoc.data() as FellowshipInvite;
    
    // Update invite status
    await updateDoc(inviteRef, { status: response });
    
    if (response === 'accepted') {
      // Add to fellowship
      const fellowshipRef = doc(fellowshipsCollection, invite.fellowshipId);
      await updateDoc(fellowshipRef, {
        memberIds: arrayUnion(userId),
        memberCount: increment(1),
        lastActivity: serverTimestamp()
      });
      
      // Add member record
      await addDoc(fellowshipMembersCollection, {
        fellowshipId: invite.fellowshipId,
        userId,
        userName,
        userProfilePic: userProfilePic || '',
        role: 'member',
        joinedAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        contributions: 0,
      });
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};