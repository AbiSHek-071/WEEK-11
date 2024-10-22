import axiosInstance from "@/AxiosConfig";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import ProductCardContainer from "@/components/ui/ProductCardContainer";
import ProductDetails from "@/components/User/ProductDetails";
import UserReviews from "@/components/User/UserReviews";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function ProductPage() {
  
  const [products,setProducts] = useState([])
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
      console.log(response.data.product.category);
      const res = await axiosInstance.post("/user/fetchrelatedproducts", {
        categoryId: response.data.product.category,
      });
      const relatedProduct = res.data.productData.filter((x) => {
        return x._id != response.data.product._id;
      });
      console.log("related products data:");

      setProducts(relatedProduct);
      
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
           { product&&<ProductCardContainer products={products} />}
        </>
      ) : (
        <div>Loading...</div>
      )}
      <Footer />
    </>
  );
}

export default ProductPage;
