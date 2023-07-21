require('dotenv').config();
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');
const { Web3Storage, File } = require('web3.storage');
const storageClient = new Web3Storage({
  token: process.env.SECRET_WEB3_STORAGE_KEY,
});

const mainTask = async () => {
  try {
  const gameSales = await axios.get('https://store.steampowered.com/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    },
    timeout: 10000,
    })
    .then(response => {
      const dom = new JSDOM(response.data);
      const salesList = dom.window.document.querySelectorAll('#tab_specials_content .tab_item');
  
      const gameSales = Array.from(salesList).map(sale => {
        const name = sale.querySelector('.tab_item_name').textContent;
        const originalPriceElement = sale.querySelector('.discount_original_price');
        const finalPriceElement = sale.querySelector('.discount_final_price');
        const topTags = Array.from(sale.querySelectorAll('.top_tag')).map(tag => tag.textContent);
  
        const originalPrice = originalPriceElement ? originalPriceElement.textContent : 'N/A';
        const finalPrice = finalPriceElement ? finalPriceElement.textContent : 'N/A';
  
        return {
          name,
          originalPrice,
          finalPrice,
          topTags,
        };
      });
  
      // console.log(gameSales);
      return gameSales;
    })
    .catch(console.error);

    console.log('Checking special games...', gameSales);

    const date = new Date().toISOString().slice(0, 10);
    const filename = `steam-daily-special-${date}.json`;

    // Uploading the image to IPFS
    const gameSalesJson = JSON.stringify(gameSales);
    const file = new File([gameSalesJson], filename, {
      type: 'application/json',
    });

    const cid = await storageClient.put([file]);
    console.log(`Uploaded and got CID: ${cid}`);

    return cid;
  } catch (err) {
    console.log('ERROR IN TASK', err);
    return null;
  }
};

module.exports = { mainTask };
