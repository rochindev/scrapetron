import fs from 'fs';
import levenshtein from 'fast-levenshtein'; // Import the fast-levenshtein library

// Function to calculate string similarity using Levenshtein distance
function calculateStringSimilarity(str1, str2) {
  const distance = levenshtein.get(str1, str2);
  const similarity = 1 - distance / Math.max(str1.length, str2.length);
  return similarity;
}

const rawData = fs.readFileSync('groupedData.json', 'utf8');
const parsedData = JSON.parse(rawData);

const findDups = async () => {
  const finalData = {}; // Object to store the final grouped data
  for (const brand of Object.keys(parsedData)) {
    const brandData = parsedData[brand];

    // Group similar products based on product names
    const groupedData = {};
    for (const product of brandData) {
      let grouped = false;
      for (const group in groupedData) {
        const firstProduct = groupedData[group][0];
        const similarity = calculateStringSimilarity(
          product.productName,
          firstProduct.productName
        );
        if (similarity >= 0.6) { // Adjust similarity (0.7 here)
          groupedData[group].push(product);
          grouped = true;
          break;
        }
      }
      if (!grouped) {
        groupedData[product.productName] = [product];
      }
    }

    // Store the grouped data for the brand in the finalData object
    finalData[brand] = groupedData;
  }

  // Save the finalData object to a new JSON file
  fs.writeFileSync('final-data.json', JSON.stringify(finalData, null, 2));
};

findDups().catch((error) => {
  console.error(error);
});
