import {React, useState} from 'react';
import amazonlogo from './assets/amazon-logo.png'
import kohlslogo from './assets/kohls-logo.png'
import sephoralogo from './assets/sephora-logo.png'
import ultalogo from './assets/ulta-logo.png'
import walgreenslogo from './assets/walgreens-logo.png'

const ProductCard = ({product}) => {
  const { store, brand, productName, price, rating, imgLink, productLinkFull, productSize, id } = product;

  // Function to handle "view details" button click
  const handleViewDetails = () => {
    window.open(productLinkFull, '_blank');
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
    <div className="product-card">
      <img src={imgLink} alt={productName} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{productName}</h3>
        {rating !== 'no rating available' && renderStarRating(rating)}
        {productSize && <p className="product-size">{productSize}</p>}
        <p className="product-price">
          <span className="price-amnt">{price}</span>
          <span className='on-span'>on</span>
          <img src={storeLogos[store.toLowerCase()]} 
          alt={store}
          className="store-logo"/>
        </p>
        <button className="view-details-btn" onClick={handleViewDetails}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

