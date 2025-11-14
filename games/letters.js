// Letter recognition game
const hebrewLetters = [
    'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י',
    'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'
];

const letterNames = {
    'א': 'אָלֶף', 'ב': 'בֵּית', 'ג': 'גִּימֶל', 'ד': 'דָּלֶת',
    'ה': 'הֵא', 'ו': 'וָו', 'ז': 'זַיִן', 'ח': 'חֵית',
    'ט': 'טֵית', 'י': 'יוֹד', 'כ': 'כַּף', 'ל': 'לָמֶד',
    'מ': 'מֵם', 'נ': 'נוּן', 'ס': 'סָמֶךְ', 'ע': 'עַיִן',
    'פ': 'פֵּא', 'צ': 'צָדִי', 'ק': 'קוֹף', 'ר': 'רֵישׁ',
    'ש': 'שִׁין', 'ת': 'תָּו'
};

let currentLetter = null;
let correctAnswers = 0;

function initLettersGame() {
    correctAnswers = 0;

    // Register cleanup function
    currentGameCleanup = cleanupLettersGame;

    nextLetterQuestion();
}

function cleanupLettersGame() {
    // Reset game state
    currentLetter = null;
    correctAnswers = 0;
}

function nextLetterQuestion() {
    currentLetter = hebrewLetters[Math.floor(Math.random() * hebrewLetters.length)];

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <h2 class="question-text">מצא את האות: ${letterNames[currentLetter]}</h2>
        <div class="options-container" id="letter-options"></div>
        <div style="text-align: center; margin-top: 30px; font-size: 1.5em; color: #667eea;">
            <strong>תשובות נכונות: ${correctAnswers} ⭐</strong>
        </div>
    `;

    // Create options
    const wrongLetters = hebrewLetters.filter(l => l !== currentLetter);
    const options = shuffleArray([
        currentLetter,
        ...getRandomItems(wrongLetters, 3)
    ]);

    const optionsContainer = document.getElementById('letter-options');
    options.forEach(letter => {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter-option';
        letterDiv.textContent = letter;
        letterDiv.onclick = () => checkLetterAnswer(letter, letterDiv);
        optionsContainer.appendChild(letterDiv);
    });
}

function checkLetterAnswer(selectedLetter, element) {
    const allOptions = document.querySelectorAll('.letter-option');
    allOptions.forEach(opt => opt.onclick = null);

    if (selectedLetter === currentLetter) {
        element.classList.add('correct');
        correctAnswers++;
        updateScore(10);
        updateStars(1);
        showFeedback('🎉 כל הכבוד! תשובה נכונה!', true);

        if (correctAnswers % 5 === 0) {
            celebrate();
        }

        setTimeout(() => {
            nextLetterQuestion();
        }, 1500);
    } else {
        element.classList.add('wrong');
        showFeedback('😊 נסה שוב! זו לא התשובה הנכונה', false);

        setTimeout(() => {
            element.classList.remove('wrong');
            allOptions.forEach(opt => {
                if (opt.textContent === currentLetter) {
                    opt.style.animation = 'bounce 0.5s ease';
                }
            });

            setTimeout(() => {
                allOptions.forEach(opt => opt.onclick = function() {
                    checkLetterAnswer(opt.textContent, opt);
                });
            }, 1000);
        }, 1500);
    }
}
