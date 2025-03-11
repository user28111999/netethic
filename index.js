document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('board');
    const boardWidth = board.offsetWidth;
    const boardHeight = board.offsetHeight;
    const player = document.getElementById('player');
    const diceButton = document.getElementById('diceButton');
    const diceModal = document.getElementById('diceModal');
    const diceResult = document.getElementById('diceResult');
    const moveMessage = document.getElementById('moveMessage');
    
    // Game state
    let currentPosition = 0; // Starting at position 0 (before first space)
    let spacePositions = [];
    let spaces = [];
    let isMoving = false;
    
    // Generate board spaces and paths
    generateBoard();
    
    // Setup click handlers for spaces
    setupSpaceClicks();
    
    // Setup dice roll functionality
    setupDiceRoll();
    
    // Position player at the starting position
    movePlayerToSpace(0);

    function generateBoard() {
        // Create a spiral board layout
        const totalSpaces = 42;
        spaces = [];
        
        // Define the center of the spiral
        const centerX = boardWidth / 2;
        const centerY = boardHeight / 2;
        
        // Define space descriptions
        const spaceDescriptions = {
            blue: "Case bleue: Gain de points ?",
            red: "Case rouge: Perte de points ?!",
            green: "Case verte : Case évenement",
            coin: "Case orange : Case pioche",
            star: "Case jaune : ???",
            item: "Case rose : ???",
            chance: "Case cyan : ???",
            bowser: "Case Marron : ???"
        };
        
        // Define the types of spaces we want to use
        const spaceTypes = ['blue', 'red', 'green', 'coin', 'item', 'chance', 'bowser'];
        const spaceWeights = [35, 15, 15, 10, 10, 10, 5]; // Percentages
        
        // Generate spiral pattern
        // Start from outside and spiral inward
        const radius = Math.min(boardWidth, boardHeight) * 0.38;
        const startAngle = Math.PI / 2; // Start from bottom
        
        // Calculate positions for spaces in a spiral
        spacePositions = [];
        for (let i = 0; i < totalSpaces; i++) {
            // The spiral formula
            const progress = i / totalSpaces;
            const angle = startAngle + progress * Math.PI * 6; // 3 rotations
            const distance = radius * (1 - progress * 0.7);
            
            const x = centerX + distance * Math.cos(angle);
            const y = centerY + distance * Math.sin(angle);
            
            spacePositions.push({x, y});
        }
        
        // Create each space
        for (let i = 0; i < totalSpaces; i++) {
            // Create space
            const space = document.createElement('div');
            space.className = 'space';
            space.dataset.index = i;
            spaces.push(space);
            
            // Determine space type based on weighted distribution
            let selectedType;
            const randomValue = Math.random() * 100;
            let cumulativeWeight = 0;
            
            for (let j = 0; j < spaceTypes.length; j++) {
                cumulativeWeight += spaceWeights[j];
                if (randomValue <= cumulativeWeight) {
                    selectedType = spaceTypes[j];
                    break;
                }
            }
            
            // Add special star spaces at certain intervals
            if (i % 10 === 5) {
                selectedType = 'star';
            }
            
            // First space is always blue
            if (i === 0) {
                selectedType = 'blue';
            }
            
            space.classList.add(selectedType);
            space.textContent = (i + 1);
            
            // Position the space
            const pos = spacePositions[i];
            space.style.left = `${pos.x - 20}px`;
            space.style.top = `${pos.y - 20}px`;
            
            // Add tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = `Space ${i + 1}: ${spaceDescriptions[selectedType] || 'A space on the board.'}`;
            space.appendChild(tooltip);
            
            board.appendChild(space);
        }
        
        // Create paths connecting all spaces
        for (let i = 0; i < totalSpaces - 1; i++) {
            const current = spacePositions[i];
            const next = spacePositions[i + 1];
            
            // Create path between current and next
            const path = document.createElement('div');
            path.className = 'path';
            
            // Calculate path position and rotation
            const dx = next.x - current.x;
            const dy = next.y - current.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            path.style.width = `${length}px`;
            path.style.left = `${current.x}px`;
            path.style.top = `${current.y}px`;
            path.style.transform = `rotate(${angle}deg)`;
            path.style.transformOrigin = '0 50%';
            
            board.appendChild(path);
            
            // Add direction arrow in the middle of the path
            const arrow = document.createElement('div');
            arrow.className = 'path-arrow';
            arrow.style.left = `${current.x + dx/2 - 4}px`;
            arrow.style.top = `${current.y + dy/2 - 6}px`;
            
            // Point the arrow in the direction of movement
            const arrowAngle = angle - 90; // Adjust to point along the path
            arrow.style.transform = `rotate(${arrowAngle}deg)`;
            
            board.appendChild(arrow);
        }
    }
    
    function setupSpaceClicks() {
        // Add click event to each space
        spaces.forEach((space, index) => {
            space.addEventListener('click', function() {
                if (!isMoving) {
                    movePlayerToSpace(index + 1); // +1 because space indices are 1-based in the UI
                }
            });
        });
    }
    
    function setupDiceRoll() {
        diceButton.addEventListener('click', function() {
            if (isMoving) return;
            
            // Generate random number between 1 and 6
            const roll = Math.floor(Math.random() * 6) + 1;
            diceResult.textContent = roll;
            
            // Calculate new position
            const newPosition = Math.min(currentPosition + roll, 50);
            
            // Update message
            moveMessage.textContent = `Joueur bouge de ${currentPosition === 0 ? "départ" : currentPosition} jusqu'à la case ${newPosition}`;
            
            // Show modal
            diceModal.classList.add('show');
            
            // Hide modal after 2 seconds and move player
            setTimeout(function() {
                diceModal.classList.remove('show');
                movePlayerToSpace(newPosition);
            }, 2000);
        });
    }
    
    function movePlayerToSpace(spaceIndex) {
        if (isMoving) return;
        isMoving = true;
        
        // Save the previous position
        const previousPosition = currentPosition;
        currentPosition = spaceIndex;
        
        // If we're moving to the starting position (0)
        if (spaceIndex === 0) {
            const startPos = {
                x: spacePositions[0].x - 40,
                y: spacePositions[0].y
            };
            player.style.left = `${startPos.x}px`;
            player.style.top = `${startPos.y - 30}px`;
            isMoving = false;
            return;
        }
        
        // If we're moving from start (0) to a space, animate through each space
        if (previousPosition === 0) {
            animatePlayerMovement(1, spaceIndex);
            return;
        }
        
        // For normal movement, animate through each space in order
        animatePlayerMovement(previousPosition, spaceIndex);
    }
    
    function animatePlayerMovement(start, end) {
        let current = start;
        
        function moveStep() {
            // Get position of the current space (subtract 1 because array is 0-indexed)
            const pos = spacePositions[current - 1];
            
            // Move player to this space
            player.style.left = `${pos.x - 15}px`;
            player.style.top = `${pos.y - 45}px`;
            
            // If we've reached the target space, stop
            if (current === end) {
                isMoving = false;
                return;
            }
            
            // Move to next space after a delay
            current++;
            setTimeout(moveStep, 500);
        }
        
        // Start the movement animation
        moveStep();
    }
});