import fs from 'fs';

// Initialize an empty array to store the combined data
const combinedData = [];

// Read and parse each JSON file
const jsonFiles = ['productsAmazon.json', 'productsKohls.json', 'productsSephora.json', 'productsUlta.json', 'productsWalgreens.json'];

jsonFiles.forEach((file) => {
  const data = fs.readFileSync(file, 'utf8');
  const jsonData = JSON.parse(data);

  // Add the parsed data to the combinedData array
  combinedData.push(...jsonData);
});

const jsonData = JSON.stringify(combinedData);
fs.writeFileSync('allData.json', jsonData);