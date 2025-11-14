// Syllable reading game
const syllableWords = [
    { word: 'אבא', syllables: ['א-בא', 'אב-א'], correct: 'א-בא' },
    { word: 'אמא', syllables: ['א-מא', 'אם-א'], correct: 'א-מא' },
    { word: 'ילד', syllables: ['יל-ד', 'י-לד'], correct: 'יל-ד' },
    { word: 'כלב', syllables: ['כל-ב', 'כ-לב'], correct: 'כל-ב' },
    { word: 'ספר', syllables: ['ספ-ר', 'ס-פר'], correct: 'ספ-ר' },
    { word: 'שולחן', syllables: ['שול-חן', 'שו-לחן'], correct: 'שול-חן' },
    { word: 'חלון', syllables: ['חל-ון', 'ח-לון'], correct: 'חל-ון' },
    { word: 'פרח', syllables: ['פר-ח', 'פ-רח'], correct: 'פר-ח' },
    { word: 'דלת', syllables: ['דל-ת', 'ד-לת'], correct: 'דל-ת' },
    { word: 'כסא', syllables: ['כס-א', 'כ-סא'], correct: 'כס-א' }
];

let currentSyllableWord = null;
let syllablesCorrect = 0;

function initSyllablesGame() {
    syllablesCorrect = 0;

    // Register cleanup function
    currentGameCleanup = cleanupSyllablesGame;

    nextSyllableQuestion();
}

function cleanupSyllablesGame() {
    // Reset game state
    currentSyllableWord = null;
    syllablesCorrect = 0;
}

function nextSyllableQuestion() {
    currentSyllableWord = syllableWords[Math.floor(Math.random() * syllableWords.length)];

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 class="question-text" style="display: inline-block; margin: 0;">איך מחלקים את המילה:</h2>
            <div id="word-speaker" style="display: inline-flex; align-items: center; margin: 10px;"></div>
        </div>
        <div class="options-container" id="syllable-options"></div>
        <div style="text-align: center; margin-top: 30px; font-size: 1.5em; color: #667eea;">
            <strong>תשובות נכונות: ${syllablesCorrect} 📖</strong>
        </div>
    `;

    // Add word with image and speaker
    const wordSpeaker = document.getElementById('word-speaker');
    const wordDisplay = createWordDisplay(currentSyllableWord.word, true, true);
    wordSpeaker.appendChild(wordDisplay);

    // Auto-play the word
    setTimeout(() => speakText(currentSyllableWord.word), 300);

    const optionsContainer = document.getElementById('syllable-options');
    const options = shuffleArray([...currentSyllableWord.syllables]);

    options.forEach(syllable => {
        const syllableDiv = document.createElement('div');
        syllableDiv.className = 'syllable-option';
        syllableDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 10px;';

        // Add syllable text
        const textSpan = document.createElement('span');
        textSpan.textContent = syllable;
        textSpan.style.fontSize = '1.5em';
        syllableDiv.appendChild(textSpan);

        // Add small speaker button
        const speakerBtn = createSpeakerButton(syllable.replace('-', ' '), '1em');
        speakerBtn.style.margin = '0';
        syllableDiv.appendChild(speakerBtn);

        syllableDiv.onclick = () => checkSyllableAnswer(syllable, syllableDiv);
        optionsContainer.appendChild(syllableDiv);
    });
}

function checkSyllableAnswer(selectedSyllable, element) {
    const allOptions = document.querySelectorAll('.syllable-option');
    allOptions.forEach(opt => opt.onclick = null);

    if (selectedSyllable === currentSyllableWord.correct) {
        element.classList.add('correct');
        syllablesCorrect++;
        updateScore(15);
        updateStars(1);
        showFeedback('👏 מצוין! חילקת נכון את המילה!', true);

        if (syllablesCorrect % 5 === 0) {
            celebrate();
        }

        setTimeout(() => {
            nextSyllableQuestion();
        }, 1500);
    } else {
        element.classList.add('wrong');
        showFeedback('😊 לא בדיוק, נסה שוב!', false);

        setTimeout(() => {
            element.classList.remove('wrong');
            allOptions.forEach(opt => opt.onclick = function() {
                checkSyllableAnswer(opt.textContent, opt);
            });
        }, 1500);
    }
}
