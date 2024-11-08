import React from "react";
import PropTypes from "prop-types";

function AdditionalProductInfo({ product, averageRating, totalReviews }) {
  return (
    <div className='bg-white py-8 px-4 sm:px-6 lg:px-8'>
      <div className='container mx-auto px-4 md:px-6 lg:px-8 py-8'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>
          Additional Information
        </h2>

        <div className='space-y-6'>
          <div className='border-b border-gray-200 pb-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Description
            </h3>
            <p className='text-gray-600'>{product.description}</p>
          </div>

          <div className='border-b border-gray-200 pb-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Additional Information
            </h3>
            <p className='text-gray-600'>{product.information}</p>
          </div>

          <div className='border-b border-gray-200 pb-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>Category</h3>
            <p className='text-gray-600'>{product.category.name}</p>
          </div>

          <div className='border-b border-gray-200 pb-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Sleeve Type
            </h3>
            <p className='text-gray-600 capitalize'>{product.sleeve}</p>
          </div>

          <div className='border-b border-gray-200 pb-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Sizes & Stock
            </h3>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {product.sizes.map((size) => (
                <div
                  key={size._id}
                  className='bg-gray-100 p-2 rounded text-center'>
                  <span className='font-medium'>{size.size}: </span>
                  <span className='text-gray-600'>
                    {size.stock > 0 ? `${size.stock} in stock` : "Out of stock"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='border-b border-gray-200 pb-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Total Stock
            </h3>
            <p className='text-gray-600'>{product.totalStock} items</p>
          </div>

          <div className='border-b border-gray-200 pb-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>Price</h3>
            <p className='text-gray-600'>
              Original: INR{product.price.toFixed(2)}
              {product.salePrice && product.salePrice < product.price && (
                <span className='ml-2 text-red-600'>
                  Sale: INR{product.salePrice.toFixed(2)}
                </span>
              )}
            </p>
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>Rating</h3>
            <div className='flex items-center'>
              <div className='flex'>
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-5 h-5 ${
                      index < Math.round(averageRating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                ))}
              </div>
              <p className='ml-2 text-gray-600'>
                {averageRating.toFixed(1)} out of 5 ({totalReviews} reviews)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
AdditionalProductInfo.propTypes = {
  product: PropTypes.object.isRequired, // Array of objects
  averageRating: PropTypes.number.isRequired,
  totalReviews: PropTypes.number.isRequired,
};
export default React.memo(AdditionalProductInfo);
