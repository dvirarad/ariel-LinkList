// Memory matching game
const memoryWords = [
    'אבא', 'אמא', 'כלב', 'חתול', 'בית', 'דג', 'ילד', 'ילדה',
    'ספר', 'עט', 'תיק', 'כדור', 'פרח', 'עץ', 'שמש', 'ירח'
];

let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;

function initMemoryGame() {
    matchedPairs = 0;
    flippedCards = [];

    // Select 8 words and duplicate them
    const selectedWords = getRandomItems(memoryWords, 8);
    memoryCards = shuffleArray([...selectedWords, ...selectedWords]);

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <h2 class="question-text">מצא את הזוגות!</h2>
        <div class="memory-grid" id="memory-grid"></div>
        <div style="text-align: center; margin-top: 30px; font-size: 1.5em; color: #667eea;">
            <strong>זוגות שמצאת: ${matchedPairs} / 8 🎯</strong>
        </div>
    `;

    const grid = document.getElementById('memory-grid');
    memoryCards.forEach((word, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.word = word;
        card.dataset.index = index;
        card.textContent = '?';
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');
    card.textContent = card.dataset.word;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        canFlip = false;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.word === card2.dataset.word) {
        // Match found!
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            updateScore(15);
            updateStars(2);

            // Update counter
            const counterText = document.querySelector('.question-text').nextElementSibling.nextElementSibling;
            counterText.innerHTML = `<strong>זוגות שמצאת: ${matchedPairs} / 8 🎯</strong>`;

            flippedCards = [];
            canFlip = true;

            if (matchedPairs === 8) {
                showFeedback('🎉 כל הכבוד! מצאת את כל הזוגות!', true);
                celebrate();

                setTimeout(() => {
                    initMemoryGame();
                }, 3000);
            }
        }, 500);
    } else {
        // No match
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '?';
            card2.textContent = '?';
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}
