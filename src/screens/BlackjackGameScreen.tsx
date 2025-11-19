import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { ArrowLeft, Coins } from 'lucide-react-native';

type Suit = '♠️' | '♥️' | '♦️' | '♣️';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

export default function BlackjackGameScreen({ navigation, route }: any) {
  const { userPoints, onPointsChange } = route.params;
  const [gameChips, setGameChips] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [remainingChips, setRemainingChips] = useState(0);
  const [currentBet, setCurrentBet] = useState(20);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [gamePhase, setGamePhase] = useState<'betting' | 'playing' | 'ended'>('betting');
  const [message, setMessage] = useState('Place your bet');

  const MIN_CHIPS = 20;
  const MIN_BET = 20;

  const createDeck = (): Card[] => {
    const suits: Suit[] = ['♠️', '♥️', '♦️', '♣️'];
    const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck: Card[] = [];

    for (const suit of suits) {
      for (let i = 0; i < ranks.length; i++) {
        const rank = ranks[i];
        let value = i + 1;
        if (rank === 'J' || rank === 'Q' || rank === 'K') value = 10;
        if (rank === 'A') value = 11; // Aces start as 11
        
        newDeck.push({ suit, rank, value });
      }
    }

    return newDeck.sort(() => Math.random() - 0.5);
  };

  const calculateHandValue = (hand: Card[]): number => {
    let value = hand.reduce((sum, card) => sum + card.value, 0);
    let aces = hand.filter(card => card.rank === 'A').length;

    // Adjust for aces if bust
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  };

  const startGame = () => {
    if (gameChips < MIN_CHIPS) {
      Alert.alert('Insufficient Chips', `You need at least ${MIN_CHIPS} chips to play`);
      return;
    }
    setGameStarted(true);
    setRemainingChips(gameChips);
    setGamePhase('betting');
    setCurrentBet(Math.min(MIN_BET, gameChips));
  };

  const dealCards = () => {
    if (currentBet > remainingChips) {
      Alert.alert('Insufficient Chips', 'Not enough chips for this bet');
      return;
    }

    const newDeck = createDeck();
    const player = [newDeck.pop()!, newDeck.pop()!];
    const dealer = [newDeck.pop()!, newDeck.pop()!];

    setPlayerHand(player);
    setDealerHand(dealer);
    setDeck(newDeck);
    setRemainingChips(remainingChips - currentBet);
    setGamePhase('playing');

    const playerValue = calculateHandValue(player);
    if (playerValue === 21) {
      checkWinner(player, dealer, newDeck);
    } else {
      setMessage('Hit or Stand?');
    }
  };

  const hit = () => {
    const newCard = deck.pop()!;
    const newPlayerHand = [...playerHand, newCard];
    setPlayerHand(newPlayerHand);
    setDeck([...deck]);

    const value = calculateHandValue(newPlayerHand);
    if (value > 21) {
      endGame(newPlayerHand, dealerHand, 'bust');
    } else if (value === 21) {
      stand(newPlayerHand);
    }
  };

  const stand = (hand: Card[] = playerHand) => {
    let newDealerHand = [...dealerHand];
    let newDeck = [...deck];

    // Dealer draws until 17 or higher
    while (calculateHandValue(newDealerHand) < 17) {
      newDealerHand.push(newDeck.pop()!);
    }

    setDealerHand(newDealerHand);
    setDeck(newDeck);
    checkWinner(hand, newDealerHand, newDeck);
  };

  const checkWinner = (playerCards: Card[], dealerCards: Card[], remainingDeck: Card[]) => {
    const playerValue = calculateHandValue(playerCards);
    const dealerValue = calculateHandValue(dealerCards);

    if (playerValue > 21) {
      endGame(playerCards, dealerCards, 'bust');
    } else if (dealerValue > 21) {
      endGame(playerCards, dealerCards, 'dealer-bust');
    } else if (playerValue > dealerValue) {
      endGame(playerCards, dealerCards, 'win');
    } else if (playerValue < dealerValue) {
      endGame(playerCards, dealerCards, 'lose');
    } else {
      endGame(playerCards, dealerCards, 'push');
    }
  };

  const endGame = (playerCards: Card[], dealerCards: Card[], result: string) => {
    setGamePhase('ended');
    
    let winnings = 0;
    let resultMessage = '';

    switch (result) {
      case 'win':
        winnings = currentBet * 2;
        resultMessage = `You win! ${currentBet * 2} chips`;
        break;
      case 'dealer-bust':
        winnings = currentBet * 2;
        resultMessage = `Dealer busts! You win ${currentBet * 2} chips`;
        break;
      case 'push':
        winnings = currentBet;
        resultMessage = 'Push! Bet returned';
        break;
      case 'lose':
        winnings = 0;
        resultMessage = `You lose ${currentBet} chips`;
        break;
      case 'bust':
        winnings = 0;
        resultMessage = `Bust! You lose ${currentBet} chips`;
        break;
    }

    const newChips = remainingChips + winnings;
    setRemainingChips(newChips);

    const playerValue = calculateHandValue(playerCards);
    const dealerValue = calculateHandValue(dealerCards);

    setTimeout(() => {
      Alert.alert(
        resultMessage,
        `Your hand: ${playerValue}\nDealer hand: ${dealerValue}\n\nRemaining chips: ${newChips}`,
        newChips >= MIN_BET
          ? [
              { text: 'Play Again', onPress: resetRound },
              {
                text: 'Leave Table',
                onPress: () => {
                  const totalPointsChange = userPoints - gameChips + newChips;
                  onPointsChange(totalPointsChange);
                  navigation.goBack();
                },
              },
            ]
          : [
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
    }, 500);
  };

  const resetRound = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setDeck([]);
    setGamePhase('betting');
    setMessage('Place your bet');
    setCurrentBet(Math.min(MIN_BET, remainingChips));
  };

  const renderCard = (card: Card, hidden: boolean = false) => {
    if (hidden) {
      return (
        <View style={[styles.card, styles.cardHidden]}>
          <Text style={styles.cardBack}>🂠</Text>
        </View>
      );
    }

    const isRed = card.suit === '♥️' || card.suit === '♦️';
    return (
      <View style={styles.card}>
        <Text style={[styles.cardText, isRed && styles.cardTextRed]}>
          {card.rank}
          {card.suit}
        </Text>
      </View>
    );
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
      <View style={styles.dealerSection}>
        <Text style={styles.sectionTitle}>
          Dealer {gamePhase !== 'betting' && `(${calculateHandValue(dealerHand)})`}
        </Text>
        <View style={styles.handContainer}>
          {dealerHand.map((card, index) => (
            <View key={index}>
              {renderCard(card, gamePhase === 'playing' && index === 1)}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.playerSection}>
        <Text style={styles.sectionTitle}>
          You {gamePhase !== 'betting' && `(${calculateHandValue(playerHand)})`}
        </Text>
        <View style={styles.handContainer}>
          {playerHand.map((card, index) => (
            <View key={index}>{renderCard(card)}</View>
          ))}
        </View>
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{message}</Text>
      </View>

      {gamePhase === 'betting' && (
        <View style={styles.bettingControls}>
          <Text style={styles.betLabel}>Bet Amount</Text>
          <View style={styles.betControls}>
            <TouchableOpacity
              style={styles.betButton}
              onPress={() => setCurrentBet(Math.max(MIN_BET, currentBet - 10))}
            >
              <Text style={styles.betButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.betDisplay}>
              <Text style={styles.betAmount}>{currentBet}</Text>
            </View>
            <TouchableOpacity
              style={styles.betButton}
              onPress={() => setCurrentBet(Math.min(remainingChips, currentBet + 10))}
            >
              <Text style={styles.betButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.dealButton} onPress={dealCards}>
            <Text style={styles.dealButtonText}>Deal Cards</Text>
          </TouchableOpacity>
        </View>
      )}

      {gamePhase === 'playing' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.hitButton} onPress={hit}>
            <Text style={styles.actionButtonText}>HIT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.standButton} onPress={() => stand()}>
            <Text style={styles.actionButtonText}>STAND</Text>
          </TouchableOpacity>
        </View>
      )}
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
        <Text style={styles.headerTitle}>🎴 Blackjack</Text>
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
  dealerSection: {
    marginBottom: 40,
  },
  playerSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  handContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    width: 60,
    height: 90,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  cardHidden: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardTextRed: {
    color: '#ef4444',
  },
  cardBack: {
    fontSize: 36,
    color: '#60a5fa',
  },
  messageContainer: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  messageText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
  bettingControls: {
    alignItems: 'center',
  },
  betLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 12,
  },
  betControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,
  },
  betButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  betButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  betDisplay: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  betAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  dealButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
  },
  dealButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  hitButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  standButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
