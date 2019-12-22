const puppeteer = require('puppeteer');
require('dotenv').config();
const cheerio = require('cheerio');
const fillTemplate = require('es6-dynamic-template');

const argv = require('yargs').argv;
const myName = argv.n;
const username = argv.u;
const password = argv.p;

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://linkedin.com');
  await page.click('.nav__button-secondary');
  await page.waitFor(1000);
  await page.waitForSelector('#username', {visible: true});
  await page.type('#username', username, {delay: 100});
  await page.type('#password', password, {delay: 100});
  await page.waitFor(1500);
  await page.keyboard.press('Enter');
  await page.waitFor(2000);
  await page.goto('https://www.linkedin.com/messaging');
  const content = await page.content();
  const $ = cheerio.load(content);
  const recruiterName = $('.msg-conversation-listitem__participant-names.msg-conversation-card__participant-names.truncate.pr1.t-16.t-black.t-normal').text().trim().split(" ")[0];
  await page.waitFor(2000);
  const message = fillTemplate(process.env.MESSAGE, { myName: myName, recruiterName: recruiterName });
  await page.type('.msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.notranslate', message);
  await page.waitFor(1000);
  await page.click('.msg-form__send-button.artdeco-button.artdeco-button--1');
})();

