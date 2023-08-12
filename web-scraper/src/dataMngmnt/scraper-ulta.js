import puppeteer from 'puppeteer'
import fs from 'fs'

const getProductDetailsUlta = async () => {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        //args:['--window-position=1920,0']
    });

    const page = await browser.newPage();

    await page.goto(
        "https://www.ulta.com/shop/body-care/suncare/sunscreen",
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
        const productsNodeList =  document.querySelectorAll('.ProductCard')

        //this returns a type array list and maps it
        const productDetails = Array.from(productsNodeList).map((productContainer) => {
            
            // Get the text content and return it with (.innerText)
            const store = "ulta"
            //Get the img src
            const imgLink = productContainer.querySelector("img").getAttribute("src")
            const productFullLink = productContainer.querySelector("a").getAttribute("href")
            const brand = productContainer.querySelector(".ProductCard__content .ProductCard__brand").innerText;
            const productName = productContainer.querySelector(".ProductCard__content .ProductCard__product").innerText;
            const price = productContainer.querySelector(".ProductPricing > span").textContent.trim();
            const rating = productContainer.querySelector(".ProductCard__rating")?.textContent.trim();
            const offers = productContainer.querySelector(".ProductCard__offers")?.textContent.trim();
            
            console.log(imgLink)

            // Create a JSON object for each product
            const product = {
                store,
                imgLink,
                productFullLink,
                brand, 
                productName, 
                price, 
                rating, 
                offers
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
    fs.writeFileSync('productsUlta.json', jsonData);

    return jsonData

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

getProductDetailsUlta();
export {getProductDetailsUlta};