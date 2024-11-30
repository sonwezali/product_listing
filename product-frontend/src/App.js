import React, { useState, useEffect } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then(response => response.json())
      .then(data => {
        // Add a default selectedColor to each product
        const updatedProducts = data.map(product => ({
          ...product,
          selectedColor: 'yellow', // Default color
        }));
        setProducts(updatedProducts);
      });
  }, []);

  const colorOptions = [
    { key: 'yellow', name: 'Yellow Gold', hexCode: '#E6CA97' },
    { key: 'white', name: 'White Gold', hexCode: '#D9D9D9' },
    { key: 'rose', name: 'Rose Gold', hexCode: '#E1A4A9' },
  ];

  const handleColorChange = (index, colorKey) => {
    setProducts(prevProducts =>
      prevProducts.map((product, i) =>
        i === index ? { ...product, selectedColor: colorKey } : product
      )
    );
  };

  // Render stars based on popularity score
  const renderStars = (score) => {
    const fullStars = Math.floor(score);
    const halfStar = score % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-xl ${i < fullStars || (halfStar && i === fullStars)
                ? 'text-yellow-500'
                : 'text-gray-300'
              }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">({score.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product, index) => (
        <div key={product.name} className="border p-4 rounded shadow">
          <img
            src={product.images[product.selectedColor]}
            alt={product.name}
            className="w-full h-40 object-cover rounded"
          />
          <div className="mt-4">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p>${product.price.toFixed(2)} USD</p>
            <div className="mt-2">{renderStars(product.normalizedPopularityScore)}</div>
            <div className="mt-2">
              {colorOptions.map(color => (
                <button
                  key={color.key}
                  style={{ backgroundColor: color.hexCode }}
                  className="w-6 h-6 rounded-full mx-1"
                  onClick={() => handleColorChange(index, color.key)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
