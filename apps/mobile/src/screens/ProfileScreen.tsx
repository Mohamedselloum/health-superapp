import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Personal Information',
      subtitle: 'Update your profile details',
      onPress: () => {},
    },
    {
      icon: 'medical-outline',
      title: 'Health Records',
      subtitle: 'View your medical history',
      onPress: () => {},
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      subtitle: 'Manage cards and billing',
      onPress: () => {},
    },
    {
      icon: 'time-outline',
      title: 'Appointment History',
      subtitle: 'Past and upcoming appointments',
      onPress: () => {},
    },
    {
      icon: 'bag-outline',
      title: 'Order History',
      subtitle: 'Track your purchases',
      onPress: () => {},
    },
    {
      icon: 'heart-outline',
      title: 'Favorites',
      subtitle: 'Saved products and providers',
      onPress: () => {},
    },
  ];

  const supportItems = [
    {
      icon: 'help-circle-outline',
      title: 'Help Center',
      onPress: () => {},
    },
    {
      icon: 'chatbubble-outline',
      title: 'Contact Support',
      onPress: () => {},
    },
    {
      icon: 'document-text-outline',
      title: 'Terms & Privacy',
      onPress: () => {},
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={['#3b82f6', '#1d4ed8']}
          style={styles.profileHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>SJ</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Sarah Johnson</Text>
              <Text style={styles.userEmail}>sarah.johnson@email.com</Text>
              <View style={styles.membershipBadge}>
                <Ionicons name="star" size={12} color="#fbbf24" />
                <Text style={styles.membershipText}>Premium Member</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#ffffff" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Health Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Summary</Text>
          <View style={styles.healthSummaryCard}>
            <View style={styles.healthStat}>
              <Ionicons name="fitness" size={24} color="#10b981" />
              <Text style={styles.healthStatValue}>8,432</Text>
              <Text style={styles.healthStatLabel}>Steps Today</Text>
            </View>
            <View style={styles.healthStat}>
              <Ionicons name="heart" size={24} color="#ef4444" />
              <Text style={styles.healthStatValue}>72</Text>
              <Text style={styles.healthStatLabel}>Heart Rate</Text>
            </View>
            <View style={styles.healthStat}>
              <Ionicons name="moon" size={24} color="#8b5cf6" />
              <Text style={styles.healthStatValue}>7h 23m</Text>
              <Text style={styles.healthStatLabel}>Sleep</Text>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon as any} size={20} color="#6b7280" />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuCard}>
            <View style={[styles.menuItem, styles.menuItemBorder]}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name="notifications-outline" size={20} color="#6b7280" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Push Notifications</Text>
                  <Text style={styles.menuItemSubtitle}>Health reminders and updates</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor={notificationsEnabled ? '#ffffff' : '#f3f4f6'}
              />
            </View>
            
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name="location-outline" size={20} color="#6b7280" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Location Services</Text>
                  <Text style={styles.menuItemSubtitle}>Find nearby providers</Text>
                </View>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor={locationEnabled ? '#ffffff' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            {supportItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index < supportItems.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon as any} size={20} color="#6b7280" />
                  </View>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.emergencyCard}>
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              style={styles.emergencyGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="warning" size={24} color="#ffffff" />
              <View style={styles.emergencyText}>
                <Text style={styles.emergencyTitle}>Emergency Contact</Text>
                <Text style={styles.emergencySubtitle}>Quick access to emergency services</Text>
              </View>
              <Ionicons name="call" size={24} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Health SuperApp v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#bfdbfe',
    marginBottom: 8,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  membershipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 4,
  },
  editButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  healthSummaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  healthStat: {
    alignItems: 'center',
  },
  healthStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  healthStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  emergencyCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  emergencyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  emergencyText: {
    flex: 1,
    marginLeft: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emergencySubtitle: {
    fontSize: 12,
    color: '#fecaca',
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default ProfileScreen;

