// Space Game - חלל האותיות
let spaceCanvas, spaceCtx;
let spaceship;
let meteors = [];
let stars = [];
let bullets = [];
let currentSpaceLetter = null;
let currentSpaceWord = '';
let spaceGameRunning = false;
let spaceAnimationId = null;
let spaceScore = 0;
let meteorsDestroyed = 0;
let spaceKeys = {};

const spaceWords = [
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
    { word: 'פיל', letter: 'פ' },
    { word: 'ציפור', letter: 'צ' },
    { word: 'קוף', letter: 'ק' },
    { word: 'רכבת', letter: 'ר' },
    { word: 'שמש', letter: 'ש' },
    { word: 'תפוח', letter: 'ת' }
];

const spaceLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];

function initSpaceGame() {
    spaceScore = 0;
    meteorsDestroyed = 0;
    spaceGameRunning = true;
    meteors = [];
    bullets = [];
    spaceKeys = {};

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="text-align: center;">
            <h2 class="question-text">🚀 חלל האותיות! 🚀</h2>

            <div style="background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                        border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">

                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;
                           margin-bottom: 15px; backdrop-filter: blur(10px);">
                    <div id="space-question" style="font-size: 1.8em; color: #fff; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                        ירה על המטאור הנכון!
                    </div>
                </div>

                <canvas id="space-canvas" width="700" height="500"
                        style="border: 4px solid #667eea; border-radius: 10px;
                               background: radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1e 100%);
                               box-shadow: inset 0 0 50px rgba(102, 126, 234, 0.3);"></canvas>

                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
                    <button onmousedown="spaceKeys.left = true" onmouseup="spaceKeys.left = false"
                            style="font-size: 2em; padding: 15px 30px; background: #667eea; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">⬅️ שמאל</button>
                    <button onclick="shootBullet()"
                            style="font-size: 2em; padding: 15px 30px; background: #ff6b6b; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">🔥 ירה!</button>
                    <button onmousedown="spaceKeys.right = true" onmouseup="spaceKeys.right = false"
                            style="font-size: 2em; padding: 15px 30px; background: #667eea; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">ימין ➡️</button>
                </div>

                <div style="display: flex; justify-content: space-around; margin-top: 20px; font-size: 1.3em; color: #fff; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                    <div>🏆 ניקוד: <span id="space-score">0</span></div>
                    <div>💥 מטאורים: <span id="meteors-destroyed">0</span></div>
                </div>
            </div>
        </div>
    `;

    spaceCanvas = document.getElementById('space-canvas');
    spaceCtx = spaceCanvas.getContext('2d');

    // Initialize spaceship
    spaceship = {
        x: spaceCanvas.width / 2,
        y: spaceCanvas.height - 80,
        width: 50,
        height: 60,
        speed: 6
    };

    // Create stars
    createStars();

    // Start new question
    nextSpaceQuestion();

    // Keyboard controls
    document.addEventListener('keydown', handleSpaceKeyDown);
    document.addEventListener('keyup', handleSpaceKeyUp);

    // Start game loop
    spaceGameLoop();
}

function createStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * spaceCanvas.width,
            y: Math.random() * spaceCanvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.2
        });
    }
}

function nextSpaceQuestion() {
    const questionData = spaceWords[Math.floor(Math.random() * spaceWords.length)];
    currentSpaceLetter = questionData.letter;
    currentSpaceWord = questionData.word;

    document.getElementById('space-question').innerHTML =
        `ירה על המטאור עם האות הראשונה של: <span style="color: #ffe66d; font-size: 1.2em;">${currentSpaceWord}</span> ← ${currentSpaceLetter}`;

    // Create meteors
    createMeteors();
}

function createMeteors() {
    meteors = [];

    // Add correct meteor
    meteors.push({
        x: Math.random() * (spaceCanvas.width - 80) + 40,
        y: -50,
        size: 45,
        letter: currentSpaceLetter,
        speed: 1 + Math.random() * 1.5,
        isCorrect: true,
        rotation: Math.random() * Math.PI * 2
    });

    // Add wrong meteors
    const wrongLetters = spaceLetters.filter(l => l !== currentSpaceLetter);
    for (let i = 0; i < 3; i++) {
        meteors.push({
            x: Math.random() * (spaceCanvas.width - 80) + 40,
            y: -50 - (i * 100),
            size: 45,
            letter: wrongLetters[Math.floor(Math.random() * wrongLetters.length)],
            speed: 1 + Math.random() * 1.5,
            isCorrect: false,
            rotation: Math.random() * Math.PI * 2
        });
    }
}

function handleSpaceKeyDown(e) {
    if (!spaceGameRunning) return;

    switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            spaceKeys.left = true;
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            spaceKeys.right = true;
            e.preventDefault();
            break;
        case ' ':
        case 'Enter':
            shootBullet();
            e.preventDefault();
            break;
    }
}

function handleSpaceKeyUp(e) {
    switch(e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            spaceKeys.left = false;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            spaceKeys.right = false;
            break;
    }
}

function shootBullet() {
    if (!spaceGameRunning) return;

    bullets.push({
        x: spaceship.x,
        y: spaceship.y - 20,
        width: 4,
        height: 15,
        speed: 8
    });
}

function spaceGameLoop() {
    if (!spaceGameRunning) return;

    // Clear canvas
    spaceCtx.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);

    // Draw and update stars
    stars.forEach(star => {
        spaceCtx.fillStyle = `rgba(255, 255, 255, ${star.size / 2})`;
        spaceCtx.fillRect(star.x, star.y, star.size, star.size);
        star.y += star.speed;
        if (star.y > spaceCanvas.height) {
            star.y = 0;
            star.x = Math.random() * spaceCanvas.width;
        }
    });

    // Update spaceship position
    if (spaceKeys.left) {
        spaceship.x = Math.max(spaceship.width / 2, spaceship.x - spaceship.speed);
    }
    if (spaceKeys.right) {
        spaceship.x = Math.min(spaceCanvas.width - spaceship.width / 2, spaceship.x + spaceship.speed);
    }

    // Draw spaceship
    drawSpaceship();

    // Update and draw bullets
    bullets = bullets.filter(bullet => {
        bullet.y -= bullet.speed;

        // Draw bullet
        spaceCtx.fillStyle = '#ffe66d';
        spaceCtx.shadowBlur = 10;
        spaceCtx.shadowColor = '#ffe66d';
        spaceCtx.fillRect(bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);
        spaceCtx.shadowBlur = 0;

        // Check collision with meteors
        for (let i = 0; i < meteors.length; i++) {
            const meteor = meteors[i];
            const distance = Math.sqrt(
                Math.pow(bullet.x - meteor.x, 2) +
                Math.pow(bullet.y - meteor.y, 2)
            );

            if (distance < meteor.size) {
                handleMeteorHit(meteor, i);
                return false; // Remove bullet
            }
        }

        return bullet.y > 0; // Keep bullet if still on screen
    });

    // Update and draw meteors
    meteors = meteors.filter(meteor => {
        meteor.y += meteor.speed;
        meteor.rotation += 0.02;

        drawMeteor(meteor);

        // Check if meteor passed the screen
        if (meteor.y > spaceCanvas.height + 50) {
            if (meteor.isCorrect) {
                showSpaceFeedback('😢 פספסת את המטאור הנכון!', false);
            }
            return false;
        }

        return true;
    });

    // Check if need new question
    if (meteors.length === 0) {
        setTimeout(() => {
            nextSpaceQuestion();
        }, 1000);
    }

    spaceAnimationId = requestAnimationFrame(spaceGameLoop);
}

function drawSpaceship() {
    // Spaceship body
    spaceCtx.fillStyle = '#667eea';
    spaceCtx.beginPath();
    spaceCtx.moveTo(spaceship.x, spaceship.y - spaceship.height / 2);
    spaceCtx.lineTo(spaceship.x - spaceship.width / 2, spaceship.y + spaceship.height / 2);
    spaceCtx.lineTo(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height / 2);
    spaceCtx.closePath();
    spaceCtx.fill();

    // Spaceship glow
    spaceCtx.shadowBlur = 15;
    spaceCtx.shadowColor = '#667eea';
    spaceCtx.fill();
    spaceCtx.shadowBlur = 0;

    // Spaceship details
    spaceCtx.fillStyle = '#4ecdc4';
    spaceCtx.beginPath();
    spaceCtx.arc(spaceship.x, spaceship.y, 8, 0, Math.PI * 2);
    spaceCtx.fill();

    // Rocket emoji
    spaceCtx.font = 'bold 35px Arial';
    spaceCtx.textAlign = 'center';
    spaceCtx.fillText('🚀', spaceship.x, spaceship.y + 10);
}

function drawMeteor(meteor) {
    spaceCtx.save();
    spaceCtx.translate(meteor.x, meteor.y);
    spaceCtx.rotate(meteor.rotation);

    // Meteor body
    spaceCtx.fillStyle = meteor.isCorrect ? '#51cf66' : '#ff6b6b';
    spaceCtx.beginPath();
    spaceCtx.arc(0, 0, meteor.size / 2, 0, Math.PI * 2);
    spaceCtx.fill();

    // Meteor border
    spaceCtx.strokeStyle = meteor.isCorrect ? '#40c057' : '#ff5252';
    spaceCtx.lineWidth = 3;
    spaceCtx.stroke();

    // Letter
    spaceCtx.fillStyle = '#fff';
    spaceCtx.font = 'bold 28px Arial';
    spaceCtx.textAlign = 'center';
    spaceCtx.textBaseline = 'middle';
    spaceCtx.fillText(meteor.letter, 0, 0);

    spaceCtx.restore();
}

function handleMeteorHit(meteor, index) {
    meteors.splice(index, 1);

    if (meteor.isCorrect) {
        // Correct meteor hit!
        meteorsDestroyed++;
        spaceScore += 15;
        updateScore(15);
        updateStars(1);

        document.getElementById('space-score').textContent = spaceScore;
        document.getElementById('meteors-destroyed').textContent = meteorsDestroyed;

        createExplosion(meteor.x, meteor.y, '#51cf66');
        showSpaceFeedback('💥 פיצוץ מושלם!', true);

        if (meteorsDestroyed % 5 === 0) {
            celebrate();
        }
    } else {
        // Wrong meteor hit
        showSpaceFeedback('❌ לא המטאור הנכון!', false);
        createExplosion(meteor.x, meteor.y, '#ff6b6b');
    }
}

function createExplosion(x, y, color) {
    // Visual explosion effect
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            spaceCtx.fillStyle = color;
            spaceCtx.globalAlpha = 1 - (i * 0.1);
            spaceCtx.beginPath();
            spaceCtx.arc(x, y, (i + 1) * 5, 0, Math.PI * 2);
            spaceCtx.fill();
            spaceCtx.globalAlpha = 1;
        }, i * 30);
    }
}

function showSpaceFeedback(message, isSuccess) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 25%;
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
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1000);
}

function cleanupSpaceGame() {
    spaceGameRunning = false;
    if (spaceAnimationId) {
        cancelAnimationFrame(spaceAnimationId);
    }
    document.removeEventListener('keydown', handleSpaceKeyDown);
    document.removeEventListener('keyup', handleSpaceKeyUp);
    spaceKeys = {};
}

// Update backToMenu function
const originalBackToMenu3 = window.backToMenu;
window.backToMenu = function() {
    if (currentGame === 'space') {
        cleanupSpaceGame();
    }
    if (currentGame === 'tractor') {
        cleanupTractorGame();
    }
    if (currentGame === 'carRace') {
        cleanupCarRace();
    }
    currentGame = null;
    document.getElementById('game-menu').classList.remove('hidden');
    document.getElementById('game-container').classList.add('hidden');
};
