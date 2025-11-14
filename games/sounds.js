// Sound matching game
const letterSounds = [
    { letter: 'א', sound: 'א (אָלֶף)', examples: ['אבא', 'אמא', 'אוכל'] },
    { letter: 'ב', sound: 'ב (בּ/ב)', examples: ['בית', 'בובה', 'בננה'] },
    { letter: 'ג', sound: 'ג (גּ)', examples: ['גמל', 'גינה', 'גשר'] },
    { letter: 'ד', sound: 'ד (דּ)', examples: ['דג', 'דלת', 'דוב'] },
    { letter: 'ה', sound: 'ה (הּ)', examples: ['הר', 'היום', 'הנה'] },
    { letter: 'ו', sound: 'ו (ו/וּ)', examples: ['ורד', 'ווילון', 'ועד'] },
    { letter: 'ז', sound: 'ז (ז)', examples: ['זאב', 'זבוב', 'זהב'] },
    { letter: 'ח', sound: 'ח (חּ)', examples: ['חתול', 'חלון', 'חלב'] },
    { letter: 'ט', sound: 'ט (טּ)', examples: ['טלה', 'טבעת', 'טוב'] },
    { letter: 'י', sound: 'י (י)', examples: ['ילד', 'ים', 'יד'] },
    { letter: 'כ', sound: 'כ (כּ/כ)', examples: ['כלב', 'כדור', 'כוס'] },
    { letter: 'ל', sound: 'ל (ל)', examples: ['לב', 'לחם', 'לילה'] },
    { letter: 'מ', sound: 'מ (מ)', examples: ['מים', 'מכונית', 'מטוס'] },
    { letter: 'נ', sound: 'נ (נ)', examples: ['נר', 'נעל', 'נחש'] },
    { letter: 'ס', sound: 'ס (ס)', examples: ['סוס', 'ספר', 'סבתא'] },
    { letter: 'ע', sound: 'ע (ע)', examples: ['עץ', 'עיגול', 'עכביש'] },
    { letter: 'פ', sound: 'פ (פּ/פ)', examples: ['פיל', 'פרח', 'פה'] },
    { letter: 'צ', sound: 'צ (צ)', examples: ['ציפור', 'צבע', 'צבי'] },
    { letter: 'ק', sound: 'ק (ק)', examples: ['קוף', 'קפה', 'קול'] },
    { letter: 'ר', sound: 'ר (ר)', examples: ['רכבת', 'רגל', 'ראש'] },
    { letter: 'ש', sound: 'ש (שׁ/שׂ)', examples: ['שמש', 'שולחן', 'שיר'] },
    { letter: 'ת', sound: 'ת (תּ)', examples: ['תפוח', 'תינוק', 'תיק'] }
];

let currentSound = null;
let soundsCorrect = 0;

function initSoundsGame() {
    soundsCorrect = 0;
    nextSoundQuestion();
}

function nextSoundQuestion() {
    currentSound = letterSounds[Math.floor(Math.random() * letterSounds.length)];

    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <h2 class="question-text">באיזו אות מתחילות המילים?</h2>
        <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: #e7f5ff; padding: 30px; border-radius: 15px; border: 3px solid #667eea;">
                ${currentSound.examples.map(word =>
                    `<div style="font-size: 2.5em; margin: 15px 0; color: #667eea; font-weight: bold;">${word}</div>`
                ).join('')}
            </div>
        </div>
        <div class="options-container" id="sound-options"></div>
        <div style="text-align: center; margin-top: 30px; font-size: 1.5em; color: #667eea;">
            <strong>תשובות נכונות: ${soundsCorrect} 🔊</strong>
        </div>
    `;

    // Create options
    const wrongSounds = letterSounds.filter(s => s.letter !== currentSound.letter);
    const options = shuffleArray([
        currentSound.letter,
        ...getRandomItems(wrongSounds.map(s => s.letter), 3)
    ]);

    const optionsContainer = document.getElementById('sound-options');
    options.forEach(letter => {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter-option';
        letterDiv.textContent = letter;
        letterDiv.onclick = () => checkSoundAnswer(letter, letterDiv);
        optionsContainer.appendChild(letterDiv);
    });
}

function checkSoundAnswer(selectedLetter, element) {
    const allOptions = document.querySelectorAll('.letter-option');
    allOptions.forEach(opt => opt.onclick = null);

    if (selectedLetter === currentSound.letter) {
        element.classList.add('correct');
        soundsCorrect++;
        updateScore(10);
        updateStars(1);
        showFeedback('🎵 נהדר! זיהית נכון את הצליל!', true);

        if (soundsCorrect % 5 === 0) {
            celebrate();
        }

        setTimeout(() => {
            nextSoundQuestion();
        }, 1500);
    } else {
        element.classList.add('wrong');
        showFeedback('😊 לא בדיוק, נסה שוב!', false);

        setTimeout(() => {
            element.classList.remove('wrong');
            allOptions.forEach(opt => opt.onclick = function() {
                checkSoundAnswer(opt.textContent, opt);
            });
        }, 1500);
    }
}
