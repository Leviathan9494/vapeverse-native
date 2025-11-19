import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { ArrowLeft, Coins } from 'lucide-react-native';

type BetType = 'red' | 'black' | 'green' | number;

interface Bet {
  type: BetType;
  amount: number;
}

export default function RouletteGameScreen({ navigation, route }: any) {
  const { userPoints, onPointsChange } = route.params;
  const [gameChips, setGameChips] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [remainingChips, setRemainingChips] = useState(0);
  const [currentBets, setCurrentBets] = useState<Bet[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [spinAnimation] = useState(new Animated.Value(0));

  const MIN_CHIPS = 10;
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  const startGame = () => {
    if (gameChips < MIN_CHIPS) {
      Alert.alert('Insufficient Chips', `You need at least ${MIN_CHIPS} chips to play`);
      return;
    }
    setGameStarted(true);
    setRemainingChips(gameChips);
  };

  const placeBet = (type: BetType, amount: number) => {
    if (amount > remainingChips) {
      Alert.alert('Insufficient Chips', 'Not enough chips for this bet');
      return;
    }

    const newBet: Bet = { type, amount };
    setCurrentBets([...currentBets, newBet]);
    setRemainingChips(remainingChips - amount);
  };

  const clearBets = () => {
    const totalBets = currentBets.reduce((sum, bet) => sum + bet.amount, 0);
    setRemainingChips(remainingChips + totalBets);
    setCurrentBets([]);
  };

  const spin = () => {
    if (currentBets.length === 0) {
      Alert.alert('No Bets', 'Place at least one bet before spinning');
      return;
    }

    setSpinning(true);
    
    // Animate spin
    Animated.timing(spinAnimation, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      // Generate result
      const spinResult = Math.floor(Math.random() * 37); // 0-36
      setResult(spinResult);
      
      // Calculate winnings
      let winnings = 0;
      currentBets.forEach(bet => {
        if (typeof bet.type === 'number' && bet.type === spinResult) {
          // Straight bet pays 35:1
          winnings += bet.amount * 36;
        } else if (bet.type === 'red' && redNumbers.includes(spinResult)) {
          // Color bet pays 1:1
          winnings += bet.amount * 2;
        } else if (bet.type === 'black' && blackNumbers.includes(spinResult)) {
          winnings += bet.amount * 2;
        } else if (bet.type === 'green' && spinResult === 0) {
          // Green (0) pays 35:1
          winnings += bet.amount * 36;
        }
      });

      const finalChips = remainingChips + winnings;
      const totalPointsChange = userPoints - gameChips + finalChips;

      setSpinning(false);
      spinAnimation.setValue(0);

      // Show result
      setTimeout(() => {
        if (winnings > 0) {
          Alert.alert(
            '🎉 Winner!',
            `Ball landed on ${spinResult}!\nYou won ${winnings} chips!\n\nFinal chips: ${finalChips}`,
            [
              {
                text: 'Leave Table',
                onPress: () => {
                  onPointsChange(totalPointsChange);
                  navigation.goBack();
                },
              },
            ]
          );
        } else {
          Alert.alert(
            'Better Luck Next Time',
            `Ball landed on ${spinResult}\n\nRemaining chips: ${finalChips}`,
            finalChips >= MIN_CHIPS
              ? [
                  { text: 'Play Again', onPress: () => {
                    setCurrentBets([]);
                    setRemainingChips(finalChips);
                    setResult(null);
                  }},
                  {
                    text: 'Leave Table',
                    onPress: () => {
                      onPointsChange(totalPointsChange);
                      navigation.goBack();
                    },
                  },
                ]
              : [
                  {
                    text: 'Leave Table',
                    onPress: () => {
                      onPointsChange(totalPointsChange);
                      navigation.goBack();
                    },
                  },
                ]
          );
        }
      }, 500);
    });
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return '#10b981';
    if (redNumbers.includes(num)) return '#ef4444';
    return '#1f2937';
  };

  const renderChipSelection = () => (
    <View style={styles.chipSelectionContainer}>
      <Text style={styles.chipSelectionTitle}>Select Game Chips</Text>
      <Text style={styles.chipSelectionSubtitle}>
        Choose how many points to use for this game
      </Text>
      <View style={styles.chipOptionsGrid}>
        {[50, 100, 250, 500].map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.chipOptionButton,
              gameChips === amount && styles.chipOptionSelected,
              amount > userPoints && styles.chipOptionDisabled,
            ]}
            onPress={() => setGameChips(amount)}
            disabled={amount > userPoints}
          >
            <Text style={[
              styles.chipOptionText,
              gameChips === amount && styles.chipOptionTextSelected,
              amount > userPoints && styles.chipOptionTextDisabled,
            ]}>
              {amount}
            </Text>
            <Text style={styles.chipOptionLabel}>points</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.customChipSection}>
        <Text style={styles.customChipLabel}>Custom Amount:</Text>
        <View style={styles.customChipControls}>
          <TouchableOpacity
            style={styles.customChipButton}
            onPress={() => setGameChips(Math.max(MIN_CHIPS, gameChips - 25))}
          >
            <Text style={styles.customChipButtonText}>-25</Text>
          </TouchableOpacity>
          <View style={styles.customChipDisplay}>
            <Text style={styles.customChipAmount}>{gameChips}</Text>
          </View>
          <TouchableOpacity
            style={styles.customChipButton}
            onPress={() => setGameChips(Math.min(userPoints, gameChips + 25))}
          >
            <Text style={styles.customChipButtonText}>+25</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.confirmChipsButton,
          (gameChips === 0 || gameChips < MIN_CHIPS) && styles.confirmChipsButtonDisabled
        ]}
        onPress={startGame}
        disabled={gameChips === 0 || gameChips < MIN_CHIPS}
      >
        <Text style={styles.confirmChipsButtonText}>
          Start Game with {gameChips} Points
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderBettingTable = () => (
    <View style={styles.gameContainer}>
      <View style={styles.rouletteWheel}>
        <Animated.View
          style={[
            styles.wheelCenter,
            {
              transform: [
                {
                  rotate: spinAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '1440deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.wheelNumber}>
            {result !== null ? result : '?'}
          </Text>
        </Animated.View>
      </View>

      <View style={styles.bettingArea}>
        <Text style={styles.sectionTitle}>Place Your Bets</Text>
        
        <View style={styles.colorBets}>
          <TouchableOpacity
            style={[styles.colorBet, { backgroundColor: '#ef4444' }]}
            onPress={() => placeBet('red', MIN_CHIPS)}
            disabled={spinning || remainingChips < MIN_CHIPS}
          >
            <Text style={styles.colorBetText}>RED</Text>
            <Text style={styles.colorBetOdds}>2:1</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.colorBet, { backgroundColor: '#1f2937' }]}
            onPress={() => placeBet('black', MIN_CHIPS)}
            disabled={spinning || remainingChips < MIN_CHIPS}
          >
            <Text style={styles.colorBetText}>BLACK</Text>
            <Text style={styles.colorBetOdds}>2:1</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.colorBet, { backgroundColor: '#10b981' }]}
            onPress={() => placeBet('green', MIN_CHIPS)}
            disabled={spinning || remainingChips < MIN_CHIPS}
          >
            <Text style={styles.colorBetText}>0 GREEN</Text>
            <Text style={styles.colorBetOdds}>36:1</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.currentBetsContainer}>
          <Text style={styles.currentBetsTitle}>Current Bets:</Text>
          {currentBets.length === 0 ? (
            <Text style={styles.noBetsText}>No bets placed</Text>
          ) : (
            currentBets.map((bet, index) => (
              <Text key={index} style={styles.betText}>
                {typeof bet.type === 'number' ? `#${bet.type}` : bet.type.toUpperCase()}: {bet.amount} chips
              </Text>
            ))
          )}
          <Text style={styles.totalBetText}>
            Total bet: {currentBets.reduce((sum, bet) => sum + bet.amount, 0)} chips
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.clearButton]}
          onPress={clearBets}
          disabled={spinning || currentBets.length === 0}
        >
          <Text style={styles.controlButtonText}>Clear Bets</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.spinButton, spinning && styles.disabledButton]}
          onPress={spin}
          disabled={spinning || currentBets.length === 0}
        >
          <Text style={styles.controlButtonText}>
            {spinning ? 'Spinning...' : 'SPIN'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (gameStarted && remainingChips > 0) {
              Alert.alert(
                'Leave Table?',
                `You have ${remainingChips} chips remaining. Cash out and leave?`,
                [
                  { text: 'Stay', style: 'cancel' },
                  {
                    text: 'Leave',
                    onPress: () => {
                      const totalPointsChange = userPoints - gameChips + remainingChips;
                      onPointsChange(totalPointsChange);
                      navigation.goBack();
                    },
                  },
                ]
              );
            } else {
              navigation.goBack();
            }
          }}
        >
          <ArrowLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🎰 Roulette</Text>
        <View style={styles.chipsDisplay}>
          <Coins color="#f59e0b" size={20} />
          <Text style={styles.chipsText}>
            {gameStarted ? remainingChips : userPoints}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {!gameStarted ? renderChipSelection() : renderBettingTable()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  chipsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  chipsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  content: {
    flex: 1,
  },
  chipSelectionContainer: {
    padding: 20,
  },
  chipSelectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  chipSelectionSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  chipOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  chipOptionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  chipOptionSelected: {
    backgroundColor: '#1e40af',
    borderColor: '#3b82f6',
  },
  chipOptionDisabled: {
    backgroundColor: '#1e293b',
    opacity: 0.4,
  },
  chipOptionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  chipOptionTextSelected: {
    color: '#60a5fa',
  },
  chipOptionTextDisabled: {
    color: '#64748b',
  },
  chipOptionLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  customChipSection: {
    marginBottom: 24,
  },
  customChipLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  customChipControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  customChipButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  customChipButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  customChipDisplay: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  customChipAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  confirmChipsButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmChipsButtonDisabled: {
    backgroundColor: '#374151',
    opacity: 0.5,
  },
  confirmChipsButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  gameContainer: {
    padding: 20,
  },
  rouletteWheel: {
    alignItems: 'center',
    marginBottom: 24,
  },
  wheelCenter: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#1e293b',
    borderWidth: 8,
    borderColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bettingArea: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  colorBets: {
    gap: 12,
    marginBottom: 24,
  },
  colorBet: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorBetText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  colorBetOdds: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
  },
  currentBetsContainer: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  currentBetsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  noBetsText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  betText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  totalBetText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#64748b',
  },
  spinButton: {
    backgroundColor: '#ef4444',
  },
  disabledButton: {
    opacity: 0.5,
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
