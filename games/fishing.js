// Fishing Words Game - דיג מילים
let fishingCanvas, fishingCtx;
let fisher;
let fish = [];
let bubbles = [];
let waves = [];
let hook;
let targetFishingWord = null;
let caughtLetters = [];
let fishingGameRunning = false;
let fishingAnimationId = null;
let fishingScore = 0;
let wordsCaught = 0;
let hookMoving = false;
let hookDirection = 1;

const fishingWords = [
    'אבא', 'אמא', 'כלב', 'חתול', 'בית', 'דג', 'ילד', 'ספר',
    'עט', 'תיק', 'כדור', 'פרח', 'עץ', 'שמש', 'ירח', 'כוכב'
];

const fishColors = ['#ff6b6b', '#51cf66', '#4ecdc4', '#ffd93d', '#ff9ff3', '#74b9ff'];

function initFishingGame() {
    fishingScore = 0;
    wordsCaught = 0;
    fishingGameRunning = true;
    caughtLetters = [];
    hookMoving = false;

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="text-align: center;">
            <h2 class="question-text">🎣 דיג מילים! 🎣</h2>

            <div style="background: linear-gradient(to bottom, #87ceeb 0%, #4a90e2 50%, #2c5aa0 100%);
                        border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">

                <div style="background: rgba(255,255,255,0.95); padding: 15px; border-radius: 10px;
                           margin-bottom: 15px; border: 3px solid #667eea;">
                    <div style="font-size: 1.5em; color: #667eea; font-weight: bold;">
                        דוג את המילה: <span id="target-fishing-word" style="color: #ff6b6b; font-size: 1.3em;"></span>
                    </div>
                    <div style="font-size: 1.8em; margin-top: 10px; direction: rtl;">
                        אותיות שנתפסו: <span id="caught-letters" style="color: #51cf66; font-weight: bold;">___</span>
                    </div>
                </div>

                <canvas id="fishing-canvas" width="700" height="500"
                        style="border: 4px solid #333; border-radius: 10px;
                               background: linear-gradient(to bottom, rgba(135, 206, 235, 0.3) 0%, #4a90e2 40%, #2c5aa0 100%);"></canvas>

                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
                    <button onclick="moveFisherLeft()"
                            style="font-size: 2em; padding: 15px 30px; background: #667eea; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">⬅️ שמאל</button>
                    <button onclick="dropHook()"
                            style="font-size: 2em; padding: 15px 30px; background: #ff6b6b; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">⬇️ דוג!</button>
                    <button onclick="moveFisherRight()"
                            style="font-size: 2em; padding: 15px 30px; background: #667eea; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">ימין ➡️</button>
                </div>

                <div style="display: flex; justify-content: space-around; margin-top: 20px; font-size: 1.3em; color: #fff; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                    <div style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 10px;">
                        🏆 ניקוד: <span id="fishing-score">0</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 10px;">
                        🐟 מילים: <span id="words-caught">0</span>
                    </div>
                </div>
            </div>

            <div style="margin-top: 15px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 10px; font-size: 1.1em; color: #666;">
                💡 <strong>הוראות:</strong> הזז את הדייג עם החצים ודוג דגים עם האותיות לפי הסדר!
            </div>
        </div>
    `;

    fishingCanvas = document.getElementById('fishing-canvas');
    fishingCtx = fishingCanvas.getContext('2d');

    // Initialize fisher
    fisher = {
        x: fishingCanvas.width / 2,
        y: 40,
        width: 60,
        height: 80,
        speed: 6
    };

    // Initialize hook
    hook = {
        x: fisher.x,
        y: fisher.y + 40,
        baseY: fisher.y + 40,
        maxY: fishingCanvas.height - 60,
        length: 0,
        isDropping: false,
        isPulling: false,
        speed: 5
    };

    // Initialize waves
    for (let i = 0; i < 10; i++) {
        waves.push({
            x: i * 80,
            offset: Math.random() * Math.PI * 2,
            speed: 0.03 + Math.random() * 0.02
        });
    }

    // Keyboard controls
    document.addEventListener('keydown', handleFishingKeyDown);

    // Start new word
    nextFishingWord();

    // Register cleanup function
    currentGameCleanup = cleanupFishingGame;

    // Start game loop
    fishingGameLoop();
}

function nextFishingWord() {
    targetFishingWord = fishingWords[Math.floor(Math.random() * fishingWords.length)];
    caughtLetters = [];

    document.getElementById('target-fishing-word').textContent = targetFishingWord;
    updateCaughtDisplay();

    // Create fish with letters
    createFish();
}

function createFish() {
    fish = [];
    bubbles = [];

    // Add fish for each letter in target word
    const wordLetters = targetFishingWord.split('');
    wordLetters.forEach((letter, index) => {
        fish.push({
            letter: letter,
            x: 80 + Math.random() * (fishingCanvas.width - 160),
            y: 200 + Math.random() * 200,
            targetIndex: index,
            isTarget: true,
            size: 35,
            color: fishColors[Math.floor(Math.random() * fishColors.length)],
            speed: 1 + Math.random() * 0.5,
            direction: Math.random() > 0.5 ? 1 : -1,
            swimOffset: Math.random() * Math.PI * 2
        });
    });

    // Add some distractor fish
    const distractors = ['ק', 'ר', 'ש', 'ת', 'מ', 'נ'];
    const numDistractors = Math.min(2, 6 - wordLetters.length);
    for (let i = 0; i < numDistractors; i++) {
        fish.push({
            letter: distractors[Math.floor(Math.random() * distractors.length)],
            x: 80 + Math.random() * (fishingCanvas.width - 160),
            y: 200 + Math.random() * 200,
            targetIndex: -1,
            isTarget: false,
            size: 35,
            color: fishColors[Math.floor(Math.random() * fishColors.length)],
            speed: 1 + Math.random() * 0.5,
            direction: Math.random() > 0.5 ? 1 : -1,
            swimOffset: Math.random() * Math.PI * 2
        });
    }

    // Create bubbles
    for (let i = 0; i < 20; i++) {
        createBubble();
    }
}

function createBubble() {
    bubbles.push({
        x: Math.random() * fishingCanvas.width,
        y: fishingCanvas.height - Math.random() * 200,
        size: 3 + Math.random() * 5,
        speed: 0.5 + Math.random() * 1,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.05 + Math.random() * 0.05
    });
}

function handleFishingKeyDown(e) {
    if (!fishingGameRunning) return;

    switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            moveFisherLeft();
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            moveFisherRight();
            e.preventDefault();
            break;
        case 'ArrowDown':
        case ' ':
        case 'Enter':
            dropHook();
            e.preventDefault();
            break;
    }
}

function moveFisherLeft() {
    if (!fishingGameRunning || hookMoving) return;
    fisher.x = Math.max(50, fisher.x - fisher.speed * 5);
    hook.x = fisher.x;
}

function moveFisherRight() {
    if (!fishingGameRunning || hookMoving) return;
    fisher.x = Math.min(fishingCanvas.width - 50, fisher.x + fisher.speed * 5);
    hook.x = fisher.x;
}

function dropHook() {
    if (!fishingGameRunning || hookMoving) return;
    hook.isDropping = true;
    hookMoving = true;
}

function fishingGameLoop() {
    if (!fishingGameRunning) return;

    // Clear canvas
    fishingCtx.clearRect(0, 0, fishingCanvas.width, fishingCanvas.height);

    // Draw water layers
    drawWater();

    // Draw waves
    drawWaves();

    // Update and draw bubbles
    updateAndDrawBubbles();

    // Update and draw fish
    updateAndDrawFish();

    // Update and draw hook
    updateAndDrawHook();

    // Draw fisher
    drawFisher();

    fishingAnimationId = requestAnimationFrame(fishingGameLoop);
}

function drawWater() {
    // Deep water gradient
    const gradient = fishingCtx.createLinearGradient(0, 100, 0, fishingCanvas.height);
    gradient.addColorStop(0, 'rgba(135, 206, 235, 0.3)');
    gradient.addColorStop(0.4, '#4a90e2');
    gradient.addColorStop(1, '#2c5aa0');
    fishingCtx.fillStyle = gradient;
    fishingCtx.fillRect(0, 0, fishingCanvas.width, fishingCanvas.height);
}

function drawWaves() {
    fishingCtx.fillStyle = 'rgba(135, 206, 235, 0.6)';
    fishingCtx.beginPath();

    for (let i = 0; i < waves.length; i++) {
        const wave = waves[i];
        wave.offset += wave.speed;

        const y = 95 + Math.sin(wave.offset) * 8;

        if (i === 0) {
            fishingCtx.moveTo(wave.x, y);
        } else {
            fishingCtx.lineTo(wave.x, y);
        }
    }

    fishingCtx.lineTo(fishingCanvas.width, 100);
    fishingCtx.lineTo(fishingCanvas.width, 0);
    fishingCtx.lineTo(0, 0);
    fishingCtx.closePath();
    fishingCtx.fill();

    // Water line
    fishingCtx.strokeStyle = 'rgba(74, 144, 226, 0.8)';
    fishingCtx.lineWidth = 3;
    fishingCtx.stroke();
}

function updateAndDrawBubbles() {
    bubbles = bubbles.filter(bubble => {
        bubble.y -= bubble.speed;
        bubble.wobble += bubble.wobbleSpeed;
        bubble.x += Math.sin(bubble.wobble) * 0.5;

        if (bubble.y < 90) {
            createBubble();
            return false;
        }

        // Draw bubble
        fishingCtx.fillStyle = `rgba(255, 255, 255, 0.4)`;
        fishingCtx.beginPath();
        fishingCtx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        fishingCtx.fill();

        fishingCtx.strokeStyle = `rgba(255, 255, 255, 0.6)`;
        fishingCtx.lineWidth = 1;
        fishingCtx.stroke();

        return true;
    });
}

function updateAndDrawFish() {
    fish.forEach((f, index) => {
        // Swim animation
        f.swimOffset += 0.1;
        f.x += f.direction * f.speed;
        f.y += Math.sin(f.swimOffset) * 0.5;

        // Bounce off walls
        if (f.x < 50 || f.x > fishingCanvas.width - 50) {
            f.direction *= -1;
        }

        // Keep in water
        f.y = Math.max(150, Math.min(fishingCanvas.height - 80, f.y));

        // Draw fish
        drawFish(f);

        // Check hook collision
        if (hook.isDropping && !hook.isPulling) {
            const distance = Math.sqrt(
                Math.pow(hook.x - f.x, 2) +
                Math.pow(hook.y - f.y, 2)
            );

            if (distance < f.size + 10) {
                catchFish(f, index);
            }
        }
    });
}

function drawFish(f) {
    fishingCtx.save();
    fishingCtx.translate(f.x, f.y);
    if (f.direction < 0) {
        fishingCtx.scale(-1, 1);
    }

    // Fish body
    fishingCtx.fillStyle = f.color;
    fishingCtx.beginPath();
    fishingCtx.ellipse(0, 0, f.size, f.size * 0.6, 0, 0, Math.PI * 2);
    fishingCtx.fill();

    // Fish tail
    fishingCtx.beginPath();
    const tailWag = Math.sin(f.swimOffset * 2) * 5;
    fishingCtx.moveTo(-f.size, 0);
    fishingCtx.lineTo(-f.size - 15, -10 + tailWag);
    fishingCtx.lineTo(-f.size - 15, 10 + tailWag);
    fishingCtx.closePath();
    fishingCtx.fill();

    // Fish eye
    fishingCtx.fillStyle = 'white';
    fishingCtx.beginPath();
    fishingCtx.arc(f.size * 0.5, -5, 6, 0, Math.PI * 2);
    fishingCtx.fill();
    fishingCtx.fillStyle = 'black';
    fishingCtx.beginPath();
    fishingCtx.arc(f.size * 0.5, -5, 3, 0, Math.PI * 2);
    fishingCtx.fill();

    // Letter on fish
    fishingCtx.fillStyle = 'white';
    fishingCtx.font = 'bold 24px Arial';
    fishingCtx.textAlign = 'center';
    fishingCtx.textBaseline = 'middle';
    fishingCtx.fillText(f.letter, 0, 5);

    fishingCtx.restore();

    // Highlight if target
    if (f.isTarget && f.targetIndex === caughtLetters.length) {
        fishingCtx.strokeStyle = '#ffe66d';
        fishingCtx.lineWidth = 3;
        fishingCtx.setLineDash([5, 5]);
        fishingCtx.beginPath();
        fishingCtx.arc(f.x, f.y, f.size + 8, 0, Math.PI * 2);
        fishingCtx.stroke();
        fishingCtx.setLineDash([]);
    }
}

function updateAndDrawHook() {
    if (hook.isDropping) {
        hook.y += hook.speed;
        hook.length = hook.y - hook.baseY;

        if (hook.y >= hook.maxY) {
            hook.isDropping = false;
            hook.isPulling = true;
        }
    } else if (hook.isPulling) {
        hook.y -= hook.speed;
        hook.length = hook.y - hook.baseY;

        if (hook.y <= hook.baseY) {
            hook.y = hook.baseY;
            hook.length = 0;
            hook.isPulling = false;
            hookMoving = false;
        }
    }

    // Draw fishing line
    fishingCtx.strokeStyle = '#333';
    fishingCtx.lineWidth = 2;
    fishingCtx.beginPath();
    fishingCtx.moveTo(fisher.x, fisher.y + 40);
    fishingCtx.lineTo(hook.x, hook.y);
    fishingCtx.stroke();

    // Draw hook
    fishingCtx.strokeStyle = '#888';
    fishingCtx.lineWidth = 4;
    fishingCtx.beginPath();
    fishingCtx.arc(hook.x, hook.y, 8, 0, Math.PI);
    fishingCtx.stroke();

    fishingCtx.beginPath();
    fishingCtx.moveTo(hook.x + 8, hook.y);
    fishingCtx.lineTo(hook.x + 8, hook.y + 12);
    fishingCtx.lineTo(hook.x + 3, hook.y + 8);
    fishingCtx.stroke();
}

function drawFisher() {
    // Boat/platform
    fishingCtx.fillStyle = '#8B4513';
    fishingCtx.fillRect(fisher.x - 40, fisher.y + 30, 80, 15);

    // Fisher body
    fishingCtx.fillStyle = '#4ecdc4';
    fishingCtx.fillRect(fisher.x - 15, fisher.y - 10, 30, 40);

    // Fisher head
    fishingCtx.fillStyle = '#ffd93d';
    fishingCtx.beginPath();
    fishingCtx.arc(fisher.x, fisher.y - 20, 15, 0, Math.PI * 2);
    fishingCtx.fill();

    // Fishing rod
    fishingCtx.strokeStyle = '#8B4513';
    fishingCtx.lineWidth = 3;
    fishingCtx.beginPath();
    fishingCtx.moveTo(fisher.x, fisher.y + 10);
    fishingCtx.lineTo(fisher.x + 5, fisher.y - 30);
    fishingCtx.stroke();

    // Hat
    fishingCtx.fillStyle = '#ff6b6b';
    fishingCtx.fillRect(fisher.x - 12, fisher.y - 30, 24, 5);
    fishingCtx.beginPath();
    fishingCtx.arc(fisher.x, fisher.y - 30, 10, Math.PI, 0, true);
    fishingCtx.fill();
}

function catchFish(f, index) {
    if (!f.isTarget) {
        // Wrong fish
        showFishingFeedback('❌ לא הדג הנכון!', false);
        hook.isDropping = false;
        hook.isPulling = true;
        return;
    }

    // Check if it's the next letter we need
    const nextIndex = caughtLetters.length;
    if (f.targetIndex === nextIndex) {
        // Correct fish in sequence!
        caughtLetters.push(f.letter);
        fish.splice(index, 1);

        updateCaughtDisplay();

        fishingScore += 5;
        updateScore(5);
        document.getElementById('fishing-score').textContent = fishingScore;

        showFishingFeedback('🐟 דג נתפס!', true);

        hook.isDropping = false;
        hook.isPulling = true;

        // Check if word is complete
        if (caughtLetters.length === targetFishingWord.length) {
            wordsCaught++;
            fishingScore += 20;
            updateScore(20);
            updateStars(2);
            document.getElementById('words-caught').textContent = wordsCaught;

            showFishingFeedback('🎉 השלמת את המילה!', true);
            celebrate();

            setTimeout(() => {
                if (fishingGameRunning) {
                    nextFishingWord();
                }
            }, 2000);
        }
    } else {
        showFishingFeedback('⚠️ לא בסדר הנכון!', false);
        hook.isDropping = false;
        hook.isPulling = true;
    }
}

function updateCaughtDisplay() {
    const display = caughtLetters.join('') +
                   '_'.repeat(targetFishingWord.length - caughtLetters.length);
    document.getElementById('caught-letters').textContent = display;
}

function showFishingFeedback(message, isSuccess) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2em;
        color: white;
        font-weight: bold;
        background: ${isSuccess ? '#51cf66' : '#ff6b6b'};
        padding: 20px 40px;
        border-radius: 15px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: fadeInOut 1s ease;
        border: 3px solid white;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1000);
}

function cleanupFishingGame() {
    fishingGameRunning = false;
    if (fishingAnimationId) {
        cancelAnimationFrame(fishingAnimationId);
        fishingAnimationId = null;
    }
    document.removeEventListener('keydown', handleFishingKeyDown);
    if (fishingCtx) {
        fishingCtx.clearRect(0, 0, fishingCanvas.width, fishingCanvas.height);
    }
}

