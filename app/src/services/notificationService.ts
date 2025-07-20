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
  writeBatch,
  limit
} from 'firebase/firestore';
import { Notification, NotificationType, NotificationData, NotificationSettings } from '../types/notification';

const notificationsCollection = collection(firestore, 'notifications');
const notificationSettingsCollection = collection(firestore, 'notificationSettings');

export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data: NotificationData,
  expiresAt?: Date
) => {
  try {
    const docRef = await addDoc(notificationsCollection, {
      userId,
      type,
      title,
      message,
      data,
      isRead: false,
      createdAt: serverTimestamp(),
      expiresAt: expiresAt || null,
    });
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getNotifications = async (userId: string, limitCount: number = 50) => {
  try {
    const q = query(
      notificationsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      expiresAt: doc.data().expiresAt?.toDate(),
    })) as Notification[];
    
    return { success: true, notifications };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notificationRef = doc(notificationsCollection, notificationId);
    await updateDoc(notificationRef, {
      isRead: true,
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const q = query(
      notificationsCollection,
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    
    const snapshot = await getDocs(q);
    const batch = writeBatch(firestore);
    
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });
    
    await batch.commit();
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getUnreadCount = async (userId: string) => {
  try {
    const q = query(
      notificationsCollection,
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    
    const snapshot = await getDocs(q);
    
    return { success: true, count: snapshot.size };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getNotificationSettings = async (userId: string) => {
  try {
    const q = query(
      notificationSettingsCollection,
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Return default settings
      const defaultSettings: NotificationSettings = {
        pushEnabled: true,
        emailEnabled: true,
        comments: true,
        mentions: true,
        shares: true,
        follows: true,
        prayerResponses: true,
        chapelInvites: true,
        fellowshipUpdates: true,
        systemUpdates: true,
      };
      
      return { success: true, settings: defaultSettings };
    }
    
    const settings = snapshot.docs[0].data() as NotificationSettings;
    
    return { success: true, settings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateNotificationSettings = async (userId: string, settings: Partial<NotificationSettings>) => {
  try {
    const q = query(
      notificationSettingsCollection,
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Create new settings document
      await addDoc(notificationSettingsCollection, {
        userId,
        ...settings,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Update existing settings
      const settingsRef = doc(notificationSettingsCollection, snapshot.docs[0].id);
      await updateDoc(settingsRef, {
        ...settings,
        updatedAt: serverTimestamp(),
      });
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Helper functions for creating specific notification types
export const notifyComment = async (postOwnerId: string, commenterName: string, postId: string) => {
  return createNotification(
    postOwnerId,
    'comment',
    'New Comment',
    `${commenterName} commented on your post`,
    { postId, userName: commenterName }
  );
};

export const notifyMention = async (mentionedUserId: string, mentionerName: string, postId: string) => {
  return createNotification(
    mentionedUserId,
    'mention',
    'You were mentioned',
    `${mentionerName} mentioned you in a post`,
    { postId, userName: mentionerName }
  );
};

export const notifyPrayerResponse = async (prayerOwnerId: string, responderName: string, prayerId: string) => {
  return createNotification(
    prayerOwnerId,
    'prayer_response',
    'Prayer Response',
    `${responderName} prayed for your request`,
    { prayerId, userName: responderName }
  );
};

export const notifyChapelInvite = async (inviteeId: string, inviterName: string, chapelId: string, chapelTitle: string) => {
  return createNotification(
    inviteeId,
    'chapel_invite',
    'Chapel Invitation',
    `${inviterName} invited you to join "${chapelTitle}"`,
    { chapelId, userName: inviterName }
  );
};

export const notifyFellowshipInvite = async (inviteeId: string, inviterName: string, fellowshipId: string, fellowshipName: string) => {
  return createNotification(
    inviteeId,
    'fellowship_invite',
    'Fellowship Invitation',
    `${inviterName} invited you to join "${fellowshipName}"`,
    { fellowshipId, userName: inviterName }
  );
};