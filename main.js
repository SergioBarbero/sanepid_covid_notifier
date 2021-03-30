const puppeteer = require('puppeteer');
var nodemailer = require('nodemailer');
const cron = require('node-cron');
var shell = require('shelljs');

require('dotenv').config();

const pesel = process.argv[2];
const code = process.argv[3];
const emailFrom = process.env.FROM;
const password = process.env.FROM_PASSWORD;
const emailTo = process.env.TO;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailFrom,
    pass: password
  }
});

var mailOptions = {
  from: emailFrom,
  to: emailTo,
  subject: 'Results available',
  text: 'Covid test available'
};

cron.schedule('*/10 * * * *', async () => {
  (async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768});
    await page.goto('https://covid19.gyncentrum.pl/sanepid');
  
    await page.type('#pesel_aut', pesel, {delay: 100});
    await page.type('#nr_probki_aut', code, {delay: 100});
    await page.click('.button.primary.fit');
  
    page.waitForNavigation(5);
    await page.waitForSelector('div#wynik_link > a');
    try {
      await page.click('div#wynik_link > a');
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log(error);
          await browser.close();
        } else {
          console.log('Email sent: ' + info.response);
          await browser.close();
        }
      });
    } catch (err) {
      console.log(err);
      console.log("Results not uploaded")
      browser.close();
    } finally {
      await browser.close();
    }
  })();
});
