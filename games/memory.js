// Memory matching game - Rich word bank
const memoryWords = [
    // משפחה ובני אדם
    'אבא', 'אמא', 'ילד', 'ילדה',
    // בעלי חיים ביתיים
    'כלב', 'חתול', 'דג', 'ציפור', 'ארנב', 'סוס',
    // בעלי חיים פראיים
    'אריה', 'פיל', 'קוף', 'ג׳ירפה', 'זברה', 'דוב', 'פנדה', 'שועל',
    'דולפין', 'לוויתן', 'צב', 'צפרדע', 'נחש', 'תנין',
    // חרקים
    'פרפר', 'דבורה', 'נמלה',
    // עופות
    'תרנגול', 'אווז', 'ינשוף', 'יונה',
    // אוכל
    'לחם', 'חלב', 'גבינה', 'ביצה', 'תפוח', 'בננה',
    'עוגה', 'עוגיה', 'שוקולד', 'גלידה', 'פיצה',
    // כלים
    'כוס', 'צלחת', 'כפית', 'מזלג',
    // בית ורהיטים
    'בית', 'דלת', 'חלון', 'מיטה', 'שולחן', 'כיסא',
    // בגדים
    'חולצה', 'מכנסיים', 'נעליים', 'כובע', 'משקפיים',
    // ציוד לימודי
    'ספר', 'עט', 'עיפרון', 'תיק',
    // משחקים וספורט
    'כדור', 'בלון',
    // טבע
    'פרח', 'עץ', 'שמש', 'ירח', 'כוכב', 'עננים', 'גשם', 'קשת',
    'ים', 'הר', 'דשא',
    // כלי נגינה
    'גיטרה', 'תוף',
    // כלי תחבורה
    'מכונית', 'טרקטור', 'רכבת', 'מטוס',
    // מכשירים
    'טלפון', 'מחשב', 'שעון', 'מצלמה',
    // שונות
    'לב', 'אש', 'מים', 'נר'
];

let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;

function initMemoryGame() {
    matchedPairs = 0;
    flippedCards = [];

    // Register cleanup function
    currentGameCleanup = cleanupMemoryGame;

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

        // Create card back (question mark)
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.textContent = '?';
        cardBack.style.cssText = 'font-size: 3em; font-weight: bold; color: #667eea;';

        // Create card front (word + image)
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.style.cssText = 'display: none; flex-direction: column; align-items: center; gap: 5px;';

        const emoji = document.createElement('div');
        emoji.textContent = getWordImage(word);
        emoji.style.cssText = 'font-size: 2.5em;';

        const wordText = document.createElement('div');
        wordText.textContent = word;
        wordText.style.cssText = 'font-size: 1.3em; font-weight: bold;';

        cardFront.appendChild(emoji);
        cardFront.appendChild(wordText);

        card.appendChild(cardBack);
        card.appendChild(cardFront);
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');

    // Show front, hide back
    const cardBack = card.querySelector('.card-back');
    const cardFront = card.querySelector('.card-front');
    cardBack.style.display = 'none';
    cardFront.style.display = 'flex';

    // Speak the word
    speakText(card.dataset.word);

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

            // Show back, hide front
            const back1 = card1.querySelector('.card-back');
            const front1 = card1.querySelector('.card-front');
            const back2 = card2.querySelector('.card-back');
            const front2 = card2.querySelector('.card-front');

            back1.style.display = 'block';
            front1.style.display = 'none';
            back2.style.display = 'block';
            front2.style.display = 'none';

            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

function cleanupMemoryGame() {
    // Reset game state
    memoryCards = [];
    flippedCards = [];
    matchedPairs = 0;
    canFlip = true;
}
