
import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchFeed } from '../../store/slices/feedSlice';
import FeedScreen from './FeedScreen';

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchFeed({ refresh: true }));
    }
  }, [dispatch, user]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FeedScreen />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
});

export default HomeScreen;
