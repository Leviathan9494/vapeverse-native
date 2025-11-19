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

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];
const SYMBOL_VALUES: Record<string, number> = {
  '🍒': 2,
  '🍋': 3,
  '🍊': 4,
  '🍇': 5,
  '🔔': 10,
  '💎': 20,
  '7️⃣': 50,
};

export default function SlotsGameScreen({ navigation, route }: any) {
  const { userPoints, onPointsChange } = route.params;
  const [gameChips, setGameChips] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [remainingChips, setRemainingChips] = useState(0);
  const [betAmount, setBetAmount] = useState(5);
  const [reels, setReels] = useState<string[]>(['🍒', '🍒', '🍒']);
  const [spinning, setSpinning] = useState(false);
  const [spinAnimations] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  const MIN_CHIPS = 5;
  const MIN_BET = 5;

  const startGame = () => {
    if (gameChips < MIN_CHIPS) {
      Alert.alert('Insufficient Chips', `You need at least ${MIN_CHIPS} chips to play`);
      return;
    }
    setGameStarted(true);
    setRemainingChips(gameChips);
    setBetAmount(Math.min(MIN_BET, gameChips));
  };

  const getRandomSymbol = () => {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  };

  const spin = () => {
    if (betAmount > remainingChips) {
      Alert.alert('Insufficient Chips', 'Not enough chips for this bet');
      return;
    }

    setSpinning(true);
    setRemainingChips(remainingChips - betAmount);

    // Animate reels
    spinAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 1000 + index * 300,
        useNativeDriver: true,
      }).start(() => {
        anim.setValue(0);
      });
    });

    // Generate results after animation
    setTimeout(() => {
      const result = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
      setReels(result);
      setSpinning(false);

      // Check for win
      const allMatch = result[0] === result[1] && result[1] === result[2];
      const twoMatch = result[0] === result[1] || result[1] === result[2] || result[0] === result[2];

      let winnings = 0;
      let message = '';

      if (allMatch) {
        const multiplier = SYMBOL_VALUES[result[0]] || 2;
        winnings = betAmount * multiplier;
        message = `🎉 JACKPOT!\nTriple ${result[0]}!\nWon ${winnings} chips (${multiplier}x)`;
      } else if (twoMatch) {
        winnings = betAmount * 2;
        message = `Nice! Pair match!\nWon ${winnings} chips (2x)`;
      } else {
        message = `No match. Try again!`;
      }

      const newChips = remainingChips - betAmount + winnings;
      setRemainingChips(newChips);

      setTimeout(() => {
        if (winnings > 0) {
          Alert.alert('Winner!', message, [
            { text: 'Spin Again' },
          ]);
        } else if (newChips < MIN_BET) {
          Alert.alert(
            'Out of Chips',
            `${message}\n\nNot enough chips to continue.`,
            [
              {
                text: 'Leave Table',
                onPress: () => {
                  const totalPointsChange = userPoints - gameChips + newChips;
                  onPointsChange(totalPointsChange);
                  navigation.goBack();
                },
              },
            ]
          );
        }
      }, 500);
    }, 2000);
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

  const renderGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.slotMachine}>
        <Text style={styles.machineName}>🎰 LUCKY SLOTS 🎰</Text>
        
        <View style={styles.reelsContainer}>
          {reels.map((symbol, index) => (
            <Animated.View
              key={index}
              style={[
                styles.reel,
                {
                  transform: [
                    {
                      translateY: spinAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -200],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.reelSymbol}>{symbol}</Text>
            </Animated.View>
          ))}
        </View>

        <View style={styles.payoutTable}>
          <Text style={styles.payoutTitle}>Payouts</Text>
          <View style={styles.payoutRows}>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutSymbol}>7️⃣ 7️⃣ 7️⃣</Text>
              <Text style={styles.payoutValue}>50x</Text>
            </View>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutSymbol}>💎 💎 💎</Text>
              <Text style={styles.payoutValue}>20x</Text>
            </View>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutSymbol}>🔔 🔔 🔔</Text>
              <Text style={styles.payoutValue}>10x</Text>
            </View>
            <View style={styles.payoutRow}>
              <Text style={styles.payoutSymbol}>Any Pair</Text>
              <Text style={styles.payoutValue}>2x</Text>
            </View>
          </View>
        </View>

        <View style={styles.betControls}>
          <Text style={styles.betLabel}>Bet Amount</Text>
          <View style={styles.betButtonsRow}>
            <TouchableOpacity
              style={styles.betButton}
              onPress={() => setBetAmount(Math.max(MIN_BET, betAmount - 5))}
              disabled={spinning}
            >
              <Text style={styles.betButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.betDisplay}>
              <Text style={styles.betAmount}>{betAmount}</Text>
            </View>
            <TouchableOpacity
              style={styles.betButton}
              onPress={() => setBetAmount(Math.min(remainingChips, betAmount + 5))}
              disabled={spinning}
            >
              <Text style={styles.betButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.quickBets}>
            {[5, 10, 25, 50].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.quickBetButton,
                  betAmount === amount && styles.quickBetActive,
                  amount > remainingChips && styles.quickBetDisabled,
                ]}
                onPress={() => setBetAmount(amount)}
                disabled={spinning || amount > remainingChips}
              >
                <Text style={[
                  styles.quickBetText,
                  betAmount === amount && styles.quickBetTextActive,
                ]}>
                  {amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.spinButton, spinning && styles.spinButtonDisabled]}
          onPress={spin}
          disabled={spinning || betAmount > remainingChips}
        >
          <Text style={styles.spinButtonText}>
            {spinning ? '🎰 SPINNING... 🎰' : '🎰 SPIN 🎰'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cashOutButton}
          onPress={() => {
            Alert.alert(
              'Cash Out',
              `Cash out ${remainingChips} chips and leave?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Cash Out',
                  onPress: () => {
                    const totalPointsChange = userPoints - gameChips + remainingChips;
                    onPointsChange(totalPointsChange);
                    navigation.goBack();
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.cashOutButtonText}>Cash Out</Text>
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
        <Text style={styles.headerTitle}>🎰 Slots</Text>
        <View style={styles.chipsDisplay}>
          <Coins color="#f59e0b" size={20} />
          <Text style={styles.chipsText}>
            {gameStarted ? remainingChips : userPoints}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {!gameStarted ? renderChipSelection() : renderGame()}
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
  slotMachine: {
    backgroundColor: '#dc2626',
    borderRadius: 16,
    padding: 20,
    borderWidth: 6,
    borderColor: '#fbbf24',
  },
  machineName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fef3c7',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#7c2d12',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  reelsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    overflow: 'hidden',
    height: 120,
  },
  reel: {
    width: 100,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#1f2937',
  },
  reelSymbol: {
    fontSize: 64,
  },
  payoutTable: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  payoutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 12,
  },
  payoutRows: {
    gap: 8,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payoutSymbol: {
    fontSize: 16,
    color: '#ffffff',
  },
  payoutValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  betControls: {
    marginBottom: 20,
  },
  betLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fef3c7',
    textAlign: 'center',
    marginBottom: 12,
  },
  betButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
  },
  betButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  betButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  betDisplay: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  betAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  quickBets: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  quickBetButton: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickBetActive: {
    borderColor: '#fbbf24',
  },
  quickBetDisabled: {
    opacity: 0.4,
  },
  quickBetText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  quickBetTextActive: {
    color: '#fbbf24',
  },
  spinButton: {
    backgroundColor: '#10b981',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#065f46',
  },
  spinButtonDisabled: {
    backgroundColor: '#374151',
    borderColor: '#1f2937',
  },
  spinButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cashOutButton: {
    backgroundColor: '#64748b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cashOutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
