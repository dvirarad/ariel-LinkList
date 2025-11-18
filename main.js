console.log('🚀 Main.js loaded - Nevo\'s Learning Games');
console.log('🌐 Browser:', navigator.userAgent);

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

console.log('🎙️ Speech synthesis available:', !!speechSynth);
console.log('📊 Initial speech rate:', speechRate);

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
    console.log('🎤 initHebrewVoice called');
    availableVoices = speechSynth.getVoices();
    console.log(`📋 Available voices: ${availableVoices.length}`, availableVoices.map(v => `${v.name} (${v.lang})`));

    if (availableVoices.length > 0 && !hebrewVoice) {
        // Prefer local Hebrew voices (most reliable and responsive)
        const hebrewVoices = availableVoices.filter(voice => voice.lang.startsWith('he'));
        console.log(`🇮🇱 Hebrew voices available:`, hebrewVoices.map(v => `${v.name} (${v.localService ? 'Local' : 'Online'})`));
        const localHebrewVoice = hebrewVoices.find(v => v.localService);

        // Priority: local Hebrew > any Hebrew > first available voice
        hebrewVoice = localHebrewVoice ||
                      hebrewVoices[0] ||
                      availableVoices[0];

        console.log('✅ Selected voice:', hebrewVoice ? `${hebrewVoice.name} (${hebrewVoice.lang}, ${hebrewVoice.localService ? 'Local' : 'Online'})` : 'NONE');
    } else if (!hebrewVoice) {
        console.warn('⚠️ No voices available yet');
    }

    // Populate voice selector if it exists - HEBREW PREFERRED
    const voiceSelect = document.getElementById('voice-select');
    if (voiceSelect && availableVoices.length > 0) {
        voiceSelect.innerHTML = '';

        // Show Hebrew voices first, but if none available, show all voices
        const hebrewVoices = availableVoices.filter(v => v.lang.startsWith('he'));

        console.log(`🇮🇱 Found ${hebrewVoices.length} Hebrew voices out of ${availableVoices.length} total`);

        if (hebrewVoices.length > 0) {
            // We have Hebrew voices - show only those
            hebrewVoices.forEach((voice) => {
                const option = document.createElement('option');
                // IMPORTANT: Store the actual index from availableVoices array
                option.value = availableVoices.indexOf(voice);
                option.textContent = `${voice.name} ${voice.localService ? '(מקומי)' : '(אונליין)'}`;
                // Check if this voice is currently selected
                if (voice === hebrewVoice) {
                    option.selected = true;
                    console.log(`✅ Selected option: ${voice.name} (index: ${option.value})`);
                }
                voiceSelect.appendChild(option);
            });
            console.log(`🎛️ Voice selector populated with ${hebrewVoices.length} Hebrew voices only`);
        } else {
            // No Hebrew voices - show all voices with warning
            console.warn('⚠️ No Hebrew voices available! Showing all voices as fallback');

            // Add warning message at top
            const warningOption = document.createElement('option');
            warningOption.value = '-1';
            warningOption.textContent = '⚠️ אין קולות עבריים - בחר קול כלשהו:';
            warningOption.disabled = true;
            warningOption.selected = true;
            voiceSelect.appendChild(warningOption);

            // Show all available voices
            availableVoices.forEach((voice, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${voice.name} (${voice.lang}) ${voice.localService ? '[מקומי]' : '[אונליין]'}`;
                if (voice === hebrewVoice) {
                    option.selected = true;
                }
                voiceSelect.appendChild(option);
            });

            console.log(`🌍 Voice selector populated with all ${availableVoices.length} voices (no Hebrew found)`);
        }

        updateVoiceInfo();
    }
}

// Update voice info display
function updateVoiceInfo() {
    const voiceInfo = document.getElementById('voice-info');
    if (voiceInfo && hebrewVoice) {
        voiceInfo.innerHTML = `
            <div style="text-align: right; padding: 10px; background: #f0f0f0; border-radius: 8px;">
                <div><strong>שם:</strong> ${hebrewVoice.name}</div>
                <div><strong>שפה:</strong> ${hebrewVoice.lang}</div>
                <div><strong>סוג:</strong> ${hebrewVoice.localService ? 'מקומי (מהיר)' : 'אונליין (איכותי)'}</div>
            </div>
        `;
    }
}

// Handle voice selection change
function onVoiceChange() {
    const voiceSelect = document.getElementById('voice-select');
    const selectedIndex = parseInt(voiceSelect.value);

    console.log(`🔄 Voice selection changed: selectedIndex=${selectedIndex}, total voices=${availableVoices.length}`);

    if (selectedIndex === -1) {
        console.warn('⚠️ No valid voice selected (no Hebrew voices available)');
        return;
    }

    if (availableVoices[selectedIndex]) {
        const oldVoice = hebrewVoice;
        hebrewVoice = availableVoices[selectedIndex];

        console.log(`✅ Voice changed from "${oldVoice?.name}" to "${hebrewVoice.name}"`);
        console.log(`   Language: ${hebrewVoice.lang}, Type: ${hebrewVoice.localService ? 'Local' : 'Online'}`);

        updateVoiceInfo();

        // Test the new voice immediately
        speakText('זהו הקול שבחרת', speechRate);
    } else {
        console.error(`❌ Invalid voice index: ${selectedIndex}`);
    }
}

// Reload voices manually
function reloadVoices() {
    console.log('🔄 Manual voice reload requested');
    availableVoices = [];
    hebrewVoice = null;
    initHebrewVoice();

    // Try again after delay
    setTimeout(initHebrewVoice, 100);
    setTimeout(initHebrewVoice, 500);

    alert('קולות נטענו מחדש! בדוק את הרשימה.');
}

// Speak text in Hebrew
function speakText(text, rate = null) {
    console.log('🔊 speakText called with:', text);

    // Detect browser type
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    console.log(`🌐 Browser: Chrome=${isChrome}, Safari=${isSafari}`);

    // Make sure voices are loaded
    if (availableVoices.length === 0) {
        availableVoices = speechSynth.getVoices();
        console.log(`🔄 Reloaded voices: ${availableVoices.length}`);
    }

    // Initialize voice if needed
    if (!hebrewVoice && availableVoices.length > 0) {
        hebrewVoice = availableVoices.find(voice => voice.lang.startsWith('he')) || availableVoices[0];
        console.log('🎯 Auto-selected voice:', hebrewVoice ? hebrewVoice.name : 'NONE');
    }

    const finalRate = rate !== null ? rate : speechRate;
    console.log(`⚙️ Speech settings: rate=${finalRate}, voice=${hebrewVoice ? hebrewVoice.name : 'default'}`);

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'he-IL';
    utterance.rate = finalRate;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;

    // Set voice for all browsers - respect user's choice
    if (hebrewVoice) {
        utterance.voice = hebrewVoice;
        console.log(`🎤 Using selected voice: ${hebrewVoice.name} (${hebrewVoice.lang}, ${isChrome ? 'Chrome' : isSafari ? 'Safari' : 'Other'})`);
    } else {
        console.log(`🎤 No voice selected - using browser default for lang='he-IL'`);
    }

    // Simple event handlers - no automatic voice switching
    utterance.onstart = () => {
        console.log('▶️ Speech started successfully');
    };

    utterance.onend = () => {
        console.log('⏹️ Speech ended');
    };

    utterance.onerror = (e) => {
        console.error('❌ Speech error:', {
            error: e.error,
            voiceName: hebrewVoice?.name,
            text: text.substring(0, 50)
        });

        // Just log the error - don't change the user's voice selection
        if (e.error === 'not-allowed') {
            console.warn('⚠️ Speech not allowed - user interaction may be required');
        }
    };

    // Speak the utterance
    console.log('📢 Calling speechSynth.speak()');
    console.log(`   Speaking: ${speechSynth.speaking}, Pending: ${speechSynth.pending}, Paused: ${speechSynth.paused}`);

    // Chrome fix: Resume if paused (Chrome sometimes starts in paused state)
    if (speechSynth.paused) {
        console.log('🔓 Speech was paused, resuming...');
        speechSynth.resume();
    }

    try {
        speechSynth.speak(utterance);
        console.log('✅ speechSynth.speak() called successfully');
    } catch (err) {
        console.error('💥 Exception in speechSynth.speak():', err);
    }
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
        console.log('🖱️ Speaker button clicked for text:', text);
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
    console.log('🎉 Fun button clicked!');
    const randomIndex = Math.floor(Math.random() * funMessages.length);
    const message = funMessages[randomIndex];
    console.log('💬 Selected message:', message);

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
        console.log(`⚙️ Speech rate changed to: ${speechRate}`);
    };

    // Ensure voice selector is populated and up to date
    if (availableVoices.length === 0) {
        console.log('⚠️ Voices not loaded yet, loading now...');
        initHebrewVoice();
    }
}

// Close settings modal
function closeSettings() {
    const modal = document.getElementById('settings-modal');
    modal.classList.add('hidden');
}

// Test the current voice settings
function testVoice() {
    console.log('🧪 Test voice button clicked');
    const testMessage = 'שלום נבו! זה בדיקה של הקול והמהירות';
    speakText(testMessage);
}

// Load voices when they become available
if (speechSynth.onvoiceschanged !== undefined) {
    console.log('👂 Registered onvoiceschanged listener');
    speechSynth.onvoiceschanged = () => {
        console.log('🔔 onvoiceschanged event fired!');
        initHebrewVoice();
    };
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOMContentLoaded - page ready');

    // Try to load voices immediately
    initHebrewVoice();

    // Try again after a delay (for browsers that load voices asynchronously)
    setTimeout(() => {
        console.log('⏰ Retry loading voices after 100ms');
        initHebrewVoice();
    }, 100);
    setTimeout(() => {
        console.log('⏰ Retry loading voices after 500ms');
        initHebrewVoice();
    }, 500);

    // Setup settings panel
    const rateSlider = document.getElementById('speech-rate');
    const rateValue = document.getElementById('rate-value');
    if (rateSlider) {
        rateSlider.value = speechRate;
        rateValue.textContent = speechRate;
    }
});
