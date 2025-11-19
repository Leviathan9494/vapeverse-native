import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Send, Gift, User, ArrowRight } from 'lucide-react-native';
import { usePoints } from '../context/PointsContext';

export default function PointsTransferScreen() {
  const [activeTab, setActiveTab] = useState<'transfer' | 'donate'>('transfer');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [points, setPoints] = useState('');
  const [message, setMessage] = useState('');

  const { userPoints, subtractPoints } = usePoints();

  const handleTransfer = () => {
    if (!recipientPhone || !points) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const pointsNum = parseInt(points);
    if (pointsNum > userPoints) {
      Alert.alert('Error', 'Insufficient points');
      return;
    }

    if (pointsNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    Alert.alert(
      'Confirm Transfer',
      `Transfer ${pointsNum} points to ${recipientPhone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // Deduct points
            subtractPoints(pointsNum);
            Alert.alert('Success', 'Points transferred successfully!');
            setRecipientPhone('');
            setPoints('');
            setMessage('');
          },
        },
      ]
    );
  };

  const handleDonate = () => {
    if (!points) {
      Alert.alert('Error', 'Please enter donation amount');
      return;
    }

    const pointsNum = parseInt(points);
    if (pointsNum > userPoints) {
      Alert.alert('Error', 'Insufficient points');
      return;
    }

    if (pointsNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    Alert.alert(
      'Confirm Donation',
      `Donate ${pointsNum} points to VapeVerse community fund?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Donate',
          onPress: () => {
            // API call would go here
            Alert.alert('Thank You!', 'Your donation helps our community grow!');
            setPoints('');
            setMessage('');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Points Management</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Points</Text>
          <Text style={styles.balanceAmount}>{userPoints}</Text>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'transfer' && styles.activeTab]}
          onPress={() => setActiveTab('transfer')}
        >
          <Send color={activeTab === 'transfer' ? '#3b82f6' : '#9ca3af'} size={20} />
          <Text style={[styles.tabText, activeTab === 'transfer' && styles.activeTabText]}>
            Transfer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'donate' && styles.activeTab]}
          onPress={() => setActiveTab('donate')}
        >
          <Gift color={activeTab === 'donate' ? '#3b82f6' : '#9ca3af'} size={20} />
          <Text style={[styles.tabText, activeTab === 'donate' && styles.activeTabText]}>
            Donate
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {activeTab === 'transfer' ? (
          <>
            <Text style={styles.sectionTitle}>Transfer Points to Another User</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Recipient Phone Number</Text>
              <View style={styles.inputContainer}>
                <User color="#9ca3af" size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number (e.g., 555-123-4567)"
                  value={recipientPhone}
                  onChangeText={setRecipientPhone}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Points Amount</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>⭐</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  value={points}
                  onChangeText={setPoints}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.helperText}>Max: {userPoints} points</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add a message..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleTransfer}>
              <ArrowRight color="#ffffff" size={20} />
              <Text style={styles.buttonText}>Send Points</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Donate to Community</Text>
            <Text style={styles.description}>
              Your donation helps support community events and rewards programs
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Donation Amount</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>⭐</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  value={points}
                  onChangeText={setPoints}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.helperText}>Max: {userPoints} points</Text>
            </View>

            <View style={styles.quickAmounts}>
              <Text style={styles.label}>Quick Amounts</Text>
              <View style={styles.quickButtonsRow}>
                {[50, 100, 250, 500].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={styles.quickButton}
                    onPress={() => setPoints(amount.toString())}
                  >
                    <Text style={styles.quickButtonText}>{amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add a message..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity style={[styles.button, styles.donateButton]} onPress={handleDonate}>
              <Gift color="#ffffff" size={20} />
              <Text style={styles.buttonText}>Donate Points</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Recent Transactions */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {[
          { type: 'sent', to: '555-123-4567', amount: 50, date: '2 days ago' },
          { type: 'received', from: '555-987-6543', amount: 100, date: '5 days ago' },
          { type: 'donated', amount: 25, date: '1 week ago' },
        ].map((transaction, index) => (
          <View key={index} style={styles.transactionCard}>
            <View style={styles.transactionIcon}>
              {transaction.type === 'sent' && <Send color="#ef4444" size={20} />}
              {transaction.type === 'received' && <ArrowRight color="#10b981" size={20} />}
              {transaction.type === 'donated' && <Gift color="#8b5cf6" size={20} />}
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>
                {transaction.type === 'sent' && `Sent to ${transaction.to}`}
                {transaction.type === 'received' && `Received from ${transaction.from}`}
                {transaction.type === 'donated' && 'Community Donation'}
              </Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                transaction.type === 'received' ? styles.positiveAmount : styles.negativeAmount,
              ]}
            >
              {transaction.type === 'received' ? '+' : '-'}
              {transaction.amount}
            </Text>
          </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: '#3b82f6',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.9,
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 4,
    margin: 16,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#eff6ff',
  },
  tabText: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3b82f6',
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  inputIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  quickAmounts: {
    marginBottom: 20,
  },
  quickButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  quickButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  button: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  donateButton: {
    backgroundColor: '#8b5cf6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentSection: {
    padding: 16,
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveAmount: {
    color: '#10b981',
  },
  negativeAmount: {
    color: '#6b7280',
  },
});
