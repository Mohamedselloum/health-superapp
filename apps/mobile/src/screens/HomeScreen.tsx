import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const quickActions = [
    {
      id: 1,
      title: 'AI Health Chat',
      subtitle: 'Get instant health guidance',
      icon: 'chatbubble-ellipses',
      color: ['#3b82f6', '#1d4ed8'],
      onPress: () => navigation.navigate('Chat'),
    },
    {
      id: 2,
      title: 'Express Delivery',
      subtitle: 'Health products in 1 hour',
      icon: 'flash',
      color: ['#10b981', '#059669'],
      onPress: () => navigation.navigate('Marketplace'),
    },
    {
      id: 3,
      title: 'Find Providers',
      subtitle: 'Book doctors & nurses',
      icon: 'medical',
      color: ['#8b5cf6', '#7c3aed'],
      onPress: () => navigation.navigate('Providers'),
    },
    {
      id: 4,
      title: 'Health Guides',
      subtitle: 'Expert health content',
      icon: 'library',
      color: ['#f59e0b', '#d97706'],
      onPress: () => {},
    },
  ];

  const healthStats = [
    { label: 'Steps Today', value: '8,432', icon: 'walk' },
    { label: 'Heart Rate', value: '72 BPM', icon: 'heart' },
    { label: 'Sleep', value: '7h 23m', icon: 'moon' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>Sarah</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#374151" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Health Summary Card */}
        <LinearGradient
          colors={['#3b82f6', '#1d4ed8']}
          style={styles.summaryCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.summaryTitle}>Today's Health Summary</Text>
          <Text style={styles.summarySubtitle}>You're doing great! Keep it up.</Text>
          
          <View style={styles.statsContainer}>
            {healthStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Ionicons name={stat.icon as any} size={20} color="#ffffff" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={action.color}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={action.icon as any} size={28} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="chatbubble" size={16} color="#3b82f6" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>AI Health Chat</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="storefront" size={16} color="#10b981" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Order Delivered</Text>
                <Text style={styles.activityTime}>Yesterday</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="medical" size={16} color="#8b5cf6" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Appointment Booked</Text>
                <Text style={styles.activityTime}>3 days ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Emergency Button */}
        <TouchableOpacity style={styles.emergencyButton} activeOpacity={0.8}>
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.emergencyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="warning" size={24} color="#ffffff" />
            <Text style={styles.emergencyText}>Emergency Services</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#bfdbfe',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#bfdbfe',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  activityTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  emergencyButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  emergencyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  emergencyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
});

export default HomeScreen;

