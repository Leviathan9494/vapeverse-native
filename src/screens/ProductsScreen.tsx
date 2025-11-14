import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { ShoppingCart, Star, Search } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import API_URL from '../config/api';

const { width } = Dimensions.get('window');
const cardWidth = (width - 45) / 2;

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  category: string;
  subcategory: string;
  image: string;
  publishToEcom: boolean;
}

export default function ProductsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/categories`);
      return ['All', ...response.data];
    },
  });

  // Fetch products
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['products', selectedCategory, page, searchQuery],
    queryFn: async () => {
      const params: any = { page, limit: 20 };
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      const response = await axios.get(`${API_URL}/products`, { params });
      return response.data;
    },
  });

  const products = data?.products || [];
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Shop Products</Text>
        <Text style={styles.subtitle}>
          {data?.total || 0} premium vaping products
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search color="#6b7280" size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => refetch()}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {(categories || ['All']).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              category === selectedCategory && styles.categoryChipActive,
            ]}
            onPress={() => {
              setSelectedCategory(category);
              setPage(1);
            }}
          >
            <Text
              style={[
                styles.categoryText,
                category === selectedCategory && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <>
          <View style={styles.productsGrid}>
            {products.map((product: Product) => (
              <TouchableOpacity key={product.id} style={styles.productCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  {product.quantity === 0 && (
                    <View style={styles.outOfStockBadge}>
                      <Text style={styles.outOfStockText}>Out of Stock</Text>
                    </View>
                  )}
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productCategory}>{product.brand}</Text>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.subcategoryText} numberOfLines={1}>
                    {product.category}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    <TouchableOpacity 
                      style={[
                        styles.addButton,
                        product.quantity === 0 && styles.addButtonDisabled
                      ]}
                      disabled={product.quantity === 0}
                    >
                      <ShoppingCart color="#ffffff" size={16} />
                    </TouchableOpacity>
                  </View>
                  {product.quantity > 0 && product.quantity <= 5 && (
                    <Text style={styles.lowStockText}>
                      Only {product.quantity} left!
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  page === 1 && styles.paginationButtonDisabled,
                ]}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <Text
                  style={[
                    styles.paginationButtonText,
                    page === 1 && styles.paginationButtonTextDisabled,
                  ]}
                >
                  Previous
                </Text>
              </TouchableOpacity>

              <Text style={styles.pageInfo}>
                Page {page} of {data.totalPages}
              </Text>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  page === data.totalPages && styles.paginationButtonDisabled,
                ]}
                onPress={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
              >
                <Text
                  style={[
                    styles.paginationButtonText,
                    page === data.totalPages && styles.paginationButtonTextDisabled,
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  productCard: {
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#f3f4f6',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  outOfStockText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productCategory: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  subcategoryText: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 8,
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
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  lowStockText: {
    fontSize: 10,
    color: '#ef4444',
    fontWeight: '600',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  paginationButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  paginationButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  paginationButtonTextDisabled: {
    color: '#9ca3af',
  },
  pageInfo: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
});
