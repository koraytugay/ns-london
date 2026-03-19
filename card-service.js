/**
 * Card Service - Handles card creation, display, and management
 */
class CardService {
    constructor() {
        this.allCardsData = [];
        this.revealedCount = 0;
        this.pinkCardsRevealed = 0;
        this.history = [];
    }

    // Create and shuffle card data
    createCards() {
        const cards = [
            { shape: 'square', bg: 'pink-bg' },
            { shape: 'square', bg: 'lightblue-bg' },
            { shape: 'circle', bg: 'pink-bg' },
            { shape: 'circle', bg: 'lightblue-bg' },
            { shape: 'triangle', bg: 'pink-bg' },
            { shape: 'triangle', bg: 'lightblue-bg' },
            { shape: 'pentagon', bg: 'pink-bg' },
            { shape: 'pentagon', bg: 'lightblue-bg' },
            { shape: 'wild', bg: 'pink-bg' },
            { shape: 'wild', bg: 'lightblue-bg' },
            { shape: 'branch', bg: 'branch-bg' }
        ];

        cards.sort(() => Math.random() - 0.5);
        this.allCardsData = cards;
        this.revealedCount = 0;
        this.pinkCardsRevealed = 0;
        this.history = [];
    }

    // Get next card
    getNextCard() {
        if (this.revealedCount >= this.allCardsData.length) {
            return null;
        }
        const card = this.allCardsData[this.revealedCount];
        this.revealedCount++;

        if (card.bg === 'pink-bg') {
            this.pinkCardsRevealed++;
        }

        return card;
    }

    // Get remaining cards (for AI lookahead)
    getRemainingCards() {
        return this.allCardsData.slice(this.revealedCount).map(c => c.shape);
    }

    // Show one or more cards in large overlay
    showCardsInCenter(cards) {
        const cardOverlay = document.getElementById('cardOverlay');
        const centerDisplay = document.getElementById('centerCardDisplay');

        // Ensure cards is an array
        const cardsToDisplay = Array.isArray(cards) ? cards : [cards];

        // Clear current display
        centerDisplay.innerHTML = '';
        
        // Add cards
        cardsToDisplay.forEach(cardData => {
            const card = this.createCardElement(cardData, 'large');
            card.classList.add('center-card');
            centerDisplay.appendChild(card);
        });

        // Populate history in the bottom section
        this.updateHistoryDisplay();

        cardOverlay.style.display = 'flex';
    }

    // New helper to update history display in overlay
    updateHistoryDisplay() {
        const historyArea = document.getElementById('historyCardsArea');
        if (!historyArea) return;
        
        historyArea.innerHTML = '';
        
        if (!this.history) this.history = [];
        
        this.history.forEach(cardData => {
            const sideCard = this.createSideCard(cardData);
            historyArea.appendChild(sideCard);
        });
        
        // Scroll to end of history
        setTimeout(() => {
            historyArea.scrollLeft = historyArea.scrollWidth;
        }, 0);
    }

    // Create a card DOM element
    createCardElement(cardData, size = 'normal') {
        const card = document.createElement('div');
        const scale = size === 'large' ? 1.8 : 1;

        let accentColor = '#333';
        if (cardData.bg === 'pink-bg') accentColor = 'rgb(210, 50, 110)';
        else if (cardData.bg === 'blue-bg' || cardData.bg === 'lightblue-bg') accentColor = 'rgb(40, 150, 210)';
        else if (cardData.bg === 'branch-bg') accentColor = '#2c3e50';

        card.style.cssText = `
            width: ${130 * scale}px;
            height: ${90 * scale}px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #eee;
            border-top: 6px solid ${accentColor};
        `;

        this.drawCardShape(card, cardData.shape, cardData.bg, scale, accentColor);

        return card;
    }

