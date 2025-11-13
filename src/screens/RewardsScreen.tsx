import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Gift, Star, CheckCircle } from 'lucide-react-native';

const rewardProducts = [
  {
    id: 1,
    name: 'Free E-Liquid 30ml',
    points: 200,
    image: 'https://via.placeholder.com/150',
    description: 'Any flavor of your choice',
    category: 'Liquids',
  },
  {
    id: 2,
    name: '$10 Store Credit',
    points: 150,
    image: 'https://via.placeholder.com/150',
    description: 'Use on any purchase',
    category: 'Credit',
  },
  {
    id: 3,
    name: 'Premium Coil Pack',
    points: 300,
    image: 'https://via.placeholder.com/150',
    description: '5 premium mesh coils',
    category: 'Accessories',
  },
  {
    id: 4,
    name: 'Free Shipping Coupon',
    points: 100,
    image: 'https://via.placeholder.com/150',
    description: 'Valid for 30 days',
    category: 'Coupon',
  },
  {
    id: 5,
    name: 'Starter Kit Discount',
    points: 250,
    image: 'https://via.placeholder.com/150',
    description: '50% off any starter kit',
    category: 'Coupon',
  },
  {
    id: 6,
    name: 'VIP Member (1 Month)',
    points: 500,
    image: 'https://via.placeholder.com/150',
    description: 'Exclusive deals & early access',
    category: 'Membership',
  },
  {
    id: 7,
    name: 'Free Battery',
    points: 350,
    image: 'https://via.placeholder.com/150',
    description: 'High capacity 18650',
    category: 'Accessories',
  },
  {
    id: 8,
    name: '$25 Store Credit',
    points: 400,
    image: 'https://via.placeholder.com/150',
    description: 'Use on any purchase',
    category: 'Credit',
  },
];

interface RewardsScreenProps {
  navigation: any;
  route: any;
}

export default function RewardsScreen({ navigation, route }: RewardsScreenProps) {
  const userPoints = route.params?.points || 850;

  const handleRedeem = (product: typeof rewardProducts[0]) => {
    if (userPoints < product.points) {
      Alert.alert(
        'Insufficient Points',
        `You need ${product.points - userPoints} more points to redeem this reward.`
      );
      return;
    }

    Alert.alert(
      'Confirm Redemption',
      `Redeem ${product.name} for ${product.points} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: () => {
            Alert.alert(
              'Success! 🎉',
              `You've redeemed ${product.name}! Check your account for details.`,
              [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Liquids: '#3b82f6',
      Credit: '#10b981',
      Accessories: '#f59e0b',
      Coupon: '#8b5cf6',
      Membership: '#ef4444',
    };
    return colors[category] || '#6b7280';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.pointsBadge}>
          <Star color="#f59e0b" size={20} fill="#f59e0b" />
          <Text style={styles.pointsText}>{userPoints} Points</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.titleContainer}>
          <Gift color="#8b5cf6" size={32} />
          <Text style={styles.title}>Rewards Store</Text>
        </View>
        <Text style={styles.subtitle}>
          Redeem your loyalty points for exclusive rewards
        </Text>

        {/* Rewards Grid */}
        <View style={styles.rewardsGrid}>
          {rewardProducts.map((product) => {
            const canAfford = userPoints >= product.points;
            return (
              <View key={product.id} style={styles.rewardCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: product.image }}
                    style={styles.rewardImage}
                    resizeMode="cover"
                  />
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(product.category) },
                    ]}
                  >
                    <Text style={styles.categoryText}>{product.category}</Text>
                  </View>
                </View>

                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.rewardDescription} numberOfLines={2}>
                    {product.description}
                  </Text>

                  <View style={styles.rewardFooter}>
                    <View style={styles.pointsCost}>
                      <Star color="#f59e0b" size={16} fill="#f59e0b" />
                      <Text style={styles.pointsCostText}>{product.points}</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.redeemButton,
                        !canAfford && styles.redeemButtonDisabled,
                      ]}
                      onPress={() => handleRedeem(product)}
                      disabled={!canAfford}
                    >
                      {canAfford ? (
                        <CheckCircle color="#ffffff" size={16} />
                      ) : (
                        <Text style={styles.lockedText}>🔒</Text>
                      )}
                      <Text style={styles.redeemButtonText}>
                        {canAfford ? 'Redeem' : 'Locked'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How to Earn Points</Text>
          <Text style={styles.infoText}>
            • Make purchases (1 point per $1 spent){'\n'}
            • Complete your profile (+50 points){'\n'}
            • Refer friends (+100 points per referral){'\n'}
            • Write product reviews (+25 points){'\n'}
            • Birthday bonus (+200 points){'\n'}
            • Daily check-in (+5 points)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 8,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  rewardCard: {
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
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
    position: 'relative',
  },
  rewardImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  rewardInfo: {
    padding: 12,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsCostText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  redeemButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  redeemButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lockedText: {
    fontSize: 12,
  },
  infoSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 24,
  },
});
