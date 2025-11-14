// Letter writing practice game
let canvas, ctx;
let isDrawing = false;
let currentWritingLetter = null;
let drawingsCompleted = 0;

function initWritingGame() {
    drawingsCompleted = 0;

    // Register cleanup function
    currentGameCleanup = cleanupWritingGame;

    setupWritingCanvas();
}

function setupWritingCanvas() {
    currentWritingLetter = hebrewLetters[Math.floor(Math.random() * hebrewLetters.length)];

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <h2 class="question-text">תרגל לכתוב את האות: <span style="font-size: 1.5em; color: #ff6b6b;">${currentWritingLetter}</span></h2>
        <div style="text-align: center; margin: 20px 0;">
            <div style="display: inline-block; font-size: 10em; color: #e7f5ff; border: 3px dashed #667eea; padding: 20px; border-radius: 15px; background: white;">
                ${currentWritingLetter}
            </div>
        </div>
        <canvas id="writing-canvas" class="writing-canvas" width="600" height="400"></canvas>
        <div class="writing-controls">
            <button onclick="clearCanvas()">🗑️ נקה</button>
            <button onclick="nextLetter()">➡️ האות הבאה</button>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 1.5em; color: #667eea;">
            <strong>אותיות שתרגלת: ${drawingsCompleted} ✍️</strong>
        </div>
    `;

    canvas = document.getElementById('writing-canvas');
    ctx = canvas.getContext('2d');

    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#667eea';

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch support for mobile
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function nextLetter() {
    drawingsCompleted++;
    updateScore(10);
    updateStars(1);
    showFeedback('🎨 יפה מאוד!', true);

    if (drawingsCompleted % 5 === 0) {
        celebrate();
    }

    setTimeout(() => {
        setupWritingCanvas();
    }, 1000);
}

function cleanupWritingGame() {
    // Remove event listeners if canvas exists
    if (canvas) {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseout', stopDrawing);
        canvas.removeEventListener('touchstart', handleTouch);
        canvas.removeEventListener('touchmove', handleTouch);
        canvas.removeEventListener('touchend', stopDrawing);
    }

    // Reset game state
    canvas = null;
    ctx = null;
    isDrawing = false;
    currentWritingLetter = null;
    drawingsCompleted = 0;
}
