import React from 'react';
import amazonlogo from './assets/amazon-logo.png'
import kohlslogo from './assets/kohls-logo.png'
import sephoralogo from './assets/sephora-logo.png'
import ultalogo from './assets/ulta-logo.png'
import walgreenslogo from './assets/walgreens-logo.png'

const ProductsCard = ({ products }) => {
  // Function to sort products by price in ascending order
  const sortProductsByPrice = (a, b) => {
    return a.price.replace('$', '') - b.price.replace('$', '');
  };

  // Sort products by price in ascending order
  const sortedProducts = products.sort(sortProductsByPrice);

  // Function to handle "view details" button click
  const handleViewDetails = (productLink) => {
    window.open(productLink, '_blank');
  };

  // Function to render the star rating
  const renderStarRating = (rating) => {
    // Convert the rating to a number
    const numericRating = parseFloat(rating);
    // Check if the rating is a valid number
    if (isNaN(numericRating) || numericRating <= 0) {
      return null; // Return null if the rating is invalid or 0
    }

    // Create an array of 5 stars, setting the 'star-icon' class to the filled star if the index is less than the rating, otherwise an empty star
    const stars = Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star-icon ${index < numericRating ? 'filled' : ''}`}>
        ★
      </span>
    ));

    return <div className="star-rating">{stars}</div>;
  };

  const storeLogos = {
    amazon: amazonlogo,
    kohls: kohlslogo,
    sephora: sephoralogo,
    ulta: ultalogo,
    walgreens: walgreenslogo,
  };
  
  return (
    <div key={products} className="products-card">
      <div className="products-info">
            <img src={products[0].imgLink} alt={products[0].brand} className="products-image" />
            <h3 className="product-name">{products[0].productName}</h3>
            {products[0].productSize && <p className="products-size">{products[0].productSize}</p>}
            {products[0].rating !== 'no rating available' && renderStarRating(products[0].rating)}
      </div>
      <div className="products-stores">
        <h4>Find it on:</h4>
        {sortedProducts.map((product) => (
          <ul>
            <li key={product.store}>
              <img src={storeLogos[product.store.toLowerCase()]} className="store-logo"/>
              <span className='for-span'> for </span>
              <span className='price-span'>{product.price}</span>
              <button className="product-stores-btn" onClick={() => handleViewDetails(product.productLinkFull)}>Buy</button>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default ProductsCard;

