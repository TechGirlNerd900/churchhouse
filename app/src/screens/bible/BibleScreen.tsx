import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
// import { fetchTranslations, fetchBooks, searchVerses } from '../../store/slices/bibleSlice';
import { BibleBook, BibleTranslation, BibleSearchResult } from '../../types';

/**
 * BibleScreen component - Provides Bible reading, searching, and bookmarking functionality
 * Features tabbed interface for browsing books, searching verses, and managing bookmarks
 */
const BibleScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  // const { translations, books, searchResults, loading, error } = useAppSelector(state => state.bible);
  
  // Temporary placeholder data until bibleSlice is implemented
  const translations: BibleTranslation[] = [];
  const books: BibleBook[] = [];
  const searchResults: BibleSearchResult[] = [];
  const loading = false;
  const error = null;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTranslation, setSelectedTranslation] = useState<string>('de4e12af7f28f599-02');
  const [activeTab, setActiveTab] = useState<'books' | 'search' | 'bookmarks'>('books');

  useEffect(() => {
    // TODO: Implement when bibleSlice actions are available
    // dispatch(fetchTranslations());
    // dispatch(fetchBooks(selectedTranslation));
  }, [dispatch, selectedTranslation]);

  /**
   * Handles Bible verse search functionality
   * Searches for verses based on query and selected translation
   */
  const handleSearch = useCallback(async () => {
    if (searchQuery.trim()) {
      // TODO: Implement when bibleSlice actions are available
      // await dispatch(searchVerses({ query: searchQuery, translationId: selectedTranslation }));
      setActiveTab('search');
    }
  }, [searchQuery, selectedTranslation]);

  /**
   * Renders individual Bible book item in the books grid
   * @param item - Bible book object containing name and abbreviation
   */
  const renderBook = useCallback(({ item }: { item: BibleBook }) => (
    <TouchableOpacity style={styles.bookItem}>
      <Text style={styles.bookName}>{item.name}</Text>
      <Text style={styles.bookAbbreviation}>{item.abbreviation}</Text>
    </TouchableOpacity>
  ), []);

  /**
   * Renders individual search result item showing verse reference and text
   * @param item - Bible search result containing reference and verse text
   */
  const renderSearchResult = useCallback(({ item }: { item: BibleSearchResult }) => (
    <TouchableOpacity style={styles.searchResultItem}>
      <Text style={styles.verseReference}>{item.reference}</Text>
      <Text style={styles.verseText}>{item.text}</Text>
    </TouchableOpacity>
  ), []);

  /**
   * Renders the tab bar for switching between Books, Search, and Bookmarks
   */
  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'books' && styles.activeTab]}
        onPress={() => setActiveTab('books')}
      >
        <Text style={[styles.tabText, activeTab === 'books' && styles.activeTabText]}>
          Books
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'search' && styles.activeTab]}
        onPress={() => setActiveTab('search')}
      >
        <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
          Search
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'bookmarks' && styles.activeTab]}
        onPress={() => setActiveTab('bookmarks')}
      >
        <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.activeTabText]}>
          Bookmarks
        </Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renders the main content based on the active tab
   * Shows loading state, books grid, search interface, or bookmarks
   */
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B4513" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'books':
        return (
          <FlatList
            data={books}
            renderItem={renderBook}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.booksGrid}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'search':
        return (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search verses..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item, index) => `${item.reference}-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.searchResults}
            />
          </View>
        );
      case 'bookmarks':
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bookmarks yet</Text>
            <Text style={styles.emptySubtext}>Bookmark verses as you read to save them here</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bible</Text>
        <Text style={styles.headerSubtitle}>Read, study, and search God's Word</Text>
      </View>
      
      {renderTabBar()}
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray600,
    textAlign: 'center',
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.gray600,
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.gray600,
  },
  booksGrid: {
    padding: 16,
  },
  bookItem: {
    flex: 1,
    backgroundColor: COLORS.white,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  bookAbbreviation: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  searchContainer: {
    flex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginRight: 12,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  searchResults: {
    padding: 16,
  },
  searchResultItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verseReference: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

export default BibleScreen;
