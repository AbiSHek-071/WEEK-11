import axiosInstance from "@/AxiosConfig";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import ProductDetails from "@/components/User/ProductDetails";
import UserReviews from "@/components/User/UserReviews";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviewsData, setReviewsData] = useState({
    averageRating: 0,
    totalReviews: 0,
  });


  const handleReviewsUpdate = ({ averageRating, totalReviews }) => {
    setReviewsData({ averageRating, totalReviews });
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axiosInstance.post("/user/fetchproduct", { id });
        setProduct(response.data.product);
        console.log("fetched", response.data.product);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          toast.error(err.response.data.message);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    }
    fetchProduct();
  }, [id]); 

  return (
    <>
      <Navbar />
      {product ? (
        <>
          <ProductDetails
            product={product}
            averageRating={reviewsData.averageRating}
            totalReviews={reviewsData.totalReviews}
          />
          <UserReviews
            product={product}
            onReviewsUpdate={handleReviewsUpdate}
          />
        </>
      ) : (
        <div>Loading...</div>
      )}
      <Footer />
    </>
  );
}

export default ProductPage;
