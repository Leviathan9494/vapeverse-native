import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Trophy, Coins } from 'lucide-react-native';

export default function GamingScreen({ navigation }: any) {
  const [userPoints, setUserPoints] = useState(850);

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

  const playGame = (gameId: string) => {
    // Navigate to appropriate game screen with chip buy-in system
    const gameRoutes: Record<string, string> = {
      poker: 'PokerGame',
      roulette: 'RouletteGame',
      blackjack: 'BlackjackGame',
      slots: 'SlotsGame',
    };

    const routeName = gameRoutes[gameId];
    if (routeName) {
      navigation.navigate(routeName, {
        userPoints: userPoints,
        onPointsChange: (newPoints: number) => setUserPoints(newPoints),
      });
    }
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
            onPress={() => playGame(game.id)}
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
});
