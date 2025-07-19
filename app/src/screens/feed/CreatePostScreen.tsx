import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../constants';
import { Ionicons } from '@expo/vector-icons';

// This is a placeholder for the actual Gemini API call
const getVerseInspirationFromGemini = async () => {
  // In a real app, you would make a network request to your backend,
  // which in turn would call the Gemini API.
  // For this example, we'll simulate a response.
  const simulatedResponses = [
    "I can do all things through Christ who strengthens me. - Philippians 4:13",
    "For where two or three gather in my name, there am I with them. - Matthew 18:20",
    "The Lord is my strength and my shield; in him my heart trusts, and I am helped. - Psalm 28:7",
    "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go. - Joshua 1:9",
    "Trust in the Lord with all your heart and lean not on your own understanding. - Proverbs 3:5"
  ];
  return new Promise(resolve => {
    setTimeout(() => {
      const randomVerse = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
      resolve(randomVerse);
    }, 1500);
  });
};

export default function CreatePostScreen() {
  const [postContent, setPostContent] = useState('');
  const [inspiration, setInspiration] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetInspiration = async () => {
    setIsLoading(true);
    setInspiration('');
    try {
      const verse = await getVerseInspirationFromGemini();
      setInspiration(verse as string);
    } catch (error) {
      console.error('Error getting verse inspiration:', error);
      setInspiration('Failed to get inspiration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Share a Blessing</Text>
        <TextInput
          style={styles.input}
          placeholder="What's on your heart?"
          multiline
          value={postContent}
          onChangeText={setPostContent}
        />
        <TouchableOpacity style={styles.inspirationButton} onPress={handleGetInspiration} disabled={isLoading}>ailles
          <Ionicons name="sparkles-outline" size={20} color={COLORS.primary} />
          <Text style={styles.inspirationButtonText}>Get Verse Inspiration</Text>
        </TouchableOpacity>
        {isLoading && <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 16 }} />}
        {inspiration && (
          <View style={styles.inspirationContainer}>
            <Text style={styles.inspirationText}>{inspiration}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.postButton}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
    fontFamily: FONTS.regular,
    fontSize: 16,
  },
  inspirationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  inspirationButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 8,
  },
  inspirationContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  inspirationText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  postButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 'auto',
    marginBottom: 20,
  },
  postButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.white,
    textAlign: 'center',
  },
});