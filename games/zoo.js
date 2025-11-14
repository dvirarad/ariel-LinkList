// Zoo Adventure Game - הרפתקה בגן החיות
let zooCanvas, zooCtx;
let currentAnimal = null;
let availableZooLetters = [];
let selectedZooLetters = [];
let zooGameRunning = false;
let zooAnimationId = null;
let zooScore = 0;
let animalsFed = 0;
let trees = [];
let clouds = [];

const zooAnimals = [
    { name: 'אריה', word: 'בשר', emoji: '🦁', sound: 'שאגגג!' },
    { name: 'קוף', word: 'בננה', emoji: '🐵', sound: 'או או!' },
    { name: 'פיל', word: 'עלים', emoji: '🐘', sound: 'חצוצרה!' },
    { name: 'ג\'ירפה', word: 'עלה', emoji: '🦒', sound: 'מממ!' },
    { name: 'דב', word: 'דבש', emoji: '🐻', sound: 'גררר!' },
    { name: 'כלב ים', word: 'דג', emoji: '🦭', sound: 'ארף ארף!' },
    { name: 'פנדה', word: 'במבוק', emoji: '🐼', sound: 'יאמ!' },
    { name: 'קנגרו', word: 'דשא', emoji: '🦘', sound: 'קפיץ!' },
];

