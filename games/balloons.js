// Balloon Shooting Game - ירי בבלונים
let balloonsCanvas, balloonsCtx;
let balloons = [];
let bow;
let arrows = [];
let currentBalloonLetter = null;
let currentBalloonWord = '';
let balloonsGameRunning = false;
let balloonsAnimationId = null;
let balloonsScore = 0;
let balloonsPopped = 0;

const balloonWords = [
    { word: 'אבא', letter: 'א' },
    { word: 'בית', letter: 'ב' },
    { word: 'גמל', letter: 'ג' },
    { word: 'דג', letter: 'ד' },
    { word: 'הר', letter: 'ה' },
    { word: 'ורד', letter: 'ו' },
    { word: 'זאב', letter: 'ז' },
    { word: 'חתול', letter: 'ח' },
    { word: 'טלה', letter: 'ט' },
    { word: 'ילד', letter: 'י' },
    { word: 'כלב', letter: 'כ' },
    { word: 'לב', letter: 'ל' },
    { word: 'מים', letter: 'מ' },
    { word: 'נר', letter: 'נ' },
    { word: 'סוס', letter: 'ס' },
    { word: 'עץ', letter: 'ע' },
    { word: 'פיל', letter: 'פ' }
];

const balloonColors = ['#ff6b6b', '#51cf66', '#4ecdc4', '#ffd93d', '#ff9ff3', '#74b9ff', '#a29bfe'];

function initBalloonsGame() {
    balloonsScore = 0;
    balloonsPopped = 0;
    balloonsGameRunning = true;
    balloons = [];
    arrows = [];

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="text-align: center;">
            <h2 class="question-text">🎈 ירי בבלונים! 🎈</h2>

            <div style="background: linear-gradient(to bottom, #667eea 0%, #764ba2 100%);
                        border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">

                <div style="background: rgba(255,255,255,0.95); padding: 15px; border-radius: 10px;
                           margin-bottom: 15px; border: 3px solid #ffe66d;">
                    <div id="balloons-question" style="font-size: 2em; color: #667eea; font-weight: bold;">
                        פוצץ את הבלון הנכון!
                    </div>
                </div>

                <canvas id="balloons-canvas" width="700" height="500"
                        style="border: 4px solid #333; border-radius: 10px;
                               background: linear-gradient(to bottom, #87ceeb 0%, #e0c3fc 100%);"></canvas>

                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
                    <button id="balloons-btn-left"
                            style="font-size: 2em; padding: 15px 30px; background: #667eea; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">⬅️ שמאל</button>
                    <button id="balloons-btn-shoot"
                            style="font-size: 2em; padding: 15px 30px; background: #ff6b6b; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">🏹 ירה!</button>
                    <button id="balloons-btn-right"
                            style="font-size: 2em; padding: 15px 30px; background: #667eea; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">ימין ➡️</button>
                </div>

                <div style="display: flex; justify-content: space-around; margin-top: 20px; font-size: 1.3em; color: #fff; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                    <div style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 10px;">
                        🏆 ניקוד: <span id="balloons-score">0</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 10px;">
                        🎈 בלונים: <span id="balloons-popped">0</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    balloonsCanvas = document.getElementById('balloons-canvas');
    balloonsCtx = balloonsCanvas.getContext('2d');

    // Initialize bow
    bow = {
        x: balloonsCanvas.width / 2,
        y: balloonsCanvas.height - 80,
        width: 60,
        height: 80,
        speed: 8
    };

    // Button controls
    document.getElementById('balloons-btn-left').addEventListener('mousedown', () => moveBowLeft());
    document.getElementById('balloons-btn-right').addEventListener('mousedown', () => moveBowRight());
    document.getElementById('balloons-btn-shoot').addEventListener('click', () => shootArrow());

    // Keyboard controls
    document.addEventListener('keydown', handleBalloonsKeyDown);

    // Start new question
    nextBalloonQuestion();

    // Register cleanup function
    currentGameCleanup = cleanupBalloonsGame;

    // Start game loop
    balloonsGameLoop();
}

function nextBalloonQuestion() {
    const questionData = balloonWords[Math.floor(Math.random() * balloonWords.length)];
    currentBalloonLetter = questionData.letter;
    currentBalloonWord = questionData.word;

    document.getElementById('balloons-question').innerHTML =
        `פוצץ בלון: <span style="color: #ff6b6b; font-size: 1.3em;">${currentBalloonLetter}</span> (מתחיל את <span style="color: #51cf66;">${currentBalloonWord}</span>)`;

    // Create balloons
    createBalloons();
}

function createBalloons() {
    balloons = [];

    // Add correct balloon
    balloons.push({
        x: 100 + Math.random() * (balloonsCanvas.width - 200),
        y: balloonsCanvas.height + 50,
        size: 45,
        letter: currentBalloonLetter,
        speed: 1.2 + Math.random() * 0.6,
        isCorrect: true,
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.03 + Math.random() * 0.02
    });

    // Add wrong balloons
    const wrongLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'].filter(l => l !== currentBalloonLetter);
    for (let i = 0; i < 4; i++) {
        balloons.push({
            x: 100 + Math.random() * (balloonsCanvas.width - 200),
            y: balloonsCanvas.height + 50 + (i * 100),
            size: 45,
            letter: wrongLetters[Math.floor(Math.random() * wrongLetters.length)],
            speed: 1.2 + Math.random() * 0.6,
            isCorrect: false,
            color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.03 + Math.random() * 0.02
        });
    }
}

function handleBalloonsKeyDown(e) {
    if (!balloonsGameRunning) return;

    switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            moveBowLeft();
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            moveBowRight();
            e.preventDefault();
            break;
        case ' ':
        case 'Enter':
            shootArrow();
            e.preventDefault();
            break;
    }
}

