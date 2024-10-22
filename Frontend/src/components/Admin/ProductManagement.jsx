import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/AxiosConfig";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Eye, Edit, Tag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";


export default function ImprovedProductList() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reload,setReload] = useState(false);
  useEffect(() => {
    async function fetchProducts() {
      try {
       
        const response = await axiosInstance.get("/admin/fetchproducts");
        setProducts(response.data.products);
        const res = await axiosInstance.get("/admin/getcategory");
        setCategories(res.data.categories);
        setReload(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          return toast.error(err.response.data.message);
        }
        toast.error("An error occurred. Please try again.");
      }
    }
    fetchProducts();
  }, [reload]);
  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between'>
        <h1 className='text-2xl font-bold mb-6 inline-block'>Product List</h1>

        <Button
          onClick={() => {
            navigate("/admin/addproduct");
          }}
          className=''>
          Add Product
        </Button>
      </div>
      <p className='text-gray-500 mb-5'>Dashboard &gt; product</p>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            categories={categories}
            setReload={setReload}
          />
        ))}
      </div>
    </div>
  );
}

