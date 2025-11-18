// Tractor Game - טרקטור אוסף מילים
let tractorCanvas, tractorCtx;
let tractor;
let fieldLetters = [];
let targetWord = null;
let collectedLetters = [];
let tractorGameRunning = false;
let tractorAnimationId = null;
let tractorScore = 0;
let wordsCollected = 0;
let keys = {};

const tractorWords = [
    'אבא', 'אמא', 'כלב', 'חתול', 'בית', 'דג', 'ילד', 'ספר',
    'עט', 'תיק', 'כדור', 'פרח', 'עץ', 'שמש', 'ירח', 'כוכב'
];

function initTractorGame() {
    tractorScore = 0;
    wordsCollected = 0;
    tractorGameRunning = true;
    collectedLetters = [];

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="text-align: center;">
            <h2 class="question-text">🚜 טרקטור אוסף מילים! 🚜</h2>

            <div style="background: linear-gradient(to bottom, #8ec5fc 0%, #e0c3fc 100%);
                        border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">

                <div style="background: #fff; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <div style="font-size: 1.5em; color: #667eea; font-weight: bold; margin-bottom: 10px;">
                        אסוף את המילה:
                    </div>
                    <div id="target-word-display" style="display: flex; align-items: center; justify-content: center; margin: 10px 0;"></div>
                    <div style="font-size: 1.8em; margin-top: 10px; direction: rtl;">
                        אותיות שנאספו: <span id="collected-letters" style="color: #51cf66; font-weight: bold;">___</span>
                    </div>
                </div>

                <canvas id="tractor-canvas" width="700" height="500"
                        style="border: 4px solid #333; border-radius: 10px; background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);"></canvas>

                <div style="margin-top: 15px;">
                    <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 10px;">
                        <button onmousedown="moveTractor('up')" onmouseup="stopTractor()"
                                style="font-size: 2em; padding: 10px 25px; background: #667eea; color: white;
                                       border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">⬆️</button>
                    </div>
                    <div style="display: flex; justify-content: center; gap: 10px;">
                        <button onmousedown="moveTractor('left')" onmouseup="stopTractor()"
                                style="font-size: 2em; padding: 10px 25px; background: #667eea; color: white;
                                       border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">⬅️</button>
                        <button onmousedown="moveTractor('down')" onmouseup="stopTractor()"
                                style="font-size: 2em; padding: 10px 25px; background: #667eea; color: white;
                                       border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">⬇️</button>
                        <button onmousedown="moveTractor('right')" onmouseup="stopTractor()"
                                style="font-size: 2em; padding: 10px 25px; background: #667eea; color: white;
                                       border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">➡️</button>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-around; margin-top: 20px; font-size: 1.3em; color: #333; font-weight: bold;">
                    <div>🏆 ניקוד: <span id="tractor-score">0</span></div>
                    <div>📦 מילים: <span id="words-collected">0</span></div>
                </div>
            </div>
        </div>
    `;

    tractorCanvas = document.getElementById('tractor-canvas');
    tractorCtx = tractorCanvas.getContext('2d');

    // Initialize tractor
    tractor = {
        x: tractorCanvas.width / 2,
        y: tractorCanvas.height / 2,
        size: 40,
        speed: 0,
        direction: 0,
        maxSpeed: 4
    };

    // Start new word
    nextTractorWord();

    // Keyboard controls
    document.addEventListener('keydown', handleTractorKeyDown);
    document.addEventListener('keyup', handleTractorKeyUp);

    // Register cleanup function
    currentGameCleanup = cleanupTractorGame;

    // Start game loop
    tractorGameLoop();
}

function nextTractorWord() {
    targetWord = tractorWords[Math.floor(Math.random() * tractorWords.length)];
    collectedLetters = [];

    // Display word with image and speaker
    const targetWordDisplay = document.getElementById('target-word-display');
    targetWordDisplay.innerHTML = '';
    const wordElement = createWordDisplay(targetWord, true, true);
    wordElement.style.fontSize = '1.8em';
    targetWordDisplay.appendChild(wordElement);

    // Auto-play the word
    setTimeout(() => speakText(`אסוף את המילה ${targetWord}`), 300);

    updateCollectedDisplay();

    // Place letters on field
    placeFieldLetters();
}

function placeFieldLetters() {
    fieldLetters = [];
    const minDistance = 120; // מרחק מינימלי בין אותיות

    // Helper function to check if position is valid (not too close to existing letters)
    function isValidPosition(x, y) {
        for (let letter of fieldLetters) {
            const distance = Math.sqrt(Math.pow(x - letter.x, 2) + Math.pow(y - letter.y, 2));
            if (distance < minDistance) {
                return false;
            }
        }
        return true;
    }

    // Helper function to find valid position
    function findValidPosition() {
        let attempts = 0;
        let x, y;
        do {
            x = 80 + Math.random() * (tractorCanvas.width - 160);
            y = 80 + Math.random() * (tractorCanvas.height - 160);
            attempts++;
        } while (!isValidPosition(x, y) && attempts < 50);
        return { x, y };
    }

    // Add target word letters
    const wordLetters = targetWord.split('');
    wordLetters.forEach((letter, index) => {
        const pos = findValidPosition();
        fieldLetters.push({
            letter: letter,
            x: pos.x,
            y: pos.y,
            size: 35,
            isTarget: true,
            targetIndex: index
        });
    });

    // Add some distractor letters
    const distractors = ['ק', 'ר', 'ש', 'ת', 'מ', 'נ', 'ה', 'ו'];
    const numDistractors = Math.min(3, 8 - wordLetters.length); // פחות מסיחים אם המילה ארוכה
    for (let i = 0; i < numDistractors; i++) {
        const distractor = distractors[Math.floor(Math.random() * distractors.length)];
        const pos = findValidPosition();
        fieldLetters.push({
            letter: distractor,
            x: pos.x,
            y: pos.y,
            size: 35,
            isTarget: false
        });
    }
}

function handleTractorKeyDown(e) {
    if (!tractorGameRunning) return;

    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            keys.up = true;
            e.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            keys.down = true;
            e.preventDefault();
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            keys.left = true;
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            keys.right = true;
            e.preventDefault();
            break;
    }
}

function handleTractorKeyUp(e) {
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            keys.up = false;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            keys.down = false;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            keys.left = false;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            keys.right = false;
            break;
    }
}

function moveTractor(direction) {
    keys[direction] = true;
}

function stopTractor() {
    keys = {};
}

function tractorGameLoop() {
    if (!tractorGameRunning) return;

    // Clear canvas
    tractorCtx.clearRect(0, 0, tractorCanvas.width, tractorCanvas.height);

    // Draw grass pattern
    drawGrass();

    // Update tractor position
    if (keys.up) tractor.y = Math.max(tractor.size, tractor.y - tractor.maxSpeed);
    if (keys.down) tractor.y = Math.min(tractorCanvas.height - tractor.size, tractor.y + tractor.maxSpeed);
    if (keys.left) tractor.x = Math.max(tractor.size, tractor.x - tractor.maxSpeed);
    if (keys.right) tractor.x = Math.min(tractorCanvas.width - tractor.size, tractor.x + tractor.maxSpeed);

    // Draw letters
    fieldLetters.forEach((letterObj, index) => {
        drawFieldLetter(letterObj);

        // Check collision
        const distance = Math.sqrt(
            Math.pow(tractor.x - letterObj.x, 2) +
            Math.pow(tractor.y - letterObj.y, 2)
        );

        if (distance < tractor.size + letterObj.size / 2) {
            collectLetter(letterObj, index);
        }
    });

    // Draw tractor
    drawTractor();

    tractorAnimationId = requestAnimationFrame(tractorGameLoop);
}

function drawGrass() {
    // Simple grass effect
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 15; j++) {
            if (Math.random() > 0.7) {
                tractorCtx.fillStyle = 'rgba(60, 179, 113, 0.3)';
                tractorCtx.fillRect(i * 35 + Math.random() * 10, j * 35 + Math.random() * 10, 3, 8);
            }
        }
    }
}

function drawFieldLetter(letterObj) {
    // Letter background
    tractorCtx.fillStyle = letterObj.isTarget ? '#ffe66d' : '#e0e0e0';
    tractorCtx.beginPath();
    tractorCtx.arc(letterObj.x, letterObj.y, letterObj.size / 2, 0, Math.PI * 2);
    tractorCtx.fill();

    // Letter border
    tractorCtx.strokeStyle = letterObj.isTarget ? '#ffd93d' : '#bbb';
    tractorCtx.lineWidth = 3;
    tractorCtx.stroke();

    // Letter text
    tractorCtx.fillStyle = '#333';
    tractorCtx.font = 'bold 28px Arial';
    tractorCtx.textAlign = 'center';
    tractorCtx.textBaseline = 'middle';
    tractorCtx.fillText(letterObj.letter, letterObj.x, letterObj.y);
}

function drawTractor() {
    // Tractor body
    tractorCtx.fillStyle = '#ff6b6b';
    tractorCtx.fillRect(tractor.x - tractor.size / 2, tractor.y - tractor.size / 2,
                        tractor.size, tractor.size * 0.7);

    // Tractor cabin
    tractorCtx.fillStyle = '#ff8787';
    tractorCtx.fillRect(tractor.x - tractor.size / 3, tractor.y - tractor.size / 2,
                        tractor.size * 0.6, tractor.size * 0.4);

    // Wheels
    tractorCtx.fillStyle = '#333';
    tractorCtx.beginPath();
    tractorCtx.arc(tractor.x - tractor.size / 3, tractor.y + tractor.size / 4, 12, 0, Math.PI * 2);
    tractorCtx.fill();
    tractorCtx.beginPath();
    tractorCtx.arc(tractor.x + tractor.size / 3, tractor.y + tractor.size / 4, 12, 0, Math.PI * 2);
    tractorCtx.fill();

    // Tractor emoji
    tractorCtx.font = 'bold 30px Arial';
    tractorCtx.textAlign = 'center';
    tractorCtx.fillText('🚜', tractor.x, tractor.y - 25);
}

function collectLetter(letterObj, index) {
    if (!letterObj.isTarget) {
        // Wrong letter
        showTractorFeedback('❌ לא האות הנכונה!', false);
        return;
    }

    // Check if it's the next letter we need
    const nextIndex = collectedLetters.length;
    if (letterObj.targetIndex === nextIndex) {
        // Correct letter in sequence!
        collectedLetters.push(letterObj.letter);
        fieldLetters.splice(index, 1);

        updateCollectedDisplay();

        tractorScore += 5;
        updateScore(5);
        document.getElementById('tractor-score').textContent = tractorScore;

        showTractorFeedback('✅ כל הכבוד!', true);

        // Check if word is complete
        if (collectedLetters.length === targetWord.length) {
            wordsCollected++;
            tractorScore += 20;
            updateScore(20);
            updateStars(2);
            document.getElementById('words-collected').textContent = wordsCollected;

            showTractorFeedback('🎉 השלמת את המילה!', true);
            celebrate();

            setTimeout(() => {
                nextTractorWord();
            }, 2000);
        }
    } else {
        showTractorFeedback('⚠️ לא בסדר הנכון!', false);
    }
}

function updateCollectedDisplay() {
    const display = collectedLetters.join('') +
                   '_'.repeat(targetWord.length - collectedLetters.length);
    document.getElementById('collected-letters').textContent = display;
}

function showTractorFeedback(message, isSuccess) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2em;
        color: ${isSuccess ? '#51cf66' : '#ff6b6b'};
        font-weight: bold;
        background: white;
        padding: 20px 40px;
        border-radius: 15px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: fadeInOut 1s ease;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1000);
}

function cleanupTractorGame() {
    tractorGameRunning = false;
    if (tractorAnimationId) {
        cancelAnimationFrame(tractorAnimationId);
    }
    document.removeEventListener('keydown', handleTractorKeyDown);
    document.removeEventListener('keyup', handleTractorKeyUp);
    keys = {};
}

