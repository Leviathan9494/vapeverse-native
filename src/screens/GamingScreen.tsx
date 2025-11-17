import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Dices, Trophy, Coins, X } from 'lucide-react-native';

export default function GamingScreen({ navigation }: any) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(850);
  const [bet, setBet] = useState(50);

  const games = [
    {
      id: 'poker',
      name: 'Poker',
      icon: '🃏',
      color: '#ef4444',
      description: 'Classic Texas Hold\'em',
      minBet: 25,
    },
    {
      id: 'roulette',
      name: 'Roulette',
      icon: '🎰',
      color: '#8b5cf6',
      description: 'Spin the wheel',
      minBet: 10,
    },
    {
      id: 'blackjack',
      name: 'Blackjack',
      icon: '🎴',
      color: '#10b981',
      description: 'Beat the dealer',
      minBet: 20,
    },
    {
      id: 'slots',
      name: 'Slots',
      icon: '🎰',
      color: '#f59e0b',
      description: 'Lucky 7s',
      minBet: 5,
    },
  ];

  const playGame = (gameId: string, gameName: string) => {
    if (bet > userPoints) {
      Alert.alert('Insufficient Points', 'You don\'t have enough points to play');
      return;
    }

    // Navigate to full poker game
    if (gameId === 'poker') {
      setSelectedGame(null);
      navigation.navigate('PokerGame', {
        userPoints: userPoints,
        onPointsChange: (newPoints: number) => setUserPoints(newPoints),
      });
      return;
    }

    // Simulate game result for other games (60% chance to win)
    const won = Math.random() > 0.4;
    const winAmount = won ? bet * 2 : 0;

    setSelectedGame(null);

    setTimeout(() => {
      if (won) {
        setUserPoints(userPoints - bet + winAmount);
        Alert.alert(
          '🎉 You Won!',
          `Congratulations! You won ${winAmount} points!`,
          [{ text: 'Play Again' }]
        );
      } else {
        setUserPoints(userPoints - bet);
        Alert.alert(
          '😔 Better Luck Next Time',
          `You lost ${bet} points. Try again!`,
          [{ text: 'Try Again' }]
        );
      }
    }, 500);
  };

  const renderGameModal = () => {
    const game = games.find(g => g.id === selectedGame);
    if (!game) return null;

    return (
      <Modal
        visible={selectedGame !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedGame(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedGame(null)}
            >
              <X color="#9ca3af" size={24} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{game.icon} {game.name}</Text>
            <Text style={styles.modalDescription}>{game.description}</Text>

            <View style={styles.betSection}>
              <Text style={styles.betLabel}>Your Bet</Text>
              <View style={styles.betControls}>
                <TouchableOpacity
                  style={styles.betButton}
                  onPress={() => setBet(Math.max(game.minBet, bet - 10))}
                >
                  <Text style={styles.betButtonText}>-</Text>
                </TouchableOpacity>
                <View style={styles.betDisplay}>
                  <Text style={styles.betAmount}>{bet}</Text>
                  <Text style={styles.betCurrency}>points</Text>
                </View>
                <TouchableOpacity
                  style={styles.betButton}
                  onPress={() => setBet(Math.min(userPoints, bet + 10))}
                >
                  <Text style={styles.betButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.betInfo}>Min bet: {game.minBet} points</Text>
            </View>

            <View style={styles.quickBets}>
              {[game.minBet, 50, 100, 200].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.quickBetButton,
                    bet === amount && styles.quickBetButtonActive,
                  ]}
                  onPress={() => setBet(Math.min(amount, userPoints))}
                >
                  <Text
                    style={[
                      styles.quickBetText,
                      bet === amount && styles.quickBetTextActive,
                    ]}
                  >
                    {amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.playButton, { backgroundColor: game.color }]}
              onPress={() => playGame(game.id, game.name)}
            >
              <Dices color="#ffffff" size={24} />
              <Text style={styles.playButtonText}>Play Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Gaming Lounge</Text>
          <Text style={styles.subtitle}>Win points by playing games</Text>
        </View>
        <View style={styles.pointsBadge}>
          <Coins color="#f59e0b" size={20} />
          <Text style={styles.pointsText}>{userPoints}</Text>
        </View>
      </View>

      {/* Games Grid */}
      <View style={styles.gamesGrid}>
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={[styles.gameCard, { borderColor: game.color }]}
            onPress={() => setSelectedGame(game.id)}
          >
            <Text style={styles.gameIcon}>{game.icon}</Text>
            <Text style={styles.gameName}>{game.name}</Text>
            <Text style={styles.gameDescription}>{game.description}</Text>
            <View style={styles.minBetBadge}>
              <Text style={styles.minBetText}>Min: {game.minBet} pts</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Leaderboard */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Trophy color="#f59e0b" size={24} />
          <Text style={styles.sectionTitle}>Top Players</Text>
        </View>
        {[
          { name: 'Player123', points: 5420, position: 1 },
          { name: 'VapeKing', points: 4890, position: 2 },
          { name: 'LuckyStar', points: 3750, position: 3 },
          { name: 'You', points: userPoints, position: 12 },
        ].map((player, index) => (
          <View
            key={index}
            style={[
              styles.leaderboardItem,
              player.name === 'You' && styles.currentPlayer,
            ]}
          >
            <View style={styles.playerInfo}>
              <View
                style={[
                  styles.positionBadge,
                  player.position <= 3 && styles.topThree,
                ]}
              >
                <Text
                  style={[
                    styles.positionText,
                    player.position <= 3 && styles.topThreeText,
                  ]}
                >
                  #{player.position}
                </Text>
              </View>
              <Text style={styles.playerName}>{player.name}</Text>
            </View>
            <Text style={styles.playerPoints}>{player.points} pts</Text>
          </View>
        ))}
      </View>

      {/* Rules */}
      <View style={styles.rulesSection}>
        <Text style={styles.rulesTitle}>How It Works</Text>
        <Text style={styles.rulesText}>
          • Use your loyalty points to play games{'\n'}
          • Win 2x your bet when you win{'\n'}
          • Minimum bet varies by game{'\n'}
          • Earn points by shopping or receiving transfers{'\n'}
          • Leaderboard updates in real-time
        </Text>
      </View>

      {renderGameModal()}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
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
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  gameCard: {
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  minBetBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  minBetText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  leaderboardItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentPlayer: {
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  positionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topThree: {
    backgroundColor: '#fef3c7',
  },
  positionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  topThreeText: {
    color: '#92400e',
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  playerPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  rulesSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  rulesText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  betSection: {
    marginBottom: 24,
  },
  betLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  betControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  betButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  betButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  betDisplay: {
    alignItems: 'center',
  },
  betAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
  },
  betCurrency: {
    fontSize: 14,
    color: '#6b7280',
  },
  betInfo: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  quickBets: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  quickBetButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickBetButtonActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  quickBetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  quickBetTextActive: {
    color: '#3b82f6',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
