/**
 * Main Turn Logic with Future-Proofing
 */
function takeTurn(gameState, card, ALLOWED_PATHS, NODES, isBranch, depth, deck, globalBlocked, globalVisited, lineIndex) {
  const nodeMap = new Map(NODES.map(n => [n.id, n]));
  const currentLineBlocked = getBlockedPathIds(gameState.pathsTaken, ALLOWED_PATHS);
  const allBlocked = new Set([...globalBlocked, ...currentLineBlocked]);
  const validAnchors = isBranch ? gameState.visitedNodesIds : gameState.edgeNodesIds;

  const legalMoves = getLegalMoves(validAnchors, gameState.visitedNodesIds, gameState.pathsTaken, allBlocked, card, ALLOWED_PATHS, nodeMap);

  // If no legal moves, return unchanged state
  if (legalMoves.length === 0) {
    return gameState;
  }

  let bestMove = null;
  let highestScore = -Infinity;

  // Only consider legal moves, not null (always make a move if possible)
  for (const move of legalMoves) {
    const simState = applyMove(gameState, move, isBranch);

    // Use deeper search (passed depth parameter)
    const score = (depth > 0)
        ? evaluatePotential(simState, depth, ALLOWED_PATHS, NODES, nodeMap, [...deck], allBlocked, globalVisited, lineIndex)
        : calculateLineScore(simState, ALLOWED_PATHS, nodeMap);

    if (score > highestScore) {
      highestScore = score;
      bestMove = move;
    }
  }
  return bestMove ? applyMove(gameState, bestMove, isBranch) : gameState;
}

/**
 * Advanced Evaluator: Scaling Heuristics & Future Blocking
 */
function evaluatePotential(state, depth, ALLOWED_PATHS, NODES, nodeMap, remainingDeck, allBlocked, globalVisited, lineIndex) {
  if (depth === 0 || remainingDeck.length === 0) return calculateLineScore(state, ALLOWED_PATHS, nodeMap);

  const currentCard = remainingDeck[0];
  const nextDeck = remainingDeck.slice(1);
  let isNextBranch = false;
  let effectiveCard = currentCard;
  let deckToPass = nextDeck;

  if (currentCard === 'branch') {
    isNextBranch = true;
    effectiveCard = nextDeck[0] || 'wild';
    deckToPass = nextDeck.slice(1);
  }

  const anchors = isNextBranch ? state.visitedNodesIds : state.edgeNodesIds;
  const futureMoves = getLegalMoves(anchors, state.visitedNodesIds, state.pathsTaken, allBlocked, effectiveCard, ALLOWED_PATHS, nodeMap);

  if (futureMoves.length === 0) return evaluatePotential(state, depth - 1, ALLOWED_PATHS, NODES, nodeMap, deckToPass, allBlocked, globalVisited, lineIndex);

  // FUTURE START PROTECTION: Don't block future lines (Nodes 13, 22, 38)
  const futureStarts = [13, 22, 38].slice(lineIndex);

  // Calculate zone growth potential
  const zoneCounts = {};
  state.visitedNodesIds.forEach(id => {
    const n = nodeMap.get(id);
    if (n) zoneCounts[n.zone] = (zoneCounts[n.zone] || 0) + 1;
  });

  const prioritized = futureMoves.map(m => {
    const targetId = state.visitedNodesIds.includes(m.start) ? m.end : m.start;
    const node = nodeMap.get(targetId);
    let val = 0;

    if (!node) return { move: m, val: -1000 };

    // 1. Core Rewards - align with actual scoring
    if (m.crossesRiver) val += 30; // Worth 2 points in final, so value higher
    if (node.type === 'tourist-site') val += 80; // Worth scaling points, high value

    // 2. Hub/Interchange Incentive - MUCH higher value
    const previousVisits = globalVisited.filter(id => id === targetId).length;
    if (previousVisits === 1) val += 120; // 2nd line: +2 points
    else if (previousVisits === 2) val += 180; // 3rd line: +3 points (total 5)
    else if (previousVisits === 3) val += 240; // 4th line: +4 points (total 9)

    // 3. Zone Strategy - optimize for maxNodes * uniqueZones formula
    const isNewZone = !state.visitedNodesIds.some(id => nodeMap.get(id).zone === node.zone);
    const currentMaxZone = Object.values(zoneCounts).length > 0 ? Math.max(...Object.values(zoneCounts)) : 0;
    const currentUniqueZones = Object.keys(zoneCounts).length;

    if (isNewZone) {
      // New zone increases uniqueZones by 1, multiplied by (currentMaxZone + 1)
      const newZoneBonus = (currentMaxZone + 1);
      val += newZoneBonus * 8; // Scale up the multiplier effect
    } else {
      // Growing existing zone: if it becomes new max, increases score significantly
      const newCount = (zoneCounts[node.zone] || 0) + 1;
      if (newCount > currentMaxZone) {
        // New max! Score = newMax * uniqueZones vs old = currentMax * uniqueZones
        const scoreDelta = (newCount - currentMaxZone) * currentUniqueZones;
        val += scoreDelta * 10;
      } else {
        // Just adding to non-max zone, less valuable
        val += 5;
      }
    }

    // 4. Count available nodes in target zone (growth potential)
    const targetZoneNodes = NODES.filter(n => n.zone === node.zone && !state.visitedNodesIds.includes(n.id));
    val += targetZoneNodes.length * 3;

    // 5. Aggressive Future-Proofing
    const blocksFutureStart = m.blocks && m.blocks.some(bId => {
      const p = ALLOWED_PATHS.find(path => path.id === bId);
      return p && (futureStarts.includes(p.start) || futureStarts.includes(p.end));
    });
    if (blocksFutureStart) val -= 120;

    // 6. Endgame: if low cards remaining, directly optimize final score
    if (remainingDeck.length <= 3) {
      const simState = applyMove(state, m, isNextBranch);
      const directScore = calculateLineScore(simState, ALLOWED_PATHS, nodeMap);
      val += directScore * 5; // Heavily weight actual score near end
    }

    return { move: m, val };
  }).sort((a, b) => b.val - a.val).slice(0, 3); // Beam width 3 instead of 2

  let maxFuture = -Infinity;
  for (const item of prioritized) {
    const score = evaluatePotential(applyMove(state, item.move, isNextBranch), depth - 1, ALLOWED_PATHS, NODES, nodeMap, deckToPass, allBlocked, globalVisited, lineIndex);
    if (score > maxFuture) maxFuture = score;
  }
  return maxFuture;
}

