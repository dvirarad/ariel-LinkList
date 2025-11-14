// Global game state
let currentGame = null;
let score = 0;
let stars = 0;
let currentGameCleanup = null;

// Audio system for Hebrew speech
let speechSynth = window.speechSynthesis;
let hebrewVoice = null;

// Word images/emojis dictionary
const wordImages = {
    'אבא': '👨',
    'אמא': '👩',
    'כלב': '🐕',
    'חתול': '🐱',
    'בית': '🏠',
    'דג': '🐟',
    'ילד': '👦',
    'ספר': '📚',
    'עט': '✏️',
    'תיק': '🎒',
    'כדור': '⚽',
    'פרח': '🌸',
    'עץ': '🌳',
    'שמש': '☀️',
    'ירח': '🌙',
    'כוכב': '⭐',
    'רכבת': '🚂',
    'מכונית': '🚗',
    'טרקטור': '🚜',
    'מטוס': '✈️',
    'חלל': '🚀',
    'כדורגל': '⚽',
    'דיג': '🎣',
    'גן חיות': '🦁',
    'בלון': '🎈',
    'פיצה': '🍕',
    'סוס': '🐴',
    'פיל': '🐘',
    'ציפור': '🐦',
    'קוף': '🐵',
    'תפוח': '🍎',
    'בננה': '🍌',
    'מים': '💧',
    'נר': '🕯️',
    'זאב': '🐺',
    'גמל': '🐪',
    'טלה': '🐑',
    'הר': '⛰️',
    'ורד': '🌹',
    'לב': '❤️',
    'תחנה': '🚉',
    'נהג': '👨‍✈️',
    'נוסע': '🧑',
    'כרטיס': '🎫',
    'מסילה': '🛤️'
};

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
        case 'soccer':
            initSoccerGame();
            break;
        case 'fishing':
            initFishingGame();
            break;
        case 'zoo':
            initZooGame();
            break;
        case 'balloons':
            initBalloonsGame();
            break;
        case 'pizza':
            initPizzaGame();
            break;
        case 'train':
            initTrainGame();
            break;
        case 'airplane':
            initAirplaneGame();
            break;
    }
}

// Return to main menu
function backToMenu() {
    // Call cleanup function if it exists
    if (currentGameCleanup && typeof currentGameCleanup === 'function') {
        currentGameCleanup();
        currentGameCleanup = null;
    }

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

// ===== AUDIO SYSTEM =====

// Initialize Hebrew voice
function initHebrewVoice() {
    if (!hebrewVoice) {
        const voices = speechSynth.getVoices();
        // Try to find Hebrew voice, fallback to any voice
        hebrewVoice = voices.find(voice => voice.lang.startsWith('he')) || voices[0];
    }
}

// Speak text in Hebrew
function speakText(text, rate = 0.9) {
    // Stop any current speech
    speechSynth.cancel();

    // Initialize voice if needed
    if (!hebrewVoice) {
        initHebrewVoice();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'he-IL';
    utterance.rate = rate; // Slightly slower for kids
    utterance.pitch = 1.1; // Slightly higher pitch for friendliness
    utterance.volume = 1.0;

    if (hebrewVoice) {
        utterance.voice = hebrewVoice;
    }

    speechSynth.speak(utterance);
}

// Create speaker button that reads text when clicked
function createSpeakerButton(text, size = '1.5em') {
    const button = document.createElement('button');
    button.innerHTML = '🔊';
    button.style.cssText = `
        font-size: ${size};
        background: #667eea;
        color: white;
        border: none;
        border-radius: 50%;
        width: 2.5em;
        height: 2.5em;
        cursor: pointer;
        margin: 0 5px;
        transition: all 0.2s;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;

    button.onmouseover = () => {
        button.style.transform = 'scale(1.1)';
        button.style.background = '#7c8cfc';
    };

    button.onmouseout = () => {
        button.style.transform = 'scale(1)';
        button.style.background = '#667eea';
    };

    button.onclick = (e) => {
        e.stopPropagation();
        button.style.animation = 'pulse 0.5s';
        speakText(text);
        setTimeout(() => button.style.animation = '', 500);
    };

    return button;
}

// Get image/emoji for a word
function getWordImage(word) {
    return wordImages[word] || '📝';
}

// Create word display with image and speaker
function createWordDisplay(word, showImage = true, showSpeaker = true) {
    const container = document.createElement('span');
    container.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 8px;
        direction: rtl;
    `;

    // Add speaker button
    if (showSpeaker) {
        const speaker = createSpeakerButton(word, '1.2em');
        container.appendChild(speaker);
    }

    // Add word text
    const wordSpan = document.createElement('span');
    wordSpan.textContent = word;
    wordSpan.style.cssText = `
        font-weight: bold;
        font-size: 1.2em;
    `;
    container.appendChild(wordSpan);

    // Add image/emoji
    if (showImage) {
        const imageSpan = document.createElement('span');
        imageSpan.textContent = getWordImage(word);
        imageSpan.style.cssText = `
            font-size: 1.8em;
            margin: 0 5px;
        `;
        container.appendChild(imageSpan);
    }

    return container;
}

// Load voices when they become available
if (speechSynth.onvoiceschanged !== undefined) {
    speechSynth.onvoiceschanged = initHebrewVoice;
}

// Initialize on load
setTimeout(initHebrewVoice, 100);
