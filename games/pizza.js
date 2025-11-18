// Pizza Words Game - פיצרייה של מילים
let pizzaCanvas, pizzaCtx;
let pizzaOrder = null;
let pizzaToppings = [];
let selectedToppings = [];
let pizzaGameRunning = false;
let pizzaAnimationId = null;
let pizzaScore = 0;
let pizzasCompleted = 0;
let chef;

const pizzaOrders = [
    { word: 'גבינה', letters: ['ג', 'ב', 'י', 'נ', 'ה'] },
    { word: 'זיתים', letters: ['ז', 'י', 'ת', 'י', 'ם'] },
    { word: 'עגבניה', letters: ['ע', 'ג', 'ב', 'נ', 'י', 'ה'] },
    { word: 'פטריות', letters: ['פ', 'ט', 'ר', 'י', 'ו', 'ת'] },
    { word: 'תירס', letters: ['ת', 'י', 'ר', 'ס'] },
    { word: 'בצל', letters: ['ב', 'צ', 'ל'] },
    { word: 'פלפל', letters: ['פ', 'ל', 'פ', 'ל'] }
];

const toppingColors = {
    'ג': '#FFD700', 'ב': '#FFA500', 'י': '#98FB98', 'נ': '#87CEEB',
    'ה': '#DDA0DD', 'ז': '#F0E68C', 'ת': '#FFB6C1', 'ם': '#B0E0E6',
    'ע': '#FF6347', 'ר': '#F4A460', 'פ': '#90EE90', 'ס': '#DEB887',
    'ל': '#FFE4B5', 'ו': '#FFDAB9', 'ט': '#E6E6FA', 'צ': '#FFE4E1',
    'ח': '#F0FFF0', 'ק': '#FFF0F5', 'מ': '#FFFAF0', 'ש': '#F5FFFA',
    'א': '#F0F8FF', 'ד': '#FAF0E6', 'כ': '#FFF5EE'
};

