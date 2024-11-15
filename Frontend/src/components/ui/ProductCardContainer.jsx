import { useState } from "react";
import ProductCard from "./ProductCard";
import PropTypes from "prop-types";
const ProductCardContainer = ({ title, products }) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">{title ? title : ""}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-7">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Define PropTypes
ProductCardContainer.propTypes = {
  title: PropTypes.string,
  products: PropTypes.array,
};

export default ProductCardContainer;
