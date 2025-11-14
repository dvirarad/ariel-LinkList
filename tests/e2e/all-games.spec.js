const { test, expect } = require('@playwright/test');

test.describe('Hebrew Learning Games Platform', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1.main-title')).toBeVisible();
  });

  test('homepage loads correctly', async ({ page }) => {
    await expect(page.locator('h1.main-title')).toContainText('משחקי קריאה וכתיבה');
    await expect(page.locator('.subtitle')).toContainText('בואו נלמד עברית בכיף');

    // Check all game cards are visible
    const gameCards = page.locator('.game-card');
    await expect(gameCards).toHaveCount(16); // 6 educational + 10 action games
  });

  test('Letters Game - זיהוי אותיות', async ({ page }) => {
    await page.click('text=זיהוי אותיות');
    await expect(page.locator('#game-container')).toBeVisible();
    await expect(page.locator('.question-text')).toBeVisible();

    // Game should have options to click
    await page.waitForSelector('.letter-option', { timeout: 5000 });
    const options = page.locator('.letter-option');
    await expect(options.first()).toBeVisible();

    // Click back to menu
    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Word Builder Game - בונים מילים', async ({ page }) => {
    await page.click('text=בונים מילים');
    await expect(page.locator('#game-container')).toBeVisible();
    await expect(page.locator('.target-word')).toBeVisible();

    // Should have draggable letters
    await page.waitForSelector('.draggable-letter', { timeout: 5000 });
    const letters = page.locator('.draggable-letter');
    await expect(letters.first()).toBeVisible();

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Memory Game - משחק זיכרון', async ({ page }) => {
    await page.click('text=משחק זיכרון');
    await expect(page.locator('#game-container')).toBeVisible();

    // Should have memory cards
    await page.waitForSelector('.memory-card', { timeout: 5000 });
    const cards = page.locator('.memory-card');
    await expect(cards).toHaveCount(12);

    // Click a card
    await cards.first().click();

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Syllables Game - קוראים הברות', async ({ page }) => {
    await page.click('text=קוראים הברות');
    await expect(page.locator('#game-container')).toBeVisible();
    await expect(page.locator('.question-text')).toBeVisible();

    // Should have syllable options
    await page.waitForTimeout(1000);

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Writing Game - כותבים אותיות', async ({ page }) => {
    await page.click('text=כותבים אותיות');
    await expect(page.locator('#game-container')).toBeVisible();

    // Should have a canvas for writing
    await page.waitForSelector('canvas', { timeout: 5000 });
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Sounds Game - התאמת צלילים', async ({ page }) => {
    await page.click('text=התאמת צלילים');
    await expect(page.locator('#game-container')).toBeVisible();
    await expect(page.locator('.question-text')).toBeVisible();

    await page.waitForTimeout(1000);

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Car Race Game - מרוץ מכוניות', async ({ page }) => {
    await page.click('text=מרוץ מכוניות');
    await expect(page.locator('#game-container')).toBeVisible();

    // Should have canvas and game controls
    await page.waitForSelector('#car-race-canvas', { timeout: 5000 });
    await expect(page.locator('#car-race-canvas')).toBeVisible();
    await expect(page.locator('#race-question')).toBeVisible();

    // Should have answer options
    const options = page.locator('.race-option-btn');
    await expect(options.first()).toBeVisible();

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Tractor Game - טרקטור בשדה', async ({ page }) => {
    await page.click('text=טרקטור בשדה');
    await expect(page.locator('#game-container')).toBeVisible();

    // Should have canvas
    await page.waitForSelector('#tractor-canvas', { timeout: 5000 });
    await expect(page.locator('#tractor-canvas')).toBeVisible();
    await expect(page.locator('#target-word')).toBeVisible();

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Space Game - חלל האותיות', async ({ page }) => {
    await page.click('text=חלל האותיות');
    await expect(page.locator('#game-container')).toBeVisible();

    // Should have canvas
    await page.waitForSelector('#space-canvas', { timeout: 5000 });
    await expect(page.locator('#space-canvas')).toBeVisible();
    await expect(page.locator('#space-question')).toBeVisible();

    // Should have control buttons
    await expect(page.locator('#space-btn-shoot')).toBeVisible();

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Soccer Game - כדורגל אותיות', async ({ page }) => {
    await page.click('text=כדורגל אותיות');
    await expect(page.locator('#game-container')).toBeVisible();

    // Should have canvas
    await page.waitForSelector('#soccer-canvas', { timeout: 5000 });
    await expect(page.locator('#soccer-canvas')).toBeVisible();
    await expect(page.locator('#soccer-question')).toBeVisible();

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Fishing Game - דיג מילים', async ({ page }) => {
    await page.click('text=דיג מילים');
    await expect(page.locator('#game-container')).toBeVisible();

    // Should have canvas
    await page.waitForSelector('#fishing-canvas', { timeout: 5000 });
    await expect(page.locator('#fishing-canvas')).toBeVisible();
    await expect(page.locator('#target-fishing-word')).toBeVisible();

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Zoo Game - הרפתקה בגן החיות', async ({ page }) => {
    await page.click('text=הרפתקה בגן החיות');
    await expect(page.locator('#game-container')).toBeVisible();

    // Should have canvas
    await page.waitForSelector('#zoo-canvas', { timeout: 5000 });
    await expect(page.locator('#zoo-canvas')).toBeVisible();
    await expect(page.locator('#zoo-question')).toBeVisible();

    // Should have letter buttons
    await page.waitForSelector('#zoo-letters-container button', { timeout: 5000 });

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Balloons Game - ירי בבלונים', async ({ page }) => {
    await page.click('text=ירי בבלונים');
    await expect(page.locator('#game-container')).toBeVisible();

    // Should have canvas
    await page.waitForSelector('#balloons-canvas', { timeout: 5000 });
    await expect(page.locator('#balloons-canvas')).toBeVisible();
    await expect(page.locator('#balloons-question')).toBeVisible();

    // Should have control buttons
    await expect(page.locator('#balloons-btn-shoot')).toBeVisible();

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Pizza Game - פיצרייה של מילים', async ({ page }) => {
    await page.click('text=פיצרייה של מילים');
    await expect(page.locator('#game-container')).toBeVisible();

    // Should have canvas
    await page.waitForSelector('#pizza-canvas', { timeout: 5000 });
    await expect(page.locator('#pizza-canvas')).toBeVisible();
    await expect(page.locator('#pizza-order')).toBeVisible();

    // Should have topping buttons
    await page.waitForSelector('#pizza-toppings button', { timeout: 5000 });

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Train Game - רכבת המילים', async ({ page }) => {
    await page.click('text=רכבת המילים');
    await expect(page.locator('#game-container')).toBeVisible();

    // Should have canvas
    await page.waitForSelector('#train-canvas', { timeout: 5000 });
    await expect(page.locator('#train-canvas')).toBeVisible();
    await expect(page.locator('#train-target-word')).toBeVisible();

    // Should have train car buttons
    await page.waitForSelector('#train-cars-container button', { timeout: 5000 });

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Airplane Game - מטוס אותיות', async ({ page }) => {
    await page.click('text=מטוס אותיות');
    await expect(page.locator('#game-container')).toBeVisible();

    // Should have canvas
    await page.waitForSelector('#airplane-canvas', { timeout: 5000 });
    await expect(page.locator('#airplane-canvas')).toBeVisible();
    await expect(page.locator('#airplane-question')).toBeVisible();

    // Should have control buttons
    await expect(page.locator('#airplane-btn-up')).toBeVisible();
    await expect(page.locator('#airplane-btn-down')).toBeVisible();

    await page.click('.back-button');
    await expect(page.locator('.game-menu')).toBeVisible();
  });

  test('Score tracking works', async ({ page }) => {
    // Check initial score
    await expect(page.locator('#score')).toContainText('0');
    await expect(page.locator('#stars')).toContainText('0');
  });

  test('All games cleanup properly on back button', async ({ page }) => {
    const games = [
      'זיהוי אותיות',
      'בונים מילים',
      'משחק זיכרון',
      'מרוץ מכוניות',
      'טרקטור בשדה'
    ];

    for (const game of games) {
      await page.click(`text=${game}`);
      await expect(page.locator('#game-container')).toBeVisible();
      await page.waitForTimeout(500);
      await page.click('.back-button');
      await expect(page.locator('.game-menu')).toBeVisible();
      await page.waitForTimeout(300);
    }
  });
});
