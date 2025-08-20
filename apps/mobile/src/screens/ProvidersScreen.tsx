import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  distance: string;
  nextAvailable: string;
  price: number;
  isOnline: boolean;
  avatar: string;
}

const ProvidersScreen = () => {
  const [selectedService, setSelectedService] = useState('All');
  const [searchText, setSearchText] = useState('');

  const services = ['All', 'Doctors', 'Nurses', 'Specialists', 'Online Consultation'];

  const providers: Provider[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Family Medicine',
      rating: 4.9,
      reviewCount: 127,
      distance: '2.3 km',
      nextAvailable: 'Today 2:30 PM',
      price: 85,
      isOnline: true,
      avatar: '👩‍⚕️',
    },
    {
      id: '2',
      name: 'Nurse Maria Garcia',
      specialty: 'Home Care',
      rating: 4.8,
      reviewCount: 89,
      distance: '1.8 km',
      nextAvailable: 'Today 4:00 PM',
      price: 65,
      isOnline: false,
      avatar: '👩‍⚕️',
    },
    {
      id: '3',
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      rating: 4.9,
      reviewCount: 203,
      distance: '3.1 km',
      nextAvailable: 'Tomorrow 10:00 AM',
      price: 120,
      isOnline: true,
      avatar: '👨‍⚕️',
    },
    {
      id: '4',
      name: 'Dr. Emily Davis',
      specialty: 'Dermatology',
      rating: 4.7,
      reviewCount: 156,
      distance: '2.7 km',
      nextAvailable: 'Today 6:30 PM',
      price: 95,
      isOnline: true,
      avatar: '👩‍⚕️',
    },
    {
      id: '5',
      name: 'Nurse James Wilson',
      specialty: 'Wound Care',
      rating: 4.6,
      reviewCount: 74,
      distance: '1.2 km',
      nextAvailable: 'Tomorrow 9:00 AM',
      price: 55,
      isOnline: false,
      avatar: '👨‍⚕️',
    },
  ];

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchText.toLowerCase());
    const matchesService = selectedService === 'All' || 
                          (selectedService === 'Doctors' && provider.name.includes('Dr.')) ||
                          (selectedService === 'Nurses' && provider.name.includes('Nurse')) ||
                          (selectedService === 'Online Consultation' && provider.isOnline);
    return matchesSearch && matchesService;
  });

  const renderProvider = (provider: Provider) => (
    <TouchableOpacity key={provider.id} style={styles.providerCard} activeOpacity={0.8}>
      <View style={styles.providerHeader}>
        <View style={styles.providerInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{provider.avatar}</Text>
            {provider.isOnline && <View style={styles.onlineIndicator} />}
          </View>
          
          <View style={styles.providerDetails}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
            
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text style={styles.ratingText}>{provider.rating}</Text>
              <Text style={styles.reviewText}>({provider.reviewCount} reviews)</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.providerMeta}>
          <Text style={styles.price}>${provider.price}</Text>
          <Text style={styles.distance}>{provider.distance}</Text>
        </View>
      </View>
      
      <View style={styles.availabilityContainer}>
        <View style={styles.availabilityInfo}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.availabilityText}>Next available: {provider.nextAvailable}</Text>
        </View>
        
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Healthcare</Text>
        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="location-outline" size={20} color="#3b82f6" />
          <Text style={styles.locationText}>Current Location</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Banner */}
      <LinearGradient
        colors={['#ef4444', '#dc2626']}
        style={styles.emergencyBanner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.emergencyContent} activeOpacity={0.8}>
          <Ionicons name="warning" size={24} color="#ffffff" />
          <View style={styles.emergencyText}>
            <Text style={styles.emergencyTitle}>Emergency Services</Text>
            <Text style={styles.emergencySubtitle}>Call 911 or find nearest hospital</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors, nurses, specialists..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#9ca3af"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Service Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.servicesContainer}
      >
        {services.map((service) => (
          <TouchableOpacity
            key={service}
            style={[
              styles.serviceButton,
              selectedService === service && styles.serviceButtonActive,
            ]}
            onPress={() => setSelectedService(service)}
          >
            <Text
              style={[
                styles.serviceText,
                selectedService === service && styles.serviceTextActive,
              ]}
            >
              {service}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.quickAction}>
          <LinearGradient
            colors={['#3b82f6', '#1d4ed8']}
            style={styles.quickActionGradient}
          >
            <Ionicons name="videocam" size={20} color="#ffffff" />
          </LinearGradient>
          <Text style={styles.quickActionText}>Video Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.quickActionGradient}
          >
            <Ionicons name="home" size={20} color="#ffffff" />
          </LinearGradient>
          <Text style={styles.quickActionText}>Home Visit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <LinearGradient
            colors={['#8b5cf6', '#7c3aed']}
            style={styles.quickActionGradient}
          >
            <Ionicons name="location" size={20} color="#ffffff" />
          </LinearGradient>
          <Text style={styles.quickActionText}>Find Nearby</Text>
        </TouchableOpacity>
      </View>

      {/* Providers List */}
      <ScrollView style={styles.providersContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Available Providers</Text>
        
        {filteredProviders.map(renderProvider)}
        
        {filteredProviders.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="medical-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyStateTitle}>No providers found</Text>
            <Text style={styles.emptyStateSubtitle}>
              Try adjusting your search or service filter
            </Text>
          </View>
        )}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#3b82f6',
    marginLeft: 4,
    fontWeight: '500',
  },
  emergencyBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  servicesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  serviceButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  serviceButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  serviceText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  serviceTextActive: {
    color: '#ffffff',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  providersContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  providerCard: {
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
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    fontSize: 32,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  providerSpecialty: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#374151',
    marginLeft: 4,
    fontWeight: '500',
  },
  reviewText: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 4,
  },
  providerMeta: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  distance: {
    fontSize: 12,
    color: '#6b7280',
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  availabilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  availabilityText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
  },
  bookButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ProvidersScreen;

