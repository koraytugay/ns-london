/**
 * Game Service - Handles game state and logic
 */
class GameService {
    constructor(renderService) {
        this.renderService = renderService;

        // Game constants
        this.LINE_COLORS = ['rgb(210, 50, 110)', 'rgb(40, 150, 210)', 'rgb(110, 60, 140)', 'rgb(70, 170, 70)'];
        this.LINE_NAMES = ['Pink Line', 'Blue Line', 'Purple Line', 'Green Line'];
        this.START_NODES = [35, 13, 22, 38];

        // Game state
        this.currentLineIndex = 0;
        this.currentState = null;
        this.globalPaths = [];
        this.globalVisited = [];
        this.linesResults = [];
        this.nodeMap = new Map(NODES.map(n => [n.id, n]));
        this.pendingMove = null;
        this.globalTouristVisits = 0;
    }

    // Initialize game state
    initialize() {
        this.currentLineIndex = 0;
        this.currentState = {
            edgeNodesIds: [this.START_NODES[0], this.START_NODES[0]],
            pathsTaken: [],
            visitedNodesIds: [this.START_NODES[0]]
        };
        this.globalPaths = [];
        this.globalVisited = [this.START_NODES[0]];
        this.linesResults = [];
        this.pendingMove = null;
        this.globalTouristVisits = 0;
    }

    // Get blocked path IDs
    getBlockedPathIds(pathsTaken) {
        const blocked = new Set();
        pathsTaken.forEach(id => {
            const p = ALLOWED_PATHS.find(path => path.id === id);
            if (p && p.blocks) {
                p.blocks.forEach(bId => blocked.add(bId));
            }
        });
        return blocked;
    }

    // Play turn with revealed card
    playTurnWithCard(shape, remainingCards, isBranch) {
        if (!this.currentState) return;

        const lineColor = this.LINE_COLORS[this.currentLineIndex];

        console.log(`Playing turn for ${this.LINE_NAMES[this.currentLineIndex]}, card: ${shape}, branch: ${isBranch}`);

        const blocked = this.getBlockedPathIds(this.globalPaths);

        // Add already-taken paths and blocked paths to blocked set (including reverse directions)
        const allBlocked = new Set();

        // Add paths from blocks array (and their reverses)
        blocked.forEach(pathId => {
            allBlocked.add(pathId);
            const [start, end] = pathId.split('-');
            if (start && end) {
                allBlocked.add(`${end}-${start}`);
            }
        });

        // Add already-taken paths (and their reverses)
        this.globalPaths.forEach(pathId => {
            allBlocked.add(pathId);
            const path = ALLOWED_PATHS.find(p => p.id === pathId);
            if (path) {
                allBlocked.add(`${path.end}-${path.start}`);
            }
        });

        const prevPathCount = this.currentState.pathsTaken.length;

        // Use takeTurn from app.js with depth 8 for smart AI
        const newState = takeTurn(
            this.currentState,
            shape,
            ALLOWED_PATHS,
            NODES,
            isBranch,
            8,
            remainingCards || [],
            allBlocked,
            this.globalVisited,
            this.currentLineIndex
        );

        // If a path was taken, store it as pending
        if (newState.pathsTaken.length > prevPathCount) {
            const newPathId = newState.pathsTaken[newState.pathsTaken.length - 1];
            this.pendingMove = { newState, newPathId, lineColor };
            console.log(`AI calculated move: ${newPathId}`);
        } else {
            console.log(`No valid move for ${shape} with ${this.LINE_NAMES[this.currentLineIndex]}`);
            this.pendingMove = null;
        }
    }

    // Execute pending move with animation
    executePendingMoveAnimated(pinkCardsRevealed, onRoundComplete, onGameComplete, onAnimationComplete) {
        if (!this.pendingMove) {
            if (pinkCardsRevealed >= 5) {
                this.handleEndOfRoundScoring(onRoundComplete, onGameComplete);
            }
            if (onAnimationComplete) onAnimationComplete();
            return;
        }

        const { newState, newPathId, lineColor } = this.pendingMove;

        // Check for newly visited tourist sites
        const newlyVisited = newState.visitedNodesIds.filter(id => !this.currentState.visitedNodesIds.includes(id));
        newlyVisited.forEach(id => {
            const node = this.nodeMap.get(id);
            if (node && node.type === 'tourist-site') {
                if (this.globalTouristVisits < 11) {
                    this.renderService.fillTouristCircle(this.globalTouristVisits, lineColor);
                    this.globalTouristVisits++;
                }
            }
        });

        // Draw the path with animation
        this.renderService.drawSolidPath(newPathId, lineColor, true, () => {
            // Actions after animation finishes
            if (pinkCardsRevealed >= 5) {
                this.handleEndOfRoundScoring(onRoundComplete, onGameComplete);
            }
            if (onAnimationComplete) onAnimationComplete();
        });

        this.globalPaths.push(newPathId);

        // Update current state
        this.currentState = newState;

        // Update global visited
        this.currentState.visitedNodesIds.forEach(id => {
            if (!this.globalVisited.includes(id)) {
                this.globalVisited.push(id);
            }
        });

        console.log(`Drew path ${newPathId} with ${this.LINE_NAMES[this.currentLineIndex]}`);
        this.pendingMove = null;
    }

