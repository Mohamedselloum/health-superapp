import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isExpressEligible: boolean;
  rating: number;
  inStock: boolean;
}

const MarketplaceScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Medications', 'Supplements', 'Medical Devices', 'First Aid'];

  const products: Product[] = [
    {
      id: '1',
      name: 'Digital Thermometer',
      price: 24.99,
      image: '🌡️',
      category: 'Medical Devices',
      isExpressEligible: true,
      rating: 4.8,
      inStock: true,
    },
    {
      id: '2',
      name: 'Vitamin D3 Supplements',
      price: 18.50,
      image: '💊',
      category: 'Supplements',
      isExpressEligible: true,
      rating: 4.6,
      inStock: true,
    },
    {
      id: '3',
      name: 'Blood Pressure Monitor',
      price: 89.99,
      image: '🩺',
      category: 'Medical Devices',
      isExpressEligible: false,
      rating: 4.9,
      inStock: true,
    },
    {
      id: '4',
      name: 'First Aid Kit',
      price: 35.00,
      image: '🏥',
      category: 'First Aid',
      isExpressEligible: true,
      rating: 4.7,
      inStock: true,
    },
    {
      id: '5',
      name: 'Omega-3 Fish Oil',
      price: 22.95,
      image: '🐟',
      category: 'Supplements',
      isExpressEligible: true,
      rating: 4.5,
      inStock: false,
    },
    {
      id: '6',
      name: 'Pain Relief Gel',
      price: 12.99,
      image: '🧴',
      category: 'Medications',
      isExpressEligible: true,
      rating: 4.4,
      inStock: true,
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProduct = (product: Product) => (
    <TouchableOpacity key={product.id} style={styles.productCard} activeOpacity={0.8}>
      <View style={styles.productImageContainer}>
        <Text style={styles.productEmoji}>{product.image}</Text>
        {product.isExpressEligible && (
          <View style={styles.expressBadge}>
            <Ionicons name="flash" size={12} color="#ffffff" />
            <Text style={styles.expressText}>1h</Text>
          </View>
        )}
        {!product.inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#fbbf24" />
          <Text style={styles.ratingText}>{product.rating}</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${product.price}</Text>
          <TouchableOpacity
            style={[
              styles.addButton,
              !product.inStock && styles.addButtonDisabled,
            ]}
            disabled={!product.inStock}
          >
            <Ionicons
              name="add"
              size={16}
              color={product.inStock ? '#ffffff' : '#9ca3af'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Marketplace</Text>
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="bag-outline" size={24} color="#374151" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Express Delivery Banner */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        style={styles.expressBanner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.expressContent}>
          <Ionicons name="flash" size={24} color="#ffffff" />
          <View style={styles.expressText}>
            <Text style={styles.expressTitle}>Express Delivery</Text>
            <Text style={styles.expressSubtitle}>Health products in 1 hour or less</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search health products..."
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

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <ScrollView style={styles.productsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.productsGrid}>
          {filteredProducts.map(renderProduct)}
        </View>
        
        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color="#9ca3af" />
            <Text style={styles.emptyStateTitle}>No products found</Text>
            <Text style={styles.emptyStateSubtitle}>
              Try adjusting your search or category filter
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <LinearGradient
          colors={['#3b82f6', '#1d4ed8']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="chatbubble" size={24} color="#ffffff" />
        </LinearGradient>
      </TouchableOpacity>
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
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  expressBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  expressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expressText: {
    marginLeft: 12,
  },
  expressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  expressSubtitle: {
    fontSize: 12,
    color: '#d1fae5',
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
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImageContainer: {
    position: 'relative',
    alignItems: 'center',
    paddingVertical: 20,
  },
  productEmoji: {
    fontSize: 40,
  },
  expressBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  expressText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 2,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  outOfStockText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    height: 36,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#e5e7eb',
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
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MarketplaceScreen;

