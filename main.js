const puppeteer = require('puppeteer');
require('dotenv').config();

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://linkedin.com');
  await page.click('.nav__button-secondary');
  await page.type('#username', process.env.LK_USERNAME);
  await page.type('#password', process.env.LK_PASSWORD);
  await page.keyboard.press('Enter');
  await browser.close();
})();