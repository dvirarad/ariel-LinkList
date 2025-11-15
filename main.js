// Global game state
let currentGame = null;
let score = 0;
let stars = 0;
let currentGameCleanup = null;

// Audio system for Hebrew speech
let speechSynth = window.speechSynthesis;
let hebrewVoice = null;
let speechRate = 0.75; // Default speech rate (can be adjusted in settings)
let availableVoices = [];

// Word images/emojis dictionary
const wordImages = {
    'אבא': '👨',
    'אמא': '👩',
    'כלב': '🐕',
    'חתול': '🐱',
    'בית': '🏠',
    'דג': '🐟',
    'ילד': '👦',
    'ילדה': '👧',
    'ספר': '📚',
    'עט': '🖊️',
    'עיפרון': '✏️',
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
    'מסילה': '🛤️',
    'שולחן': '🪑',
    'כיסא': '🪑',
    'דלת': '🚪',
    'חלון': '🪟',
    'מיטה': '🛏️',
    'כרית': '🛏️',
    'שמיכה': '🛌',
    'משקפיים': '👓',
    'כובע': '🧢',
    'חולצה': '👕',
    'מכנסיים': '👖',
    'נעליים': '👟',
    'גרביים': '🧦',
    'שעון': '⏰',
    'טלפון': '📱',
    'מחשב': '💻',
    'טלויזיה': '📺',
    'רדיו': '📻',
    'מצלמה': '📷',
    'גיטרה': '🎸',
    'תוף': '🥁',
    'חליל': '🎺',
    'פעמון': '🔔',
    'לחם': '🍞',
    'חלב': '🥛',
    'גבינה': '🧀',
    'ביצה': '🥚',
    'עוגה': '🎂',
    'עוגיה': '🍪',
    'שוקולד': '🍫',
    'ממתק': '🍬',
    'גלידה': '🍦',
    'מרק': '🍲',
    'סלט': '🥗',
    'כוס': '🥤',
    'צלחת': '🍽️',
    'כפית': '🥄',
    'מזלג': '🍴',
    'סכין': '🔪',
    'שמיים': '☁️',
    'עננים': '☁️',
    'גשם': '🌧️',
    'שלג': '❄️',
    'רוח': '💨',
    'קשת': '🌈',
    'ים': '🌊',
    'חוף': '🏖️',
    'אוהל': '⛺',
    'אש': '🔥',
    'דשא': '🌱',
    'פרפר': '🦋',
    'דבורה': '🐝',
    'נמלה': '🐜',
    'חיפושית': '🐞',
    'עכביש': '🕷️',
    'צפרדע': '🐸',
    'ארנב': '🐰',
    'שועל': '🦊',
    'דוב': '🐻',
    'פנדה': '🐼',
    'אריה': '🦁',
    'נמר': '🐯',
    'ג׳ירפה': '🦒',
    'זברה': '🦓',
    'קרנף': '🦏',
    'היפו': '🦛',
    'תנין': '🐊',
    'נחש': '🐍',
    'צב': '🐢',
    'דולפין': '🐬',
    'לוויתן': '🐋',
    'כריש': '🦈',
    'תמנון': '🐙',
    'סרטן': '🦀',
    'תרנגול': '🐔',
    'אווז': '🦆',
    'ינשוף': '🦉',
    'יונה': '🕊️'
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
        case 'letterWord':
            initLetterWordGame();
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

// Initialize Hebrew voice and load all available voices
function initHebrewVoice() {
    availableVoices = speechSynth.getVoices();

    if (availableVoices.length > 0 && !hebrewVoice) {
        // Try to find Hebrew voice, fallback to any voice
        hebrewVoice = availableVoices.find(voice => voice.lang.startsWith('he')) || availableVoices[0];
    }

    // Populate voice selector if it exists
    const voiceSelect = document.getElementById('voice-select');
    if (voiceSelect && availableVoices.length > 0) {
        voiceSelect.innerHTML = '';
        availableVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            if (voice === hebrewVoice) {
                option.selected = true;
            }
            voiceSelect.appendChild(option);
        });
    }
}

