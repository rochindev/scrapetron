import puppeteer from 'puppeteer'
import fs from 'fs'

const getProductDetailsKohls = async () => {

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
      "https://www.kohls.com/catalog/sephora-sunscreen-skincare-beauty.jsp?CN=Partnership:Sephora+Product:Sunscreen+Category:Skincare+Department:Beauty&sks=true&kls_sbp=51735693451546548285270438491179454903&PPP=48&WS=0&S=1 ",
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
    const productsNodeList =  document.querySelectorAll('.products_grid')


    //this returns a type array list and maps it
    const productDetails = Array.from(productsNodeList).map((productContainer) => {
        
      // Get the text content and return it with (.innerText)
      const store = "kohls"
      const brandAndProduct = productContainer.querySelector('.products-container-right .prod_nameBlock > p').innerText;
      const price = productContainer.querySelector('.products-container-right .prod_priceBlock  > span').innerText;
      const ratingElement = productContainer.querySelector('.products-container-right .prod_ratingImg a');
      const rating = ratingElement ? parseFloat(ratingElement.getAttribute('alt').split(' ')[0]) : null;

      // Extract the image URL from the "src" attribute
      const imgElement = productContainer.querySelector('.products-container-left .prod_img_block img.pmp-hero-img');
      const imgLink = imgElement ? imgElement.getAttribute('data-herosrc') : null;

      //Get that link bitchboiii
      const productLink = productContainer.querySelector('a').getAttribute('href');

      const productLinkFull = "https://www.kohls.com/" + productLink

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
  })
  
  await browser.close();

  // Convert the productContent to JSON string
  const jsonData = JSON.stringify(productContent.productDetails);

  // Write the JSON data to a file
  fs.writeFileSync('productsKohls.json', jsonData);

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

getProductDetailsKohls()

export {getProductDetailsKohls}