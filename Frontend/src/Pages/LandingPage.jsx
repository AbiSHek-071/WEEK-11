import axiosInstance from "@/AxiosConfig";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import ProductCardContainer from "@/components/ui/ProductCardContainer";
import HeroSection from "@/components/User/HeroSection";
import ReferalPop from "@/components/User/ReferalPop";
import { sortBy } from "lodash";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
function LandingPage() {
  const userData = useSelector((store) => store.user.userDatas);

  const [newArraivals, setNewArraivals] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (userData && !userData.usedReferral) {
      setIsOpen(true);
    }

    async function fetchNewArraivals() {
      try {
        const sortBy = "newest";
        const response = await axiosInstance.get("/user/products/", {
          params: { sortBy },
        });
        setNewArraivals(response.data.productData);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          return toast.error(err.response.data.message);
        }
        if (err.response && err.response.status === 400) {
          return toast.error(err.response.data.message);
        }
        // toast.error("An error occurred. Please try again.");
      }
    }
    fetchNewArraivals();
  }, []);
  return (
    <>
      {userData && (
        <ReferalPop
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          user_id={userData._id}
        />
      )}
      <Navbar />
      <HeroSection />
      <ProductCardContainer title={"New Arraivals"} products={newArraivals} />
      <ProductCardContainer title={"Top Selling"} products={newArraivals} />
      <Footer />
    </>
  );
}

export default LandingPage;
