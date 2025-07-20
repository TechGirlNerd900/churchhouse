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
import { fetchActiveChapels, fetchScheduledChapels, joinChapel } from '../../store/slices/chapelSlice';
import { Chapel } from '../../types';
import { COLORS, FONTS } from '../../constants';

interface ChapelItemProps {
  chapel: Chapel;
  onJoin: (chapel: Chapel) => void;
}

/**
 * ChapelItem component renders individual chapel cards with join functionality
 * @param chapel - Chapel object containing chapel details
 * @param onJoin - Callback function to handle joining a chapel
 */
const ChapelItem: React.FC<ChapelItemProps> = ({ chapel, onJoin }) => {
  return (
    <TouchableOpacity style={styles.chapelContainer} onPress={() => onJoin(chapel)}>
      <View style={styles.chapelHeader}>
        <View style={styles.chapelInfo}>
          <Text style={styles.chapelTitle}>{chapel.name}</Text>
          <Text style={styles.chapelHost}>Hosted by {chapel.hostName}</Text>
        </View>
        <View style={styles.liveIndicator}>
          {chapel.isActive && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
      </View>
      
      {chapel.description && (
        <Text style={styles.chapelDescription} numberOfLines={2}>
          {chapel.description}
        </Text>
      )}
      
      <View style={styles.chapelFooter}>
        <Text style={styles.participantCount}>
          👥 {chapel.currentParticipants || 0} listening
        </Text>
        {chapel.category && (
          <Text style={styles.chapelTopic}>
            📖 {chapel.category}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

/**
 * ChapelListScreen component displays a list of active and scheduled chapels
 * Allows users to browse, refresh, and join available chapels
 */
const ChapelListScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeChapels, scheduledChapels, loading, error } = useAppSelector(state => state.chapel);
  const { user } = useAppSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'scheduled'>('active');

  /**
   * Loads both active and scheduled chapels from the store
   */
  const loadChapels = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(fetchActiveChapels()),
        dispatch(fetchScheduledChapels(user?.id))
      ]);
    } catch (error) {
      console.error('Error loading chapels:', error);
    }
  }, [dispatch, user]);

  useEffect(() => {
    loadChapels();
  }, [loadChapels]);

  /**
   * Handles pull-to-refresh functionality
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadChapels();
    setRefreshing(false);
  }, [loadChapels]);

  /**
   * Handles joining a chapel with user authentication check
   * @param chapel - Chapel object to join
   */
  const handleJoinChapel = useCallback(async (chapel: Chapel) => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to join a chapel');
      return;
    }

    try {
      await dispatch(joinChapel({
        chapelId: chapel.id,
        userId: user.id,
        userData: {
          userName: user.displayName || user.email,
          profileImage: user.photoURL,
        }
      }));
      
      // Navigate to chapel room
      // This would be handled by navigation
      console.log('Joined chapel:', chapel.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to join chapel');
    }
  }, [dispatch, user]);

  const renderChapelItem = useCallback(({ item }: { item: Chapel }) => (
    <ChapelItem chapel={item} onJoin={handleJoinChapel} />
  ), [handleJoinChapel]);

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'active' && styles.activeTab]}
        onPress={() => setActiveTab('active')}
      >
        <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
          Live Chapels
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'scheduled' && styles.activeTab]}
        onPress={() => setActiveTab('scheduled')}
      >
        <Text style={[styles.tabText, activeTab === 'scheduled' && styles.activeTabText]}>
          Scheduled
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {activeTab === 'active' ? 'No live chapels' : 'No scheduled chapels'}
      </Text>
      <Text style={styles.emptySubtext}>
        {activeTab === 'active' 
          ? 'Start your own chapel to begin sharing'
          : 'Check back later for upcoming events'
        }
      </Text>
    </View>
  );

  const currentData = activeTab === 'active' ? activeChapels : scheduledChapels;

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading chapels</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chapels</Text>
        <Text style={styles.headerSubtitle}>Join audio conversations about faith</Text>
      </View>
      
      {renderTabBar()}
      
      <FlatList
        data={currentData}
        renderItem={renderChapelItem}
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
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  listContent: {
    paddingBottom: 20,
  },
  chapelContainer: {
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
  chapelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  chapelInfo: {
    flex: 1,
  },
  chapelTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 4,
  },
  chapelHost: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  liveIndicator: {
    marginLeft: 12,
  },
  liveBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  chapelDescription: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  chapelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  participantCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  chapelTopic: {
    fontSize: 12,
    color: COLORS.primary,
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
    color: COLORS.textSecondary,
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
    color: COLORS.error,
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

export default ChapelListScreen;
