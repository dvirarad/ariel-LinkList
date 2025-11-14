// Soccer Letters Game - כדורגל אותיות
let soccerCanvas, soccerCtx;
let goalkeeper;
let soccerBalls = [];
let currentSoccerLetter = null;
let currentSoccerWord = '';
let soccerGameRunning = false;
let soccerAnimationId = null;
let soccerScore = 0;
let goalsScored = 0;
let selectedBall = null;
let kickPower = 0;
let isCharging = false;

const soccerWords = [
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

const soccerLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];

function initSoccerGame() {
    soccerScore = 0;
    goalsScored = 0;
    soccerGameRunning = true;
    selectedBall = null;
    kickPower = 0;
    isCharging = false;

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="text-align: center;">
            <h2 class="question-text">⚽ כדורגל אותיות! ⚽</h2>

            <div style="background: linear-gradient(to bottom, #87ceeb 0%, #7ec850 70%, #7ec850 100%);
                        border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">

                <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 10px;
                           margin-bottom: 15px; border: 3px solid #667eea;">
                    <div id="soccer-question" style="font-size: 2em; color: #667eea; font-weight: bold;">
                        בעט בכדור עם האות הנכונה!
                    </div>
                </div>

                <canvas id="soccer-canvas" width="700" height="500"
                        style="border: 4px solid #333; border-radius: 10px;
                               background: linear-gradient(to bottom, #87ceeb 0%, #7ec850 60%, #7ec850 100%);
                               cursor: pointer;"></canvas>

                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
                    <div id="power-meter" style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 10px; min-width: 200px;">
                        <div style="font-size: 1.2em; font-weight: bold; color: #667eea; margin-bottom: 8px;">💪 כוח בעיטה</div>
                        <div style="background: #e0e0e0; height: 30px; border-radius: 15px; overflow: hidden; border: 2px solid #333;">
                            <div id="power-bar" style="background: linear-gradient(90deg, #51cf66, #ffe66d, #ff6b6b);
                                                       height: 100%; width: 0%; transition: width 0.1s;"></div>
                        </div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-around; margin-top: 20px; font-size: 1.3em; font-weight: bold;">
                    <div style="background: rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 10px; color: #667eea;">
                        🏆 ניקוד: <span id="soccer-score">0</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 10px; color: #667eea;">
                        ⚽ שערים: <span id="goals-scored">0</span>
                    </div>
                </div>
            </div>

            <div style="margin-top: 15px; padding: 15px; background: rgba(255,255,255,0.9); border-radius: 10px; font-size: 1.1em; color: #666;">
                💡 <strong>הוראות:</strong> לחץ על כדור עם האות הנכונה, לחץ והחזק להגביר כוח, שחרר לבעוט!
            </div>
        </div>
    `;

    soccerCanvas = document.getElementById('soccer-canvas');
    soccerCtx = soccerCanvas.getContext('2d');

    // Initialize goalkeeper
    goalkeeper = {
        x: soccerCanvas.width / 2,
        y: 80,
        width: 60,
        height: 80,
        targetX: soccerCanvas.width / 2,
        speed: 3
    };

    // Mouse/touch events
    soccerCanvas.addEventListener('mousedown', handleSoccerMouseDown);
    soccerCanvas.addEventListener('mouseup', handleSoccerMouseUp);
    soccerCanvas.addEventListener('click', handleSoccerClick);

    // Start new question
    nextSoccerQuestion();

    // Register cleanup function
    currentGameCleanup = cleanupSoccerGame;

    // Start game loop
    soccerGameLoop();
}

function nextSoccerQuestion() {
    const questionData = soccerWords[Math.floor(Math.random() * soccerWords.length)];
    currentSoccerLetter = questionData.letter;
    currentSoccerWord = questionData.word;
    selectedBall = null;
    kickPower = 0;
    isCharging = false;

    document.getElementById('soccer-question').innerHTML =
        `בעט בכדור: <span style="color: #ff6b6b; font-size: 1.3em;">${currentSoccerLetter}</span> (מתחיל את <span style="color: #51cf66;">${currentSoccerWord}</span>)`;

    // Create balls
    createSoccerBalls();
}

function createSoccerBalls() {
    soccerBalls = [];

    // Add correct ball
    soccerBalls.push({
        x: 150 + Math.random() * 100,
        y: soccerCanvas.height - 100,
        size: 40,
        letter: currentSoccerLetter,
        isCorrect: true,
        vx: 0,
        vy: 0,
        kicked: false,
        goalReached: false
    });

    // Add wrong balls
    const wrongLetters = soccerLetters.filter(l => l !== currentSoccerLetter);
    for (let i = 0; i < 3; i++) {
        soccerBalls.push({
            x: 250 + (i * 120),
            y: soccerCanvas.height - 100,
            size: 40,
            letter: wrongLetters[Math.floor(Math.random() * wrongLetters.length)],
            isCorrect: false,
            vx: 0,
            vy: 0,
            kicked: false,
            goalReached: false
        });
    }
}

function handleSoccerClick(e) {
    if (!soccerGameRunning || isCharging) return;

    const rect = soccerCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a ball
    for (let ball of soccerBalls) {
        if (!ball.kicked) {
            const distance = Math.sqrt(Math.pow(x - ball.x, 2) + Math.pow(y - ball.y, 2));
            if (distance < ball.size) {
                selectedBall = ball;
                break;
            }
        }
    }
}

function handleSoccerMouseDown(e) {
    if (!soccerGameRunning || !selectedBall || selectedBall.kicked) return;

    isCharging = true;
    kickPower = 0;

    const chargeInterval = setInterval(() => {
        if (!isCharging) {
            clearInterval(chargeInterval);
            return;
        }
        kickPower = Math.min(100, kickPower + 3);
        document.getElementById('power-bar').style.width = kickPower + '%';
    }, 30);
}

function handleSoccerMouseUp(e) {
    if (!soccerGameRunning || !selectedBall || !isCharging) return;

    isCharging = false;

    if (kickPower > 10) {
        kickBall(selectedBall, kickPower);
    }

    kickPower = 0;
    document.getElementById('power-bar').style.width = '0%';
}

function kickBall(ball, power) {
    ball.kicked = true;

    // Calculate velocity based on power and direction to goal
    const angleToGoal = Math.atan2(goalkeeper.y - ball.y, goalkeeper.x - ball.x);
    const speed = power / 10;

    ball.vx = Math.cos(angleToGoal) * speed;
    ball.vy = Math.sin(angleToGoal) * speed;
}

function soccerGameLoop() {
    if (!soccerGameRunning) return;

    // Clear canvas
    soccerCtx.clearRect(0, 0, soccerCanvas.width, soccerCanvas.height);

    // Draw grass
    drawSoccerField();

    // Draw goal
    drawGoal();

    // Update and draw goalkeeper
    updateGoalkeeper();
    drawGoalkeeper();

    // Update and draw balls
    soccerBalls = soccerBalls.filter(ball => {
        if (ball.kicked && !ball.goalReached) {
            ball.x += ball.vx;
            ball.y += ball.vy;
            ball.vy += 0.2; // Gravity

            // Check if ball reached goal area
            if (ball.y < 150 && Math.abs(ball.x - goalkeeper.x) < 150) {
                // Check if goalkeeper caught it
                if (Math.abs(ball.x - goalkeeper.x) < 80 && ball.y < 140) {
                    // Goalkeeper saved!
                    handleBallSaved(ball);
                    return false;
                } else {
                    // Goal!
                    handleGoal(ball);
                    return false;
                }
            }

            // Remove if out of bounds
            if (ball.y < -50 || ball.x < -50 || ball.x > soccerCanvas.width + 50) {
                if (ball.isCorrect) {
                    showSoccerFeedback('😢 החטאת!', false);
                }
                return false;
            }
        }

        drawSoccerBall(ball);
        return true;
    });

    // Check if need new question
    if (soccerBalls.length === 0) {
        setTimeout(() => {
            if (soccerGameRunning) {
                nextSoccerQuestion();
            }
        }, 1500);
    }

    soccerAnimationId = requestAnimationFrame(soccerGameLoop);
}

function drawSoccerField() {
    // Sky
    soccerCtx.fillStyle = '#87ceeb';
    soccerCtx.fillRect(0, 0, soccerCanvas.width, soccerCanvas.height * 0.6);

    // Grass
    soccerCtx.fillStyle = '#7ec850';
    soccerCtx.fillRect(0, soccerCanvas.height * 0.6, soccerCanvas.width, soccerCanvas.height * 0.4);

    // Grass stripes
    for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
            soccerCtx.fillStyle = 'rgba(60, 179, 113, 0.2)';
            soccerCtx.fillRect(i * 70, soccerCanvas.height * 0.6, 70, soccerCanvas.height * 0.4);
        }
    }

    // Goal area
    soccerCtx.strokeStyle = '#fff';
    soccerCtx.lineWidth = 3;
    soccerCtx.strokeRect(soccerCanvas.width / 2 - 150, 20, 300, 130);
}

function drawGoal() {
    // Goal posts
    soccerCtx.strokeStyle = '#fff';
    soccerCtx.lineWidth = 6;

    // Left post
    soccerCtx.beginPath();
    soccerCtx.moveTo(soccerCanvas.width / 2 - 150, 20);
    soccerCtx.lineTo(soccerCanvas.width / 2 - 150, 150);
    soccerCtx.stroke();

    // Right post
    soccerCtx.beginPath();
    soccerCtx.moveTo(soccerCanvas.width / 2 + 150, 20);
    soccerCtx.lineTo(soccerCanvas.width / 2 + 150, 150);
    soccerCtx.stroke();

    // Top bar
    soccerCtx.beginPath();
    soccerCtx.moveTo(soccerCanvas.width / 2 - 150, 20);
    soccerCtx.lineTo(soccerCanvas.width / 2 + 150, 20);
    soccerCtx.stroke();

    // Net pattern
    soccerCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    soccerCtx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
        soccerCtx.beginPath();
        soccerCtx.moveTo(soccerCanvas.width / 2 - 150 + (i * 30), 20);
        soccerCtx.lineTo(soccerCanvas.width / 2 - 150 + (i * 30), 150);
        soccerCtx.stroke();
    }
}

function updateGoalkeeper() {
    // Move goalkeeper towards nearest ball
    let nearestBall = null;
    let minDistance = Infinity;

    for (let ball of soccerBalls) {
        if (ball.kicked && !ball.goalReached && ball.y < 300) {
            const distance = Math.abs(ball.x - goalkeeper.x);
            if (distance < minDistance) {
                minDistance = distance;
                nearestBall = ball;
            }
        }
    }

    if (nearestBall) {
        goalkeeper.targetX = nearestBall.x;
    } else {
        goalkeeper.targetX = soccerCanvas.width / 2;
    }

    // Move towards target
    if (goalkeeper.x < goalkeeper.targetX) {
        goalkeeper.x = Math.min(goalkeeper.targetX, goalkeeper.x + goalkeeper.speed);
    } else if (goalkeeper.x > goalkeeper.targetX) {
        goalkeeper.x = Math.max(goalkeeper.targetX, goalkeeper.x - goalkeeper.speed);
    }

    // Keep in bounds
    goalkeeper.x = Math.max(soccerCanvas.width / 2 - 120, Math.min(soccerCanvas.width / 2 + 120, goalkeeper.x));
}

function drawGoalkeeper() {
    // Shadow
    soccerCtx.fillStyle = 'rgba(0,0,0,0.2)';
    soccerCtx.ellipse(goalkeeper.x, goalkeeper.y + goalkeeper.height / 2, 35, 10, 0, 0, Math.PI * 2);
    soccerCtx.fill();

    // Body
    soccerCtx.fillStyle = '#ffe66d';
    soccerCtx.fillRect(goalkeeper.x - goalkeeper.width / 2, goalkeeper.y, goalkeeper.width, goalkeeper.height * 0.6);

    // Head
    soccerCtx.fillStyle = '#ffd93d';
    soccerCtx.beginPath();
    soccerCtx.arc(goalkeeper.x, goalkeeper.y - 15, 20, 0, Math.PI * 2);
    soccerCtx.fill();

    // Arms (extended)
    soccerCtx.strokeStyle = '#ffe66d';
    soccerCtx.lineWidth = 8;
    soccerCtx.beginPath();
    soccerCtx.moveTo(goalkeeper.x - goalkeeper.width / 2, goalkeeper.y + 20);
    soccerCtx.lineTo(goalkeeper.x - goalkeeper.width / 2 - 30, goalkeeper.y);
    soccerCtx.stroke();

    soccerCtx.beginPath();
    soccerCtx.moveTo(goalkeeper.x + goalkeeper.width / 2, goalkeeper.y + 20);
    soccerCtx.lineTo(goalkeeper.x + goalkeeper.width / 2 + 30, goalkeeper.y);
    soccerCtx.stroke();

    // Emoji
    soccerCtx.font = 'bold 40px Arial';
    soccerCtx.textAlign = 'center';
    soccerCtx.fillText('🧤', goalkeeper.x, goalkeeper.y + 10);
}

function drawSoccerBall(ball) {
    // Shadow
    if (!ball.kicked) {
        soccerCtx.fillStyle = 'rgba(0,0,0,0.2)';
        soccerCtx.beginPath();
        soccerCtx.ellipse(ball.x, ball.y + 5, ball.size * 0.8, ball.size * 0.2, 0, 0, Math.PI * 2);
        soccerCtx.fill();
    }

    // Ball
    soccerCtx.fillStyle = ball.isCorrect ? '#51cf66' : '#ff6b6b';
    soccerCtx.beginPath();
    soccerCtx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    soccerCtx.fill();

    // Ball border
    soccerCtx.strokeStyle = ball.isCorrect ? '#40c057' : '#ff5252';
    soccerCtx.lineWidth = 4;
    soccerCtx.stroke();

    // Highlight if selected
    if (ball === selectedBall && !ball.kicked) {
        soccerCtx.strokeStyle = '#ffe66d';
        soccerCtx.lineWidth = 6;
        soccerCtx.setLineDash([10, 5]);
        soccerCtx.stroke();
        soccerCtx.setLineDash([]);
    }

    // Letter
    soccerCtx.fillStyle = '#fff';
    soccerCtx.font = 'bold 32px Arial';
    soccerCtx.textAlign = 'center';
    soccerCtx.textBaseline = 'middle';
    soccerCtx.fillText(ball.letter, ball.x, ball.y);
}

function handleGoal(ball) {
    ball.goalReached = true;

    if (ball.isCorrect) {
        // Correct goal!
        goalsScored++;
        soccerScore += 15;
        updateScore(15);
        updateStars(1);

        document.getElementById('soccer-score').textContent = soccerScore;
        document.getElementById('goals-scored').textContent = goalsScored;

        showSoccerFeedback('⚽ גווווול! כל הכבוד!', true);

        if (goalsScored % 5 === 0) {
            celebrate();
        }
    } else {
        // Wrong goal
        showSoccerFeedback('❌ לא הכדור הנכון!', false);
    }
}

function handleBallSaved(ball) {
    if (ball.isCorrect) {
        showSoccerFeedback('😢 השוער תפס!', false);
    }
}

function showSoccerFeedback(message, isSuccess) {
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
        animation: fadeInOut 1.2s ease;
        border: 4px solid white;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1200);
}

function cleanupSoccerGame() {
    soccerGameRunning = false;
    if (soccerAnimationId) {
        cancelAnimationFrame(soccerAnimationId);
        soccerAnimationId = null;
    }
    if (soccerCanvas) {
        soccerCanvas.removeEventListener('mousedown', handleSoccerMouseDown);
        soccerCanvas.removeEventListener('mouseup', handleSoccerMouseUp);
        soccerCanvas.removeEventListener('click', handleSoccerClick);
    }
    if (soccerCtx) {
        soccerCtx.clearRect(0, 0, soccerCanvas.width, soccerCanvas.height);
    }
}

