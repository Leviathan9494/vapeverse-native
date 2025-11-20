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

interface Bet {
  spot: string;
  amount: number;
  type: 'straight' | 'color' | 'even-odd' | 'low-high' | 'dozen' | 'column';
  numbers: number[];
  payout: number;
}

export default function RouletteGameScreen({ navigation, route }: any) {
  const { userPoints, onPointsChange } = route.params;
  const [gameChips, setGameChips] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [remainingChips, setRemainingChips] = useState(0);
  const [chipValue, setChipValue] = useState(10);
  const [bets, setBets] = useState<Map<string, Bet>>(new Map());
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [spinAnimation] = useState(new Animated.Value(0));
  const [ballAnimation] = useState(new Animated.Value(0));
  const [winningSpots, setWinningSpots] = useState<Set<string>>(new Set());
  const [showDetailedWheel, setShowDetailedWheel] = useState(false);

  const MIN_CHIPS = 10;
  
  // Roulette wheel numbers in actual order (European roulette)
  const wheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
    5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
  
  const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
    if (num === 0) return 'green';
    return redNumbers.includes(num) ? 'red' : 'black';
  };
  
  const rouletteLayout = [
    [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
    [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  ];

  const startGame = () => {
    if (gameChips < MIN_CHIPS) {
      Alert.alert('Insufficient Chips', `You need at least ${MIN_CHIPS} chips to play`);
      return;
    }
    setGameStarted(true);
    setRemainingChips(gameChips);
  };

  const placeBet = (spot: string, numbers: number[], type: 'straight' | 'color' | 'even-odd' | 'low-high' | 'dozen' | 'column', payout: number) => {
    if (chipValue > remainingChips) {
      Alert.alert('Insufficient Chips', 'Not enough chips for this bet');
      return;
    }

    const newBets = new Map(bets);
    if (newBets.has(spot)) {
      const existing = newBets.get(spot)!;
      newBets.set(spot, {
        ...existing,
        amount: existing.amount + chipValue,
      });
    } else {
      newBets.set(spot, { spot, amount: chipValue, type, numbers, payout });
    }
    
    setBets(newBets);
    setRemainingChips(remainingChips - chipValue);
  };

  const clearBets = () => {
    const totalBets = Array.from(bets.values()).reduce((sum, bet) => sum + bet.amount, 0);
    setRemainingChips(remainingChips + totalBets);
    setBets(new Map());
    setWinningSpots(new Set());
    setResult(null);
  };

  const spin = () => {
    if (bets.size === 0) {
      Alert.alert('No Bets', 'Place at least one bet before spinning');
      return;
    }

    setSpinning(true);
    setWinningSpots(new Set());
    setResult(null);
    setShowDetailedWheel(true);
    
    // Animate wheel and ball spin
    spinAnimation.setValue(0);
    ballAnimation.setValue(0);
    
    Animated.parallel([
      Animated.timing(spinAnimation, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }),
      Animated.timing(ballAnimation, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Generate result
      const spinResult = Math.floor(Math.random() * 37); // 0-36
      setResult(spinResult);
      
      // Calculate winnings and mark winning spots
      let winnings = 0;
      const winning = new Set<string>();
      
      bets.forEach((bet, spot) => {
        if (bet.numbers.includes(spinResult)) {
          winnings += bet.amount * bet.payout;
          winning.add(spot);
        }
      });

      setWinningSpots(winning);
      const finalChips = remainingChips + winnings;
      const totalPointsChange = userPoints - gameChips + finalChips;

      setSpinning(false);
      // Keep wheel visible to show result
      spinAnimation.setValue(0);

      // Show result
      setTimeout(() => {
        if (winnings > 0) {
          Alert.alert(
            '🎉 Winner!',
            `Ball landed on ${spinResult}!\nYou won ${winnings} chips!\n\nFinal chips: ${finalChips}`,
            [
              { text: 'Play Again', onPress: () => {
                setShowDetailedWheel(false);
                setBets(new Map());
                setWinningSpots(new Set());
                setRemainingChips(finalChips);
              }},
              {
                text: 'Leave Table',
                onPress: () => {
                  setShowDetailedWheel(false);
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
                    setShowDetailedWheel(false);
                    setBets(new Map());
                    setWinningSpots(new Set());
                    setRemainingChips(finalChips);
                  }},
                  {
                    text: 'Leave Table',
                    onPress: () => {
                      setShowDetailedWheel(false);
                      onPointsChange(totalPointsChange);
                      navigation.goBack();
                    },
                  },
                ]
              : [
                  {
                    text: 'Leave Table',
                    onPress: () => {
                      setShowDetailedWheel(false);
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

  const getNumberColorHex = (num: number) => {
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
      {/* Detailed Roulette Wheel - Show at top when spinning or showing result */}
      {showDetailedWheel && (
        <View style={styles.detailedWheelContainer}>
          <Text style={styles.spinningText}>
            {spinning ? '🎰 SPINNING... 🎰' : result !== null ? `✨ LANDED ON ${result}! ✨` : '🎰 SPINNING... 🎰'}
          </Text>
          <View style={styles.wheelFrame}>
            {/* Outer rim */}
            <View style={styles.wheelOuter}>
              {/* Rotating wheel with numbers */}
              <Animated.View
                style={[
                  styles.wheelInner,
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
                {wheelNumbers.map((num, index) => {
                  const angle = (index * 360) / wheelNumbers.length;
                  const color = getNumberColorHex(num);
                  return (
                    <View
                      key={index}
                      style={[
                        styles.wheelSegment,
                        {
                          transform: [
                            { rotate: `${angle}deg` },
                            { translateY: -80 },
                          ],
                        },
                      ]}
                    >
                      <View style={[styles.numberPocket, { backgroundColor: color }]}>
                        <Text style={styles.pocketNumber}>{num}</Text>
                      </View>
                    </View>
                  );
                })}
                {/* Center circle */}
                <View style={styles.wheelCenter}>
                  <Text style={styles.wheelCenterText}>🎯</Text>
                </View>
              </Animated.View>
              
              {/* Animated Ball */}
              <Animated.View
                style={[
                  styles.spinningBall,
                  {
                    transform: [
                      {
                        rotate: ballAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '-2880deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.ballOrbit}>
                  <View style={styles.ballVisual} />
                </View>
              </Animated.View>
            </View>
          </View>
        </View>
      )}

      {/* Simple Result Display */}
      {!showDetailedWheel && (
        <View style={styles.simpleWheelContainer}>
          {result !== null ? (
            <View style={styles.lastResultDisplay}>
              <Text style={styles.lastResultLabel}>Last Result</Text>
              <View style={[styles.resultBall, { backgroundColor: getNumberColorHex(result) }]}>
                <Text style={styles.resultNumber}>{result}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.readyToSpin}>
              <Text style={styles.readyText}>🎯</Text>
              <Text style={styles.readyLabel}>Ready to Spin!</Text>
            </View>
          )}
        </View>
      )}

      <Text style={styles.tableTitle}>Place Your Chips on the Table</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.rouletteTable}>
          {/* Zero */}
          <TouchableOpacity
            style={[
              styles.zeroCell,
              winningSpots.has('0') && styles.winningCell,
              bets.has('0') && styles.betPlacedCell,
            ]}
            onPress={() => placeBet('0', [0], 'straight', 36)}
            disabled={spinning}
          >
            <Text style={styles.zeroText}>0</Text>
            {bets.has('0') && (
              <View style={styles.chipIndicator}>
                <Text style={styles.chipAmount}>{bets.get('0')!.amount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Number Grid */}
          <View style={styles.numberGrid}>
            {rouletteLayout.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.tableRow}>
                {row.map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.numberCell,
                      { backgroundColor: getNumberColorHex(num) },
                      winningSpots.has(String(num)) && styles.winningCell,
                      bets.has(String(num)) && styles.betPlacedCell,
                    ]}
                    onPress={() => placeBet(String(num), [num], 'straight', 36)}
                    disabled={spinning}
                  >
                    <Text style={styles.numberText}>{num}</Text>
                    {bets.has(String(num)) && (
                      <View style={styles.chipIndicator}>
                        <Text style={styles.chipAmount}>{bets.get(String(num))!.amount}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
                {/* 2:1 Column Bet */}
                <TouchableOpacity
                  style={[
                    styles.columnCell,
                    winningSpots.has(`col-${rowIndex}`) && styles.winningCell,
                    bets.has(`col-${rowIndex}`) && styles.betPlacedCell,
                  ]}
                  onPress={() => placeBet(`col-${rowIndex}`, row, 'column', 3)}
                  disabled={spinning}
                >
                  <Text style={styles.sideText}>2:1</Text>
                  {bets.has(`col-${rowIndex}`) && (
                    <View style={styles.chipIndicator}>
                      <Text style={styles.chipAmount}>{bets.get(`col-${rowIndex}`)!.amount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Bottom Bets */}
          <View style={styles.bottomBets}>
            {/* Dozens */}
            <View style={styles.dozenRow}>
              {[
                { label: '1st 12', numbers: Array.from({ length: 12 }, (_, i) => i + 1), spot: '1st12' },
                { label: '2nd 12', numbers: Array.from({ length: 12 }, (_, i) => i + 13), spot: '2nd12' },
                { label: '3rd 12', numbers: Array.from({ length: 12 }, (_, i) => i + 25), spot: '3rd12' },
              ].map((dozen) => (
                <TouchableOpacity
                  key={dozen.spot}
                  style={[
                    styles.dozenCell,
                    winningSpots.has(dozen.spot) && styles.winningCell,
                    bets.has(dozen.spot) && styles.betPlacedCell,
                  ]}
                  onPress={() => placeBet(dozen.spot, dozen.numbers, 'dozen', 3)}
                  disabled={spinning}
                >
                  <Text style={styles.bottomText}>{dozen.label}</Text>
                  {bets.has(dozen.spot) && (
                    <View style={styles.chipIndicator}>
                      <Text style={styles.chipAmount}>{bets.get(dozen.spot)!.amount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Even Money Bets */}
            <View style={styles.evenMoneyRow}>
              {[
                { label: '1-18', numbers: Array.from({ length: 18 }, (_, i) => i + 1), spot: '1-18' },
                { label: 'EVEN', numbers: [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36], spot: 'even' },
                { label: 'RED', numbers: redNumbers, spot: 'red', color: '#ef4444' },
                { label: 'BLACK', numbers: blackNumbers, spot: 'black', color: '#1f2937' },
                { label: 'ODD', numbers: [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35], spot: 'odd' },
                { label: '19-36', numbers: Array.from({ length: 18 }, (_, i) => i + 19), spot: '19-36' },
              ].map((bet) => (
                <TouchableOpacity
                  key={bet.spot}
                  style={[
                    styles.evenMoneyCell,
                    bet.color && { backgroundColor: bet.color },
                    winningSpots.has(bet.spot) && styles.winningCell,
                    bets.has(bet.spot) && styles.betPlacedCell,
                  ]}
                  onPress={() => placeBet(bet.spot, bet.numbers, bet.spot === 'red' || bet.spot === 'black' ? 'color' : bet.spot === 'even' || bet.spot === 'odd' ? 'even-odd' : 'low-high', 2)}
                  disabled={spinning}
                >
                  <Text style={[
                    styles.bottomText,
                    (bet.color || bet.spot === 'black') && styles.whiteText,
                  ]}>
                    {bet.label}
                  </Text>
                  {bets.has(bet.spot) && (
                    <View style={styles.chipIndicator}>
                      <Text style={styles.chipAmount}>{bets.get(bet.spot)!.amount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Chip Selector */}
      <View style={styles.chipSelector}>
        <Text style={styles.chipSelectorLabel}>Chip Value:</Text>
        <View style={styles.chipOptions}>
          {[5, 10, 25, 50, 100].map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.chipOption,
                chipValue === value && styles.chipOptionActive,
                value > remainingChips && styles.chipValueDisabled,
              ]}
              onPress={() => setChipValue(value)}
              disabled={value > remainingChips}
            >
              <Text style={[
                styles.chipOptionValueText,
                chipValue === value && styles.chipOptionTextActive,
              ]}>
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Info */}
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>Total Bet: {Array.from(bets.values()).reduce((sum, bet) => sum + bet.amount, 0)}</Text>
        <Text style={styles.infoText}>Bets Placed: {bets.size}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.clearButton]}
          onPress={clearBets}
          disabled={spinning || bets.size === 0}
        >
          <Text style={styles.controlButtonText}>Clear Bets</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.spinButton, spinning && styles.disabledButton]}
          onPress={spin}
          disabled={spinning || bets.size === 0}
        >
          <Text style={styles.controlButtonText}>
            {spinning ? 'SPINNING...' : 'SPIN'}
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
    padding: 16,
  },
  detailedWheelContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  spinningText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 15,
    textAlign: 'center',
  },
  wheelFrame: {
    padding: 10,
    backgroundColor: '#78350f',
    borderRadius: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 15,
  },
  wheelOuter: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#92400e',
    borderWidth: 8,
    borderColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  wheelInner: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#065f46',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wheelSegment: {
    position: 'absolute',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberPocket: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  pocketNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  wheelCenter: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  wheelCenterText: {
    fontSize: 24,
  },
  spinningBall: {
    position: 'absolute',
    width: 240,
    height: 240,
  },
  ballOrbit: {
    position: 'absolute',
    top: 10,
    left: '50%',
    marginLeft: -6,
  },
  ballVisual: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  simpleWheelContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
  },
  lastResultDisplay: {
    alignItems: 'center',
  },
  lastResultLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 10,
  },
  resultBall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  resultNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  readyToSpin: {
    alignItems: 'center',
  },
  readyText: {
    fontSize: 48,
    marginBottom: 8,
  },
  readyLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  rouletteTable: {
    backgroundColor: '#065f46',
    borderRadius: 12,
    padding: 12,
    borderWidth: 3,
    borderColor: '#fbbf24',
  },
  zeroCell: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  zeroText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  numberGrid: {
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  numberCell: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  numberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  columnCell: {
    width: 50,
    height: 50,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  sideText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bottomBets: {
    marginTop: 8,
  },
  dozenRow: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 4,
  },
  dozenCell: {
    flex: 1,
    height: 50,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  evenMoneyRow: {
    flexDirection: 'row',
    gap: 4,
  },
  evenMoneyCell: {
    flex: 1,
    height: 50,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  bottomText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  whiteText: {
    color: '#ffffff',
  },
  winningCell: {
    borderColor: '#fbbf24',
    borderWidth: 4,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  betPlacedCell: {
    opacity: 0.9,
  },
  chipIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#fbbf24',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  chipAmount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  chipSelector: {
    marginTop: 20,
    marginBottom: 12,
  },
  chipSelectorLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  chipOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  chipOption: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#334155',
  },
  chipOptionActive: {
    backgroundColor: '#fbbf24',
    borderColor: '#f59e0b',
  },
  chipValueDisabled: {
    opacity: 0.4,
  },
  chipOptionValueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  chipOptionTextActive: {
    color: '#1f2937',
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
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
