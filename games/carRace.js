// Car Racing Game - מרוץ מכוניות אותיות
let carRaceCanvas, carRaceCtx;
let playerCar, rivalCars = [];
let currentRaceLetter = null;
let carSpeed = 5;
let raceDistance = 0;
let raceScore = 0;
let gameRunning = false;
let animationId = null;
let currentRaceQuestion = '';

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
    carSpeed = 5;
    gameRunning = true;

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="text-align: center;">
            <h2 class="question-text">🏁 מרוץ האותיות! 🏁</h2>
            <div style="background: linear-gradient(to bottom, #87ceeb 0%, #98d8e8 50%, #4a4a4a 50%, #5a5a5a 100%);
                        border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                <canvas id="car-race-canvas" width="600" height="400"
                        style="border: 4px solid #333; border-radius: 10px; background: linear-gradient(to bottom, #87ceeb 0%, #98d8e8 40%, #5a5a5a 40%, #6a6a6a 100%);"></canvas>

                <div id="race-question" style="font-size: 2em; color: #fff; background: #667eea;
                                               padding: 15px; border-radius: 10px; margin: 15px 0;
                                               font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    איזו אות?
                </div>

                <div id="race-options" style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                </div>

                <div style="display: flex; justify-content: space-around; margin-top: 20px; font-size: 1.3em; color: #fff; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                    <div>🏎️ מהירות: <strong><span id="speed-display">5</span></strong></div>
                    <div>📍 מרחק: <strong><span id="distance-display">0</span>מ'</strong></div>
                    <div>🏆 ניקוד: <strong><span id="race-score">0</span></strong></div>
                </div>
            </div>
        </div>
    `;

    carRaceCanvas = document.getElementById('car-race-canvas');
    carRaceCtx = carRaceCanvas.getContext('2d');

    // Initialize player car
    playerCar = {
        x: carRaceCanvas.width / 2 - 25,
        y: carRaceCanvas.height - 100,
        width: 50,
        height: 80,
        color: '#ff6b6b'
    };

    // Initialize rival cars
    initRivalCars();

    // Start the game loop
    nextRaceQuestion();
    gameLoop();
}

function initRivalCars() {
    rivalCars = [];
    for (let i = 0; i < 3; i++) {
        rivalCars.push({
            x: 100 + (i * 200),
            y: -100 - (i * 150),
            width: 50,
            height: 80,
            speed: 3 + Math.random() * 2,
            color: ['#4ecdc4', '#45b7d1', '#96ceb4'][i]
        });
    }
}

function nextRaceQuestion() {
    const questionData = raceWords[Math.floor(Math.random() * raceWords.length)];
    currentRaceLetter = questionData.letter;
    currentRaceQuestion = questionData.word;

    document.getElementById('race-question').innerHTML =
        `באיזו אות מתחילה המילה: <span style="color: #ffe66d; font-size: 1.2em;">${currentRaceQuestion}</span>`;

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
            font-size: 2.5em;
            padding: 20px 35px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 15px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';
        btn.onclick = () => checkRaceAnswer(letter, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkRaceAnswer(selectedLetter, btn) {
    if (!gameRunning) return;

    const allBtns = document.querySelectorAll('.race-option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (selectedLetter === currentRaceLetter) {
        // Correct answer - speed up!
        btn.style.background = '#51cf66';
        carSpeed += 2;
        raceScore += 10;
        updateScore(10);
        updateStars(1);

        // Show boost effect
        showBoostEffect('⚡ מהירות! ⚡');

        setTimeout(() => {
            nextRaceQuestion();
        }, 1000);
    } else {
        // Wrong answer - slow down
        btn.style.background = '#ff6b6b';
        carSpeed = Math.max(2, carSpeed - 1);

        showBoostEffect('😅 האט!');

        setTimeout(() => {
            btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            allBtns.forEach(b => b.disabled = false);
        }, 1000);
    }

    document.getElementById('speed-display').textContent = carSpeed;
    document.getElementById('race-score').textContent = raceScore;
}

function showBoostEffect(text) {
    const effect = document.createElement('div');
    effect.textContent = text;
    effect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3em;
        color: #ffe66d;
        font-weight: bold;
        text-shadow: 3px 3px 6px rgba(0,0,0,0.5);
        z-index: 1000;
        animation: fadeInOut 1s ease;
    `;
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}

function gameLoop() {
    if (!gameRunning) return;

    // Clear canvas
    carRaceCtx.clearRect(0, 0, carRaceCanvas.width, carRaceCanvas.height);

    // Draw road lines
    drawRoadLines();

    // Update and draw rival cars
    rivalCars.forEach(car => {
        car.y += carSpeed * 0.8;
        if (car.y > carRaceCanvas.height) {
            car.y = -car.height;
            car.x = 50 + Math.random() * (carRaceCanvas.width - 100);
        }
        drawCar(car.x, car.y, car.width, car.height, car.color);
    });

    // Draw player car
    drawCar(playerCar.x, playerCar.y, playerCar.width, playerCar.height, playerCar.color, true);

    // Update distance
    raceDistance += carSpeed * 0.1;
    document.getElementById('distance-display').textContent = Math.floor(raceDistance);

    animationId = requestAnimationFrame(gameLoop);
}

function drawRoadLines() {
    carRaceCtx.strokeStyle = '#fff';
    carRaceCtx.lineWidth = 4;
    carRaceCtx.setLineDash([20, 15]);
    carRaceCtx.beginPath();
    carRaceCtx.moveTo(carRaceCanvas.width / 2, 0);
    carRaceCtx.lineTo(carRaceCanvas.width / 2, carRaceCanvas.height);
    carRaceCtx.stroke();
    carRaceCtx.setLineDash([]);
}

function drawCar(x, y, width, height, color, isPlayer = false) {
    // Car body
    carRaceCtx.fillStyle = color;
    carRaceCtx.fillRect(x, y, width, height);

    // Car windows
    carRaceCtx.fillStyle = '#4a90e2';
    carRaceCtx.fillRect(x + 5, y + 10, width - 10, height * 0.3);

    // Wheels
    carRaceCtx.fillStyle = '#333';
    carRaceCtx.fillRect(x - 5, y + 15, 8, 15);
    carRaceCtx.fillRect(x + width - 3, y + 15, 8, 15);
    carRaceCtx.fillRect(x - 5, y + height - 30, 8, 15);
    carRaceCtx.fillRect(x + width - 3, y + height - 30, 8, 15);

    // Player indicator
    if (isPlayer) {
        carRaceCtx.fillStyle = '#ffe66d';
        carRaceCtx.font = 'bold 24px Arial';
        carRaceCtx.textAlign = 'center';
        carRaceCtx.fillText('⭐', x + width / 2, y - 10);
    }
}

// Cleanup when leaving the game
function cleanupCarRace() {
    gameRunning = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

// Add cleanup on back button
const originalBackToMenu = window.backToMenu;
window.backToMenu = function() {
    if (currentGame === 'carRace') {
        cleanupCarRace();
    }
    originalBackToMenu();
};
