import puppeteer from 'puppeteer'
import fs from 'fs'

const getProductDetailsSephora = async () => {

  const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args:[
          // '--window-position=1920,0',
          '--lang=en-US,en',
          '--geolocation="countryCode:US"']
  });

  const page = await browser.newPage();

  await page.goto(
      "https://www.sephora.com/shop/face-sunscreen",
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
    const productsNodeList =  document.querySelectorAll('.css-klx76')


    //this returns a type array list and maps it
    const productDetails = Array.from(productsNodeList).map((productContainer) => {
        
      // Get the text content and return it with (.innerText)
      const store = "sephora"
      const brand = productContainer.querySelector("span").innerText;
      const productName = productContainer.querySelector(".ProductTile-name").innerText;
      const price = productContainer.querySelector(".css-1f35s9q > span").innerText;

      //getting that src
      const imgElement = productContainer.querySelector('img');
      const imgLink = imgElement ? imgElement.src : null;

      const productLinkFull = productContainer.getAttribute('href')


      // Create a JSON object for each product
      const product = {
        store,
        imgLink,
        productLinkFull,
        brand, 
        productName, 
        price
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
  fs.writeFileSync('productsSephora.json', jsonData);
    
}

// Function to scroll the page to load all products
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 200;
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

getProductDetailsSephora()

export {getProductDetailsSephora};