import axiosInstance from '@/AxiosConfig';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import ProductCardContainer from '@/components/ui/ProductCardContainer';
import HeroSection from '@/components/User/HeroSection';

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'sonner';




function LandingPage() {
    const userData = useSelector((store) => store.user.userDatas);
    console.log(userData)
  const[newArraivals,setNewArraivals] =useState([])

  useEffect(()=>{
    async function fetchNewArraivals() {
      try {
        const response = await axiosInstance.get("/user/products/");
        setNewArraivals(response.data.productData);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          return toast.error(err.response.data.message);
        }
        if (err.response && err.response.status === 400) {
          return toast.error(err.response.data.message);
        }
        toast.error("An error occurred. Please try again.");
      }
    }
    fetchNewArraivals();
  },[])
  return (
    <>
      <Navbar  />
      <HeroSection />
      <ProductCardContainer title={"New Arraivals"} products={newArraivals} />
      <ProductCardContainer title={"Top Selling"} products={newArraivals} />
      <Footer />
    </>
  );
}

export default LandingPage