import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Package, TrendingUp, Clock } from 'lucide-react-native';

const orders = [
  {
    id: 1,
    orderNumber: '#ORD-1234',
    date: '2024-11-10',
    status: 'Delivered',
    statusColor: '#10b981',
    total: 129.99,
    items: 3,
  },
  {
    id: 2,
    orderNumber: '#ORD-1233',
    date: '2024-11-05',
    status: 'Processing',
    statusColor: '#f59e0b',
    total: 49.99,
    items: 1,
  },
  {
    id: 3,
    orderNumber: '#ORD-1232',
    date: '2024-10-28',
    status: 'Delivered',
    statusColor: '#10b981',
    total: 89.99,
    items: 2,
  },
  {
    id: 4,
    orderNumber: '#ORD-1231',
    date: '2024-10-20',
    status: 'Cancelled',
    statusColor: '#ef4444',
    total: 34.99,
    items: 1,
  },
];

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Order History</Text>
        <Text style={styles.subtitle}>Track your purchases</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Package color="#3b82f6" size={24} />
          <Text style={styles.summaryValue}>24</Text>
          <Text style={styles.summaryLabel}>Total Orders</Text>
        </View>
        <View style={styles.summaryCard}>
          <TrendingUp color="#10b981" size={24} />
          <Text style={styles.summaryValue}>$1,234</Text>
          <Text style={styles.summaryLabel}>Total Spent</Text>
        </View>
      </View>

      {/* Orders List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {orders.map((order) => (
          <TouchableOpacity key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <View style={styles.orderMeta}>
                  <Clock color="#6b7280" size={14} />
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: order.statusColor + '20' },
                ]}
              >
                <Text
                  style={[styles.statusText, { color: order.statusColor }]}
                >
                  {order.status}
                </Text>
              </View>
            </View>

            <View style={styles.orderDetails}>
              <Text style={styles.orderItems}>{order.items} items</Text>
              <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View Details</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
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
  summaryContainer: {
    flexDirection: 'row',
    padding: 15,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
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
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  orderItems: {
    fontSize: 14,
    color: '#6b7280',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 14,
  },
});
