// Letter-Word Matching Game - Connect word to its first letter
const letterWordPairs = [
    { letter: 'א', words: ['אבא', 'אמא', 'אריה', 'ארנב', 'אש', 'אוהל', 'אווז', 'אוכל'] },
    { letter: 'ב', words: ['בית', 'בננה', 'בלון', 'בובה'] },
    { letter: 'ג', words: ['גמל', 'גבינה', 'גיטרה', 'גן', 'גשם'] },
    { letter: 'ד', words: ['דג', 'דלת', 'דוב', 'דבורה', 'דשא', 'דולפין'] },
    { letter: 'ה', words: ['הר', 'היפו'] },
    { letter: 'ו', words: ['ורד'] },
    { letter: 'ז', words: ['זאב', 'זברה'] },
    { letter: 'ח', words: ['חתול', 'חלב', 'חלון', 'חולצה', 'חוף'] },
    { letter: 'ט', words: ['טלפון', 'טרקטור', 'טלויזיה', 'תוף'] },
    { letter: 'י', words: ['ילד', 'ילדה', 'ירח', 'ים', 'יונה', 'ינשוף'] },
    { letter: 'כ', words: ['כלב', 'כדור', 'כוכב', 'כובע', 'כיסא', 'כוס', 'כפית', 'כריש'] },
    { letter: 'ל', words: ['לחם', 'לב', 'לוויתן'] },
    { letter: 'מ', words: ['מים', 'מיטה', 'מכונית', 'מחשב', 'מטוס', 'מצלמה', 'משקפיים', 'מזלג'] },
    { letter: 'נ', words: ['נר', 'נמר', 'נחש', 'נמלה', 'נעליים'] },
    { letter: 'ס', words: ['ספר', 'סוס', 'סלט', 'סכין', 'סרטן'] },
    { letter: 'ע', words: ['עץ', 'עט', 'עוגה', 'עיפרון', 'עננים'] },
    { letter: 'פ', words: ['פיל', 'פרח', 'פרפר', 'פיצה', 'פנדה', 'פעמון'] },
    { letter: 'צ', words: ['ציפור', 'צב', 'צפרדע', 'צלחת'] },
    { letter: 'ק', words: ['קוף', 'קשת', 'קרנף'] },
    { letter: 'ר', words: ['רכבת'] },
    { letter: 'ש', words: ['שמש', 'שולחן', 'שעון', 'שוקולד', 'שועל', 'שלג', 'שמיים'] },
    { letter: 'ת', words: ['תיק', 'תפוח', 'תרנגול', 'תנין', 'תמנון'] }
];

let currentLetterWords = [];
let connections = {};
let currentLine = null;
let startElement = null;

function initLetterWordGame() {
    connections = {};
    currentLine = null;
    startElement = null;

    // Register cleanup function
    currentGameCleanup = cleanupLetterWordGame;

    nextLetterWordQuestion();
}

