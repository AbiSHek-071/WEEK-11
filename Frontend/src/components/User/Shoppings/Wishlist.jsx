import React, { useState } from 'react';

// Sample data for the wishlist
const initialWishlist = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 19.99,
    image: "https://res.cloudinary.com/dneqndzyc/image/upload/v1730972635/furu7rsyqt8rpekdmwoq.jpg",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Denim Jeans",
    price: 49.99,
    image: "https://res.cloudinary.com/dneqndzyc/image/upload/v1730972635/furu7rsyqt8rpekdmwoq.jpg",
    sizes: ["28", "30", "32", "34"]
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 79.99,
    image: "https://res.cloudinary.com/dneqndzyc/image/upload/v1730972635/furu7rsyqt8rpekdmwoq.jpg",
    sizes: ["7", "8", "9", "10", "11"]
  },
  {
    id: 4,
    name: "Leather Jacket",
    price: 129.99,
    image: "https://res.cloudinary.com/dneqndzyc/image/upload/v1730972635/furu7rsyqt8rpekdmwoq.jpg",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 5,
    name: "Casual Dress",
    price: 59.99,
    image: "https://res.cloudinary.com/dneqndzyc/image/upload/v1730972635/furu7rsyqt8rpekdmwoq.jpg",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 6,
    name: "Formal Suit",
    price: 199.99,
    image: "https://res.cloudinary.com/dneqndzyc/image/upload/v1730972635/furu7rsyqt8rpekdmwoq.jpg",
    sizes: ["38", "40", "42", "44"]
  }
];

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const moveToCart = (id) => {
    console.log(`Moved item ${id} to cart`);
    removeFromWishlist(id);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col sm:flex-row" >
            <div className="w-full sm:w-1/3">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="w-full sm:w-2/3 p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-gray-600 mb-4">${item.price.toFixed(2)}</p>
                <div className="flex items-center mb-4">
                  <label htmlFor={`size-${item.id}`} className="mr-2 text-gray-700">Size:</label>
                  <select
                    id={`size-${item.id}`}
                    className="border border-gray-300 rounded px-2 py-1 text-gray-700 bg-white"
                  >
                    {item.sizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-between mt-auto">
                <button
                  onClick={() => moveToCart(item.id)}
                  className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded border border-black transition-colors duration-300"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {wishlist.length === 0 && (
        <p className="text-center text-gray-600 mt-8">Your wishlist is empty.</p>
      )}
    </div>
  );
}