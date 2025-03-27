const QUESTIONS = [
    {
        case: 1,
        question: "Un groupe WhatsApp a été créé pour embêter une élève de ma classe, je dois :",
        answers: [
            { title: "En parler à un adulte de confiance", isTrue: true },
            { title: "Insulter les personnes du groupe", isTrue: false },
            { title: "Ne rien faire", isTrue: false }
        ]
    },
    {
        case: 2,
        question: "Un influenceur raconte comment il est devenu célèbre du jour au lendemain grâce à une vidéo virale. Que dois-tu penser de son histoire ?",
        answers: [
            { title: "Il a réussi du premier coût, je pense pouvoir faire pareil", isTrue: false },
            { title: "Il a peut-être eu de la chance, mais il faut aussi beaucoup de travail", isTrue: true },
            { title: "Il raconte l'histoire de quelqu'un d'autre", isTrue: false }
        ]
    },
    {
        case: 3,
        question: "Le PEGI est le système d'évaluation européen des jeux vidéo ?",
        answers: [
            { title: "OUI", isTrue: true },
            { title: "NON", isTrue: false },
            { title: "Je ne sais pas !", isTrue: false }
        ]
    },
    {
        case: 4,
        question: "Il n'y a pas de problème à utiliser les écrans juste avant de dormir",
        answers: [
            { title: "VRAI", isTrue: false },
            { title: "FAUX", isTrue: true },
            { title: "Je ne sais pas !", isTrue: false }
        ]
    },
    {
        case: 5,
        question: "Les mises à jour des applications ne servent à rien et prennent de la place",
        answers: [
            { title: "VRAI", isTrue: false },
            { title: "FAUX", isTrue: true },
            { title: "Je ne sais pas !", isTrue: false }
        ]
    },
    {
        case: 6,
        question: "Partager le mot de passe de mon compte avec un ami est une bonne idée si on est très proches",
        answers: [
            { title: "VRAI", isTrue: false },
            { title: "FAUX", isTrue: true },
            { title: "Je ne sais pas !", isTrue: false }
        ]
    }
];

// Création du plateau de jeu
const gameBoard = document.getElementById('game-board');
const player = document.getElementById('player');
const modal = document.getElementById('modal');
const modalQuestion = document.getElementById('modal-question');
const modalAnswers = document.getElementById('modal-answers');
const closeModal = document.querySelector('.close-modal');

