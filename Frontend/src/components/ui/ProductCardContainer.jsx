import { useState } from "react";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion"
import PropTypes from "prop-types";
import { PackageX } from "lucide-react";
const ProductCardContainer = ({ title, products }) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">{title ? title : ""}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-7">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {products.length == 0 && <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center p-8 text-muted-foreground"
    >
      <PackageX className="w-6 h-6 mr-2" />
      <span>No products available in {title}</span>
    </motion.div>}
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