function nextLetterWordQuestion() {
    // Select 4 random letter groups
    const selectedGroups = getRandomItems(letterWordPairs, 4);

    // For each group, select one random word
    currentLetterWords = selectedGroups.map(group => ({
        letter: group.letter,
        word: getRandomItems(group.words, 1)[0]
    }));

    // Shuffle the letters separately
    const shuffledLetters = shuffleArray([...currentLetterWords.map(item => item.letter)]);

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <h2 class="question-text">חבר כל מילה לאות שמתחילה אותה</h2>

        <div class="letter-word-container">
            <div class="words-column" id="words-column"></div>
            <svg id="connection-svg" class="connection-svg"></svg>
            <div class="letters-column" id="letters-column"></div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <button onclick="checkLetterWordConnections()" class="check-button">
                ✅ בדוק תשובות
            </button>
            <button onclick="resetConnections()" class="reset-button">
                🔄 נקה הכל
            </button>
        </div>

        <div id="feedback-area" style="text-align: center; margin-top: 20px; font-size: 1.5em; min-height: 40px;"></div>
    `;

    // Create words column
    const wordsColumn = document.getElementById('words-column');
    currentLetterWords.forEach((item, index) => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word-item';
        wordDiv.dataset.letter = item.letter;
        wordDiv.dataset.word = item.word;
        wordDiv.dataset.index = index;

        const emoji = document.createElement('span');
        emoji.textContent = getWordImage(item.word);
        emoji.style.cssText = 'font-size: 2em; margin-left: 10px;';

        const wordText = document.createElement('span');
        wordText.textContent = item.word;
        wordText.style.cssText = 'font-size: 1.5em; font-weight: bold; margin-left: 10px;';

        const speakerBtn = createSpeakerButton(item.word, '1em');
        speakerBtn.style.marginLeft = '10px';

        const connector = document.createElement('div');
        connector.className = 'word-connector';
        connector.dataset.index = index;
        connector.onmousedown = (e) => startConnection(e, 'word', index);
        connector.ontouchstart = (e) => startConnection(e, 'word', index);

        wordDiv.appendChild(emoji);
        wordDiv.appendChild(wordText);
        wordDiv.appendChild(speakerBtn);
        wordDiv.appendChild(connector);

        wordsColumn.appendChild(wordDiv);
    });

    // Create letters column
    const lettersColumn = document.getElementById('letters-column');
    shuffledLetters.forEach((letter, index) => {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter-item';
        letterDiv.dataset.letter = letter;
        letterDiv.dataset.index = index;

        const connector = document.createElement('div');
        connector.className = 'letter-connector';
        connector.dataset.index = index;
        connector.onmousedown = (e) => startConnection(e, 'letter', index);
        connector.ontouchstart = (e) => startConnection(e, 'letter', index);

        const letterText = document.createElement('span');
        letterText.textContent = letter;
        letterText.style.cssText = 'font-size: 2em; font-weight: bold;';

        letterDiv.appendChild(connector);
        letterDiv.appendChild(letterText);

        lettersColumn.appendChild(letterDiv);
    });

    // Setup mouse/touch events for drawing
    const svg = document.getElementById('connection-svg');
    svg.onmousemove = drawConnection;
    svg.onmouseup = endConnection;
    svg.ontouchmove = drawConnection;
    svg.ontouchend = endConnection;
}

function startConnection(e, type, index) {
    e.preventDefault();
    e.stopPropagation();

    startElement = { type, index };

    // Create temporary line
    const svg = document.getElementById('connection-svg');
    currentLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    currentLine.setAttribute('stroke', '#667eea');
    currentLine.setAttribute('stroke-width', '4');
    currentLine.setAttribute('stroke-linecap', 'round');

    const rect = e.target.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - svgRect.left;
    const y = rect.top + rect.height / 2 - svgRect.top;

    currentLine.setAttribute('x1', x);
    currentLine.setAttribute('y1', y);
    currentLine.setAttribute('x2', x);
    currentLine.setAttribute('y2', y);

    svg.appendChild(currentLine);
}

function drawConnection(e) {
    if (!currentLine) return;

    e.preventDefault();
    const svg = document.getElementById('connection-svg');
    const svgRect = svg.getBoundingClientRect();

    let clientX, clientY;
    if (e.type.includes('touch')) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const x = clientX - svgRect.left;
    const y = clientY - svgRect.top;

    currentLine.setAttribute('x2', x);
    currentLine.setAttribute('y2', y);
}

function endConnection(e) {
    if (!currentLine || !startElement) return;

    e.preventDefault();

    // Find target element under mouse/touch
    let clientX, clientY;
    if (e.type.includes('touch')) {
        if (e.changedTouches.length > 0) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        } else {
            currentLine.remove();
            currentLine = null;
            startElement = null;
            return;
        }
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const target = document.elementFromPoint(clientX, clientY);

    if (target && (target.classList.contains('word-connector') || target.classList.contains('letter-connector'))) {
        const targetType = target.classList.contains('word-connector') ? 'word' : 'letter';
        const targetIndex = parseInt(target.dataset.index);

        // Check if connection is valid (word to letter or letter to word)
        if (startElement.type !== targetType) {
            const wordIndex = startElement.type === 'word' ? startElement.index : targetIndex;
            const letterIndex = startElement.type === 'letter' ? startElement.index : targetIndex;

            // Save connection
            connections[wordIndex] = letterIndex;

            // Redraw all connections
            redrawConnections();
        } else {
            currentLine.remove();
        }
    } else {
        currentLine.remove();
    }

    currentLine = null;
    startElement = null;
}

function redrawConnections() {
    const svg = document.getElementById('connection-svg');
    svg.innerHTML = '';

    Object.entries(connections).forEach(([wordIndex, letterIndex]) => {
        const wordConnector = document.querySelector(`.word-connector[data-index="${wordIndex}"]`);
        const letterConnector = document.querySelector(`.letter-connector[data-index="${letterIndex}"]`);

        if (wordConnector && letterConnector) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

            const svgRect = svg.getBoundingClientRect();
            const rect1 = wordConnector.getBoundingClientRect();
            const rect2 = letterConnector.getBoundingClientRect();

            const x1 = rect1.left + rect1.width / 2 - svgRect.left;
            const y1 = rect1.top + rect1.height / 2 - svgRect.top;
            const x2 = rect2.left + rect2.width / 2 - svgRect.left;
            const y2 = rect2.top + rect2.height / 2 - svgRect.top;

            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', '#667eea');
            line.setAttribute('stroke-width', '4');
            line.setAttribute('stroke-linecap', 'round');
            line.dataset.wordIndex = wordIndex;

            svg.appendChild(line);
        }
    });
}

function resetConnections() {
    connections = {};
    redrawConnections();
    document.getElementById('feedback-area').innerHTML = '';
}

function checkLetterWordConnections() {
    let correct = 0;
    let total = currentLetterWords.length;

    // Clear previous visual feedback
    document.querySelectorAll('.word-item, .letter-item').forEach(el => {
        el.classList.remove('correct-connection', 'wrong-connection');
    });

    // Check each connection
    Object.entries(connections).forEach(([wordIndex, letterIndex]) => {
        const wordItem = currentLetterWords[parseInt(wordIndex)];
        const letterElements = document.querySelectorAll('.letter-item');
        const selectedLetter = letterElements[letterIndex].dataset.letter;

        const line = document.querySelector(`line[data-word-index="${wordIndex}"]`);

        if (wordItem.letter === selectedLetter) {
            correct++;
            if (line) line.setAttribute('stroke', '#51cf66');

            const wordEl = document.querySelector(`.word-item[data-index="${wordIndex}"]`);
            const letterEl = letterElements[letterIndex];
            wordEl.classList.add('correct-connection');
            letterEl.classList.add('correct-connection');
        } else {
            if (line) line.setAttribute('stroke', '#ff6b6b');

            const wordEl = document.querySelector(`.word-item[data-index="${wordIndex}"]`);
            const letterEl = letterElements[letterIndex];
            wordEl.classList.add('wrong-connection');
            letterEl.classList.add('wrong-connection');
        }
    });

    const feedbackArea = document.getElementById('feedback-area');

    if (correct === total && Object.keys(connections).length === total) {
        feedbackArea.innerHTML = '<span style="color: #51cf66; font-weight: bold;">🎉 מעולה! כל התשובות נכונות!</span>';
        updateScore(20);
        updateStars(3);
        celebrate();

        setTimeout(() => {
            nextLetterWordQuestion();
        }, 2500);
    } else if (Object.keys(connections).length < total) {
        feedbackArea.innerHTML = '<span style="color: #ff9800;">עוד לא סיימת לחבר את כל המילים</span>';
    } else {
        feedbackArea.innerHTML = `<span style="color: #ff6b6b;">יש ${total - correct} טעויות, נסה שוב!</span>`;
    }
}

function cleanupLetterWordGame() {
    connections = {};
    currentLine = null;
    startElement = null;
    currentLetterWords = [];
}