function initPizzaGame() {
    pizzaScore = 0;
    pizzasCompleted = 0;
    pizzaGameRunning = true;
    selectedToppings = [];

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="text-align: center;">
            <h2 class="question-text">🍕 פיצרייה של מילים! 🍕</h2>

            <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
                        border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">

                <div style="background: rgba(255,255,255,0.95); padding: 15px; border-radius: 10px;
                           margin-bottom: 15px; border: 3px solid #ff6b6b;">
                    <div style="font-size: 1.8em; color: #ff6b6b; font-weight: bold;">
                        🧑‍🍳 הזמנה: <span id="pizza-order" style="color: #667eea; font-size: 1.2em;"></span>
                    </div>
                    <div style="font-size: 1.3em; margin-top: 10px; color: #666;">
                        הוסף תוספות לפי הסדר!
                    </div>
                </div>

                <canvas id="pizza-canvas" width="700" height="450"
                        style="border: 4px solid #333; border-radius: 10px;
                               background: linear-gradient(to bottom, #fff8e1 0%, #ffe0b2 100%);"></canvas>

                <div style="margin: 20px 0;">
                    <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 10px; display: inline-block; max-width: 600px;">
                        <div style="font-size: 1.2em; color: #667eea; font-weight: bold; margin-bottom: 10px;">תוספות זמינות:</div>
                        <div id="pizza-toppings" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        </div>
                    </div>
                </div>

                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
                    <button onclick="clearPizza()"
                            style="font-size: 1.5em; padding: 12px 25px; background: #ffa502; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">🔄 נקה פיצה</button>
                    <button onclick="servePizza()"
                            style="font-size: 1.5em; padding: 12px 25px; background: #51cf66; color: white;
                                   border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 5px 15px rgba(0,0,0,0.3);">✅ הגש ללקוח!</button>
                </div>

                <div style="display: flex; justify-content: space-around; margin-top: 20px; font-size: 1.3em; font-weight: bold;">
                    <div style="background: rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 10px; color: #667eea;">
                        🏆 ניקוד: <span id="pizza-score">0</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 10px; color: #667eea;">
                        🍕 פיצות: <span id="pizzas-completed">0</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    pizzaCanvas = document.getElementById('pizza-canvas');
    pizzaCtx = pizzaCanvas.getContext('2d');

    // Initialize chef
    chef = {
        x: 100,
        y: 120,
        happy: false
    };

    // Start new order
    nextPizzaOrder();

    // Register cleanup function
    currentGameCleanup = cleanupPizzaGame;

    // Start animation loop
    pizzaGameLoop();
}

function nextPizzaOrder() {
    pizzaOrder = pizzaOrders[Math.floor(Math.random() * pizzaOrders.length)];
    selectedToppings = [];

    document.getElementById('pizza-order').textContent = pizzaOrder.word;

    // Create available toppings (order letters + some distractors)
    pizzaToppings = [...pizzaOrder.letters];

    // Add distractors
    const allLetters = Object.keys(toppingColors);
    const distractors = allLetters.filter(l => !pizzaOrder.letters.includes(l));
    const numDistractors = Math.min(3, 8 - pizzaOrder.letters.length);

    for (let i = 0; i < numDistractors; i++) {
        if (distractors.length > 0) {
            const randomIndex = Math.floor(Math.random() * distractors.length);
            pizzaToppings.push(distractors[randomIndex]);
            distractors.splice(randomIndex, 1);
        }
    }

    // Shuffle toppings
    pizzaToppings = shuffleArray(pizzaToppings);

    renderPizzaToppings();
}

function renderPizzaToppings() {
    const container = document.getElementById('pizza-toppings');
    container.innerHTML = '';

    pizzaToppings.forEach((letter, index) => {
        const btn = document.createElement('button');
        btn.textContent = letter;
        btn.onclick = () => addTopping(index);
        btn.style.cssText = `
            font-size: 2em;
            padding: 15px 25px;
            background: ${toppingColors[letter] || '#ddd'};
            color: #333;
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

function addTopping(index) {
    if (!pizzaGameRunning) return;

    const letter = pizzaToppings[index];
    selectedToppings.push(letter);
    pizzaToppings.splice(index, 1);

    renderPizzaToppings();
}

function clearPizza() {
    if (!pizzaGameRunning) return;

    pizzaToppings = [...pizzaToppings, ...selectedToppings];
    selectedToppings = [];

    renderPizzaToppings();
}

function servePizza() {
    if (!pizzaGameRunning || selectedToppings.length === 0) return;

    const builtWord = selectedToppings.join('');

    if (builtWord === pizzaOrder.word) {
        // Correct pizza!
        pizzasCompleted++;
        pizzaScore += 20;
        updateScore(20);
        updateStars(2);

        document.getElementById('pizza-score').textContent = pizzaScore;
        document.getElementById('pizzas-completed').textContent = pizzasCompleted;

        chef.happy = true;
        showPizzaFeedback('🎉 פיצה מושלמת! הלקוח מרוצה!', true);

        if (pizzasCompleted % 5 === 0) {
            celebrate();
        }

        setTimeout(() => {
            chef.happy = false;
            if (pizzaGameRunning) {
                nextPizzaOrder();
            }
        }, 2500);
    } else {
        // Wrong pizza
        showPizzaFeedback('❌ לא הפיצה שהוזמנה!', false);
    }
}

function pizzaGameLoop() {
    if (!pizzaGameRunning) return;

    // Clear canvas
    pizzaCtx.clearRect(0, 0, pizzaCanvas.width, pizzaCanvas.height);

    // Draw kitchen background
    drawKitchen();

    // Draw chef
    drawChef();

    // Draw pizza base
    drawPizzaBase();

    // Draw selected toppings on pizza
    drawToppingsOnPizza();

    pizzaAnimationId = requestAnimationFrame(pizzaGameLoop);
}

function drawKitchen() {
    // Counter
    pizzaCtx.fillStyle = '#8B4513';
    pizzaCtx.fillRect(0, pizzaCanvas.height - 100, pizzaCanvas.width, 100);

    // Counter top
    pizzaCtx.fillStyle = '#A0522D';
    pizzaCtx.fillRect(0, pizzaCanvas.height - 100, pizzaCanvas.width, 15);

    // Wall tiles
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 14; x++) {
            pizzaCtx.strokeStyle = '#ccc';
            pizzaCtx.strokeRect(x * 50, y * 50, 50, 50);
        }
    }
}

function drawChef() {
    // Chef body
    pizzaCtx.fillStyle = 'white';
    pizzaCtx.fillRect(chef.x - 30, chef.y, 60, 80);

    // Chef head
    pizzaCtx.fillStyle = '#ffd93d';
    pizzaCtx.beginPath();
    pizzaCtx.arc(chef.x, chef.y - 10, 25, 0, Math.PI * 2);
    pizzaCtx.fill();

    // Chef hat
    pizzaCtx.fillStyle = 'white';
    pizzaCtx.fillRect(chef.x - 25, chef.y - 35, 50, 15);
    pizzaCtx.beginPath();
    pizzaCtx.arc(chef.x, chef.y - 35, 20, Math.PI, 0, true);
    pizzaCtx.fill();

    // Face emoji
    pizzaCtx.font = 'bold 35px Arial';
    pizzaCtx.textAlign = 'center';
    pizzaCtx.fillText(chef.happy ? '😄' : '🧑‍🍳', chef.x, chef.y + 5);
}

function drawPizzaBase() {
    const centerX = pizzaCanvas.width / 2 + 80;
    const centerY = pizzaCanvas.height / 2 - 20;
    const radius = 120;

    // Pizza shadow
    pizzaCtx.fillStyle = 'rgba(0,0,0,0.2)';
    pizzaCtx.beginPath();
    pizzaCtx.arc(centerX + 5, centerY + 5, radius, 0, Math.PI * 2);
    pizzaCtx.fill();

    // Pizza dough
    pizzaCtx.fillStyle = '#FFE4B5';
    pizzaCtx.beginPath();
    pizzaCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    pizzaCtx.fill();

    // Pizza crust
    pizzaCtx.strokeStyle = '#D2B48C';
    pizzaCtx.lineWidth = 12;
    pizzaCtx.stroke();

    // Tomato sauce
    pizzaCtx.fillStyle = '#FF6347';
    pizzaCtx.beginPath();
    pizzaCtx.arc(centerX, centerY, radius - 15, 0, Math.PI * 2);
    pizzaCtx.fill();

    // Cheese base
    pizzaCtx.fillStyle = '#FFD700';
    pizzaCtx.globalAlpha = 0.7;
    pizzaCtx.beginPath();
    pizzaCtx.arc(centerX, centerY, radius - 15, 0, Math.PI * 2);
    pizzaCtx.fill();
    pizzaCtx.globalAlpha = 1;
}

function drawToppingsOnPizza() {
    const centerX = pizzaCanvas.width / 2 + 80;
    const centerY = pizzaCanvas.height / 2 - 20;
    const radius = 90;

    selectedToppings.forEach((letter, index) => {
        const angle = (Math.PI * 2 * index) / Math.max(selectedToppings.length, 1);
        const distance = radius * 0.6 + (Math.random() - 0.5) * 30;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        // Topping circle
        pizzaCtx.fillStyle = toppingColors[letter] || '#ddd';
        pizzaCtx.beginPath();
        pizzaCtx.arc(x, y, 25, 0, Math.PI * 2);
        pizzaCtx.fill();

        // Topping border
        pizzaCtx.strokeStyle = '#333';
        pizzaCtx.lineWidth = 2;
        pizzaCtx.stroke();

        // Letter
        pizzaCtx.fillStyle = '#333';
        pizzaCtx.font = 'bold 24px Arial';
        pizzaCtx.textAlign = 'center';
        pizzaCtx.textBaseline = 'middle';
        pizzaCtx.fillText(letter, x, y);
    });
}

function showPizzaFeedback(message, isSuccess) {
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
        animation: fadeInOut 1.5s ease;
        border: 4px solid white;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1500);
}

function cleanupPizzaGame() {
    pizzaGameRunning = false;
    if (pizzaAnimationId) {
        cancelAnimationFrame(pizzaAnimationId);
        pizzaAnimationId = null;
    }
    if (pizzaCtx) {
        pizzaCtx.clearRect(0, 0, pizzaCanvas.width, pizzaCanvas.height);
    }
}

