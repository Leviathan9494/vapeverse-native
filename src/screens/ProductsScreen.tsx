import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { ShoppingCart, Star } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 45) / 2;

const products = [
  {
    id: 1,
    name: 'Premium Vape Pod',
    price: 49.99,
    rating: 4.8,
    image: 'https://via.placeholder.com/150',
    category: 'Pods',
  },
  {
    id: 2,
    name: 'Starter Kit Pro',
    price: 89.99,
    rating: 4.9,
    image: 'https://via.placeholder.com/150',
    category: 'Kits',
  },
  {
    id: 3,
    name: 'E-Liquid 50ml',
    price: 19.99,
    rating: 4.7,
    image: 'https://via.placeholder.com/150',
    category: 'Liquids',
  },
  {
    id: 4,
    name: 'Mesh Coil Pack',
    price: 14.99,
    rating: 4.6,
    image: 'https://via.placeholder.com/150',
    category: 'Accessories',
  },
];

export default function ProductsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Shop Products</Text>
        <Text style={styles.subtitle}>Discover premium vaping products</Text>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {['All', 'Pods', 'Kits', 'Liquids', 'Accessories'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              category === 'All' && styles.categoryChipActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                category === 'All' && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <View style={styles.productsGrid}>
        {products.map((product) => (
          <TouchableOpacity key={product.id} style={styles.productCard}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productCategory}>{product.category}</Text>
              <Text style={styles.productName} numberOfLines={2}>
                {product.name}
              </Text>
              <View style={styles.ratingContainer}>
                <Star color="#f59e0b" size={14} fill="#f59e0b" />
                <Text style={styles.ratingText}>{product.rating}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.price}>${product.price}</Text>
                <TouchableOpacity style={styles.addButton}>
                  <ShoppingCart color="#ffffff" size={16} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Load More */}
      <TouchableOpacity style={styles.loadMoreButton}>
        <Text style={styles.loadMoreText}>Load More Products</Text>
      </TouchableOpacity>
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
  categoriesContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
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
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
  },
  productCard: {
    width: cardWidth,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: cardWidth,
    backgroundColor: '#f3f4f6',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
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
  loadMoreButton: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