function initZooGame() {
    zooScore = 0;
    animalsFed = 0;
    zooGameRunning = true;
    selectedZooLetters = [];

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="text-align: center;">
            <h2 class="question-text">🦁 הרפתקה בגן החיות! 🦁</h2>

            <div style="background: linear-gradient(to bottom, #87ceeb 0%, #a8e6cf 50%, #7ec850 100%);
                        border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">

                <div style="background: rgba(255,255,255,0.95); padding: 15px; border-radius: 10px;
                           margin-bottom: 15px; border: 3px solid #667eea;">
                    <div id="zoo-question" style="font-size: 2em; color: #667eea; font-weight: bold;">
                        בנה את המילה!
                    </div>
                </div>

                <canvas id="zoo-canvas" width="700" height="400"
                        style="border: 4px solid #333; border-radius: 10px;
                               background: linear-gradient(to bottom, #87ceeb 0%, #a8e6cf 50%, #7ec850 100%);"></canvas>

                <div style="margin: 20px 0;">
                    <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 10px; display: inline-block;">
                        <div style="font-size: 1.2em; color: #667eea; font-weight: bold; margin-bottom: 10px;">בחר אותיות לבנות:</div>
                        <div id="zoo-word-builder" style="display: flex; gap: 10px; justify-content: center; min-height: 70px; align-items: center; flex-wrap: wrap;">
                        </div>
                    </div>
                </div>

                <div id="zoo-letters-container" style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin: 20px 0;">
                </div>

                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
                    <button onclick="clearZooWord()"
                            style="font-size: 1.5em; padding: 12px 25px; background: #ffa502; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">🔄 נקה</button>
                    <button onclick="submitZooWord()"
                            style="font-size: 1.5em; padding: 12px 25px; background: #51cf66; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">✅ האכל!</button>
                </div>

                <div style="display: flex; justify-content: space-around; margin-top: 20px; font-size: 1.3em; font-weight: bold;">
                    <div style="background: rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 10px; color: #667eea;">
                        🏆 ניקוד: <span id="zoo-score">0</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 10px; color: #667eea;">
                        🍖 האכלות: <span id="animals-fed">0</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    zooCanvas = document.getElementById('zoo-canvas');
    zooCtx = zooCanvas.getContext('2d');

    // Create scenery
    createZooScenery();

    // Start with first animal
    nextAnimal();

    // Register cleanup function
    currentGameCleanup = cleanupZooGame;

    // Start animation loop
    zooGameLoop();
}

function createZooScenery() {
    trees = [];
    clouds = [];

    // Create trees
    for (let i = 0; i < 5; i++) {
        trees.push({
            x: 50 + i * 150,
            y: 280,
            size: 40 + Math.random() * 20
        });
    }

    // Create clouds
    for (let i = 0; i < 4; i++) {
        clouds.push({
            x: i * 200,
            y: 30 + i * 20,
            speed: 0.2 + Math.random() * 0.3
        });
    }
}

function nextAnimal() {
    currentAnimal = zooAnimals[Math.floor(Math.random() * zooAnimals.length)];
    selectedZooLetters = [];

    document.getElementById('zoo-question').innerHTML =
        `${currentAnimal.emoji} ה${currentAnimal.name} רוצה: <span style="color: #ff6b6b; font-size: 1.2em;">${currentAnimal.word}</span>`;

    // Create letter options
    const wordLetters = currentAnimal.word.split('');
    const distractorLetters = ['ק', 'ר', 'ש', 'ת', 'מ', 'נ', 'ה', 'ו', 'ז', 'ח'];
    const numDistractors = Math.min(4, 8 - wordLetters.length);

    availableZooLetters = [...wordLetters];
    for (let i = 0; i < numDistractors; i++) {
        const distractor = distractorLetters[Math.floor(Math.random() * distractorLetters.length)];
        if (!availableZooLetters.includes(distractor)) {
            availableZooLetters.push(distractor);
        }
    }

    // Shuffle letters
    availableZooLetters = shuffleArray(availableZooLetters);

    renderZooLetters();
    updateZooWordBuilder();
}

function renderZooLetters() {
    const container = document.getElementById('zoo-letters-container');
    container.innerHTML = '';

    availableZooLetters.forEach((letter, index) => {
        const btn = document.createElement('button');
        btn.textContent = letter;
        btn.onclick = () => selectZooLetter(index);
        btn.style.cssText = `
            font-size: 2.5em;
            padding: 15px 25px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: 3px solid #ffe66d;
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

function selectZooLetter(index) {
    if (!zooGameRunning) return;

    const letter = availableZooLetters[index];
    selectedZooLetters.push(letter);
    availableZooLetters.splice(index, 1);

    renderZooLetters();
    updateZooWordBuilder();
}

function updateZooWordBuilder() {
    const builder = document.getElementById('zoo-word-builder');
    builder.innerHTML = '';

    if (selectedZooLetters.length === 0) {
        builder.innerHTML = '<div style="color: #999; font-size: 1.5em;">בחר אותיות...</div>';
        return;
    }

    selectedZooLetters.forEach((letter, index) => {
        const letterDiv = document.createElement('div');
        letterDiv.textContent = letter;
        letterDiv.onclick = () => unselectZooLetter(index);
        letterDiv.style.cssText = `
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
        letterDiv.onmouseover = () => letterDiv.style.transform = 'scale(1.1)';
        letterDiv.onmouseout = () => letterDiv.style.transform = 'scale(1)';
        builder.appendChild(letterDiv);
    });
}

function unselectZooLetter(index) {
    if (!zooGameRunning) return;

    const letter = selectedZooLetters[index];
    selectedZooLetters.splice(index, 1);
    availableZooLetters.push(letter);

    renderZooLetters();
    updateZooWordBuilder();
}

function clearZooWord() {
    if (!zooGameRunning) return;

    availableZooLetters = [...availableZooLetters, ...selectedZooLetters];
    selectedZooLetters = [];

    renderZooLetters();
    updateZooWordBuilder();
}

function submitZooWord() {
    if (!zooGameRunning || selectedZooLetters.length === 0) return;

    const builtWord = selectedZooLetters.join('');

    if (builtWord === currentAnimal.word) {
        // Correct!
        animalsFed++;
        zooScore += 15;
        updateScore(15);
        updateStars(1);

        document.getElementById('zoo-score').textContent = zooScore;
        document.getElementById('animals-fed').textContent = animalsFed;

        showZooFeedback(`${currentAnimal.emoji} ${currentAnimal.sound} תודה!`, true);

        if (animalsFed % 5 === 0) {
            celebrate();
        }

        setTimeout(() => {
            if (zooGameRunning) {
                nextAnimal();
            }
        }, 2000);
    } else {
        // Wrong
        showZooFeedback('❌ לא המילה הנכונה!', false);
    }
}

function zooGameLoop() {
    if (!zooGameRunning) return;

    // Clear canvas
    zooCtx.clearRect(0, 0, zooCanvas.width, zooCanvas.height);

    // Draw sky
    const skyGradient = zooCtx.createLinearGradient(0, 0, 0, zooCanvas.height * 0.6);
    skyGradient.addColorStop(0, '#87ceeb');
    skyGradient.addColorStop(1, '#a8e6cf');
    zooCtx.fillStyle = skyGradient;
    zooCtx.fillRect(0, 0, zooCanvas.width, zooCanvas.height * 0.6);

    // Update and draw clouds
    clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > zooCanvas.width + 100) {
            cloud.x = -100;
        }

        drawCloud(cloud.x, cloud.y);
    });

    // Draw ground
    zooCtx.fillStyle = '#7ec850';
    zooCtx.fillRect(0, zooCanvas.height * 0.6, zooCanvas.width, zooCanvas.height * 0.4);

    // Draw path
    zooCtx.fillStyle = '#d4a574';
    zooCtx.fillRect(0, zooCanvas.height * 0.65, zooCanvas.width, 40);

    // Draw trees
    trees.forEach(tree => {
        drawTree(tree.x, tree.y, tree.size);
    });

    // Draw fence
    drawFence();

    // Draw animal
    if (currentAnimal) {
        drawAnimal();
    }

    zooAnimationId = requestAnimationFrame(zooGameLoop);
}

