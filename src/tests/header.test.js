const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6'];

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });

    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
});

afterEach(async () => {
    await browser.close();
});

test('header logo', async () => {
    
    await page.emulate(iPhone);
    const alt = await page.$eval('img.makeStyles-logo-3', el => el.alt);
    const src = await page.$eval('img.makeStyles-logo-3', el => el.src);

    expect(alt).toEqual('logo');
    expect(src).toEqual("https://jaytronics.s3.ap-southeast-2.amazonaws.com/other/logo.svg");

});