    // Helper for end of round scoring
    handleEndOfRoundScoring(onRoundComplete, onGameComplete) {
        // Calculate detailed score components
        const zoneCounts = {};
        const uniqueZones = new Set();
        
        this.currentState.visitedNodesIds.forEach(id => {
            const node = this.nodeMap.get(id);
            if (node) {
                zoneCounts[node.zone] = (zoneCounts[node.zone] || 0) + 1;
                uniqueZones.add(node.zone);
            }
        });

        const counts = Object.values(zoneCounts);
        const maxNodesInZone = counts.length > 0 ? Math.max(...counts) : 0;
        const zonesVisited = uniqueZones.size;
        
        let riverScore = 0;
        this.currentState.pathsTaken.forEach(id => {
            const p = ALLOWED_PATHS.find(path => path.id === id);
            if (p && p.crossesRiver) riverScore += 2;
        });
        
        const lineScore = calculateLineScore(this.currentState, ALLOWED_PATHS, this.nodeMap);
        
        this.linesResults.push({
            score: lineScore,
            maxNodesInZone: maxNodesInZone,
            zonesVisited: zonesVisited,
            riverScore: riverScore,
            visited: [...this.currentState.visitedNodesIds],
            name: this.LINE_NAMES[this.currentLineIndex],
            color: this.LINE_COLORS[this.currentLineIndex]
        });
        
        console.log(`${this.LINE_NAMES[this.currentLineIndex]} Score: ${lineScore} (${maxNodesInZone} x ${zonesVisited})`);

        if (this.currentLineIndex < 3) {
            if (onRoundComplete) onRoundComplete();
        } else {
            // Callback to render scoring for the final line
            if (onRoundComplete) onRoundComplete();
            if (onGameComplete) onGameComplete();
        }
    }

    // Perform round transition
    doRoundTransition() {
        // Move to next line
        this.currentLineIndex++;

        console.log(`Starting new round with ${this.LINE_NAMES[this.currentLineIndex]} from node ${this.START_NODES[this.currentLineIndex]}`);

        // Initialize completely new line state
        const startNode = this.START_NODES[this.currentLineIndex];
        this.currentState = {
            edgeNodesIds: [startNode, startNode],
            pathsTaken: [],
            visitedNodesIds: [startNode]
        };

        // Only add to globalVisited if not already there
        if (!this.globalVisited.includes(startNode)) {
            this.globalVisited.push(startNode);
        }

        // Clear pending move
        this.pendingMove = null;

        console.log(`New line state initialized:`, this.currentState);
        console.log(`Global paths so far:`, this.globalPaths.length, 'paths');
        console.log(`Global visited so far:`, this.globalVisited.length, 'nodes');
    }

    // Calculate final score
    calculateFinalScore() {
        let baseTotal = this.linesResults.reduce((sum, l) => sum + l.score, 0);
        let totalBaseLineScoreProduct = this.linesResults.reduce((sum, l) => sum + (l.maxNodesInZone * l.zonesVisited), 0);
        let totalRiverPoints = this.linesResults.reduce((sum, l) => sum + l.riverScore, 0);

        // Calculate interchange bonuses
        let visitCounts = {};
        this.linesResults.forEach(line => {
            line.visited.forEach(nodeId => {
                visitCounts[nodeId] = (visitCounts[nodeId] || 0) + 1;
            });
        });

        let bonus = 0;
        let hubs = { 2: 0, 3: 0, 4: 0 };
        Object.entries(visitCounts).forEach(([nodeId, count]) => {
            if (count === 2) { bonus += 2; hubs[2]++; }
            else if (count === 3) { bonus += 5; hubs[3]++; }
            else if (count === 4) { bonus += 9; hubs[4]++; }
        });

        const touristScore = this.renderService.getTouristScore();

        const grandTotal = baseTotal + bonus + touristScore;

        return { grandTotal, baseTotal, bonus, hubs, touristScore, totalBaseLineScoreProduct, totalRiverPoints };
    }
}