function drawPath() {
    const canvas = document.getElementById('path-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match game board
    canvas.width = gameBoard.offsetWidth;
    canvas.height = gameBoard.offsetHeight;
    
    // Path style
    ctx.strokeStyle = '#d4b483'; // Sandy color
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw the path
    ctx.beginPath();
    positions.forEach((pos, index) => {
        if (index === 0) {
            ctx.moveTo(pos.x + 40, pos.y + 40); // Move to center of first square
        } else {
            // Create a curve to the next position
            const prevPos = positions[index - 1];
            const midX = (prevPos.x + pos.x) / 2;
            const midY = (prevPos.y + pos.y) / 2;
            
            ctx.quadraticCurveTo(
                midX + 40,
                midY + 40,
                pos.x + 40,
                pos.y + 40
            );
        }
    });
    
    // Add some texture to the path
    ctx.strokeStyle = '#c4a472'; // Slightly darker sandy color
    ctx.stroke();
    
    // Add dots for texture
    positions.forEach(pos => {
        for (let i = 0; i < 5; i++) {
            const randomX = pos.x + Math.random() * 80;
            const randomY = pos.y + Math.random() * 80;
            ctx.beginPath();
            ctx.arc(randomX, randomY, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#b3935f';
            ctx.fill();
        }
    });
}

// Positions des cases du plateau (Game of Life spiral pattern)
const positions = (() => {
    const board = document.getElementById('game-board');
    const width = board.offsetWidth;
    const height = board.offsetHeight;
    
    const cellSize = Math.min(width, height) / 5;
    const centerX = width / 2;
    const centerY = height / 2;
    
    return [
        // Bottom loop
        {x: centerX - cellSize*2, y: centerY + cellSize, case: 1},
        {x: centerX - cellSize, y: centerY + cellSize*1.5, case: 2},
        {x: centerX, y: centerY + cellSize, case: 3},
        {x: centerX + cellSize, y: centerY + cellSize*1.5, case: 4},
        {x: centerX + cellSize*2, y: centerY + cellSize, case: 5},
        
        // Right curve
        {x: centerX + cellSize*2.5, y: centerY, case: 6},
        {x: centerX + cellSize*2, y: centerY - cellSize, case: 1},
        
        // Top loop
        {x: centerX + cellSize, y: centerY - cellSize*1.5, case: 2},
        {x: centerX, y: centerY - cellSize, case: 3},
        {x: centerX - cellSize, y: centerY - cellSize*1.5, case: 4},
        {x: centerX - cellSize*2, y: centerY - cellSize, case: 5},
        
        // Left curve connecting back
        {x: centerX - cellSize*2.5, y: centerY, case: 6},
        {x: centerX - cellSize*2, y: centerY + cellSize, case: 1}
    ];
})();

console.log(positions)

    document.addEventListener('click', (e) => {
        console.log(`{x: ${e.clientX}, y: ${e.clientY}},`);
    });

    // Générer un plateau de 28 cases avec des numéros de 1 à 7
    function generateGameBoard(positions) {
        positions.forEach((pos, index) => {
            const square = document.createElement('div');
            square.classList.add('game-square', `square-${pos.case}`);
            square.textContent = pos.case;
            square.dataset.index = index;
            
            square.style.left = `${pos.x}px`;
            square.style.top = `${pos.y}px`;
            
            square.addEventListener('click', () => handleSquareClick(square, pos.case));
            gameBoard.appendChild(square);
        });
    }

// Déplacer le joueur sur une case
function movePlayerToSquare(square) {
    const squareRect = square.getBoundingClientRect();
    const boardRect = gameBoard.getBoundingClientRect();
    
    player.style.left = `${squareRect.left - boardRect.left + squareRect.width / 2 - player.offsetWidth / 2}px`;
    player.style.top = `${squareRect.top - boardRect.top + squareRect.height / 2 - player.offsetHeight / 2}px`;
}

// Gérer le clic sur une case
function handleSquareClick(square, number) {
    // Add one-time event listener for transition completion
    const onTransitionEnd = () => {
        // Remove the event listener
        player.removeEventListener('transitionend', onTransitionEnd);
        
        // Wait a small additional delay for visual polish
        setTimeout(() => {
            if (number === 7) {
                // Case chance
                modalQuestion.textContent = "PIOCHE UNE CARTE !";
                modalAnswers.innerHTML = `
                    <button class="answer-button" style="background-color: #2ecc71;">Chance</button>
                    <button class="answer-button" style="background-color: #e74c3c;">Malchance</button>
                `;
            } else {
                // Cases avec questions
                const questionForNumber = QUESTIONS.find(q => q.case === number);
                if (questionForNumber) {
                    modalQuestion.textContent = questionForNumber.question;
                    modalAnswers.innerHTML = questionForNumber.answers.map(answer => 
                        `<button class="answer-button" data-correct="${answer.isTrue}" style="background-color: #3498db;">${answer.title}</button>`
                    ).join('');

                    // Ajout des écouteurs d'événements pour les réponses
                    modalAnswers.querySelectorAll('.answer-button').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const isCorrect = e.target.dataset.correct === 'true';
                            modalQuestion.textContent = isCorrect ? "Bonne réponse ! 🎉" : "Mauvaise réponse ! 😞";
                            modalAnswers.innerHTML = `<button class="answer-button" style="background-color: ${isCorrect ? '#2ecc71' : '#e74c3c'}">Continuer</button>`;
                            modalAnswers.querySelector('.answer-button').addEventListener('click', () => {
                                modal.style.display = 'none';
                            });
                        });
                    });
                }
            }

            // Afficher la modal
            modal.style.display = 'flex';
        }, 200); // Add a 200ms delay after the transition
    };

    // Add the transition end listener
    player.addEventListener('transitionend', onTransitionEnd);
    
    // Move the player
    movePlayerToSquare(square);
}

// Fermer la modal en cliquant sur le X ou en dehors
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Add window resize handler
window.addEventListener('resize', drawPath);
window.addEventListener('resize', () => generateGameBoard(positions));

window.addEventListener('load', () => {
    const firstSquare = document.querySelector('.game-square[data-index="0"]');
    if (firstSquare) {
        movePlayerToSquare(firstSquare);
    }
});

// Initialisation du jeu
generateGameBoard(positions);
drawPath();