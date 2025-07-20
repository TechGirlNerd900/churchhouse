import { LinkPreview } from '../types/feed';

// Parse hashtags from text
export const parseHashtags = (text: string): string[] => {
  const hashtagRegex = /#[\w]+/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map(tag => tag.substring(1).toLowerCase()) : [];
};

// Parse mentions from text
export const parseMentions = (text: string): string[] => {
  const mentionRegex = /@[\w]+/g;
  const matches = text.match(mentionRegex);
  return matches ? matches.map(mention => mention.substring(1).toLowerCase()) : [];
};

// Parse Bible references from text
export const parseBibleReferences = (text: string): string[] => {
  const bibleRefRegex = /\b(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?/g;
  const matches = [];
  let match;
  
  while ((match = bibleRefRegex.exec(text)) !== null) {
    matches.push(match[0]);
  }
  
  return matches;
};

// Format text with clickable hashtags and mentions
export const formatPostText = (text: string): string => {
  let formattedText = text;
  
  // Replace hashtags
  formattedText = formattedText.replace(/#([\w]+)/g, '<hashtag>$1</hashtag>');
  
  // Replace mentions
  formattedText = formattedText.replace(/@([\w]+)/g, '<mention>$1</mention>');
  
  // Replace Bible references (basic pattern)
  formattedText = formattedText.replace(
    /\b(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?/g,
    '<bibleref>$&</bibleref>'
  );
  
  return formattedText;
};

// Extract URLs from text
export const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches || [];
};

// Generate link preview (basic implementation)
export const generateLinkPreview = async (url: string): Promise<LinkPreview | null> => {
  try {
    // This is a simplified implementation
    // In a real app, you'd use a service like linkpreview.net or implement server-side scraping
    const domain = new URL(url).hostname;
    
    return {
      url,
      title: `Link from ${domain}`,
      description: 'Click to view content',
      domain,
    };
  } catch (error) {
    return null;
  }
};

// Validate post content
export const validatePostContent = (text: string): { isValid: boolean; error?: string } => {
  if (!text.trim()) {
    return { isValid: false, error: 'Post cannot be empty' };
  }
  
  if (text.length > 2000) {
    return { isValid: false, error: 'Post is too long (max 2000 characters)' };
  }
  
  // Check for inappropriate content (basic implementation)
  const inappropriateWords = ['spam', 'scam']; // Add more as needed
  const lowerText = text.toLowerCase();
  
  for (const word of inappropriateWords) {
    if (lowerText.includes(word)) {
      return { isValid: false, error: 'Post contains inappropriate content' };
    }
  }
  
  return { isValid: true };
};

// Format timestamp for display
export const formatTimestamp = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else {
    return timestamp.toLocaleDateString();
  }
};

// Truncate text for preview
export const truncateText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength).trim() + '...';
};

// Generate post excerpt for notifications
export const generatePostExcerpt = (text: string): string => {
  return truncateText(text, 100);
};

// Check if user can view post based on audience settings
export const canViewPost = (
  post: { audience: string; userId: string; fellowshipId?: string },
  currentUserId: string,
  userFollowingIds: string[] = [],
  userFellowshipIds: string[] = []
): boolean => {
  // Post owner can always view
  if (post.userId === currentUserId) {
    return true;
  }
  
  switch (post.audience) {
    case 'public':
      return true;
    case 'followers':
      return userFollowingIds.includes(post.userId);
    case 'fellowship':
      return post.fellowshipId ? userFellowshipIds.includes(post.fellowshipId) : false;
    default:
      return false;
  }
};

// Sort posts by engagement (for discovery feed)
export const sortPostsByEngagement = (posts: any[]): any[] => {
  return posts.sort((a, b) => {
    const aEngagement = (a.commentCount || 0) + (a.shareCount || 0);
    const bEngagement = (b.commentCount || 0) + (b.shareCount || 0);
    
    // If engagement is equal, sort by timestamp
    if (aEngagement === bEngagement) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    
    return bEngagement - aEngagement;
  });
};

// Filter posts by hashtags
export const filterPostsByHashtags = (posts: any[], hashtags: string[]): any[] => {
  if (!hashtags.length) return posts;
  
  return posts.filter(post => 
    post.hashtags?.some((tag: string) => 
      hashtags.includes(tag.toLowerCase())
    )
  );
};

// Search posts by text content
export const searchPosts = (posts: any[], searchQuery: string): any[] => {
  if (!searchQuery.trim()) return posts;
  
  const query = searchQuery.toLowerCase();
  
  return posts.filter(post => 
    post.text?.toLowerCase().includes(query) ||
    post.userName?.toLowerCase().includes(query) ||
    post.hashtags?.some((tag: string) => tag.toLowerCase().includes(query))
  );
};