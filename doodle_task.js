require('dotenv').config();
const PCR = require("puppeteer-chromium-resolver");
const axios = require('axios');
const { Web3Storage, File } = require('web3.storage');
const storageClient = new Web3Storage({
  token: process.env.SECRET_WEB3_STORAGE_KEY,
});

const main = async () => {
  try {
    const options = {};
    const stats = await PCR(options);

    const browser = await stats.puppeteer.launch({
      headless: 'new',
      executablePath: stats.executablePath 
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
    const headers = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537',
      },
      responseType: 'arraybuffer',
      timeout: 3000,
    };
    const response = await axios.get(imageUrl, headers);
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