function calculateLineScore(state, ALLOWED_PATHS, nodeMap) {
  let riverScore = 0;
  state.pathsTaken.forEach(id => {
    const p = ALLOWED_PATHS.find(path => path.id === id);
    if (p && p.crossesRiver) riverScore += 2;
  });

  const zoneCounts = {};
  const uniqueZones = new Set();

  state.visitedNodesIds.forEach(id => {
    const node = nodeMap.get(id);
    if (node) {
      zoneCounts[node.zone] = (zoneCounts[node.zone] || 0) + 1;
      uniqueZones.add(node.zone);
    }
  });

  const counts = Object.values(zoneCounts);
  const maxNodes = counts.length > 0 ? Math.max(...counts) : 0;
  return (maxNodes * uniqueZones.size) + riverScore;
}

function applyMove(state, path, isBranch) {
  const newState = { edgeNodesIds: [...state.edgeNodesIds], pathsTaken: [...state.pathsTaken, path.id], visitedNodesIds: [...state.visitedNodesIds] };
  const isS = newState.visitedNodesIds.includes(path.start);
  const targetId = isS ? path.end : path.start;
  const sourceId = isS ? path.start : path.end;
  const edgeIndex = newState.edgeNodesIds.indexOf(sourceId);

  if (isBranch && edgeIndex === -1) newState.edgeNodesIds.push(targetId);
  else if (edgeIndex !== -1) newState.edgeNodesIds.splice(edgeIndex, 1, targetId);
  else newState.edgeNodesIds.push(targetId);

  if (!newState.visitedNodesIds.includes(targetId)) newState.visitedNodesIds.push(targetId);
  return newState;
}

function getBlockedPathIds(pathsTaken, ALLOWED_PATHS) {
  const blocked = new Set();
  pathsTaken.forEach(id => {
    const p = ALLOWED_PATHS.find(path => path.id === id);
    if (p && p.blocks) p.blocks.forEach(bId => blocked.add(bId));
  });
  return blocked;
}

function getLegalMoves(anchors, currentLineVisited, taken, blocked, card, paths, nodeMap) {
  return paths.filter(p => {
    if (taken.includes(p.id) || (blocked && blocked.has(p.id))) return false;
    const canS = anchors.includes(p.start);
    const canE = anchors.includes(p.end);
    if (!canS && !canE) return false;
    const targetId = canS ? p.end : p.start;
    if (currentLineVisited.includes(targetId)) return false;
    const node = nodeMap.get(targetId);
    return node && (card === 'wild' || node.shape === 'wild' || node.shape === card);
  });
}