function moveBowLeft() {
    if (!balloonsGameRunning) return;
    bow.x = Math.max(bow.width / 2, bow.x - bow.speed * 3);
}

function moveBowRight() {
    if (!balloonsGameRunning) return;
    bow.x = Math.min(balloonsCanvas.width - bow.width / 2, bow.x + bow.speed * 3);
}

function shootArrow() {
    if (!balloonsGameRunning) return;

    arrows.push({
        x: bow.x,
        y: bow.y - 20,
        width: 6,
        height: 30,
        speed: 8
    });
}

function balloonsGameLoop() {
    if (!balloonsGameRunning) return;

    // Clear canvas
    balloonsCtx.clearRect(0, 0, balloonsCanvas.width, balloonsCanvas.height);

    // Draw clouds
    drawBalloonsBackground();

    // Update and draw balloons
    balloons = balloons.filter(balloon => {
        balloon.y -= balloon.speed;
        balloon.wobble += balloon.wobbleSpeed;
        balloon.x += Math.sin(balloon.wobble) * 0.8;

        drawBalloon(balloon);

        // Remove if off screen
        if (balloon.y < -100) {
            if (balloon.isCorrect) {
                showBalloonsFeedback('😢 הבלון ברח!', false);
            }
            return false;
        }

        return true;
    });

    // Update and draw arrows
    arrows = arrows.filter(arrow => {
        arrow.y -= arrow.speed;

        // Draw arrow
        balloonsCtx.fillStyle = '#8B4513';
        balloonsCtx.fillRect(arrow.x - arrow.width / 2, arrow.y, arrow.width, arrow.height);

        // Arrow tip
        balloonsCtx.fillStyle = '#C0C0C0';
        balloonsCtx.beginPath();
        balloonsCtx.moveTo(arrow.x, arrow.y - 10);
        balloonsCtx.lineTo(arrow.x - 5, arrow.y);
        balloonsCtx.lineTo(arrow.x + 5, arrow.y);
        balloonsCtx.closePath();
        balloonsCtx.fill();

        // Check collision with balloons
        for (let i = balloons.length - 1; i >= 0; i--) {
            const balloon = balloons[i];
            const distance = Math.sqrt(
                Math.pow(arrow.x - balloon.x, 2) +
                Math.pow(arrow.y - balloon.y, 2)
            );

            if (distance < balloon.size / 2) {
                handleBalloonPop(balloon, i);
                return false; // Remove arrow
            }
        }

        return arrow.y > 0; // Keep arrow if still on screen
    });

    // Draw bow
    drawBow();

    // Check if need new question
    if (balloons.length === 0) {
        setTimeout(() => {
            if (balloonsGameRunning) {
                nextBalloonQuestion();
            }
        }, 1500);
    }

    balloonsAnimationId = requestAnimationFrame(balloonsGameLoop);
}

function drawBalloonsBackground() {
    // Draw some clouds
    for (let i = 0; i < 3; i++) {
        const x = i * 250 + ((Date.now() / 50) % 250);
        const y = 50 + i * 40;

        balloonsCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        balloonsCtx.beginPath();
        balloonsCtx.arc(x, y, 20, 0, Math.PI * 2);
        balloonsCtx.arc(x + 25, y, 25, 0, Math.PI * 2);
        balloonsCtx.arc(x + 50, y, 20, 0, Math.PI * 2);
        balloonsCtx.fill();
    }
}

