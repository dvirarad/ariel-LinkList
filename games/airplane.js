// Letter Airplane Game - מטוס אותיות
let airplaneCanvas, airplaneCtx;
let airplane;
let airplaneClouds = [];
let birds = [];
let currentAirplaneLetter = null;
let currentAirplaneWord = '';
let airplaneGameRunning = false;
let airplaneAnimationId = null;
let airplaneScore = 0;
let altitude = 0;
let lettersCollected = 0;

const airplaneWords = [
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
    { word: 'מים', letter: 'מ' }
];

function initAirplaneGame() {
    airplaneScore = 0;
    altitude = 0;
    lettersCollected = 0;
    airplaneGameRunning = true;
    airplaneClouds = [];
    birds = [];

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="text-align: center;">
            <h2 class="question-text">✈️ מטוס אותיות! ✈️</h2>

            <div style="background: linear-gradient(to bottom, #1e3c72 0%, #2a5298 50%, #87ceeb 100%);
                        border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">

                <div style="background: rgba(255,255,255,0.95); padding: 15px; border-radius: 10px;
                           margin-bottom: 15px; border: 3px solid #667eea;">
                    <div id="airplane-question" style="font-size: 2em; color: #667eea; font-weight: bold;">
                        הכנס לענן הנכון!
                    </div>
                </div>

                <canvas id="airplane-canvas" width="700" height="500"
                        style="border: 4px solid #333; border-radius: 10px;
                               background: linear-gradient(to bottom, #1e3c72 0%, #2a5298 50%, #87ceeb 100%);"></canvas>

                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
                    <button id="airplane-btn-up"
                            style="font-size: 2em; padding: 15px 30px; background: #667eea; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">⬆️ למעלה</button>
                    <button id="airplane-btn-down"
                            style="font-size: 2em; padding: 15px 30px; background: #667eea; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">⬇️ למטה</button>
                </div>

                <div style="display: flex; justify-content: space-around; margin-top: 20px; font-size: 1.3em; color: #fff; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                    <div style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 10px;">
                        🏆 ניקוד: <span id="airplane-score">0</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 10px;">
                        ⬆️ גובה: <span id="altitude">0</span>מ'
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 10px;">
                        ✅ אותיות: <span id="letters-collected">0</span>
                    </div>
                </div>
            </div>

            <div style="margin-top: 15px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 10px; font-size: 1.1em; color: #666;">
                💡 <strong>הוראות:</strong> העף את המטוס למעלה ולמטה, היכנס לענן עם האות הנכונה!
            </div>
        </div>
    `;

    airplaneCanvas = document.getElementById('airplane-canvas');
    airplaneCtx = airplaneCanvas.getContext('2d');

    // Initialize airplane
    airplane = {
        x: 150,
        y: airplaneCanvas.height / 2,
        width: 80,
        height: 40,
        vy: 0,
        targetY: airplaneCanvas.height / 2,
        speed: 4
    };

    // Button controls
    document.getElementById('airplane-btn-up').addEventListener('mousedown', () => moveAirplaneUp());
    document.getElementById('airplane-btn-down').addEventListener('mousedown', () => moveAirplaneDown());

    // Keyboard controls
    document.addEventListener('keydown', handleAirplaneKeyDown);

    // Create initial birds
    for (let i = 0; i < 3; i++) {
        createBird();
    }

    // Start new question
    nextAirplaneQuestion();

    // Register cleanup function
    currentGameCleanup = cleanupAirplaneGame;

    // Start game loop
    airplaneGameLoop();
}

function nextAirplaneQuestion() {
    const questionData = airplaneWords[Math.floor(Math.random() * airplaneWords.length)];
    currentAirplaneLetter = questionData.letter;
    currentAirplaneWord = questionData.word;

    document.getElementById('airplane-question').innerHTML =
        `היכנס לענן: <span style="color: #ffe66d; font-size: 1.3em;">${currentAirplaneLetter}</span> (מתחיל את <span style="color: #51cf66;">${currentAirplaneWord}</span>)`;

    // Create airplaneClouds
    createAirplaneClouds();
}

function createAirplaneClouds() {
    airplaneClouds = [];

    // Add correct cloud
    airplaneClouds.push({
        x: airplaneCanvas.width + 50,
        y: 100 + Math.random() * 300,
        size: 60,
        letter: currentAirplaneLetter,
        speed: 2 + Math.random() * 0.5,
        isCorrect: true
    });

    // Add wrong airplaneClouds
    const wrongLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ'].filter(l => l !== currentAirplaneLetter);
    for (let i = 0; i < 3; i++) {
        airplaneClouds.push({
            x: airplaneCanvas.width + 50 + (i * 180),
            y: 100 + Math.random() * 300,
            size: 60,
            letter: wrongLetters[Math.floor(Math.random() * wrongLetters.length)],
            speed: 2 + Math.random() * 0.5,
            isCorrect: false
        });
    }
}

function createBird() {
    birds.push({
        x: airplaneCanvas.width + Math.random() * 200,
        y: 50 + Math.random() * 300,
        speed: 1 + Math.random() * 0.5,
        flapOffset: Math.random() * Math.PI * 2
    });
}

function handleAirplaneKeyDown(e) {
    if (!airplaneGameRunning) return;

    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            moveAirplaneUp();
            e.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            moveAirplaneDown();
            e.preventDefault();
            break;
    }
}

function moveAirplaneUp() {
    if (!airplaneGameRunning) return;
    airplane.targetY = Math.max(50, airplane.targetY - 50);
}

function moveAirplaneDown() {
    if (!airplaneGameRunning) return;
    airplane.targetY = Math.min(airplaneCanvas.height - 50, airplane.targetY + 50);
}

function airplaneGameLoop() {
    if (!airplaneGameRunning) return;

    // Clear canvas
    airplaneCtx.clearRect(0, 0, airplaneCanvas.width, airplaneCanvas.height);

    // Draw sky with gradient
    const skyGradient = airplaneCtx.createLinearGradient(0, 0, 0, airplaneCanvas.height);
    skyGradient.addColorStop(0, '#1e3c72');
    skyGradient.addColorStop(0.5, '#2a5298');
    skyGradient.addColorStop(1, '#87ceeb');
    airplaneCtx.fillStyle = skyGradient;
    airplaneCtx.fillRect(0, 0, airplaneCanvas.width, airplaneCanvas.height);

    // Draw sun
    drawSun();

    // Update and draw birds
    updateAndDrawBirds();

    // Update and draw airplaneClouds
    updateAndDrawClouds();

    // Update and draw airplane
    updateAndDrawAirplane();

    airplaneAnimationId = requestAnimationFrame(airplaneGameLoop);
}

function drawSun() {
    airplaneCtx.fillStyle = '#FFD700';
    airplaneCtx.shadowBlur = 20;
    airplaneCtx.shadowColor = '#FFD700';
    airplaneCtx.beginPath();
    airplaneCtx.arc(650, 50, 40, 0, Math.PI * 2);
    airplaneCtx.fill();
    airplaneCtx.shadowBlur = 0;

    // Sun rays
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        airplaneCtx.strokeStyle = '#FFD700';
        airplaneCtx.lineWidth = 3;
        airplaneCtx.beginPath();
        airplaneCtx.moveTo(650 + Math.cos(angle) * 45, 50 + Math.sin(angle) * 45);
        airplaneCtx.lineTo(650 + Math.cos(angle) * 60, 50 + Math.sin(angle) * 60);
        airplaneCtx.stroke();
    }
}

function updateAndDrawBirds() {
    birds = birds.filter(bird => {
        bird.x -= bird.speed;
        bird.flapOffset += 0.1;

        if (bird.x < -50) {
            createBird();
            return false;
        }

        // Draw bird
        airplaneCtx.fillStyle = '#333';
        const wingY = Math.sin(bird.flapOffset) * 8;

        // Bird body
        airplaneCtx.beginPath();
        airplaneCtx.moveTo(bird.x, bird.y);
        airplaneCtx.lineTo(bird.x - 10, bird.y + wingY);
        airplaneCtx.lineTo(bird.x - 15, bird.y);
        airplaneCtx.lineTo(bird.x - 10, bird.y - wingY);
        airplaneCtx.closePath();
        airplaneCtx.fill();

        airplaneCtx.beginPath();
        airplaneCtx.moveTo(bird.x, bird.y);
        airplaneCtx.lineTo(bird.x + 10, bird.y + wingY);
        airplaneCtx.lineTo(bird.x + 15, bird.y);
        airplaneCtx.lineTo(bird.x + 10, bird.y - wingY);
        airplaneCtx.closePath();
        airplaneCtx.fill();

        return true;
    });
}

function updateAndDrawClouds() {
    airplaneClouds = airplaneClouds.filter(cloud => {
        cloud.x -= cloud.speed;

        drawCloud(cloud);

        // Check collision with airplane
        const distance = Math.sqrt(
            Math.pow(airplane.x - cloud.x, 2) +
            Math.pow(airplane.y - cloud.y, 2)
        );

        if (distance < airplane.width / 2 + cloud.size / 2) {
            handleCloudEntry(cloud);
            return false;
        }

        // Remove if off screen
        if (cloud.x < -100) {
            if (cloud.isCorrect) {
                showAirplaneFeedback('😢 פספסת את הענן הנכון!', false);
            }
            return false;
        }

        return true;
    });

    // Check if need new question
    if (airplaneClouds.length === 0) {
        setTimeout(() => {
            if (airplaneGameRunning) {
                nextAirplaneQuestion();
            }
        }, 1500);
    }
}

function drawCloud(cloud) {
    // Cloud shadow/depth
    airplaneCtx.fillStyle = 'rgba(200, 200, 200, 0.4)';
    airplaneCtx.beginPath();
    airplaneCtx.arc(cloud.x + 5, cloud.y + 5, cloud.size * 0.6, 0, Math.PI * 2);
    airplaneCtx.arc(cloud.x + cloud.size * 0.8 + 5, cloud.y + 5, cloud.size * 0.7, 0, Math.PI * 2);
    airplaneCtx.arc(cloud.x + cloud.size * 1.5 + 5, cloud.y + 5, cloud.size * 0.6, 0, Math.PI * 2);
    airplaneCtx.fill();

    // Cloud main color
    airplaneCtx.fillStyle = cloud.isCorrect ? 'rgba(255, 230, 109, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    airplaneCtx.beginPath();
    airplaneCtx.arc(cloud.x, cloud.y, cloud.size * 0.6, 0, Math.PI * 2);
    airplaneCtx.arc(cloud.x + cloud.size * 0.8, cloud.y, cloud.size * 0.7, 0, Math.PI * 2);
    airplaneCtx.arc(cloud.x + cloud.size * 1.5, cloud.y, cloud.size * 0.6, 0, Math.PI * 2);
    airplaneCtx.fill();

    // Letter
    airplaneCtx.fillStyle = cloud.isCorrect ? '#333' : '#667eea';
    airplaneCtx.font = 'bold 36px Arial';
    airplaneCtx.textAlign = 'center';
    airplaneCtx.textBaseline = 'middle';
    airplaneCtx.fillText(cloud.letter, cloud.x + cloud.size * 0.75, cloud.y);

    // Highlight if correct
    if (cloud.isCorrect) {
        airplaneCtx.strokeStyle = '#ffd93d';
        airplaneCtx.lineWidth = 3;
        airplaneCtx.setLineDash([5, 5]);
        airplaneCtx.beginPath();
        airplaneCtx.arc(cloud.x + cloud.size * 0.75, cloud.y, cloud.size * 0.9, 0, Math.PI * 2);
        airplaneCtx.stroke();
        airplaneCtx.setLineDash([]);
    }
}

function updateAndDrawAirplane() {
    // Smooth movement towards target
    if (airplane.y < airplane.targetY) {
        airplane.y = Math.min(airplane.targetY, airplane.y + airplane.speed);
    } else if (airplane.y > airplane.targetY) {
        airplane.y = Math.max(airplane.targetY, airplane.y - airplane.speed);
    }

    // Keep in bounds
    airplane.y = Math.max(40, Math.min(airplaneCanvas.height - 40, airplane.y));

    // Draw airplane
    drawAirplane();
}

function drawAirplane() {
    // Airplane body
    airplaneCtx.fillStyle = '#667eea';
    airplaneCtx.beginPath();
    airplaneCtx.ellipse(airplane.x, airplane.y, airplane.width / 2, airplane.height / 2.5, 0, 0, Math.PI * 2);
    airplaneCtx.fill();

    // Airplane nose
    airplaneCtx.fillStyle = '#764ba2';
    airplaneCtx.beginPath();
    airplaneCtx.moveTo(airplane.x + airplane.width / 2, airplane.y);
    airplaneCtx.lineTo(airplane.x + airplane.width / 2 + 15, airplane.y - 5);
    airplaneCtx.lineTo(airplane.x + airplane.width / 2 + 15, airplane.y + 5);
    airplaneCtx.closePath();
    airplaneCtx.fill();

    // Wings
    airplaneCtx.fillStyle = '#4ecdc4';
    airplaneCtx.beginPath();
    airplaneCtx.moveTo(airplane.x - 10, airplane.y);
    airplaneCtx.lineTo(airplane.x - 25, airplane.y - 25);
    airplaneCtx.lineTo(airplane.x + 10, airplane.y - 10);
    airplaneCtx.closePath();
    airplaneCtx.fill();

    airplaneCtx.beginPath();
    airplaneCtx.moveTo(airplane.x - 10, airplane.y);
    airplaneCtx.lineTo(airplane.x - 25, airplane.y + 25);
    airplaneCtx.lineTo(airplane.x + 10, airplane.y + 10);
    airplaneCtx.closePath();
    airplaneCtx.fill();

    // Tail
    airplaneCtx.fillStyle = '#4ecdc4';
    airplaneCtx.beginPath();
    airplaneCtx.moveTo(airplane.x - airplane.width / 2, airplane.y);
    airplaneCtx.lineTo(airplane.x - airplane.width / 2 - 10, airplane.y - 15);
    airplaneCtx.lineTo(airplane.x - airplane.width / 2 + 5, airplane.y);
    airplaneCtx.closePath();
    airplaneCtx.fill();

    // Window
    airplaneCtx.fillStyle = '#87ceeb';
    airplaneCtx.beginPath();
    airplaneCtx.arc(airplane.x + 15, airplane.y, 8, 0, Math.PI * 2);
    airplaneCtx.fill();

    // Propeller (spinning)
    const propAngle = (Date.now() / 50) % (Math.PI * 2);
    airplaneCtx.strokeStyle = 'rgba(102, 126, 234, 0.5)';
    airplaneCtx.lineWidth = 3;
    airplaneCtx.beginPath();
    airplaneCtx.moveTo(
        airplane.x + airplane.width / 2 + 15 + Math.cos(propAngle) * 15,
        airplane.y + Math.sin(propAngle) * 15
    );
    airplaneCtx.lineTo(
        airplane.x + airplane.width / 2 + 15 - Math.cos(propAngle) * 15,
        airplane.y - Math.sin(propAngle) * 15
    );
    airplaneCtx.stroke();
}

function handleCloudEntry(cloud) {
    if (cloud.isCorrect) {
        // Correct cloud!
        lettersCollected++;
        altitude += 100;
        airplaneScore += 15;
        updateScore(15);
        updateStars(1);

        document.getElementById('airplane-score').textContent = airplaneScore;
        document.getElementById('altitude').textContent = altitude;
        document.getElementById('letters-collected').textContent = lettersCollected;

        showAirplaneFeedback('✈️ כל הכבוד! עולים גבוה יותר!', true);

        if (lettersCollected % 5 === 0) {
            celebrate();
        }
    } else {
        // Wrong cloud
        showAirplaneFeedback('❌ לא הענן הנכון!', false);
    }
}

function showAirplaneFeedback(message, isSuccess) {
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

function cleanupAirplaneGame() {
    airplaneGameRunning = false;
    if (airplaneAnimationId) {
        cancelAnimationFrame(airplaneAnimationId);
        airplaneAnimationId = null;
    }
    document.removeEventListener('keydown', handleAirplaneKeyDown);
    if (airplaneCtx) {
        airplaneCtx.clearRect(0, 0, airplaneCanvas.width, airplaneCanvas.height);
    }
}

