import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="medical" size={48} color="#ffffff" />
          </View>
          <Text style={styles.appName}>Health SuperApp</Text>
          <Text style={styles.tagline}>Your complete health companion</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="chatbubble-ellipses" size={32} color="#3b82f6" />
            </View>
            <Text style={styles.featureTitle}>AI Health Assistant</Text>
            <Text style={styles.featureDescription}>
              Get instant health guidance and symptom assessment
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="flash" size={32} color="#10b981" />
            </View>
            <Text style={styles.featureTitle}>Express Delivery</Text>
            <Text style={styles.featureDescription}>
              Health products delivered in 1 hour or less
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="medical" size={32} color="#8b5cf6" />
            </View>
            <Text style={styles.featureTitle}>Find Healthcare</Text>
            <Text style={styles.featureDescription}>
              Book doctors, nurses, and specialists nearby
            </Text>
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => navigation.replace('Main')}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#3b82f6" />
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#bfdbfe',
    textAlign: 'center',
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  feature: {
    alignItems: 'center',
    marginBottom: 40,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#bfdbfe',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  ctaContainer: {
    paddingBottom: 40,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginRight: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#bfdbfe',
    marginRight: 4,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#bfdbfe',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default OnboardingScreen;

