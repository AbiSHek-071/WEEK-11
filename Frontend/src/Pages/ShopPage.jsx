import React, { useEffect, useState } from 'react'
import Navbar from '@/components/ui/Navbar';
import ShopNow from '@/components/User/ShopNow';
import Footer from '@/components/ui/Footer';
import axiosInstance from '@/AxiosConfig';
import { toast } from 'sonner';

function ShopPage() {
    
  return (
    <>
      <Navbar />
      <ShopNow/>
      <Footer />
    </>
  );
}

export default ShopPage