function drawCloud(x, y) {
    zooCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    zooCtx.beginPath();
    zooCtx.arc(x, y, 20, 0, Math.PI * 2);
    zooCtx.arc(x + 25, y, 25, 0, Math.PI * 2);
    zooCtx.arc(x + 50, y, 20, 0, Math.PI * 2);
    zooCtx.fill();
}

function drawTree(x, y, size) {
    // Trunk
    zooCtx.fillStyle = '#8B4513';
    zooCtx.fillRect(x - size * 0.2, y, size * 0.4, size * 1.2);

    // Leaves
    zooCtx.fillStyle = '#228B22';
    zooCtx.beginPath();
    zooCtx.arc(x, y - size * 0.3, size, 0, Math.PI * 2);
    zooCtx.fill();

    zooCtx.fillStyle = '#2d7a2d';
    zooCtx.beginPath();
    zooCtx.arc(x - size * 0.5, y - size * 0.1, size * 0.7, 0, Math.PI * 2);
    zooCtx.fill();

    zooCtx.beginPath();
    zooCtx.arc(x + size * 0.5, y - size * 0.1, size * 0.7, 0, Math.PI * 2);
    zooCtx.fill();
}

function drawFence() {
    zooCtx.strokeStyle = '#8B4513';
    zooCtx.lineWidth = 4;

    // Horizontal bars
    for (let y = 320; y < 360; y += 20) {
        zooCtx.beginPath();
        zooCtx.moveTo(0, y);
        zooCtx.lineTo(zooCanvas.width, y);
        zooCtx.stroke();
    }

    // Vertical posts
    for (let x = 0; x < zooCanvas.width; x += 60) {
        zooCtx.fillStyle = '#8B4513';
        zooCtx.fillRect(x, 310, 8, 60);
    }
}

function drawAnimal() {
    // Animal enclosure/area
    zooCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    zooCtx.fillRect(250, 140, 200, 140);

    // Animal emoji (large)
    zooCtx.font = 'bold 120px Arial';
    zooCtx.textAlign = 'center';
    zooCtx.textBaseline = 'middle';
    zooCtx.fillText(currentAnimal.emoji, zooCanvas.width / 2, 200);

    // Speech bubble
    zooCtx.fillStyle = 'white';
    zooCtx.strokeStyle = '#333';
    zooCtx.lineWidth = 3;

    // Bubble (rounded rectangle)
    zooCtx.beginPath();
    const x = 320, y = 60, w = 160, h = 60, r = 10;
    zooCtx.moveTo(x + r, y);
    zooCtx.lineTo(x + w - r, y);
    zooCtx.quadraticCurveTo(x + w, y, x + w, y + r);
    zooCtx.lineTo(x + w, y + h - r);
    zooCtx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    zooCtx.lineTo(x + r, y + h);
    zooCtx.quadraticCurveTo(x, y + h, x, y + h - r);
    zooCtx.lineTo(x, y + r);
    zooCtx.quadraticCurveTo(x, y, x + r, y);
    zooCtx.closePath();
    zooCtx.fill();
    zooCtx.stroke();

    // Bubble tail
    zooCtx.beginPath();
    zooCtx.moveTo(380, 120);
    zooCtx.lineTo(360, 140);
    zooCtx.lineTo(400, 120);
    zooCtx.closePath();
    zooCtx.fill();
    zooCtx.stroke();

    // Text in bubble
    zooCtx.fillStyle = '#333';
    zooCtx.font = 'bold 20px Arial';
    zooCtx.textAlign = 'center';
    zooCtx.fillText('רעב!', 400, 80);
    zooCtx.fillText(currentAnimal.word, 400, 105);
}

function showZooFeedback(message, isSuccess) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2.5em;
        color: white;
        font-weight: bold;
        background: ${isSuccess ? '#51cf66' : '#ff6b6b'};
        padding: 25px 50px;
        border-radius: 20px;
        box-shadow: 0 5px 25px rgba(0,0,0,0.4);
        z-index: 1000;
        animation: fadeInOut 1.5s ease;
        border: 4px solid white;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1500);
}

function cleanupZooGame() {
    zooGameRunning = false;
    if (zooAnimationId) {
        cancelAnimationFrame(zooAnimationId);
        zooAnimationId = null;
    }
    if (zooCtx) {
        zooCtx.clearRect(0, 0, zooCanvas.width, zooCanvas.height);
    }
}

