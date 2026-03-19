/**
 * Render Service - Handles all SVG rendering and drawing
 */
class RenderService {
    constructor() {
        this.svg = document.getElementById('gridSvg');
        this.SPACING = 60;
        this.OFFSET = 30;
        this.DOT_RADIUS = 3;
        this.SHAPE_SIZE = 12;
        this.GRID_SIZE = 10;
    }

    // Transform grid coordinates to SVG coordinates
    gridToSvg(x, y) {
        return {
            x: this.OFFSET + x * this.SPACING,
            y: this.OFFSET + (this.GRID_SIZE - 1 - y) * this.SPACING
        };
    }

    // Get node by ID
    getNodeById(id) {
        return NODES.find(node => node.id === id);
    }

    // Get path key for tracking
    getPathKey(start, end) {
        return [Math.min(start, end), Math.max(start, end)].join('-');
    }

    // Initialize SVG groups for proper layering
    initSvgGroups() {
        this.svg.innerHTML = '';

        const groups = ['grid', 'guide-lines', 'dashed-paths', 'solid-paths', 'decorations', 'shapes', 'labels'];
        groups.forEach(name => {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('id', `${name}-group`);
            this.svg.appendChild(group);
        });
    }

    // Draw grid dots
    drawGrid() {
        const gridGroup = document.getElementById('grid-group');
        if (!gridGroup) return;

        for (let x = 0; x < this.GRID_SIZE; x++) {
            for (let y = 0; y < this.GRID_SIZE; y++) {
                const pos = this.gridToSvg(x, y);
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', pos.x);
                circle.setAttribute('cy', pos.y);
                circle.setAttribute('r', this.DOT_RADIUS);
                circle.setAttribute('class', 'grid-dot');
                gridGroup.appendChild(circle);
            }
        }
    }

    // Draw guide lines
    drawGuideLines() {
        const guideLinesGroup = document.getElementById('guide-lines-group');
        if (!guideLinesGroup) return;

        // Yellow vertical lines at x=3 and x=7
        this.drawYellowLine(guideLinesGroup, 3, 0, 3, 9, -30, 0);
        this.drawYellowLine(guideLinesGroup, 7, 0, 7, 9, -30, 0);

        // Yellow horizontal lines at y=3 and y=6
        this.drawYellowLine(guideLinesGroup, 0, 3, 9, 3, 0, 30);
        this.drawYellowLine(guideLinesGroup, 0, 6, 9, 6, 0, -30);

        // Water lines
        this.drawWaterLines(guideLinesGroup);

        // Corner L-shapes
        this.drawCornerLShapes(guideLinesGroup);
    }