    // Draw shape on card (SVG)
    drawCardShape(cardFront, shape, bgClass, scale = 1, color = '#333') {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');

        const isSmall = scale < 1;
        const width = isSmall ? 50 : 130 * scale;
        const height = isSmall ? 50 : 90 * scale;

        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';

        const centerX = width / 2;
        const centerY = height / 2;
        const size = isSmall ? 12 : 24 * scale;

        let shapeElement;

        if (shape === 'square') {
            shapeElement = document.createElementNS(svgNS, 'rect');
            shapeElement.setAttribute('x', centerX - size);
            shapeElement.setAttribute('y', centerY - size);
            shapeElement.setAttribute('width', size * 2);
            shapeElement.setAttribute('height', size * 2);
            shapeElement.setAttribute('rx', '4');
            shapeElement.setAttribute('fill', color);
        } else if (shape === 'circle') {
            shapeElement = document.createElementNS(svgNS, 'circle');
            shapeElement.setAttribute('cx', centerX);
            shapeElement.setAttribute('cy', centerY);
            shapeElement.setAttribute('r', size);
            shapeElement.setAttribute('fill', color);
        } else if (shape === 'triangle') {
            shapeElement = document.createElementNS(svgNS, 'polygon');
            const points = `${centerX},${centerY - size} ${centerX - size * 1.1},${centerY + size * 0.8} ${centerX + size * 1.1},${centerY + size * 0.8}`;
            shapeElement.setAttribute('points', points);
            shapeElement.setAttribute('fill', color);
        } else if (shape === 'pentagon') {
            shapeElement = document.createElementNS(svgNS, 'polygon');
            const points = [];
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                points.push(`${centerX + size * 1.2 * Math.cos(angle)},${centerY + size * 1.2 * Math.sin(angle)}`);
            }
            shapeElement.setAttribute('points', points.join(' '));
            shapeElement.setAttribute('fill', color);
        } else if (shape === 'wild' || shape === 'branch') {
            shapeElement = document.createElementNS(svgNS, 'text');
            shapeElement.setAttribute('x', centerX);
            shapeElement.setAttribute('y', centerY);
            shapeElement.setAttribute('text-anchor', 'middle');
            shapeElement.setAttribute('dominant-baseline', 'central');
            
            if (shape === 'wild') {
                shapeElement.setAttribute('font-size', (isSmall ? 28 : 60 * scale) + 'px');
                shapeElement.setAttribute('font-weight', '900');
                shapeElement.textContent = '?';
            } else {
                shapeElement.setAttribute('font-size', (isSmall ? 24 : 50 * scale) + 'px');
                shapeElement.textContent = '🍴';
            }
            shapeElement.setAttribute('fill', color);
        }

        if (shapeElement) {
            svg.appendChild(shapeElement);
        }
        cardFront.appendChild(svg);
    }

    // Move current cards to history and hide overlay
    moveCardsToSide(currentRevealedCard, branchCard = null) {
        if (!this.history) this.history = [];

        // Add to persistent history
        if (branchCard) {
            this.history.push(branchCard);
        }
        this.history.push(currentRevealedCard);

        // Hide overlay
        document.getElementById('cardOverlay').style.display = 'none';
    }

    // Create a side card element
    createSideCard(cardData) {
        let accentColor = '#333';
        if (cardData.bg === 'pink-bg') accentColor = 'rgb(210, 50, 110)';
        else if (cardData.bg === 'blue-bg' || cardData.bg === 'lightblue-bg') accentColor = 'rgb(40, 150, 210)';
        else if (cardData.bg === 'branch-bg') accentColor = '#2c3e50';

        const card = document.createElement('div');
        card.style.cssText = `
            width: 50px;
            height: 50px;
            flex-shrink: 0;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.06);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #eee;
            border-bottom: 4px solid ${accentColor};
        `;

        this.drawCardShape(card, cardData.shape, cardData.bg, 0.4, accentColor);

        return card;
    }

    // Clear revealed cards (reset history)
    clearRevealedCards() {
        this.history = [];
        const historyArea = document.getElementById('historyCardsArea');
        if (historyArea) historyArea.innerHTML = '';
    }

    // Reset counters
    reset() {
        this.pinkCardsRevealed = 0;
        this.history = [];
    }
}
