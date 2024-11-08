import axiosInstance from "@/AxiosConfig";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import ProductCardContainer from "@/components/ui/ProductCardContainer";
import AdditionalProductInfo from "@/components/User/AdditionalProductInfo";
import ProductDetails from "@/components/User/ProductDetails";
import UserReviews from "@/components/User/UserReviews";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviewsData, setReviewsData] = useState({
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true); // Loading state

  const handleReviewsUpdate = ({ averageRating, totalReviews }) => {
    setReviewsData({ averageRating, totalReviews });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axiosInstance.post("/user/fetchproduct", { id });
        setProduct(response.data.product);

        const res = await axiosInstance.post("/user/products/related", {
          categoryId: response.data.product.category,
        });

        const relatedProducts = res.data.productData.filter(
          (x) => x._id !== response.data.product._id
        );
        setProducts(relatedProducts);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          toast.error(err.response.data.message);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <>
      <Navbar />
      {loading ? ( // Show loading state
        <div>Loading...</div>
      ) : product ? (
        <>
          <ProductDetails
            product={product}
            averageRating={reviewsData.averageRating}
            totalReviews={reviewsData.totalReviews}
          />
          <AdditionalProductInfo
            product={product}
            averageRating={reviewsData.averageRating}
            totalReviews={reviewsData.totalReviews}
          />
          <UserReviews
            product={product}
            onReviewsUpdate={handleReviewsUpdate}
          />
          {product && <ProductCardContainer products={products} />}
        </>
      ) : (
        <div>No product found</div>
      )}
      <Footer />
    </>
  );
}

export default ProductPage;
