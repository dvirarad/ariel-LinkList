// Car Racing Game - מרוץ מכוניות אותיות
let carRaceCanvas, carRaceCtx;
let playerCar, rivalCars = [];
let currentRaceLetter = null;
let carSpeed = 3;
let raceDistance = 0;
let raceScore = 0;
let gameRunning = false;
let animationId = null;
let currentRaceQuestion = '';
let roadOffset = 0;
let canAnswer = true;

const hebrewLettersRace = [
    'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י',
    'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'
];

const raceWords = [
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

function initCarRaceGame() {
    raceScore = 0;
    raceDistance = 0;
    carSpeed = 3;
    gameRunning = true;
    roadOffset = 0;
    canAnswer = true;

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="text-align: center;">
            <h2 class="question-text">🏁 מרוץ האותיות! 🏁</h2>
            <p style="font-size: 1.3em; color: #667eea; margin-bottom: 15px;">ענה נכון כדי להאיץ! הגע למטרה ראשון!</p>

            <div style="background: linear-gradient(to bottom, #87ceeb 0%, #98d8e8 50%, #4a4a4a 50%, #5a5a5a 100%);
                        border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">

                <canvas id="car-race-canvas" width="600" height="400"
                        style="border: 4px solid #333; border-radius: 10px; background: #5a5a5a;"></canvas>

                <div id="race-question" style="font-size: 2.2em; color: #fff; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                               padding: 20px; border-radius: 15px; margin: 20px 0;
                                               font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                                               border: 4px solid #ffe66d;">
                    איזו אות?
                </div>

                <div id="race-options" style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin: 20px 0;">
                </div>

                <div style="display: flex; justify-content: space-around; margin-top: 20px; font-size: 1.5em; color: #fff; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-weight: bold;">
                    <div style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 10px;">
                        ⚡ מהירות: <span id="speed-display">3</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 10px;">
                        📍 מרחק: <span id="distance-display">0</span>מ'
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 10px;">
                        🏆 ניקוד: <span id="race-score">0</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    carRaceCanvas = document.getElementById('car-race-canvas');
    carRaceCtx = carRaceCanvas.getContext('2d');

    // Initialize player car
    playerCar = {
        x: carRaceCanvas.width / 2 - 25,
        y: carRaceCanvas.height - 120,
        width: 50,
        height: 80,
        color: '#ff6b6b'
    };

    // Initialize rival cars
    initRivalCars();

    // Register cleanup function
    currentGameCleanup = cleanupCarRace;

    // Start the game loop
    nextRaceQuestion();
    gameLoop();
}

function initRivalCars() {
    rivalCars = [];
    for (let i = 0; i < 2; i++) {
        rivalCars.push({
            x: 150 + (i * 250),
            y: -100 - (i * 200),
            width: 50,
            height: 80,
            speed: 2 + Math.random(),
            color: ['#4ecdc4', '#45b7d1'][i]
        });
    }
}

function nextRaceQuestion() {
    const questionData = raceWords[Math.floor(Math.random() * raceWords.length)];
    currentRaceLetter = questionData.letter;
    currentRaceQuestion = questionData.word;
    canAnswer = true;

    document.getElementById('race-question').innerHTML =
        `באיזו אות מתחילה: <span style="color: #ffe66d; font-size: 1.3em;">${currentRaceQuestion}</span> ❓`;

    // Create answer options
    const wrongLetters = hebrewLettersRace.filter(l => l !== currentRaceLetter);
    const options = shuffleArray([
        currentRaceLetter,
        ...getRandomItems(wrongLetters, 3)
    ]);

    const optionsContainer = document.getElementById('race-options');
    optionsContainer.innerHTML = '';

    options.forEach(letter => {
        const btn = document.createElement('button');
        btn.textContent = letter;
        btn.className = 'race-option-btn';
        btn.style.cssText = `
            font-size: 3em;
            padding: 20px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: 3px solid #ffe66d;
            border-radius: 15px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        btn.onmouseover = () => {
            if (canAnswer) btn.style.transform = 'scale(1.15)';
        };
        btn.onmouseout = () => btn.style.transform = 'scale(1)';
        btn.onclick = () => checkRaceAnswer(letter, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkRaceAnswer(selectedLetter, btn) {
    if (!gameRunning || !canAnswer) return;

    canAnswer = false;
    const allBtns = document.querySelectorAll('.race-option-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if (selectedLetter === currentRaceLetter) {
        // Correct answer - speed up!
        btn.style.background = '#51cf66';
        btn.style.border = '3px solid #40c057';
        carSpeed = Math.min(8, carSpeed + 1.5);
        raceScore += 10;
        updateScore(10);
        updateStars(1);

        showBoostEffect('⚡ כל הכבוד! מהירות! ⚡');

        setTimeout(() => {
            nextRaceQuestion();
        }, 1200);
    } else {
        // Wrong answer - slow down
        btn.style.background = '#ff6b6b';
        btn.style.border = '3px solid #ff5252';
        carSpeed = Math.max(1.5, carSpeed - 0.8);

        showBoostEffect('🐌 אופס! האטה...');

        setTimeout(() => {
            canAnswer = true;
            allBtns.forEach(b => b.style.pointerEvents = 'auto');
        }, 1200);
    }

    document.getElementById('speed-display').textContent = Math.floor(carSpeed);
    document.getElementById('race-score').textContent = raceScore;
}

function showBoostEffect(text) {
    const effect = document.createElement('div');
    effect.textContent = text;
    effect.style.cssText = `
        position: fixed;
        top: 35%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2.5em;
        color: white;
        font-weight: bold;
        background: rgba(0,0,0,0.8);
        padding: 20px 40px;
        border-radius: 15px;
        text-shadow: 3px 3px 6px rgba(0,0,0,0.5);
        z-index: 1000;
        animation: fadeInOut 1.2s ease;
        border: 3px solid #ffe66d;
    `;
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 1200);
}

function gameLoop() {
    if (!gameRunning) return;

    // Clear canvas
    carRaceCtx.clearRect(0, 0, carRaceCanvas.width, carRaceCanvas.height);

    // Draw background
    carRaceCtx.fillStyle = '#5a5a5a';
    carRaceCtx.fillRect(0, 0, carRaceCanvas.width, carRaceCanvas.height);

    // Draw road lines with animation
    roadOffset += carSpeed;
    if (roadOffset > 40) roadOffset = 0;

    drawRoadLines();

    // Update and draw rival cars
    rivalCars.forEach(car => {
        car.y += carSpeed * 1.2;
        if (car.y > carRaceCanvas.height) {
            car.y = -car.height - 100;
            car.x = 100 + Math.random() * (carRaceCanvas.width - 200);
        }
        drawCar(car.x, car.y, car.width, car.height, car.color);
    });

    // Draw player car (with bounce effect)
    const bounce = Math.sin(Date.now() / 100) * 3;
    drawCar(playerCar.x, playerCar.y + bounce, playerCar.width, playerCar.height, playerCar.color, true);

    // Update distance
    raceDistance += carSpeed * 0.15;
    document.getElementById('distance-display').textContent = Math.floor(raceDistance);

    // Check milestones
    if (Math.floor(raceDistance) % 100 === 0 && Math.floor(raceDistance) > 0) {
        if (!window.lastMilestone || window.lastMilestone !== Math.floor(raceDistance)) {
            window.lastMilestone = Math.floor(raceDistance);
            celebrate();
        }
    }

    animationId = requestAnimationFrame(gameLoop);
}

function drawRoadLines() {
    carRaceCtx.strokeStyle = '#fff';
    carRaceCtx.lineWidth = 5;
    carRaceCtx.setLineDash([30, 20]);
    carRaceCtx.lineDashOffset = -roadOffset;

    // Center line
    carRaceCtx.beginPath();
    carRaceCtx.moveTo(carRaceCanvas.width / 2, 0);
    carRaceCtx.lineTo(carRaceCanvas.width / 2, carRaceCanvas.height);
    carRaceCtx.stroke();

    // Side lines
    carRaceCtx.strokeStyle = '#ffe66d';
    carRaceCtx.lineWidth = 4;
    carRaceCtx.setLineDash([]);

    carRaceCtx.beginPath();
    carRaceCtx.moveTo(50, 0);
    carRaceCtx.lineTo(50, carRaceCanvas.height);
    carRaceCtx.stroke();

    carRaceCtx.beginPath();
    carRaceCtx.moveTo(carRaceCanvas.width - 50, 0);
    carRaceCtx.lineTo(carRaceCanvas.width - 50, carRaceCanvas.height);
    carRaceCtx.stroke();

    carRaceCtx.setLineDash([]);
}

function drawCar(x, y, width, height, color, isPlayer = false) {
    // Car shadow
    carRaceCtx.fillStyle = 'rgba(0,0,0,0.3)';
    carRaceCtx.fillRect(x + 5, y + 5, width, height);

    // Car body
    carRaceCtx.fillStyle = color;
    carRaceCtx.fillRect(x, y, width, height);

    // Car windows
    carRaceCtx.fillStyle = '#4a90e2';
    carRaceCtx.fillRect(x + 8, y + 15, width - 16, height * 0.25);

    // Wheels
    carRaceCtx.fillStyle = '#222';
    carRaceCtx.fillRect(x - 3, y + 20, 8, 16);
    carRaceCtx.fillRect(x + width - 5, y + 20, 8, 16);
    carRaceCtx.fillRect(x - 3, y + height - 36, 8, 16);
    carRaceCtx.fillRect(x + width - 5, y + height - 36, 8, 16);

    // Player indicator
    if (isPlayer) {
        carRaceCtx.fillStyle = '#ffe66d';
        carRaceCtx.font = 'bold 30px Arial';
        carRaceCtx.textAlign = 'center';
        carRaceCtx.fillText('⭐', x + width / 2, y - 10);

        // Speed lines
        for (let i = 0; i < 3; i++) {
            carRaceCtx.strokeStyle = `rgba(255, 230, 109, ${0.5 - i * 0.15})`;
            carRaceCtx.lineWidth = 3;
            carRaceCtx.beginPath();
            carRaceCtx.moveTo(x - 10 - (i * 8), y + 20 + (i * 10));
            carRaceCtx.lineTo(x - 20 - (i * 8), y + 25 + (i * 10));
            carRaceCtx.stroke();

            carRaceCtx.beginPath();
            carRaceCtx.moveTo(x + width + 10 + (i * 8), y + 20 + (i * 10));
            carRaceCtx.lineTo(x + width + 20 + (i * 8), y + 25 + (i * 10));
            carRaceCtx.stroke();
        }
    }
}

// Cleanup when leaving the game
function cleanupCarRace() {
    gameRunning = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    window.lastMilestone = null;
}
