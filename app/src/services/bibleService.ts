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
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import { BibleBookmark, BibleNote, BibleVerse, BibleSearchQuery } from '../types/bible';

const bookmarksCollection = collection(firestore, 'bibleBookmarks');
const notesCollection = collection(firestore, 'bibleNotes');

// Bible API configuration (you'll need to set up API keys)
const BIBLE_API_BASE_URL = 'https://api.scripture.api.bible/v1';
const BIBLE_API_KEY = process.env.EXPO_PUBLIC_BIBLE_API_KEY || '';

// Available translations
export const BIBLE_TRANSLATIONS = [
  { id: 'de4e12af7f28f599-02', name: 'King James Version', abbreviation: 'KJV', language: 'en' },
  { id: 'bba9f40183526463-01', name: 'New International Version', abbreviation: 'NIV', language: 'en' },
  { id: '01b29f4b342acc35-01', name: 'English Standard Version', abbreviation: 'ESV', language: 'en' },
  { id: '7142879509583d59-01', name: 'New Living Translation', abbreviation: 'NLT', language: 'en' },
];

// Bible books structure
export const BIBLE_BOOKS = [
  // Old Testament
  { id: 'GEN', name: 'Genesis', abbreviation: 'Gen', testament: 'old', chapters: 50 },
  { id: 'EXO', name: 'Exodus', abbreviation: 'Exo', testament: 'old', chapters: 40 },
  { id: 'LEV', name: 'Leviticus', abbreviation: 'Lev', testament: 'old', chapters: 27 },
  // ... (you would include all 66 books)
  
  // New Testament
  { id: 'MAT', name: 'Matthew', abbreviation: 'Mat', testament: 'new', chapters: 28 },
  { id: 'MRK', name: 'Mark', abbreviation: 'Mrk', testament: 'new', chapters: 16 },
  { id: 'LUK', name: 'Luke', abbreviation: 'Luk', testament: 'new', chapters: 24 },
  { id: 'JHN', name: 'John', abbreviation: 'Jhn', testament: 'new', chapters: 21 },
  // ... (continue with all NT books)
];

export const searchBibleVerses = async (searchQuery: BibleSearchQuery): Promise<{ success: boolean; verses?: BibleVerse[]; error?: string }> => {
  try {
    if (!BIBLE_API_KEY) {
      return { success: false, error: 'Bible API key not configured' };
    }
    
    const response = await fetch(
      `${BIBLE_API_BASE_URL}/bibles/${searchQuery.translation}/search?query=${encodeURIComponent(searchQuery.query)}&limit=50`,
      {
        headers: {
          'api-key': BIBLE_API_KEY,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to search Bible verses');
    }
    
    const data = await response.json();
    const verses = data.data.verses.map((verse: any) => ({
      id: verse.id,
      book: verse.bookId,
      chapter: verse.chapterNumber,
      verse: verse.verseNumber,
      text: verse.text.replace(/<[^>]*>/g, ''), // Remove HTML tags
      reference: verse.reference,
      translation: searchQuery.translation,
    }));
    
    return { success: true, verses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getBibleChapter = async (translation: string, bookId: string, chapter: number) => {
  try {
    if (!BIBLE_API_KEY) {
      return { success: false, error: 'Bible API key not configured' };
    }
    
    const response = await fetch(
      `${BIBLE_API_BASE_URL}/bibles/${translation}/chapters/${bookId}.${chapter}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`,
      {
        headers: {
          'api-key': BIBLE_API_KEY,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Bible chapter');
    }
    
    const data = await response.json();
    
    return { 
      success: true, 
      chapter: {
        id: data.data.id,
        book: bookId,
        chapter: chapter,
        verses: [], // You would parse the content to extract individual verses
        translation: translation,
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const addBookmark = async (
  userId: string, 
  verse: BibleVerse, 
  note?: string, 
  tags: string[] = [],
  isHighlighted: boolean = false,
  highlightColor?: string
) => {
  try {
    const docRef = await addDoc(bookmarksCollection, {
      userId,
      verse,
      note: note || '',
      tags,
      isHighlighted,
      highlightColor: highlightColor || '',
      createdAt: serverTimestamp(),
    });
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getBookmarks = async (userId: string) => {
  try {
    const q = query(
      bookmarksCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const bookmarks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as BibleBookmark[];
    
    return { success: true, bookmarks };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const removeBookmark = async (bookmarkId: string) => {
  try {
    await deleteDoc(doc(bookmarksCollection, bookmarkId));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const addNote = async (
  userId: string, 
  verse: BibleVerse, 
  note: string, 
  isPrivate: boolean = true,
  tags: string[] = []
) => {
  try {
    const docRef = await addDoc(notesCollection, {
      userId,
      verse,
      note,
      isPrivate,
      tags,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateNote = async (noteId: string, note: string, tags: string[] = []) => {
  try {
    const noteRef = doc(notesCollection, noteId);
    await updateDoc(noteRef, {
      note,
      tags,
      updatedAt: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getNotes = async (userId: string) => {
  try {
    const q = query(
      notesCollection,
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const notes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as BibleNote[];
    
    return { success: true, notes };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const deleteNote = async (noteId: string) => {
  try {
    await deleteDoc(doc(notesCollection, noteId));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Utility function to parse Bible references
export const parseBibleReference = (reference: string): { book: string; chapter: number; verse?: number } | null => {
  const regex = /^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+))?$/;
  const match = reference.match(regex);
  
  if (!match) return null;
  
  return {
    book: match[1].trim(),
    chapter: parseInt(match[2]),
    verse: match[3] ? parseInt(match[3]) : undefined,
  };
};

// Utility function to format Bible reference
export const formatBibleReference = (book: string, chapter: number, verse?: number): string => {
  return verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`;
};