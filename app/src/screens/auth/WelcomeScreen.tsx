import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';
import { COLORS, FONTS, SIZES } from '../../constants';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🏛️</Text>
          </View>
          <Text style={styles.title}>ChurchHouse</Text>
          <Text style={styles.subtitle}>
            Connect, Worship, and Grow Together in Faith
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📖</Text>
            <Text style={styles.featureText}>Daily Bible Reading</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎵</Text>
            <Text style={styles.featureText}>Virtual Chapels</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🙏</Text>
            <Text style={styles.featureText}>Prayer Community</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>💬</Text>
            <Text style={styles.featureText}>Daily Scroll</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: SIZES.padding,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray600,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    marginVertical: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.gray700,
  },
  buttons: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
});