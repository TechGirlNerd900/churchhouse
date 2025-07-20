import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPublicPrayers } from '../../store/slices/prayerSlice';
import { addPrayerResponse } from '../../store/slices/prayerSlice';
import { PrayerRequest, PrayerCategory } from '../../types';
import { COLORS, FONTS } from '../../constants';

interface PrayerItemProps {
  prayer: PrayerRequest;
  onPray: (prayerId: string) => void;
  onRespond: (prayer: PrayerRequest) => void;
}

/**
 * PrayerItem component - Renders individual prayer request with interactions
 * @param prayer - The prayer request data
 * @param onPray - Handler for praying for the request
 * @param onRespond - Handler for responding to the request
 */
const PrayerItem: React.FC<PrayerItemProps> = ({ prayer, onPray, onRespond }) => {
  const getCategoryEmoji = (category: PrayerCategory) => {
    switch (category) {
      case 'health': return '🙏';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'work': return '💼';
      case 'relationships': return '💕';
      case 'spiritual': return '✨';
      case 'guidance': return '🧭';
      case 'thanksgiving': return '🙌';
      case 'other': return '📿';
      default: return '🙏';
    }
  };

  return (
    <View style={styles.prayerContainer}>
      <View style={styles.prayerHeader}>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>
            {prayer.isAnonymous ? 'Anonymous' : prayer.authorName}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {getCategoryEmoji(prayer.category)} {prayer.category}
            </Text>
          </View>
          {prayer.isUrgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>🚨 Urgent</Text>
            </View>
          )}
        </View>
        <Text style={styles.timestamp}>
          {new Date(prayer.createdAt).toLocaleDateString()}
        </Text>
      </View>
      
      {prayer.title && (
        <Text style={styles.prayerTitle}>{prayer.title}</Text>
      )}
      
      <Text style={styles.prayerContent} numberOfLines={4}>
        {prayer.description}
      </Text>
      
      {prayer.status === 'answered' && (
        <View style={styles.answeredBadge}>
          <Text style={styles.answeredText}>✅ Prayer Answered</Text>
        </View>
      )}
      
      <View style={styles.prayerFooter}>
        <TouchableOpacity
          style={styles.prayButton}
          onPress={() => onPray(prayer.id)}
        >
          <Text style={styles.prayButtonText}>
            🙏 Pray ({prayer.prayersCount || 0})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.respondButton}
          onPress={() => onRespond(prayer)}
        >
          <Text style={styles.respondButtonText}>
            💬 Respond
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * PrayerListScreen component - Main interface for viewing and interacting with prayer requests
 * Features category filtering, pull-to-refresh, and prayer interactions
 */
const PrayerListScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { publicPrayers, loading, error } = useAppSelector(state => state.prayer);
  const { user } = useAppSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PrayerCategory | undefined>();

  const categories: PrayerCategory[] = ['health', 'family', 'work', 'relationships', 'spiritual', 'guidance', 'thanksgiving', 'other'];

  useEffect(() => {
    loadPrayers();
  }, [selectedCategory]);

  /**
   * Loads prayer requests based on selected category
   */
  const loadPrayers = useCallback(async () => {
    try {
      await dispatch(fetchPublicPrayers(selectedCategory));
    } catch (error) {
      console.error('Error loading prayers:', error);
    }
  }, [dispatch, selectedCategory]);

  /**
   * Handles pull-to-refresh functionality
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPrayers();
    setRefreshing(false);
  }, [loadPrayers]);

  /**
   * Handles praying for a prayer request
   * @param prayerId - ID of the prayer request to pray for
   */
  const handlePray = useCallback(async (prayerId: string) => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to pray for requests');
      return;
    }

    try {
      await dispatch(addPrayerResponse({
        prayerId,
        userId: user.id,
        type: 'prayed'
      }));
      Alert.alert('Prayer Added', 'Your prayer has been added to this request 🙏');
    } catch (error) {
      Alert.alert('Error', 'Failed to add prayer');
    }
  }, [dispatch, user]);

  /**
   * Handles responding to a prayer request
   * @param prayer - The prayer request to respond to
   */
  const handleRespond = useCallback((prayer: PrayerRequest) => {
    // Navigate to prayer details or open response modal
    console.log('Respond to prayer:', prayer.id);
  }, []);

  /**
   * Renders category filter buttons
   */
  const renderCategoryFilter = () => (
    <View style={styles.categoryFilter}>
      <TouchableOpacity
        style={[styles.categoryButton, !selectedCategory && styles.activeCategoryButton]}
        onPress={() => setSelectedCategory(undefined)}
      >
        <Text style={[styles.categoryButtonText, !selectedCategory && styles.activeCategoryButtonText]}>
          All
        </Text>
      </TouchableOpacity>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[styles.categoryButton, selectedCategory === category && styles.activeCategoryButton]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text style={[styles.categoryButtonText, selectedCategory === category && styles.activeCategoryButtonText]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  /**
   * Renders the header with title and subtitle
   */
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Prayer Altar</Text>
      <Text style={styles.headerSubtitle}>Join our community in prayer</Text>
    </View>
  );

  /**
   * Renders empty state when no prayers are available
   */
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No prayer requests</Text>
      <Text style={styles.emptySubtext}>Be the first to share a prayer request!</Text>
    </View>
  );

  /**
   * Renders individual prayer item
   * @param item - Prayer request data
   */
  const renderItem = useCallback(({ item }: { item: PrayerRequest }) => (
    <PrayerItem
      prayer={item}
      onPray={handlePray}
      onRespond={handleRespond}
    />
  ), [handlePray, handleRespond]);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading prayer requests</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderCategoryFilter()}
      <FlatList
        data={publicPrayers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
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
  categoryFilter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
  },
  activeCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 12,
    color: COLORS.gray600,
    textTransform: 'capitalize',
  },
  activeCategoryButtonText: {
    color: COLORS.white,
  },
  listContent: {
    paddingBottom: 20,
  },
  prayerContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.gray600,
    textTransform: 'capitalize',
  },
  urgentBadge: {
    alignSelf: 'flex-start',
  },
  urgentText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.gray400,
  },
  prayerTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.gray900,
    marginBottom: 8,
  },
  prayerContent: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.gray700,
    marginBottom: 12,
  },
  answeredBadge: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  answeredText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: '#2E7D32',
  },
  prayerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  prayButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  prayButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  respondButton: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  respondButtonText: {
    color: COLORS.gray600,
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray600,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
});

export default PrayerListScreen;
