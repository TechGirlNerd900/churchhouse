import React, { useCallback, useEffect, useState } from 'react';
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
import { COLORS, FONTS } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchFeed, likePost, sharePost } from '../../store/slices/feedSlice';
import { Post } from '../../types';

interface FeedItemProps {
  post: Post;
  onInteraction: (postId: string, type: 'amen' | 'pray' | 'share') => void;
  onComment: (postId: string) => void;
}

/**
 * FeedItem component - Renders individual feed post with interactions
 * @param post - The feed post data
 * @param onInteraction - Handler for post interactions (amen, pray, share)
 * @param onComment - Handler for opening comments
 */
const FeedItem: React.FC<FeedItemProps> = ({ post, onInteraction, onComment }) => {
  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Text style={styles.authorName}>{post.authorName}</Text>
        <Text style={styles.timestamp}>
          {new Date(post.createdAt).toLocaleDateString()}
        </Text>
      </View>
      
      {post.content && (
        <Text style={styles.postContent}>{post.content}</Text>
      )}
      
      {post.verseReference && post.verseText && (
        <View style={styles.verseContainer}>
          <Text style={styles.verseReference}>{post.verseReference}</Text>
          <Text style={styles.verseText}>"{post.verseText}"</Text>
        </View>
      )}
      
      <View style={styles.interactionBar}>
        <TouchableOpacity
          style={styles.interactionButton}
          onPress={() => onInteraction(post.id, 'amen')}
        >
          <Text style={styles.interactionText}>
            🙏 Amen ({post.likesCount || 0})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.interactionButton}
          onPress={() => onComment(post.id)}
        >
          <Text style={styles.interactionText}>
            💬 Comment ({post.commentsCount || 0})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.interactionButton}
          onPress={() => onInteraction(post.id, 'share')}
        >
          <Text style={styles.interactionText}>
            📤 Share ({post.sharesCount || 0})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * FeedScreen component - Main feed interface for displaying and interacting with posts
 * Features infinite scroll, pull-to-refresh, and post interactions
 */
const FeedScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, loading, refreshing, hasMore, error } = useAppSelector(state => state.feed);
  const { user } = useAppSelector(state => state.auth);
  const [localRefreshing, setLocalRefreshing] = useState(false);

  /**
   * Handles pull-to-refresh functionality
   * Refreshes the feed with latest posts
   */
  const onRefresh = useCallback(async () => {
    if (user) {
      setLocalRefreshing(true);
      await dispatch(fetchFeed({ refresh: true }));
      setLocalRefreshing(false);
    }
  }, [dispatch, user]);

  /**
   * Handles infinite scroll by loading more posts
   * Loads additional posts when user reaches the end of the list
   */
  const loadMore = useCallback(() => {
    if (hasMore && !loading && user && posts.length > 0) {
      dispatch(fetchFeed({}));
    }
  }, [dispatch, user, posts, hasMore, loading]);

  /**
   * Handles post interactions (amen, pray, share)
   * @param postId - ID of the post to interact with
   * @param type - Type of interaction (amen, pray, share)
   */
  const handleInteraction = useCallback(async (postId: string, type: 'amen' | 'pray' | 'share') => {
    if (!user) return;
    
    try {
      if (type === 'share') {
        await dispatch(sharePost({ postId }));
      } else if (type === 'amen') {
        // For amen, we'll use the like functionality
        const post = posts.find(p => p.id === postId);
        await dispatch(likePost({ postId, isLiked: post?.isLiked || false }));
      }
      // Note: 'pray' functionality would need to be implemented separately
    } catch (error) {
      Alert.alert('Error', 'Failed to add interaction');
    }
  }, [dispatch, user, posts]);

  /**
   * Handles comment button press
   * @param postId - ID of the post to comment on
   */
  const handleComment = useCallback((postId: string) => {
    // Navigate to post details or open comment modal
    // This would be implemented with navigation
    console.log('Comment on post:', postId);
  }, []);

  /**
   * Renders individual feed item
   * @param item - Feed post data
   */
  const renderItem = useCallback(({ item }: { item: Post }) => (
    <FeedItem
      post={item}
      onInteraction={handleInteraction}
      onComment={handleComment}
    />
  ), [handleInteraction, handleComment]);

  /**
   * Renders the feed header with title and subtitle
   */
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Daily Scroll</Text>
      <Text style={styles.headerSubtitle}>Share your blessings with the community</Text>
    </View>
  );

  /**
   * Renders empty state when no posts are available
   */
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No posts yet</Text>
      <Text style={styles.emptySubtext}>Be the first to share a blessing!</Text>
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading feed</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={localRefreshing || refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
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
  listContent: {
    paddingBottom: 20,
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
  postContainer: {
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.gray400,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.gray900,
    marginBottom: 12,
  },
  verseContainer: {
    backgroundColor: '#F8F4E6',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8B4513',
    marginBottom: 12,
  },
  verseReference: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  verseText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555555',
    lineHeight: 20,
  },
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  interactionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
  },
  interactionText: {
    fontSize: 12,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
    backgroundColor: '#8B4513',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedScreen;
