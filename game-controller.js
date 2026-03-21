/**
 * Game Controller - Main controller coordinating all services
 */
class GameController {
    constructor() {
        this.renderService = new RenderService();
        this.cardService = new CardService();
        this.gameService = new GameService(this.renderService);

        // State machine
        this.GameState = {
            WAITING_FOR_CARD: 'waiting',
            CARD_SHOWN: 'card_shown',
            GAME_OVER: 'game_over'
        };

        this.currentGameState = this.GameState.WAITING_FOR_CARD;
        this.currentRevealedCard = null;
        this.branchCard = null;
        this.needsRoundTransition = false;
        this.isAnimating = false;
    }

    // Initialize the game
    initialize() {
        // Render the grid
        this.renderService.render();

        // Create cards
        this.cardService.createCards();

        // Initialize game state
        this.gameService.initialize();

        // Setup event listeners
        this.setupEventListeners();

        console.log('Game initialized. Press Enter to start.');
        this.revealCard();
    }

    // Setup event listeners
    setupEventListeners() {
        // Enter key handler
        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter') return;

            // Block input during animation
            if (this.isAnimating) {
                console.log('Animation in progress, please wait...');
                return;
            }

            // Handle round transition
            if (this.needsRoundTransition) {
                this.handleRoundTransition();
                return;
            }

            // State machine
            this.handleEnterKey();
        });
    }

    // Handle Enter key based on current state
    handleEnterKey() {
        if (this.currentGameState === this.GameState.WAITING_FOR_CARD) {
            this.revealCard();
        } else if (this.currentGameState === this.GameState.CARD_SHOWN) {
            this.executeCardAction();
        }
    }

    // Reveal a card
    revealCard() {
        // Block input immediately
        this.isAnimating = true;

        const cardData = this.cardService.getNextCard();
        if (!cardData) {
            console.log('No more cards');
            this.isAnimating = false;
            return;
        }

        if (cardData.shape === 'branch') {
            this.branchCard = cardData;

            const nextCardData = this.cardService.getNextCard();
            if (!nextCardData) {
                console.log('No more cards for branch');
                this.currentRevealedCard = cardData;
                this.cardService.showCardsInCenter([cardData]);
                this.currentGameState = this.GameState.CARD_SHOWN;
                this.isAnimating = false;
                return;
            }

            // Show both cards in center immediately
            this.cardService.showCardsInCenter([cardData, nextCardData]);
            this.currentRevealedCard = nextCardData;
        } else {
            this.currentRevealedCard = cardData;
            this.cardService.showCardsInCenter([cardData]);
        }

        // AI starts thinking immediately while card is shown
        const aiMsg = document.getElementById('aiMessage');
        aiMsg.textContent = 'AI thinking...';
        aiMsg.style.display = 'block';
        aiMsg.style.background = '#fff3cd';
        aiMsg.style.color = '#856404';

        // Brief timeout to let UI show the card before heavy calculation
        setTimeout(() => {
            const isBranch = this.branchCard !== null;
            const card = this.currentRevealedCard.shape;
            const remainingCards = this.cardService.getRemainingCards();

            this.gameService.playTurnWithCard(card, remainingCards, isBranch);

            // Change message when AI is done
            aiMsg.textContent = 'AI Ready';
            aiMsg.style.background = '#d4edda';
            aiMsg.style.color = '#155724';

            this.currentGameState = this.GameState.CARD_SHOWN;
            // UNBLOCK INPUT now that AI is ready
            this.isAnimating = false;
        }, 50);
    }

    // Execute card action (move to side, draw path)
    executeCardAction() {
        this.isAnimating = true;

        // Hide AI message
        const aiMsg = document.getElementById('aiMessage');
        aiMsg.style.display = 'none';

        // Move cards to side (include branch card if present)
        this.cardService.moveCardsToSide(this.currentRevealedCard, this.branchCard);

        if (this.gameService.pendingMove) {
            this.gameService.executePendingMoveAnimated(
                this.cardService.pinkCardsRevealed,
                () => this.onRoundComplete(),
                () => this.onGameComplete(),
                () => {
                    this.isAnimating = false;
                    this.branchCard = null;
                    if (this.currentGameState !== this.GameState.GAME_OVER) {
                        this.currentGameState = this.GameState.WAITING_FOR_CARD;
                    }
                }
            );
        } else {
            console.log('No valid move available');
            this.isAnimating = false;

            // Check if round should end even with no move
            if (this.cardService.pinkCardsRevealed >= 5) {
                const lineScore = calculateLineScore(
                    this.gameService.currentState,
                    ALLOWED_PATHS,
                    this.gameService.nodeMap
                );
                this.gameService.linesResults.push({
                    score: lineScore,
                    visited: [...this.gameService.currentState.visitedNodesIds],
                    name: this.gameService.LINE_NAMES[this.gameService.currentLineIndex],
                    color: this.gameService.LINE_COLORS[this.gameService.currentLineIndex]
                });

                if (this.gameService.currentLineIndex < 3) {
                    this.onRoundComplete();
                } else {
                    this.renderLineScoring();
                    this.onGameComplete();
                }
            }

            this.branchCard = null;
            if (this.currentGameState !== this.GameState.GAME_OVER) {
                this.currentGameState = this.GameState.WAITING_FOR_CARD;
            }
        }
    }

    // Handle round completion
    onRoundComplete() {
        console.log('Round complete!');
        this.isAnimating = false;

        // Populate the scoring boxes for the finished line
        this.renderLineScoring();

        // Only show round complete transition if it's not the last line
        if (this.gameService.currentLineIndex < 3) {
            this.needsRoundTransition = true;

            // Show round complete in overlay
            const cardOverlay = document.getElementById('cardOverlay');
            const roundMsg = document.getElementById('roundCompleteMessage');
            const enterInstr = document.getElementById('enterInstruction');
            const centerDisplay = document.getElementById('centerCardDisplay');
            const aiMsg = document.getElementById('aiMessage');

            centerDisplay.innerHTML = ''; // Clear cards
            if (aiMsg) aiMsg.style.display = 'none';
            roundMsg.style.display = 'block';
            if (enterInstr) enterInstr.style.display = 'none';
            cardOverlay.style.display = 'flex';
        }
    }

    // Populate the scoring boxes for the finished line
    renderLineScoring() {
        const gameSvc = this.gameService;
        const result = gameSvc.linesResults[gameSvc.currentLineIndex];
        if (!result) return;

        const colorName = result.name.split(' ')[0].toLowerCase();

        const box1 = document.getElementById(`${colorName}-box-1`);
        const box2 = document.getElementById(`${colorName}-box-2`);
        const box3 = document.getElementById(`${colorName}-box-3`);
        const box4 = document.getElementById(`${colorName}-box-4`);

        if (box1 && box2 && box3 && box4) {
            box1.textContent = result.maxNodesInZone;
            box2.textContent = result.zonesVisited;
            box3.textContent = result.riverScore;
            box4.textContent = result.score;

            [box1, box2, box3, box4].forEach(b => {
                b.style.color = result.color;
            });
        }
    }

    // Handle game completion
    onGameComplete() {
        console.log(`Game Complete! All 4 lines finished.`);
        this.currentGameState = this.GameState.GAME_OVER;
        this.showFinalScoring();
    }

    // Handle round transition
    handleRoundTransition() {
        this.gameService.doRoundTransition();

        // Reset for new round
        this.cardService.reset();
        this.cardService.createCards();
        this.cardService.clearRevealedCards();

        // Hide round complete stuff
        document.getElementById('cardOverlay').style.display = 'none';
        document.getElementById('roundCompleteMessage').style.display = 'none';
        
        const enterInstr = document.getElementById('enterInstruction');
        if (enterInstr) enterInstr.style.display = 'block';

        this.needsRoundTransition = false;
        if (this.currentGameState !== this.GameState.GAME_OVER) {
            this.currentGameState = this.GameState.WAITING_FOR_CARD;
        }
    }

    // Show final scoring
    showFinalScoring() {
        const { grandTotal, baseTotal, bonus, hubs, touristScore } = this.gameService.calculateFinalScore();

        // Populate the Total Score Column
        const totalBox4 = document.getElementById('total-box-4');

        // baseTotal is the sum of pink, blue, purple, and green line scores
        if (totalBox4) totalBox4.textContent = baseTotal;

        // Populate sixth-box-1, 2, 3 with the number of nodes visited by 2, 3, 4 lines
        const sixthBox1 = document.getElementById('sixth-box-1');
        const sixthBox2 = document.getElementById('sixth-box-2');
        const sixthBox3 = document.getElementById('sixth-box-3');
        const sixthBox4 = document.getElementById('sixth-box-4');

        if (sixthBox1) sixthBox1.textContent = hubs[2];
        if (sixthBox2) sixthBox2.textContent = hubs[3];
        if (sixthBox3) sixthBox3.textContent = hubs[4];
        this.renderService.renderTouristNodeInto('sixth-box-4', touristScore);

        // Populate final-box-1, 2, 3 with the calculated score for hubs (2pts, 5pts, 9pts)
        const finalBox1 = document.querySelector('#final-box-1 .hub-circle');
        const finalBox2 = document.querySelector('#final-box-2 .hub-circle');
        const finalBox3 = document.querySelector('#final-box-3 .hub-circle');
        const finalBox4 = document.querySelector('#final-box-4 .hub-circle');

        const scoreHubs2 = hubs[2] * 2;
        const scoreHubs3 = hubs[3] * 5;
        const scoreHubs4 = hubs[4] * 9;

        if (finalBox1) finalBox1.textContent = scoreHubs2;
        if (finalBox2) finalBox2.textContent = scoreHubs3;
        if (finalBox3) finalBox3.textContent = scoreHubs4;

        // Populate final-box-4 with the sum of the hub scores
        if (finalBox4) finalBox4.textContent = scoreHubs2 + scoreHubs3 + scoreHubs4;

        // Populate grand-box-4 with the grand total
        const grandBox4 = document.getElementById('grand-box-4');
        if (grandBox4) grandBox4.textContent = grandTotal;

        console.log("Final Scoring Complete. Grand Total:", grandTotal);
    }}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const gameController = new GameController();
    gameController.initialize();
});
