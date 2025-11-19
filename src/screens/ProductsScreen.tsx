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
  Alert,
  Modal,
} from 'react-native';
import { ShoppingCart, Star, Search, Award, X, Plus } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import API_URL from '../config/api';
import { useCart } from '../context/CartContext';
import { usePoints } from '../context/PointsContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 45) / 2;

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  pointsCost: number;
  quantity: number;
  category: string;
  subcategory: string;
  image: string;
  publishToEcom: boolean;
}

export default function ProductsScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { userPoints, subtractPoints } = usePoints();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const { addToCart, getCartCount } = useCart();

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

  // Handle product click to show details
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    Alert.alert(
      '✅ Added to Cart',
      `${product.name} has been added to your cart!`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  // Handle points redemption
  const handleRedeemWithPoints = (product: Product) => {
    setSelectedProduct(product);
    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    if (!selectedProduct) return;

    if (userPoints >= selectedProduct.pointsCost) {
      // Deduct points
      subtractPoints(selectedProduct.pointsCost);
      setShowRedeemModal(false);
      
      Alert.alert(
        '🎉 Redeemed Successfully!',
        `You've redeemed ${selectedProduct.name} for ${selectedProduct.pointsCost.toLocaleString()} points!\n\nRemaining Points: ${(userPoints - selectedProduct.pointsCost).toLocaleString()}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        '❌ Insufficient Points',
        `You need ${selectedProduct.pointsCost.toLocaleString()} points but only have ${userPoints.toLocaleString()} points.`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Points Balance Header with Cart Icon */}
      <View style={styles.pointsHeader}>
        <View style={styles.pointsRow}>
          <Award color="#f59e0b" size={24} fill="#f59e0b" />
          <View style={styles.pointsInfo}>
            <Text style={styles.pointsLabel}>Your Points Balance</Text>
            <Text style={styles.pointsValue}>{userPoints.toLocaleString()} pts</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.cartIconContainer}
          onPress={() => navigation.navigate('Cart')}
        >
          <ShoppingCart color="#3b82f6" size={24} />
          {getCartCount() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getCartCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.pointsConversionRow}>
        <Text style={styles.pointsConversion}>100 points = $1.00</Text>
      </View>
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
              <TouchableOpacity 
                key={product.id} 
                style={styles.productCard}
                onPress={() => handleProductClick(product)}
              >
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
                  
                  {/* Price and Points */}
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    <View style={styles.pointsRow2}>
                      <Award color="#f59e0b" size={12} fill="#f59e0b" />
                      <Text style={styles.pointsText}>
                        {product.pointsCost.toLocaleString()} pts
                      </Text>
                    </View>
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

      {/* Redeem Modal */}
      <Modal
        visible={showRedeemModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRedeemModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowRedeemModal(false)}
            >
              <X color="#6b7280" size={24} />
            </TouchableOpacity>

            {selectedProduct && (
              <>
                <View style={styles.modalHeader}>
                  <Award color="#f59e0b" size={48} fill="#f59e0b" />
                  <Text style={styles.modalTitle}>Redeem with Points</Text>
                </View>

                <Image
                  source={{ uri: selectedProduct.image }}
                  style={styles.modalProductImage}
                  resizeMode="cover"
                />

                <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                <Text style={styles.modalProductBrand}>{selectedProduct.brand}</Text>

                <View style={styles.modalPriceRow}>
                  <View style={styles.modalPriceBox}>
                    <Text style={styles.modalLabel}>Cash Price</Text>
                    <Text style={styles.modalCashPrice}>${selectedProduct.price.toFixed(2)}</Text>
                  </View>
                  <View style={styles.modalPriceBox}>
                    <Text style={styles.modalLabel}>Points Cost</Text>
                    <Text style={styles.modalPointsPrice}>
                      {selectedProduct.pointsCost.toLocaleString()} pts
                    </Text>
                  </View>
                </View>

                <View style={styles.modalBalance}>
                  <Text style={styles.modalBalanceLabel}>Your Balance:</Text>
                  <Text style={[
                    styles.modalBalanceValue,
                    userPoints < selectedProduct.pointsCost && styles.modalBalanceInsufficient
                  ]}>
                    {userPoints.toLocaleString()} pts
                  </Text>
                </View>

                {userPoints >= selectedProduct.pointsCost ? (
                  <View style={styles.modalAfterBalance}>
                    <Text style={styles.modalAfterLabel}>After Redemption:</Text>
                    <Text style={styles.modalAfterValue}>
                      {(userPoints - selectedProduct.pointsCost).toLocaleString()} pts
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.modalInsufficientText}>
                    ❌ You need {(selectedProduct.pointsCost - userPoints).toLocaleString()} more points
                  </Text>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setShowRedeemModal(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalConfirmButton,
                      userPoints < selectedProduct.pointsCost && styles.modalConfirmButtonDisabled
                    ]}
                    onPress={confirmRedeem}
                    disabled={userPoints < selectedProduct.pointsCost}
                  >
                    <Award color="#ffffff" size={16} fill="#ffffff" />
                    <Text style={[
                      styles.modalConfirmText,
                      userPoints < selectedProduct.pointsCost && styles.modalConfirmTextDisabled
                    ]}>
                      Confirm Redemption
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Product Detail Modal */}
      <Modal
        visible={showProductModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowProductModal(false)}
            >
              <X color="#6b7280" size={24} />
            </TouchableOpacity>

            {selectedProduct && (
              <ScrollView>
                <Image
                  source={{ uri: selectedProduct.image }}
                  style={styles.modalProductImage}
                  resizeMode="cover"
                />

                <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                <Text style={styles.modalProductBrand}>{selectedProduct.brand}</Text>
                <Text style={styles.modalCategoryText}>{selectedProduct.category}</Text>

                <View style={styles.modalPriceSection}>
                  <Text style={styles.modalPrice}>${selectedProduct.price.toFixed(2)}</Text>
                  <View style={styles.modalPointsDisplay}>
                    <Award color="#f59e0b" size={16} fill="#f59e0b" />
                    <Text style={styles.modalPointsText}>
                      {selectedProduct.pointsCost.toLocaleString()} points
                    </Text>
                  </View>
                </View>

                {selectedProduct.quantity > 0 ? (
                  <Text style={styles.stockText}>✅ In Stock ({selectedProduct.quantity} available)</Text>
                ) : (
                  <Text style={styles.outOfStockTextLarge}>❌ Out of Stock</Text>
                )}

                <View style={styles.modalActionButtons}>
                  <TouchableOpacity
                    style={[
                      styles.modalAddToCartButton,
                      selectedProduct.quantity === 0 && styles.buttonDisabled
                    ]}
                    onPress={() => {
                      handleAddToCart(selectedProduct);
                      setShowProductModal(false);
                    }}
                    disabled={selectedProduct.quantity === 0}
                  >
                    <ShoppingCart color="#ffffff" size={20} />
                    <Text style={styles.modalAddToCartText}>Add to Cart</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modalRedeemButton,
                      (userPoints < selectedProduct.pointsCost || selectedProduct.quantity === 0) && 
                      styles.buttonDisabled
                    ]}
                    onPress={() => {
                      setShowProductModal(false);
                      setTimeout(() => handleRedeemWithPoints(selectedProduct), 300);
                    }}
                    disabled={userPoints < selectedProduct.pointsCost || selectedProduct.quantity === 0}
                  >
                    <Award color="#ffffff" size={20} fill="#ffffff" />
                    <Text style={styles.modalRedeemText}>Redeem with Points</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
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
  // Points header styles
  pointsHeader: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#f59e0b',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsInfo: {
    marginLeft: 12,
  },
  pointsLabel: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400e',
  },
  pointsConversion: {
    fontSize: 11,
    color: '#78350f',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  pointsRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  pointsText: {
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: '600',
    marginLeft: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  modalProductImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalProductName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalProductBrand: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  modalPriceBox: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  modalCashPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalPointsPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  modalBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  modalBalanceLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  modalBalanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  modalBalanceInsufficient: {
    color: '#ef4444',
  },
  modalAfterBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalAfterLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  modalAfterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  modalInsufficientText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#6b7280',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalConfirmButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f59e0b',
    gap: 8,
  },
  modalConfirmButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  modalConfirmText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalConfirmTextDisabled: {
    color: '#9ca3af',
  },
  cartIconContainer: {
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
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pointsConversionRow: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  modalCategoryText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  modalPriceSection: {
    marginVertical: 16,
  },
  modalPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 8,
  },
  modalPointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalPointsText: {
    fontSize: 16,
    color: '#f59e0b',
    fontWeight: '600',
  },
  stockText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: 16,
  },
  outOfStockTextLarge: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
    marginBottom: 16,
  },
  modalActionButtons: {
    gap: 12,
    marginTop: 16,
  },
  modalAddToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  modalAddToCartText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalRedeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f59e0b',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  modalRedeemText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#e5e7eb',
    opacity: 0.6,
  },
});
