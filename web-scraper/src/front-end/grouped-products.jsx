import {React, useState, useRef, useEffect} from 'react';
import ProductCard from './product-card';
import ProductsCard from './products-card';
import data from '../../final-data.json';
import ceravelogo from './assets/cerave-logo.png'
import coolalogo from './assets/coola-logo.png'
import larocheposaylogo from './assets/la-roche-posay-logo.png'
import neutrogenalogo from './assets/neutrogena-logo.png'
import sunbumlogo from './assets/sun-bum-logo.png'
import supergooplogo from './assets/supergoop-logo.png'
import shiseidologo from './assets/shiseido-logo.png'



const GroupedProducts = () => {

  const brandLogos = (brand) => {
    switch (brand) {
      case "Supergoop!":
        return supergooplogo;
        break;
      case "Sun Bum":
        return sunbumlogo;
        break;
      case "Neutrogena":
        return neutrogenalogo;
        break;
      case "La Roche-Posay":
        return larocheposaylogo;
        break;
      case "COOLA":
        return coolalogo;
        break;
      case "CeraVe":
        return ceravelogo;
        break;
      case "Shiseido":
        return shiseidologo;
      break;
    }
  }
  //Slider component settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5
  };

  const allProducts = () => {
    return Object.keys(data).map((brand) => {
      return (
        <div className='brand-container'>
          <h2>
            <img 
              src={brandLogos(brand)} 
              alt={brand} 
              className='brand-logo'/>
          </h2>
          <div className='product-carousel-wrapper' >
              <div className='product-carousel' >
              {
                Object.entries(data[brand]).map((product) => {
                  const brandName = brand
                  const productName = product[0]; // Access the product name
                  const productsArray = product[1]; // Access the array of products

                  if (productsArray.length < 2) {
                    return productsArray.map((productObj) => {
                      return (
                        <ProductCard key={productObj.id} product={productObj} />
                      )
                    });
                  } else {
                    return (
                      <div>
                      <ProductsCard key={productName} brand={brand} products={productsArray} />
                      </div>
                    )
                  }
                })
              }
              </div>
          </div>
        </div>
      )
    });
  }

  return (
    <div>
      {/* {productElements()} */}
      <div>
      {allProducts()}
      </div>

    </div>
  );
};

export default GroupedProducts;



