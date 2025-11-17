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

// Card types
type Suit = '♠️' | '♥️' | '♦️' | '♣️';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

interface Player {
  id: string;
  name: string;
  chips: number;
  cards: Card[];
  folded: boolean;
  currentBet: number;
  isDealer: boolean;
}

type GamePhase = 'betting' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown' | 'ended';

export default function PokerGameScreen({ navigation, route }: any) {
  const { userPoints, onPointsChange } = route.params;
  const [gamePhase, setGamePhase] = useState<GamePhase>('betting');
  const [pot, setPot] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [playerBet, setPlayerBet] = useState(50);
  const [players, setPlayers] = useState<Player[]>([]);
  const [communityCards, setCommunityCards] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [message, setMessage] = useState('Place your bet to start');
  const [canCheck, setCanCheck] = useState(false);

  // Create a deck of cards
  const createDeck = (): Card[] => {
    const suits: Suit[] = ['♠️', '♥️', '♦️', '♣️'];
    const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck: Card[] = [];

    for (const suit of suits) {
      for (let i = 0; i < ranks.length; i++) {
        const rank = ranks[i];
        let value = i + 1;
        if (rank === 'A') value = 14; // Ace high
        if (rank === 'J') value = 11;
        if (rank === 'Q') value = 12;
        if (rank === 'K') value = 13;
        
        deck.push({ suit, rank, value });
      }
    }

    // Shuffle
    return deck.sort(() => Math.random() - 0.5);
  };

  // Initialize game
  useEffect(() => {
    const initialPlayers: Player[] = [
      { id: 'player', name: 'You', chips: userPoints, cards: [], folded: false, currentBet: 0, isDealer: true },
      { id: 'ai1', name: 'CPU 1', chips: 500, cards: [], folded: false, currentBet: 0, isDealer: false },
      { id: 'ai2', name: 'CPU 2', chips: 800, cards: [], folded: false, currentBet: 0, isDealer: false },
      { id: 'ai3', name: 'CPU 3', chips: 600, cards: [], folded: false, currentBet: 0, isDealer: false },
    ];
    setPlayers(initialPlayers);
  }, []);

  const startGame = () => {
    if (playerBet > userPoints) {
      Alert.alert('Insufficient Points', 'You don\'t have enough points');
      return;
    }

    const newDeck = createDeck();
    const hands: Card[][] = [[], [], [], []];
    
    // Deal 2 cards to each player
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        hands[j].push(newDeck.pop()!);
      }
    }

    setPlayerHand(hands[0]);
    setDeck(newDeck);
    setPot(playerBet * 4); // All players match the bet
    setCurrentBet(playerBet);
    setGamePhase('preflop');
    setMessage('Check your cards. Call, Raise, or Fold?');
    setCanCheck(true);

    // Update players with cards and bets
    const updatedPlayers = players.map((player, index) => ({
      ...player,
      cards: hands[index],
      currentBet: playerBet,
      chips: player.chips - playerBet,
    }));
    setPlayers(updatedPlayers);
  };

  const dealFlop = () => {
    const newCommunityCards = [deck.pop()!, deck.pop()!, deck.pop()!];
    setCommunityCards(newCommunityCards);
    setGamePhase('flop');
    setMessage('The Flop has been dealt');
    setTimeout(() => aiTurn(), 1000);
  };

  const dealTurn = () => {
    setCommunityCards([...communityCards, deck.pop()!]);
    setGamePhase('turn');
    setMessage('The Turn has been dealt');
    setTimeout(() => aiTurn(), 1000);
  };

  const dealRiver = () => {
    setCommunityCards([...communityCards, deck.pop()!]);
    setGamePhase('river');
    setMessage('The River has been dealt');
    setTimeout(() => aiTurn(), 1000);
  };

  const aiTurn = () => {
    // Simple AI logic: 50% call, 30% raise, 20% fold
    const rand = Math.random();
    
    if (rand < 0.2) {
      setMessage('AI players folded');
    } else if (rand < 0.5) {
      setMessage('AI players called');
    } else {
      const raise = Math.floor(Math.random() * 50) + 25;
      setCurrentBet(currentBet + raise);
      setPot(pot + raise * 3);
      setMessage(`AI raised by ${raise} points!`);
    }
  };

  const handleCall = () => {
    if (players[0].chips < currentBet - players[0].currentBet) {
      Alert.alert('Insufficient Points', 'Not enough points to call');
      return;
    }

    const callAmount = currentBet - players[0].currentBet;
    setPot(pot + callAmount);
    
    const updatedPlayers = [...players];
    updatedPlayers[0].chips -= callAmount;
    updatedPlayers[0].currentBet = currentBet;
    setPlayers(updatedPlayers);

    nextPhase();
  };

  const handleRaise = () => {
    const raiseAmount = 50;
    if (players[0].chips < raiseAmount + currentBet - players[0].currentBet) {
      Alert.alert('Insufficient Points', 'Not enough points to raise');
      return;
    }

    const totalAmount = raiseAmount + currentBet - players[0].currentBet;
    setPot(pot + totalAmount);
    setCurrentBet(currentBet + raiseAmount);
    
    const updatedPlayers = [...players];
    updatedPlayers[0].chips -= totalAmount;
    updatedPlayers[0].currentBet = currentBet + raiseAmount;
    setPlayers(updatedPlayers);

    setMessage(`You raised by ${raiseAmount} points!`);
    setTimeout(() => nextPhase(), 1500);
  };

  const handleCheck = () => {
    if (!canCheck || players[0].currentBet < currentBet) {
      Alert.alert('Cannot Check', 'You must call or raise');
      return;
    }
    setMessage('You checked');
    setTimeout(() => nextPhase(), 1000);
  };

  const handleFold = () => {
    Alert.alert(
      'Fold Hand?',
      'Are you sure you want to fold? You\'ll lose your bet.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Fold',
          style: 'destructive',
          onPress: () => {
            setMessage('You folded. Better luck next time!');
            setGamePhase('ended');
            setTimeout(() => navigation.goBack(), 2000);
          },
        },
      ]
    );
  };

  const nextPhase = () => {
    if (gamePhase === 'preflop') {
      dealFlop();
    } else if (gamePhase === 'flop') {
      dealTurn();
    } else if (gamePhase === 'turn') {
      dealRiver();
    } else if (gamePhase === 'river') {
      showdown();
    }
  };

  const evaluateHand = (hand: Card[], community: Card[]): number => {
    // Simple hand evaluation (high card value)
    const allCards = [...hand, ...community];
    const values = allCards.map(c => c.value).sort((a, b) => b - a);
    
    // Check for pairs, flush, straight, etc.
    const ranks = values.slice(0, 5);
    const suits = allCards.map(c => c.suit);
    
    // Flush check
    const suitCounts = suits.reduce((acc, suit) => {
      acc[suit] = (acc[suit] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const hasFlush = Object.values(suitCounts).some(count => count >= 5);
    
    // Pair check
    const rankCounts = values.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    const pairs = Object.values(rankCounts).filter(count => count === 2).length;
    const threeOfKind = Object.values(rankCounts).some(count => count === 3);
    const fourOfKind = Object.values(rankCounts).some(count => count === 4);
    
    // Scoring
    let score = ranks.reduce((sum, val) => sum + val, 0);
    if (fourOfKind) score += 10000;
    else if (threeOfKind && pairs) score += 7000; // Full house
    else if (hasFlush) score += 6000;
    else if (threeOfKind) score += 4000;
    else if (pairs >= 2) score += 3000; // Two pair
    else if (pairs === 1) score += 2000; // One pair
    
    return score;
  };

  const showdown = () => {
    setGamePhase('showdown');
    setMessage('Showdown! Revealing hands...');

    setTimeout(() => {
      const playerScore = evaluateHand(playerHand, communityCards);
      
      // AI scores (randomized but slightly lower)
      const aiScores = [
        evaluateHand(players[1].cards, communityCards) * 0.8,
        evaluateHand(players[2].cards, communityCards) * 0.85,
        evaluateHand(players[3].cards, communityCards) * 0.9,
      ];

      const maxAiScore = Math.max(...aiScores);
      
      if (playerScore > maxAiScore) {
        setMessage(`🎉 You WIN ${pot} points!`);
        onPointsChange(players[0].chips + pot);
        
        setTimeout(() => {
          Alert.alert(
            '🏆 Winner!',
            `Congratulations! You won ${pot} points!\n\nYour hand was the best!`,
            [
              { text: 'Play Again', onPress: () => navigation.goBack() },
              { text: 'Leave Table', onPress: () => navigation.goBack() },
            ]
          );
        }, 1500);
      } else {
        setMessage('😔 You Lost. CPU won this round');
        onPointsChange(players[0].chips);
        
        setTimeout(() => {
          Alert.alert(
            'Better Luck Next Time',
            `The pot of ${pot} points went to the CPU.\n\nTry again!`,
            [
              { text: 'Play Again', onPress: () => navigation.goBack() },
              { text: 'Leave Table', onPress: () => navigation.goBack() },
            ]
          );
        }, 1500);
      }
      
      setGamePhase('ended');
    }, 2000);
  };

  const renderCard = (card: Card, index: number) => {
    const isRed = card.suit === '♥️' || card.suit === '♦️';
    return (
      <View key={index} style={styles.card}>
        <Text style={[styles.cardText, isRed && styles.redCard]}>
          {card.rank}{card.suit}
        </Text>
      </View>
    );
  };

  const renderBackCard = (index: number) => (
    <View key={index} style={[styles.card, styles.cardBack]}>
      <Text style={styles.cardBackText}>🃏</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Texas Hold'em Poker</Text>
        <View style={styles.chipsDisplay}>
          <Coins color="#f59e0b" size={20} />
          <Text style={styles.chipsText}>{players[0]?.chips || userPoints}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Opponent Players */}
        <View style={styles.opponentsSection}>
          {players.slice(1).map((player, idx) => (
            <View key={player.id} style={styles.opponentCard}>
              <Text style={styles.opponentName}>{player.name}</Text>
              <View style={styles.opponentCards}>
                {gamePhase === 'showdown' ? (
                  player.cards.map((card, i) => renderCard(card, i))
                ) : (
                  <>
                    {renderBackCard(0)}
                    {renderBackCard(1)}
                  </>
                )}
              </View>
              <Text style={styles.opponentChips}>{player.chips} pts</Text>
            </View>
          ))}
        </View>

        {/* Pot and Message */}
        <View style={styles.centerSection}>
          <View style={styles.potContainer}>
            <Text style={styles.potLabel}>POT</Text>
            <Text style={styles.potAmount}>{pot}</Text>
            <Text style={styles.potPoints}>points</Text>
          </View>
          <Text style={styles.message}>{message}</Text>
        </View>

        {/* Community Cards */}
        {communityCards.length > 0 && (
          <View style={styles.communitySection}>
            <Text style={styles.communityLabel}>Community Cards</Text>
            <View style={styles.communityCards}>
              {communityCards.map((card, index) => renderCard(card, index))}
            </View>
          </View>
        )}

        {/* Player Hand */}
        <View style={styles.playerSection}>
          <Text style={styles.playerLabel}>Your Hand</Text>
          <View style={styles.playerCards}>
            {playerHand.length > 0 ? (
              playerHand.map((card, index) => renderCard(card, index))
            ) : (
              <>
                {renderBackCard(0)}
                {renderBackCard(1)}
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        {gamePhase === 'betting' && (
          <>
            <View style={styles.betControls}>
              <TouchableOpacity
                style={styles.betButton}
                onPress={() => setPlayerBet(Math.max(25, playerBet - 25))}
              >
                <Text style={styles.betButtonText}>-</Text>
              </TouchableOpacity>
              <View style={styles.betDisplay}>
                <Text style={styles.betAmount}>{playerBet}</Text>
                <Text style={styles.betLabel}>points</Text>
              </View>
              <TouchableOpacity
                style={styles.betButton}
                onPress={() => setPlayerBet(Math.min(userPoints, playerBet + 25))}
              >
                <Text style={styles.betButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>Start Game</Text>
            </TouchableOpacity>
          </>
        )}

        {(gamePhase === 'preflop' || gamePhase === 'flop' || gamePhase === 'turn' || gamePhase === 'river') && (
          <View style={styles.gameActions}>
            <TouchableOpacity style={styles.foldButton} onPress={handleFold}>
              <Text style={styles.foldButtonText}>Fold</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.checkButton, !canCheck && styles.disabledButton]} 
              onPress={handleCheck}
              disabled={!canCheck}
            >
              <Text style={styles.checkButtonText}>Check</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.raiseButton} onPress={handleRaise}>
              <Text style={styles.raiseButtonText}>Raise</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    paddingTop: 48,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
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
    gap: 4,
  },
  chipsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
  },
  content: {
    flex: 1,
  },
  opponentsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  opponentCard: {
    alignItems: 'center',
  },
  opponentName: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  opponentCards: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  opponentChips: {
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: '600',
  },
  centerSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  potContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f59e0b',
    minWidth: 150,
  },
  potLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  potAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginVertical: 4,
  },
  potPoints: {
    fontSize: 12,
    color: '#94a3b8',
  },
  message: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  communitySection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  communityLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 12,
    fontWeight: '600',
  },
  communityCards: {
    flexDirection: 'row',
    gap: 8,
  },
  playerSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  playerLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 12,
    fontWeight: '600',
  },
  playerCards: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    width: 50,
    height: 70,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardBack: {
    backgroundColor: '#ef4444',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  redCard: {
    color: '#ef4444',
  },
  cardBackText: {
    fontSize: 24,
  },
  actionSection: {
    padding: 16,
    backgroundColor: '#1e293b',
  },
  betControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 20,
  },
  betButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  betButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  betDisplay: {
    alignItems: 'center',
  },
  betAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  betLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  startButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameActions: {
    flexDirection: 'row',
    gap: 8,
  },
  foldButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  foldButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkButton: {
    flex: 1,
    backgroundColor: '#64748b',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  callButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  raiseButton: {
    flex: 1,
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  raiseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
