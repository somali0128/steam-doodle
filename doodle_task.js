require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');
const { Web3Storage, File } = require('web3.storage');
const storageClient = new Web3Storage({
  token: process.env.SECRET_WEB3_STORAGE_KEY,
});

const main = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();
    await page.goto('https://store.steampowered.com/');

    // Getting the background image url
    const imageUrl = await page.evaluate(() => {
      const bgDiv = document.querySelector('.page_background_holder');
      const url = bgDiv.style.backgroundImage.slice(5, -2);
      return url;
    });

    await browser.close();

    // Downloading the image
    console.log('Downloading image...', imageUrl);
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    const date = new Date().toISOString().slice(0, 10);
    const filename = `steam-doodle-${date}.gif`;

    // Uploading the image to IPFS
    const file = new File([buffer], filename, {
      type: 'image/gif',
    });

    const cid = await storageClient.put([file]);
    console.log(`Uploaded and got CID: ${cid}`);

    return cid;
  } catch (err) {
    console.log('ERROR IN TASK', err);
    return null;
  }
};

module.exports = { main };
