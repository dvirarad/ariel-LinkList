// Letter Train Game - רכבת המילים
let trainCanvas, trainCtx;
let train;
let trainCars = [];
let availableTrainLetters = [];
let targetTrainWord = null;
let trainGameRunning = false;
let trainAnimationId = null;
let trainScore = 0;
let stationsReached = 0;
let sceneryOffset = 0;
let mountains = [];
let trainTrees = [];

const trainWords = [
    'רכבת', 'תחנה', 'נהג', 'נוסע', 'כרטיס', 'מסילה',
    'אבא', 'אמא', 'כלב', 'חתול', 'בית', 'ספר'
];

function initTrainGame() {
    trainScore = 0;
    stationsReached = 0;
    trainGameRunning = true;
    sceneryOffset = 0;

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="text-align: center;">
            <h2 class="question-text">🚂 רכבת המילים! 🚂</h2>

            <div style="background: linear-gradient(to bottom, #87ceeb 0%, #a8e6cf 70%, #8B4513 100%);
                        border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">

                <div style="background: rgba(255,255,255,0.95); padding: 15px; border-radius: 10px;
                           margin-bottom: 15px; border: 3px solid #667eea;">
                    <div style="font-size: 1.8em; color: #667eea; font-weight: bold; margin-bottom: 10px;">
                        בנה את המילה:
                    </div>
                    <div id="train-target-word" style="display: flex; align-items: center; justify-content: center; margin: 10px 0;"></div>
                    <div style="font-size: 1.3em; margin-top: 10px; color: #666;">
                        סדר את הקרונות לפי הסדר הנכון!
                    </div>
                </div>

                <canvas id="train-canvas" width="700" height="400"
                        style="border: 4px solid #333; border-radius: 10px;
                               background: linear-gradient(to bottom, #87ceeb 0%, #a8e6cf 70%, #8B4513 100%);"></canvas>

                <div style="margin: 20px 0;">
                    <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 10px; display: inline-block;">
                        <div style="font-size: 1.2em; color: #667eea; font-weight: bold; margin-bottom: 10px;">קרונות זמינים:</div>
                        <div id="train-cars-container" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        </div>
                    </div>
                </div>

                <div style="margin: 20px 0;">
                    <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 10px; display: inline-block;">
                        <div style="font-size: 1.2em; color: #667eea; font-weight: bold; margin-bottom: 10px;">הרכבת שלי:</div>
                        <div id="train-sequence" style="display: flex; gap: 10px; justify-content: center; min-height: 70px; align-items: center; flex-wrap: wrap;">
                            <div style="color: #999; font-size: 1.5em;">הוסף קרונות...</div>
                        </div>
                    </div>
                </div>

                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
                    <button onclick="clearTrainSequence()"
                            style="font-size: 1.5em; padding: 12px 25px; background: #ffa502; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">🔄 נקה רכבת</button>
                    <button onclick="departTrain()"
                            style="font-size: 1.5em; padding: 12px 25px; background: #51cf66; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">🚂 יציאה!</button>
                </div>

                <div style="display: flex; justify-content: space-around; margin-top: 20px; font-size: 1.3em; font-weight: bold;">
                    <div style="background: rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 10px; color: #667eea;">
                        🏆 ניקוד: <span id="train-score">0</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 10px; color: #667eea;">
                        🏁 תחנות: <span id="stations-reached">0</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    trainCanvas = document.getElementById('train-canvas');
    trainCtx = trainCanvas.getContext('2d');

    // Initialize train
    train = {
        x: 100,
        y: trainCanvas.height - 150,
        width: 60,
        height: 50,
        speed: 0,
        moving: false
    };

    // Create scenery
    createTrainScenery();

    // Start new word
    nextTrainWord();

    // Register cleanup function
    currentGameCleanup = cleanupTrainGame;

    // Start game loop
    trainGameLoop();
}

function createTrainScenery() {
    mountains = [];
    trees = [];

    // Create mountains
    for (let i = 0; i < 5; i++) {
        mountains.push({
            x: i * 200,
            y: 150,
            width: 150,
            height: 100
        });
    }

    // Create trees
    for (let i = 0; i < 8; i++) {
        trainTrees.push({
            x: i * 120 + 50,
            y: trainCanvas.height - 180
        });
    }
}

function nextTrainWord() {
    targetTrainWord = trainWords[Math.floor(Math.random() * trainWords.length)];
    trainCars = [];

    // Display word with image and speaker
    const targetDisplay = document.getElementById('train-target-word');
    targetDisplay.innerHTML = '';
    const wordElement = createWordDisplay(targetTrainWord, true, true);
    wordElement.style.fontSize = '1.5em';
    targetDisplay.appendChild(wordElement);

    // Auto-play the word
    setTimeout(() => speakText(`בנה את המילה ${targetTrainWord}`), 300);

    // Create available letters
    const wordLetters = targetTrainWord.split('');
    availableTrainLetters = [...wordLetters];

    // Add distractors
    const distractors = ['ק', 'ר', 'ש', 'מ', 'נ', 'ה', 'ו', 'ז'];
    const numDistractors = Math.min(3, 7 - wordLetters.length);

    for (let i = 0; i < numDistractors; i++) {
        const distractor = distractors[Math.floor(Math.random() * distractors.length)];
        if (!availableTrainLetters.includes(distractor)) {
            availableTrainLetters.push(distractor);
        }
    }

    // Shuffle
    availableTrainLetters = shuffleArray(availableTrainLetters);

    renderTrainCars();
    updateTrainSequence();
}

function renderTrainCars() {
    const container = document.getElementById('train-cars-container');
    container.innerHTML = '';

    availableTrainLetters.forEach((letter, index) => {
        const btn = document.createElement('button');
        btn.textContent = letter;
        btn.onclick = () => addTrainCar(index);
        btn.style.cssText = `
            font-size: 2.5em;
            padding: 15px 25px;
            background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
            color: white;
            border: 3px solid #333;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';
        container.appendChild(btn);
    });
}

function addTrainCar(index) {
    if (!trainGameRunning) return;

    const letter = availableTrainLetters[index];
    trainCars.push(letter);
    availableTrainLetters.splice(index, 1);

    renderTrainCars();
    updateTrainSequence();
}

function updateTrainSequence() {
    const sequence = document.getElementById('train-sequence');
    sequence.innerHTML = '';

    if (trainCars.length === 0) {
        sequence.innerHTML = '<div style="color: #999; font-size: 1.5em;">הוסף קרונות...</div>';
        return;
    }

    trainCars.forEach((letter, index) => {
        const carDiv = document.createElement('div');
        carDiv.textContent = letter;
        carDiv.onclick = () => removeTrainCar(index);
        carDiv.style.cssText = `
            font-size: 2.5em;
            padding: 10px 20px;
            background: #51cf66;
            color: white;
            border: 3px solid #40c057;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        `;
        carDiv.onmouseover = () => carDiv.style.transform = 'scale(1.1)';
        carDiv.onmouseout = () => carDiv.style.transform = 'scale(1)';
        sequence.appendChild(carDiv);
    });
}

function removeTrainCar(index) {
    if (!trainGameRunning) return;

    const letter = trainCars[index];
    trainCars.splice(index, 1);
    availableTrainLetters.push(letter);

    renderTrainCars();
    updateTrainSequence();
}

function clearTrainSequence() {
    if (!trainGameRunning) return;

    availableTrainLetters = [...availableTrainLetters, ...trainCars];
    trainCars = [];

    renderTrainCars();
    updateTrainSequence();
}

function departTrain() {
    if (!trainGameRunning || trainCars.length === 0 || train.moving) return;

    const builtWord = trainCars.join('');

    if (builtWord === targetTrainWord) {
        // Correct train!
        stationsReached++;
        trainScore += 20;
        updateScore(20);
        updateStars(2);

        document.getElementById('train-score').textContent = trainScore;
        document.getElementById('stations-reached').textContent = stationsReached;

        train.moving = true;
        train.speed = 3;

        showTrainFeedback('🚂 הרכבת יוצאת! כל הכבוד!', true);

        if (stationsReached % 5 === 0) {
            celebrate();
        }

        setTimeout(() => {
            train.moving = false;
            train.speed = 0;
            if (trainGameRunning) {
                nextTrainWord();
            }
        }, 3000);
    } else {
        // Wrong sequence
        showTrainFeedback('❌ הרכבת לא נכונה!', false);
    }
}

function trainGameLoop() {
    if (!trainGameRunning) return;

    // Clear canvas
    trainCtx.clearRect(0, 0, trainCanvas.width, trainCanvas.height);

    // Draw sky
    const skyGradient = trainCtx.createLinearGradient(0, 0, 0, trainCanvas.height * 0.6);
    skyGradient.addColorStop(0, '#87ceeb');
    skyGradient.addColorStop(1, '#a8e6cf');
    trainCtx.fillStyle = skyGradient;
    trainCtx.fillRect(0, 0, trainCanvas.width, trainCanvas.height * 0.6);

    // Update scenery offset if train is moving
    if (train.moving) {
        sceneryOffset += train.speed;
        if (sceneryOffset > 200) sceneryOffset = 0;
    }

    // Draw mountains
    mountains.forEach(mountain => {
        const x = mountain.x - (sceneryOffset * 0.5);
        drawMountain(x, mountain.y, mountain.width, mountain.height);
    });

    // Draw ground
    trainCtx.fillStyle = '#7ec850';
    trainCtx.fillRect(0, trainCanvas.height * 0.6, trainCanvas.width, trainCanvas.height * 0.4);

    // Draw trees
    trainTrees.forEach(tree => {
        const x = tree.x - sceneryOffset;
        if (x > -50 && x < trainCanvas.width + 50) {
            drawTrainTree(x, tree.y);
        }
    });

    // Draw train tracks
    drawTrainTracks();

    // Draw train
    drawTrain();

    trainAnimationId = requestAnimationFrame(trainGameLoop);
}

function drawMountain(x, y, width, height) {
    trainCtx.fillStyle = '#8B7355';
    trainCtx.beginPath();
    trainCtx.moveTo(x, y + height);
    trainCtx.lineTo(x + width / 2, y);
    trainCtx.lineTo(x + width, y + height);
    trainCtx.closePath();
    trainCtx.fill();

    // Snow cap
    trainCtx.fillStyle = 'white';
    trainCtx.beginPath();
    trainCtx.moveTo(x + width / 2 - 20, y + 30);
    trainCtx.lineTo(x + width / 2, y);
    trainCtx.lineTo(x + width / 2 + 20, y + 30);
    trainCtx.closePath();
    trainCtx.fill();
}

function drawTrainTree(x, y) {
    // Trunk
    trainCtx.fillStyle = '#8B4513';
    trainCtx.fillRect(x - 8, y, 16, 40);

    // Leaves
    trainCtx.fillStyle = '#228B22';
    trainCtx.beginPath();
    trainCtx.arc(x, y - 10, 25, 0, Math.PI * 2);
    trainCtx.fill();
}

function drawTrainTracks() {
    trainCtx.strokeStyle = '#333';
    trainCtx.lineWidth = 4;

    const trackY = trainCanvas.height - 100;

    // Rails
    trainCtx.beginPath();
    trainCtx.moveTo(0, trackY);
    trainCtx.lineTo(trainCanvas.width, trackY);
    trainCtx.stroke();

    trainCtx.beginPath();
    trainCtx.moveTo(0, trackY + 20);
    trainCtx.lineTo(trainCanvas.width, trackY + 20);
    trainCtx.stroke();

    // Sleepers
    trainCtx.fillStyle = '#654321';
    for (let x = -sceneryOffset % 60; x < trainCanvas.width; x += 60) {
        trainCtx.fillRect(x, trackY - 5, 40, 30);
    }
}

function drawTrain() {
    // Engine
    trainCtx.fillStyle = '#ff6b6b';
    trainCtx.fillRect(train.x, train.y, train.width, train.height);

    // Engine cabin
    trainCtx.fillStyle = '#ff8787';
    trainCtx.fillRect(train.x + 10, train.y - 20, train.width - 20, 20);

    // Chimney
    trainCtx.fillStyle = '#333';
    trainCtx.fillRect(train.x + 15, train.y - 35, 12, 15);

    // Smoke if moving
    if (train.moving) {
        for (let i = 0; i < 3; i++) {
            trainCtx.fillStyle = `rgba(200, 200, 200, ${0.5 - i * 0.15})`;
            trainCtx.beginPath();
            trainCtx.arc(train.x + 21 - i * 10, train.y - 40 - i * 15, 8 + i * 3, 0, Math.PI * 2);
            trainCtx.fill();
        }
    }

    // Wheels
    trainCtx.fillStyle = '#333';
    trainCtx.beginPath();
    trainCtx.arc(train.x + 15, train.y + train.height + 5, 10, 0, Math.PI * 2);
    trainCtx.fill();
    trainCtx.beginPath();
    trainCtx.arc(train.x + train.width - 15, train.y + train.height + 5, 10, 0, Math.PI * 2);
    trainCtx.fill();

    // Train cars (if selected)
    trainCars.forEach((letter, index) => {
        const carX = train.x + train.width + 10 + (index * 65);
        const carY = train.y;

        // Car body
        trainCtx.fillStyle = '#51cf66';
        trainCtx.fillRect(carX, carY, 55, train.height);

        // Car window
        trainCtx.fillStyle = '#e0f7fa';
        trainCtx.fillRect(carX + 10, carY + 10, 35, 20);

        // Letter
        trainCtx.fillStyle = 'white';
        trainCtx.font = 'bold 28px Arial';
        trainCtx.textAlign = 'center';
        trainCtx.textBaseline = 'middle';
        trainCtx.fillText(letter, carX + 27, carY + train.height / 2);

        // Wheels
        trainCtx.fillStyle = '#333';
        trainCtx.beginPath();
        trainCtx.arc(carX + 15, carY + train.height + 5, 8, 0, Math.PI * 2);
        trainCtx.fill();
        trainCtx.beginPath();
        trainCtx.arc(carX + 40, carY + train.height + 5, 8, 0, Math.PI * 2);
        trainCtx.fill();
    });
}

function showTrainFeedback(message, isSuccess) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2.2em;
        color: white;
        font-weight: bold;
        background: ${isSuccess ? '#51cf66' : '#ff6b6b'};
        padding: 25px 50px;
        border-radius: 20px;
        box-shadow: 0 5px 25px rgba(0,0,0,0.4);
        z-index: 1000;
        animation: fadeInOut 2s ease;
        border: 4px solid white;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2000);
}

function cleanupTrainGame() {
    trainGameRunning = false;
    if (trainAnimationId) {
        cancelAnimationFrame(trainAnimationId);
        trainAnimationId = null;
    }
    if (trainCtx) {
        trainCtx.clearRect(0, 0, trainCanvas.width, trainCanvas.height);
    }
}

