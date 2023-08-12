import puppeteer from 'puppeteer';
import fs from 'fs';

const getProductDetailsWalgreens = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--lang=en-US,en',
      '--geolocation="countryCode:US"'
    ]
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.walgreens.com/store/c/productlist/N=360433",
    {
      waitUntil: "domcontentloaded"
    }
  );

  // Scroll to load all products
  await autoScroll(page);

  const productContent = await page.evaluate(() => {
    const products = [];
    const productsNodeList = document.querySelectorAll('.card__product');

    const productDetails = Array.from(productsNodeList).map((productContainer) => {
      const brandElement = productContainer.querySelector(".product__details .brand");
      const productNameElement = productContainer.querySelector(".product__details .description");
      const sizeElement = productContainer.querySelector(".product__details .amount");
      const priceElement = productContainer.querySelector(".product__details .product__price-contain > span > span");
      const offersElement = productContainer.querySelector('.product__details .product__deal-container .product__deal.color__text-red > span');
      const extrasElement = productContainer.querySelector('.product__details .product__deal-container .product__deal > a');
      const imageElement = productContainer.querySelector(".product__img img");

      //get the link
      const productLink = productContainer.querySelector("a").getAttribute('href');
      const productLinkFull = "https://www.walgreens.com" + productLink

      const store = "walgreens"
      const brand = brandElement ? brandElement.innerText : "";
      const productName = productNameElement ? productNameElement.innerText : "";
      const size = sizeElement ? sizeElement.innerText : "";
      const price = priceElement ? priceElement.innerText : "";
      const offers = offersElement ? offersElement.innerText : "";
      const extras = extrasElement ? extrasElement.innerText : "";
      const imgLink = imageElement ? imageElement.src : "";

      const product = {
        store,
        imgLink,
        productLinkFull,
        brand,
        productName,
        size,
        price,
        offers,
        extras
      };

      products.push(product);
    });

    return { productDetails: products };
  });

  await browser.close();

  const jsonData = JSON.stringify(productContent.productDetails);
  fs.writeFileSync('productsWalgreens.json', jsonData);

  return jsonData;
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

getProductDetailsWalgreens()

export { getProductDetailsWalgreens };
