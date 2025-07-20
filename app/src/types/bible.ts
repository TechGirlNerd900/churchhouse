export interface BibleTranslation {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
  description: string;
}

export interface BibleBook {
  id: string;
  name: string;
  abbreviation: string;
  testament: 'old' | 'new';
  chapters: number;
}

export interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
  translation: string;
}

export interface BibleChapter {
  id: string;
  book: string;
  chapter: number;
  verses: BibleVerse[];
  translation: string;
}

export interface BibleBookmark {
  id: string;
  userId: string;
  verse: BibleVerse;
  note?: string;
  tags: string[];
  createdAt: Date;
  isHighlighted: boolean;
  highlightColor?: string;
}

export interface BibleNote {
  id: string;
  userId: string;
  verse: BibleVerse;
  note: string;
  isPrivate: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BibleState {
  currentTranslation: BibleTranslation;
  availableTranslations: BibleTranslation[];
  books: BibleBook[];
  currentChapter: BibleChapter | null;
  bookmarks: BibleBookmark[];
  notes: BibleNote[];
  searchResults: BibleVerse[];
  isLoading: boolean;
  error: string | null;
}

export interface BibleSearchQuery {
  query: string;
  translation: string;
  books?: string[];
  testament?: 'old' | 'new';
}