// Speak text in Hebrew
function speakText(text, rate = null) {
    // Stop any current speech
    speechSynth.cancel();

    // Make sure voices are loaded
    if (availableVoices.length === 0) {
        availableVoices = speechSynth.getVoices();
    }

    // Initialize voice if needed
    if (!hebrewVoice && availableVoices.length > 0) {
        hebrewVoice = availableVoices.find(voice => voice.lang.startsWith('he')) || availableVoices[0];
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'he-IL';
    utterance.rate = rate !== null ? rate : speechRate; // Use custom rate or global setting
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
        font-family: 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', 'Android Emoji', sans-serif;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 50%;
        width: 2.5em;
        height: 2.5em;
        cursor: pointer;
        margin: 0 5px;
        padding: 0;
        transition: all 0.2s;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        line-height: 1;
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
            font-family: 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', 'Android Emoji', sans-serif;
        `;
        container.appendChild(imageSpan);
    }

    return container;
}

// ===== FUN GREETINGS AND JOKES =====

const funMessages = [
    'ברוך הבא נבו! האם אתה מוכן לשחק וללמוד ביחד?',
    'יש לי חידה בשבילך: מה עושה פיל בעץ? קוראים ביחד!',
    'כל הכבוד נבו! אתה לומד מצוין!',
    'למה העיפרון הלך לישון? כי הוא היה עייף מלכתוב!',
    'נבו המלך! אתה הכי חכם בעולם!',
    'למה הספר הלך לרופא? כי היו לו הרבה עמודים כואבים!',
    'וואו נבו! אתה גיבור אמיתי של הקריאה!',
    'מה האות האהובה על הדג? אות דגש! חה חה חה!',
    'נבו, אתה כוכב! תמשיך לשחק וללמוד!',
    'למה המילה הלכה לים? כי היא רצתה לגלוש על המשפטים!'
];

// Play random greeting or joke
function playRandomGreeting() {
    const randomIndex = Math.floor(Math.random() * funMessages.length);
    const message = funMessages[randomIndex];

    // Animate the button
    const funButton = document.getElementById('fun-button');
    funButton.style.animation = 'none';
    setTimeout(() => {
        funButton.style.animation = 'pulse 0.6s ease';
    }, 10);
    setTimeout(() => {
        funButton.style.animation = 'wiggle 2s ease-in-out infinite';
    }, 600);

    // Speak the message
    speakText(message, 0.7);
}

// ===== SETTINGS FUNCTIONS =====

// Open settings modal
function openSettings() {
    const modal = document.getElementById('settings-modal');
    modal.classList.remove('hidden');

    // Update rate slider value display
    const rateSlider = document.getElementById('speech-rate');
    const rateValue = document.getElementById('rate-value');
    rateSlider.value = speechRate;
    rateValue.textContent = speechRate;

    // Add listener for rate changes
    rateSlider.oninput = function() {
        speechRate = parseFloat(this.value);
        rateValue.textContent = speechRate;
    };

    // Add listener for voice selection
    const voiceSelect = document.getElementById('voice-select');
    voiceSelect.onchange = function() {
        hebrewVoice = availableVoices[this.value];
    };
}

// Close settings modal
function closeSettings() {
    const modal = document.getElementById('settings-modal');
    modal.classList.add('hidden');
}

// Test the current voice settings
function testVoice() {
    const testMessage = 'שלום נבו! זה בדיקה של הקול והמהירות';
    speakText(testMessage);
}

// Load voices when they become available
if (speechSynth.onvoiceschanged !== undefined) {
    speechSynth.onvoiceschanged = initHebrewVoice;
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    // Try to load voices immediately
    initHebrewVoice();

    // Try again after a delay (for browsers that load voices asynchronously)
    setTimeout(initHebrewVoice, 100);
    setTimeout(initHebrewVoice, 500);

    // Setup settings panel
    const rateSlider = document.getElementById('speech-rate');
    const rateValue = document.getElementById('rate-value');
    if (rateSlider) {
        rateSlider.value = speechRate;
        rateValue.textContent = speechRate;
    }
});
