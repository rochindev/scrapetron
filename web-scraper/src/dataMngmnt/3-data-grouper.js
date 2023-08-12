import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Function to generate a random alphanumeric ID
const generateRandomId = () => {
  return crypto.randomBytes(8).toString('hex');
};

// Read the cleanedData.json file
fs.readFile('cleanedData.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the cleanedData.json file:', err);
    return;
  }

  try {
    const products = JSON.parse(data);

    // Group products by brand
    const groupedData = {};
    products.forEach((product) => {
      let brand = product.brand;

      // Check if the product has a brand property and is not null/undefined
      if (brand && typeof brand === 'string') {
        // Group brands with "posay" in their name together with "la roche-posay"
        if (brand.toLowerCase().includes('posay')) {
          brand = 'La Roche-Posay';
        }

        if (!groupedData[brand]) {
          groupedData[brand] = [];
        }

        // Generate a random ID for each product
        const productId = generateRandomId();
        const productWithId = { ...product, id: productId };
        groupedData[brand].push(productWithId);
      }
    });

    // Filter out brands with less than 4 products
    for (const brand in groupedData) {
      if (groupedData[brand].length < 4) {
        delete groupedData[brand];
      }
    }

    // Filter out brands with less than 2 different stores
    for (const brand in groupedData) {
      const stores = groupedData[brand].map((product) => product.store);
      const uniqueStores = new Set(stores);
      if (uniqueStores.size < 2) {
        delete groupedData[brand];
      }
    }

    // Sort the brands based on the number of products they have (in descending order)
    const sortedBrands = Object.keys(groupedData).sort(
      (brandA, brandB) => groupedData[brandB].length - groupedData[brandA].length
    );

    // Create a new object with sorted brands and their products
    const sortedGroupedData = {};
    sortedBrands.forEach((brand) => {
      sortedGroupedData[brand] = groupedData[brand];
    });

    // Convert the sorted grouped data to JSON format
    const sortedGroupedDataJSON = JSON.stringify(sortedGroupedData, null, 2);

    // Write the sorted grouped data to a new JSON file named "groupedData.json"
    fs.writeFile('groupedData.json', sortedGroupedDataJSON, 'utf8', (err) => {
      if (err) {
        console.error('Error writing the groupedData.json file:', err);
      } else {
        console.log('Data grouped by brand (sorted by number of products) and saved as groupedData.json');
      }
    });
  } catch (err) {
    console.error('Error parsing JSON data from cleanedData.json:', err);
  }
});

