import { firestore } from './firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp, 
  orderBy, 
  query, 
  where, 
  limit, 
  startAfter,
  doc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { Post, CreatePostData, Comment, FeedFilter } from '../types/feed';
import { parseHashtags, parseMentions } from '../utils/feedUtils';

const postsCollection = collection(firestore, 'posts');
const commentsCollection = collection(firestore, 'comments');

export const createPost = async (postData: CreatePostData, userId: string, userName: string, userProfilePic?: string) => {
  try {
    const hashtags = parseHashtags(postData.text);
    const mentions = parseMentions(postData.text);
    
    const docRef = await addDoc(postsCollection, {
      ...postData,
      userId,
      userName,
      userProfilePic: userProfilePic || '',
      hashtags,
      mentions,
      commentCount: 0,
      shareCount: 0,
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getPosts = async (filter: FeedFilter, lastVisible?: any, limitCount: number = 20) => {
  try {
    let q = query(postsCollection, orderBy('timestamp', 'desc'), limit(limitCount));
    
    // Apply filters
    if (filter.type === 'fellowship' && filter.fellowshipId) {
      q = query(postsCollection, 
        where('audience', '==', 'fellowship'),
        where('fellowshipId', '==', filter.fellowshipId),
        orderBy('timestamp', 'desc'), 
        limit(limitCount)
      );
    } else if (filter.type === 'following' && filter.userId) {
      // This would require a separate followingIds array in the query
      // For now, we'll return public posts
      q = query(postsCollection, 
        where('audience', 'in', ['public', 'followers']),
        orderBy('timestamp', 'desc'), 
        limit(limitCount)
      );
    }
    
    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }
    
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as Post[];
    
    return { 
      success: true, 
      posts, 
      lastVisible: snapshot.docs[snapshot.docs.length - 1],
      hasMore: snapshot.docs.length === limitCount
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getPost = async (postId: string) => {
  try {
    const docRef = doc(postsCollection, postId);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      return { success: false, error: 'Post not found' };
    }
    
    const post = {
      id: snapshot.id,
      ...snapshot.data(),
      timestamp: snapshot.data().timestamp?.toDate() || new Date(),
    } as Post;
    
    return { success: true, post };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const sharePost = async (postId: string, userId: string, userName: string, userProfilePic?: string, message?: string) => {
  try {
    // Create a new post that references the original
    const originalPost = await getPost(postId);
    if (!originalPost.success) {
      return { success: false, error: 'Original post not found' };
    }
    
    const shareData: CreatePostData = {
      text: message || `Shared a post from @${originalPost.post!.userName}`,
      audience: 'public'
    };
    
    const result = await createPost(shareData, userId, userName, userProfilePic);
    
    if (result.success) {
      // Increment share count on original post
      const postRef = doc(postsCollection, postId);
      await updateDoc(postRef, {
        shareCount: increment(1)
      });
    }
    
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const addComment = async (postId: string, userId: string, userName: string, text: string, userProfilePic?: string, parentCommentId?: string) => {
  try {
    const mentions = parseMentions(text);
    
    const docRef = await addDoc(commentsCollection, {
      postId,
      userId,
      userName,
      userProfilePic: userProfilePic || '',
      text,
      mentions,
      parentCommentId: parentCommentId || null,
      timestamp: serverTimestamp(),
    });
    
    // Increment comment count on post
    const postRef = doc(postsCollection, postId);
    await updateDoc(postRef, {
      commentCount: increment(1)
    });
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getComments = async (postId: string) => {
  try {
    const q = query(
      commentsCollection, 
      where('postId', '==', postId),
      orderBy('timestamp', 'asc')
    );
    
    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as Comment[];
    
    return { success: true, comments };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};