// Global game state
let currentGame = null;
let score = 0;
let stars = 0;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    updateScore(0);
    updateStars(0);
});

// Start a specific game
function startGame(gameName) {
    currentGame = gameName;
    document.getElementById('game-menu').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = '';

    // Load the appropriate game
    switch(gameName) {
        case 'letters':
            initLettersGame();
            break;
        case 'wordBuilder':
            initWordBuilderGame();
            break;
        case 'memory':
            initMemoryGame();
            break;
        case 'syllables':
            initSyllablesGame();
            break;
        case 'writing':
            initWritingGame();
            break;
        case 'sounds':
            initSoundsGame();
            break;
        case 'carRace':
            initCarRaceGame();
            break;
        case 'tractor':
            initTractorGame();
            break;
        case 'space':
            initSpaceGame();
            break;
    }
}

// Return to main menu
function backToMenu() {
    currentGame = null;
    document.getElementById('game-menu').classList.remove('hidden');
    document.getElementById('game-container').classList.add('hidden');
}

// Update score
function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;

    if (points > 0) {
        animateScoreIncrease();
    }
}

// Update stars
function updateStars(amount) {
    stars += amount;
    document.getElementById('stars').textContent = stars;
}

// Animate score increase
function animateScoreIncrease() {
    const scoreElement = document.getElementById('score');
    scoreElement.style.transform = 'scale(1.5)';
    scoreElement.style.color = '#51cf66';

    setTimeout(() => {
        scoreElement.style.transform = 'scale(1)';
        scoreElement.style.color = '#667eea';
    }, 300);
}

// Show feedback message
function showFeedback(message, isSuccess = true) {
    const gameContent = document.getElementById('game-content');
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `feedback-message ${isSuccess ? 'success' : 'error'}`;
    feedbackDiv.textContent = message;

    gameContent.appendChild(feedbackDiv);

    setTimeout(() => {
        feedbackDiv.remove();
    }, 2000);
}

// Play celebration animation
function celebrate() {
    const celebration = document.createElement('div');
    celebration.innerHTML = '🎉🎊✨';
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 5em;
        animation: celebrate 1s ease;
        z-index: 1000;
    `;

    document.body.appendChild(celebration);

    setTimeout(() => {
        celebration.remove();
    }, 1000);
}

// Shuffle array utility
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Get random items from array
function getRandomItems(array, count) {
    const shuffled = shuffleArray(array);
    return shuffled.slice(0, count);
}
