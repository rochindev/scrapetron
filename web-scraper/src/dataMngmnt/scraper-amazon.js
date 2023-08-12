import puppeteer from 'puppeteer'
import fs from 'fs'

const getProductDetailsAmazon = async () => {

  const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args:[
          //'--window-position=1920,0',
          '--lang=en-US,en',
          '--geolocation="countryCode:US"']
  });

  const page = await browser.newPage();

  await page.goto(
      "https://www.amazon.com/Best-Sellers-Beauty-Personal-Care-Facial-Sunscreens/zgbs/beauty/7792567011/ref=zg_bs_nav_beauty_4_11062651",
      {
          waitUntil: "domcontentloaded"
      }
  );
          
  // Scroll to load all products
  await autoScroll(page);

  //get page data (inspect section)
  const productContent = await page.evaluate(() => {

    // Create an array to store the product objects
    const products = [];

    //this returns a type NodeList (queryselectorAll)
    const productsNodeList =  document.querySelectorAll('.p13n-sc-uncoverable-faceout')


    //this returns a type array list and maps it
    const productDetails = Array.from(productsNodeList).map((productContainer) => {
        
      // Get the text content and return it with (.innerText)
      const store = "amazon"
      const imgLink = productContainer.querySelector('img.a-dynamic-image').getAttribute('src');
      const productLink = productContainer.querySelector('a').getAttribute('href');
      const productLinkFull = "https://www.amazon.com/" + productLink
      const brandAndProduct = productContainer.querySelectorAll('a.a-link-normal')[1].textContent.trim();
      const price = productContainer.querySelectorAll('.a-row')[1].textContent.trim();
      const rating = productContainer.querySelectorAll('.a-row')[0].textContent.trim();

      // Create a JSON object for each product
      const product = {
        store,
        imgLink,
        productLinkFull,
        brandAndProduct, 
        price, 
        rating
      };

      // Push the product object to the products array
      products.push(product); 

    });
    
    return {productDetails: products}

  });
  
  await browser.close();

  // Convert the productContent to JSON string
  const jsonData = JSON.stringify(productContent.productDetails);

  // Write the JSON data to a file
  fs.writeFileSync('productsAmazon.json', jsonData);
    
} 

// Function to scroll the page to load all products
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

getProductDetailsAmazon()

export { getProductDetailsAmazon };