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
    nextSyllableQuestion();
}

function nextSyllableQuestion() {
    currentSyllableWord = syllableWords[Math.floor(Math.random() * syllableWords.length)];

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <h2 class="question-text">איך מחלקים את המילה: <span style="color: #ff6b6b;">${currentSyllableWord.word}</span></h2>
        <div class="options-container" id="syllable-options"></div>
        <div style="text-align: center; margin-top: 30px; font-size: 1.5em; color: #667eea;">
            <strong>תשובות נכונות: ${syllablesCorrect} 📖</strong>
        </div>
    `;

    const optionsContainer = document.getElementById('syllable-options');
    const options = shuffleArray([...currentSyllableWord.syllables]);

    options.forEach(syllable => {
        const syllableDiv = document.createElement('div');
        syllableDiv.className = 'syllable-option';
        syllableDiv.textContent = syllable;
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
