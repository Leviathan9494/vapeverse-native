import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { TrendingUp, ShoppingBag, Award, DollarSign } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { usePoints } from '../context/PointsContext';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { userPoints } = usePoints();
  
  const stats = [
    { icon: ShoppingBag, label: 'Total Orders', value: '24', color: '#3b82f6' },
    { icon: DollarSign, label: 'Total Spent', value: '$1,234', color: '#10b981' },
    { icon: Award, label: 'Loyalty Points', value: userPoints.toString(), color: '#f59e0b' },
    { icon: TrendingUp, label: 'Member Since', value: '2024', color: '#8b5cf6' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Here's your vaping journey</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <View key={index} style={styles.statCard}>
              <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                <Icon color={stat.color} size={24} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          );
        })}
      </View>

      {/* Points Card */}
      <View style={styles.pointsCard}>
        <View style={styles.pointsHeader}>
          <Award color="#ffffff" size={32} />
          <Text style={styles.pointsTitle}>Loyalty Rewards</Text>
        </View>
        <Text style={styles.pointsBalance}>{userPoints} Points</Text>
        <Text style={styles.pointsSubtext}>Keep shopping to earn more rewards!</Text>
        <TouchableOpacity 
          style={styles.redeemButton}
          onPress={() => (navigation as any).navigate('Rewards', { points: userPoints })}
        >
          <Text style={styles.redeemButtonText}>Redeem Points</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Order #1234 Delivered</Text>
          <Text style={styles.activityDate}>2 hours ago</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Earned 50 Points</Text>
          <Text style={styles.activityDate}>1 day ago</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>New Product Added</Text>
          <Text style={styles.activityDate}>3 days ago</Text>
        </View>
      </View>

      {/* Announcements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        <View style={[styles.announcementCard, { borderLeftColor: '#3b82f6' }]}>
          <Text style={styles.announcementTitle}>🎉 New Products Available!</Text>
          <Text style={styles.announcementText}>
            Check out our latest collection of premium vapes.
          </Text>
        </View>
      </View>
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
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  pointsCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  pointsBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  pointsSubtext: {
    fontSize: 14,
    color: '#e9d5ff',
    marginBottom: 16,
  },
  redeemButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  redeemButtonText: {
    color: '#8b5cf6',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  activityDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  announcementCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  announcementText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
