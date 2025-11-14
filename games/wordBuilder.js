// Word building game
const simpleWords = [
    { word: 'אבא', letters: ['א', 'ב', 'א'] },
    { word: 'אמא', letters: ['א', 'מ', 'א'] },
    { word: 'כלב', letters: ['כ', 'ל', 'ב'] },
    { word: 'חתול', letters: ['ח', 'ת', 'ו', 'ל'] },
    { word: 'בית', letters: ['ב', 'י', 'ת'] },
    { word: 'דג', letters: ['ד', 'ג'] },
    { word: 'ילד', letters: ['י', 'ל', 'ד'] },
    { word: 'ספר', letters: ['ס', 'פ', 'ר'] },
    { word: 'שולחן', letters: ['ש', 'ו', 'ל', 'ח', 'נ'] },
    { word: 'כסא', letters: ['כ', 'ס', 'א'] },
    { word: 'דלת', letters: ['ד', 'ל', 'ת'] },
    { word: 'חלון', letters: ['ח', 'ל', 'ו', 'נ'] },
    { word: 'עץ', letters: ['ע', 'ץ'] },
    { word: 'פרח', letters: ['פ', 'ר', 'ח'] },
    { word: 'שמש', letters: ['ש', 'מ', 'ש'] }
];

let currentWord = null;
let playerWord = [];
let wordsCompleted = 0;

function initWordBuilderGame() {
    wordsCompleted = 0;

    // Register cleanup function
    currentGameCleanup = cleanupWordBuilderGame;

    nextWordBuildQuestion();
}

function cleanupWordBuilderGame() {
    // Reset game state
    currentWord = null;
    playerWord = [];
    wordsCompleted = 0;
    selectedLetterElement = null;
    selectedLetter = null;
}

function nextWordBuildQuestion() {
    currentWord = simpleWords[Math.floor(Math.random() * simpleWords.length)];
    playerWord = new Array(currentWord.letters.length).fill('');

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div class="word-builder-container">
            <h2 class="question-text">בנה את המילה: ${currentWord.word}</h2>
            <div class="letter-slots" id="letter-slots"></div>
            <div class="available-letters" id="available-letters"></div>
            <div style="text-align: center; margin-top: 30px; font-size: 1.5em; color: #667eea;">
                <strong>מילים שהשלמת: ${wordsCompleted} 🏆</strong>
            </div>
        </div>
    `;

    // Create letter slots
    const slotsContainer = document.getElementById('letter-slots');
    currentWord.letters.forEach((letter, index) => {
        const slot = document.createElement('div');
        slot.className = 'letter-slot';
        slot.id = `slot-${index}`;
        slot.dataset.index = index;
        slotsContainer.appendChild(slot);
    });

    // Create available letters with some distractors
    const allLettersArray = [...currentWord.letters];
    const otherLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס'];
    const distractors = getRandomItems(otherLetters.filter(l => !allLettersArray.includes(l)), 3);
    const availableLetters = shuffleArray([...allLettersArray, ...distractors]);

    const lettersContainer = document.getElementById('available-letters');
    availableLetters.forEach((letter, index) => {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'draggable-letter';
        letterDiv.textContent = letter;
        letterDiv.dataset.letter = letter;
        letterDiv.dataset.id = index;
        letterDiv.onclick = () => selectLetter(letter, letterDiv);
        lettersContainer.appendChild(letterDiv);
    });
}

let selectedLetterElement = null;
let selectedLetter = null;

function selectLetter(letter, element) {
    if (element.classList.contains('used')) return;

    // Deselect previously selected letter
    if (selectedLetterElement) {
        selectedLetterElement.style.border = 'none';
    }

    selectedLetterElement = element;
    selectedLetter = letter;
    element.style.border = '4px solid #ffe66d';

    // Find next empty slot
    const emptySlotIndex = playerWord.findIndex(l => l === '');
    if (emptySlotIndex !== -1) {
        placeLetter(emptySlotIndex);
    }
}

function placeLetter(slotIndex) {
    if (!selectedLetter || !selectedLetterElement) return;

    playerWord[slotIndex] = selectedLetter;

    const slot = document.getElementById(`slot-${slotIndex}`);
    slot.textContent = selectedLetter;
    slot.classList.add('filled');

    selectedLetterElement.classList.add('used');
    selectedLetterElement.style.border = 'none';

    selectedLetterElement = null;
    selectedLetter = null;

    // Check if word is complete
    if (!playerWord.includes('')) {
        checkWord();
    }
}

function checkWord() {
    const isCorrect = playerWord.every((letter, index) => letter === currentWord.letters[index]);

    setTimeout(() => {
        if (isCorrect) {
            wordsCompleted++;
            updateScore(20);
            updateStars(2);
            showFeedback('🎊 מעולה! בנית את המילה נכון!', true);
            celebrate();

            setTimeout(() => {
                nextWordBuildQuestion();
            }, 2000);
        } else {
            showFeedback('😊 כמעט! נסה שוב', false);

            setTimeout(() => {
                // Reset
                playerWord = new Array(currentWord.letters.length).fill('');
                document.querySelectorAll('.letter-slot').forEach(slot => {
                    slot.textContent = '';
                    slot.classList.remove('filled');
                });
                document.querySelectorAll('.draggable-letter').forEach(letter => {
                    letter.classList.remove('used');
                });
            }, 1500);
        }
    }, 500);
}