function drawBalloon(balloon) {
    // Balloon body
    balloonsCtx.fillStyle = balloon.color;
    balloonsCtx.beginPath();
    balloonsCtx.ellipse(balloon.x, balloon.y, balloon.size / 2, balloon.size / 1.5, 0, 0, Math.PI * 2);
    balloonsCtx.fill();

    // Balloon shine
    balloonsCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    balloonsCtx.beginPath();
    balloonsCtx.ellipse(balloon.x - 10, balloon.y - 10, balloon.size / 5, balloon.size / 4, -0.5, 0, Math.PI * 2);
    balloonsCtx.fill();

    // Balloon knot
    balloonsCtx.fillStyle = balloon.color;
    balloonsCtx.beginPath();
    balloonsCtx.ellipse(balloon.x, balloon.y + balloon.size / 1.5, 4, 6, 0, 0, Math.PI * 2);
    balloonsCtx.fill();

    // String
    balloonsCtx.strokeStyle = '#666';
    balloonsCtx.lineWidth = 2;
    balloonsCtx.beginPath();
    balloonsCtx.moveTo(balloon.x, balloon.y + balloon.size / 1.5);
    balloonsCtx.bezierCurveTo(
        balloon.x + 5, balloon.y + balloon.size / 1.5 + 20,
        balloon.x - 5, balloon.y + balloon.size / 1.5 + 40,
        balloon.x, balloon.y + balloon.size / 1.5 + 60
    );
    balloonsCtx.stroke();

    // Letter
    balloonsCtx.fillStyle = 'white';
    balloonsCtx.font = 'bold 32px Arial';
    balloonsCtx.textAlign = 'center';
    balloonsCtx.textBaseline = 'middle';
    balloonsCtx.fillText(balloon.letter, balloon.x, balloon.y);

    // Highlight if correct
    if (balloon.isCorrect) {
        balloonsCtx.strokeStyle = '#ffe66d';
        balloonsCtx.lineWidth = 3;
        balloonsCtx.setLineDash([5, 5]);
        balloonsCtx.beginPath();
        balloonsCtx.ellipse(balloon.x, balloon.y, balloon.size / 2 + 5, balloon.size / 1.5 + 5, 0, 0, Math.PI * 2);
        balloonsCtx.stroke();
        balloonsCtx.setLineDash([]);
    }
}

function drawBow() {
    // Bow
    balloonsCtx.strokeStyle = '#8B4513';
    balloonsCtx.lineWidth = 6;
    balloonsCtx.beginPath();
    balloonsCtx.arc(bow.x, bow.y, 30, 0.3 * Math.PI, 0.7 * Math.PI, false);
    balloonsCtx.stroke();

    // Bowstring
    balloonsCtx.strokeStyle = '#666';
    balloonsCtx.lineWidth = 2;
    balloonsCtx.beginPath();
    balloonsCtx.moveTo(bow.x - 20, bow.y - 22);
    balloonsCtx.lineTo(bow.x - 20, bow.y + 22);
    balloonsCtx.stroke();

    // Archer emoji
    balloonsCtx.font = 'bold 50px Arial';
    balloonsCtx.textAlign = 'center';
    balloonsCtx.fillText('🏹', bow.x, bow.y + 10);
}

function handleBalloonPop(balloon, index) {
    balloons.splice(index, 1);

    if (balloon.isCorrect) {
        // Correct balloon popped!
        balloonsPopped++;
        balloonsScore += 12;
        updateScore(12);
        updateStars(1);

        document.getElementById('balloons-score').textContent = balloonsScore;
        document.getElementById('balloons-popped').textContent = balloonsPopped;

        createPopEffect(balloon.x, balloon.y, balloon.color);
        showBalloonsFeedback('💥 פופ! כל הכבוד!', true);

        if (balloonsPopped % 5 === 0) {
            celebrate();
        }
    } else {
        // Wrong balloon popped
        showBalloonsFeedback('❌ לא הבלון הנכון!', false);
        createPopEffect(balloon.x, balloon.y, balloon.color);
    }
}

function createPopEffect(x, y, color) {
    // Visual pop effect
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            if (balloonsCtx) {
                const angle = (Math.PI * 2 * i) / 8;
                const distance = i * 8;
                const px = x + Math.cos(angle) * distance;
                const py = y + Math.sin(angle) * distance;

                balloonsCtx.fillStyle = color;
                balloonsCtx.globalAlpha = 1 - (i * 0.12);
                balloonsCtx.beginPath();
                balloonsCtx.arc(px, py, 8 - i, 0, Math.PI * 2);
                balloonsCtx.fill();
                balloonsCtx.globalAlpha = 1;
            }
        }, i * 40);
    }
}

function showBalloonsFeedback(message, isSuccess) {
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
        box-shadow: 0 5px 20px rgba(0,0,0,0.5);
        z-index: 1000;
        animation: fadeInOut 1s ease;
        border: 3px solid white;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1000);
}

function cleanupBalloonsGame() {
    balloonsGameRunning = false;
    if (balloonsAnimationId) {
        cancelAnimationFrame(balloonsAnimationId);
        balloonsAnimationId = null;
    }
    document.removeEventListener('keydown', handleBalloonsKeyDown);
    if (balloonsCtx) {
        balloonsCtx.clearRect(0, 0, balloonsCanvas.width, balloonsCanvas.height);
    }
}