    drawYellowLine(group, x1, y1, x2, y2, xOffset = 0, yOffset = 0) {
        const startPos = this.gridToSvg(x1, y1);
        const endPos = this.gridToSvg(x2, y2);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startPos.x + xOffset);
        line.setAttribute('y1', startPos.y + yOffset);
        line.setAttribute('x2', endPos.x + xOffset);
        line.setAttribute('y2', endPos.y + yOffset);
        line.setAttribute('stroke', '#FFD700');
        line.setAttribute('stroke-width', '3');
        line.setAttribute('opacity', '0.8');
        group.appendChild(line);
    }

    drawWaterLines(group) {
        const startPos4 = this.gridToSvg(0, 6);
        const waterStartY = startPos4.y - 30 + 60 + 2; // Moved 10px down (-8 + 10)

        const node23 = this.getNodeById(23);
        const node23Pos = this.gridToSvg(node23.x, node23.y);
        
        const rightEdge = this.gridToSvg(9, 0);

        const riverPath = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        
        // Define all points of the river continuously
        const points = [
            `${startPos4.x},${waterStartY}`,
            `${startPos4.x + 125},${waterStartY}`, // Set joint at 125px
            `${node23Pos.x},${node23Pos.y + 30}`,
            `${node23Pos.x + 80},${node23Pos.y + 30}`,
            `${node23Pos.x + 140},${node23Pos.y - 30}`,
            `${rightEdge.x},${node23Pos.y - 30}`
        ].join(' ');

        riverPath.setAttribute('points', points);
        riverPath.setAttribute('fill', 'none');
        riverPath.setAttribute('stroke', 'rgb(110, 170, 190)');
        riverPath.setAttribute('stroke-width', '14');
        riverPath.setAttribute('stroke-linejoin', 'round');
        riverPath.setAttribute('stroke-linecap', 'round');
        riverPath.setAttribute('opacity', '0.8');
        group.appendChild(riverPath);
    }

    drawWaterLine(group, x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', 'rgb(110, 170, 190)');
        line.setAttribute('stroke-width', '14');
        line.setAttribute('opacity', '0.8');
        group.appendChild(line);
    }

    drawCornerLShapes(group) {
        const corners = [
            { x: 0, y: 0, dx: 30, dy: -30 },  // Bottom-left
            { x: 9, y: 0, dx: -30, dy: -30 }, // Bottom-right
            { x: 0, y: 9, dx: 30, dy: 30 },   // Top-left
            { x: 9, y: 9, dx: -30, dy: 30 }   // Top-right
        ];

        corners.forEach(corner => {
            const pos = this.gridToSvg(corner.x, corner.y);

            // Horizontal line
            const h = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            h.setAttribute('x1', pos.x);
            h.setAttribute('y1', pos.y + corner.dy);
            h.setAttribute('x2', pos.x + corner.dx);
            h.setAttribute('y2', pos.y + corner.dy);
            h.setAttribute('stroke', '#FFD700');
            h.setAttribute('stroke-width', '3');
            h.setAttribute('opacity', '0.8');
            group.appendChild(h);

            // Vertical line
            const v = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            v.setAttribute('x1', pos.x + corner.dx);
            v.setAttribute('y1', pos.y);
            v.setAttribute('x2', pos.x + corner.dx);
            v.setAttribute('y2', pos.y + corner.dy);
            v.setAttribute('stroke', '#FFD700');
            v.setAttribute('stroke-width', '3');
            v.setAttribute('opacity', '0.8');
            group.appendChild(v);
        });
    }

    // Draw dashed paths between nodes
    drawPaths() {
        const dashedPathsGroup = document.getElementById('dashed-paths-group');
        if (!dashedPathsGroup) return;

        const drawnPaths = new Set();

        ALLOWED_PATHS.forEach(path => {
            const startNode = this.getNodeById(path.start);
            const endNode = this.getNodeById(path.end);

            if (startNode && endNode) {
                const pathKey = this.getPathKey(path.start, path.end);
                if (drawnPaths.has(pathKey)) return;
                drawnPaths.add(pathKey);

                const startPos = this.gridToSvg(startNode.x, startNode.y);
                const endPos = this.gridToSvg(endNode.x, endNode.y);

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', startPos.x);
                line.setAttribute('y1', startPos.y);
                line.setAttribute('x2', endPos.x);
                line.setAttribute('y2', endPos.y);
                line.setAttribute('stroke', '#999');
                line.setAttribute('stroke-width', '1');
                line.setAttribute('stroke-dasharray', '5,5');
                line.setAttribute('fill', 'none');
                dashedPathsGroup.appendChild(line);
            }
        });
    }

    // Draw a solid path with color
    drawSolidPath(pathId, color, animated = false, onComplete = null) {
        const path = ALLOWED_PATHS.find(p => p.id === pathId);
        if (!path) {
            if (onComplete) onComplete();
            return;
        }

        const startNode = this.getNodeById(path.start);
        const endNode = this.getNodeById(path.end);

        if (startNode && endNode) {
            const startPos = this.gridToSvg(startNode.x, startNode.y);
            const endPos = this.gridToSvg(endNode.x, endNode.y);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', startPos.x);
            line.setAttribute('y1', startPos.y);
            line.setAttribute('x2', endPos.x);
            line.setAttribute('y2', endPos.y);
            line.setAttribute('stroke', color);
            line.setAttribute('stroke-width', '5');
            line.setAttribute('fill', 'none');
            line.setAttribute('class', 'solid-path');

            const solidPathsGroup = document.getElementById('solid-paths-group');
            if (!solidPathsGroup) {
                if (onComplete) onComplete();
                return;
            }

            if (animated) {
                const dx = endPos.x - startPos.x;
                const dy = endPos.y - startPos.y;
                const length = Math.sqrt(dx * dx + dy * dy);

                line.setAttribute('stroke-dasharray', length);
                line.setAttribute('stroke-dashoffset', length);
                solidPathsGroup.appendChild(line);

                const startTime = performance.now();
                const duration = 400;

                function animate(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    line.setAttribute('stroke-dashoffset', length * (1 - eased));
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else if (onComplete) {
                        onComplete();
                    }
                }

                requestAnimationFrame(animate);
            } else {
                solidPathsGroup.appendChild(line);
                if (onComplete) onComplete();
            }
        } else if (onComplete) {
            onComplete();
        }
    }

    // Create shape path functions
    createTriangle(x, y) {
        const points = [
            [x, y - this.SHAPE_SIZE],
            [x - this.SHAPE_SIZE * 0.866, y + this.SHAPE_SIZE * 0.5],
            [x + this.SHAPE_SIZE * 0.866, y + this.SHAPE_SIZE * 0.5]
        ];
        return points.map(p => p.join(',')).join(' ');
    }

    createSquare(x, y) {
        const size = this.SHAPE_SIZE * 1.4;
        const half = size / 2;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x - half);
        rect.setAttribute('y', y - half);
        rect.setAttribute('width', size);
        rect.setAttribute('height', size);
        rect.setAttribute('class', 'shape');
        return rect;
    }

    createPentagon(x, y) {
        const points = [];
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const px = x + this.SHAPE_SIZE * Math.cos(angle);
            const py = y + this.SHAPE_SIZE * Math.sin(angle);
            points.push([px, py]);
        }
        return points.map(p => p.join(',')).join(' ');
    }

    createCircle(x, y) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', this.SHAPE_SIZE * 0.8);
        circle.setAttribute('class', 'shape');
        return circle;
    }

    // Draw all nodes
    drawNodes() {
        const shapesGroup = document.getElementById('shapes-group');
        const decorationsGroup = document.getElementById('decorations-group');
        const labelsGroup = document.getElementById('labels-group');
        if (!shapesGroup || !decorationsGroup || !labelsGroup) return;

        const startNodeColors = {
            35: 'rgb(210, 50, 110)', // pink
            13: 'rgb(40, 150, 210)',  // blue
            22: 'rgb(110, 60, 140)',  // purple
            38: 'rgb(70, 170, 70)'    // green
        };

        NODES.forEach(node => {
            const pos = this.gridToSvg(node.x, node.y);

            // Draw circle background
            const circleRadius = this.SHAPE_SIZE * 1.3;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', circleRadius);
            circle.setAttribute('fill', startNodeColors[node.id] || '#fff');
            circle.setAttribute('stroke', '#000');
            circle.setAttribute('stroke-width', '1.5');
            decorationsGroup.appendChild(circle);

            // Draw sun decoration for tourist sites
            if (node.type === 'tourist-site') {
                this.drawSunDecoration(decorationsGroup, pos.x, pos.y, circleRadius);
            }

            // Draw shape
            const shape = this.createNodeShape(node, pos);
            if (shape) {
                if (startNodeColors[node.id]) {
                    if (shape.tagName === 'text') {
                        shape.setAttribute('fill', '#fff');
                    } else {
                        shape.style.fill = startNodeColors[node.id];
                        shape.style.stroke = '#fff';
                        shape.style.strokeWidth = '3';
                    }
                }
                shapesGroup.appendChild(shape);
            }

            // Draw label
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', pos.x);
            label.setAttribute('y', pos.y + this.SHAPE_SIZE + 15);
            label.setAttribute('class', 'label');
            label.textContent = node.id;
            labelsGroup.appendChild(label);
        });
    }

    drawSunDecoration(group, x, y, radius) {
        const numTriangles = 16;
        const triangleSize = 5;

        for (let i = 0; i < numTriangles; i++) {
            const angle = (Math.PI * 2 * i) / numTriangles;
            const triangleX = x + Math.cos(angle) * radius;
            const triangleY = y + Math.sin(angle) * radius;

            const tipX = triangleX + Math.cos(angle) * triangleSize;
            const tipY = triangleY + Math.sin(angle) * triangleSize;

            const perpAngle1 = angle + Math.PI / 2;
            const perpAngle2 = angle - Math.PI / 2;

            const base1X = triangleX + Math.cos(perpAngle1) * (triangleSize * 0.4);
            const base1Y = triangleY + Math.sin(perpAngle1) * (triangleSize * 0.4);
            const base2X = triangleX + Math.cos(perpAngle2) * (triangleSize * 0.4);
            const base2Y = triangleY + Math.sin(perpAngle2) * (triangleSize * 0.4);

            const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            triangle.setAttribute('points', `${tipX},${tipY} ${base1X},${base1Y} ${base2X},${base2Y}`);
            triangle.setAttribute('fill', '#000');
            group.appendChild(triangle);
        }
    }

    createNodeShape(node, pos) {
        let shape;

        switch(node.shape) {
            case 'triangle':
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                shape.setAttribute('points', this.createTriangle(pos.x, pos.y));
                shape.setAttribute('class', 'shape');
                break;
            case 'square':
                shape = this.createSquare(pos.x, pos.y);
                break;
            case 'pentagon':
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                shape.setAttribute('points', this.createPentagon(pos.x, pos.y));
                shape.setAttribute('class', 'shape');
                break;
            case 'circle':
                shape = this.createCircle(pos.x, pos.y);
                break;
            case 'wild':
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                shape.setAttribute('x', pos.x);
                shape.setAttribute('y', pos.y);
                shape.setAttribute('text-anchor', 'middle');
                shape.setAttribute('dominant-baseline', 'central');
                shape.setAttribute('font-size', '24');
                shape.setAttribute('font-weight', 'bold');
                shape.setAttribute('fill', '#000');
                shape.textContent = '?';
                break;
        }

        return shape;
    }

    drawTouristScores() {
        const row = document.getElementById('touristScoreRow');
        if (!row) return;
        row.innerHTML = '';
        
        const scores = [0, 1, 2, 4, 6, 8, 11, 14, 17, 21, 25];
        const radius = this.SHAPE_SIZE * 1.3;
        
        scores.forEach(score => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '-25 -25 50 50');
            svg.setAttribute('width', '40');
            svg.setAttribute('height', '40');
            svg.setAttribute('class', 'tourist-score-node');
            
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            this.drawSunDecoration(group, 0, 0, radius);
            svg.appendChild(group);
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '0');
            circle.setAttribute('cy', '0');
            circle.setAttribute('r', radius);
            circle.setAttribute('fill', '#fff');
            circle.setAttribute('stroke', '#000');
            circle.setAttribute('stroke-width', '1.5');
            svg.appendChild(circle);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', '0');
            text.setAttribute('y', '0');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'central');
            text.setAttribute('font-size', '16'); // Back to 16px font
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('fill', '#000');
            text.textContent = score;
            svg.appendChild(text);
            
            row.appendChild(svg);
        });
    }

    renderTouristNodeInto(elementId, value) {
        const container = document.getElementById(elementId);
        if (!container) return;
        container.innerHTML = '';
        
        const radius = this.SHAPE_SIZE * 1.3;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '-25 -25 50 50');
        svg.setAttribute('width', '40');
        svg.setAttribute('height', '40');
        svg.setAttribute('class', 'tourist-score-node');
        
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.drawSunDecoration(group, 0, 0, radius);
        svg.appendChild(group);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '0');
        circle.setAttribute('cy', '0');
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', '#fff');
        circle.setAttribute('stroke', '#000');
        circle.setAttribute('stroke-width', '1.5');
        svg.appendChild(circle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '0');
        text.setAttribute('y', '0');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('font-size', '16');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('fill', '#000');
        text.textContent = value;
        svg.appendChild(text);
        
        container.appendChild(svg);
    }

    fillTouristCircle(index, color) {
        const row = document.getElementById('touristScoreRow');
        if (!row) return;
        
        const nodes = row.querySelectorAll('.tourist-score-node');
        if (nodes && nodes[index]) {
            const circle = nodes[index].querySelector('circle');
            const text = nodes[index].querySelector('text');
            
            if (circle) circle.setAttribute('fill', color);
            if (text) text.setAttribute('fill', '#fff');
        }
    }

    getTouristScore() {
        let currentScore = 0;
        const row = document.getElementById('touristScoreRow');
        if (!row) return currentScore;
        
        const nodes = row.querySelectorAll('.tourist-score-node');
        nodes.forEach(node => {
            const circle = node.querySelector('circle');
            if (circle && circle.getAttribute('fill') !== '#fff') {
                const text = node.querySelector('text');
                if (text) {
                    currentScore = parseInt(text.textContent, 10) || 0;
                }
            }
        });
        return currentScore;
    }

    // Main render function
    render() {
        this.initSvgGroups();
        this.drawGrid();
        this.drawGuideLines();
        this.drawPaths();
        this.drawNodes();
        this.drawTouristScores();
    }
}
