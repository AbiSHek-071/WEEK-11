import React, { useState } from 'react'
import ProductDetailsDialog from './ProductDetailsDialog';
import { Card, CardContent } from '../ui/card';
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import axiosInstance from '@/AxiosConfig';

function ProductCard({ product, categories, setReload }) {
  const [isListed, setIsListed] = useState(product.listed);
  async function handleToggle(_id, isActive) {
     try {
       const response = await axiosInstance.put("/admin/toggleproduct", {
         _id,
         isActive,
       });
       toast.success(response.data.message);
       setReload(true)
     } catch (err) {
       if (err.response && err.response.status === 400) {
         return toast.error(err.response.data.message);
       }
       console.log(err);
       
       toast.error("An error occurred. Please try again.");
     }
  }
  return (
    <Card className='overflow-hidden'>
      <CardContent className='p-0 flex flex-col sm:flex-row'>
        <div className='w-full sm:w-1/3 h-48 sm:h-full'>
          <img
            src={product.images[0]}
            alt={product.name}
            className='w-full h-full object-cover'
          />
        </div>
        <div className='p-4 flex-1 flex flex-col justify-between'>
          <div>
            <h2 className='text-xl font-semibold mb-2'>{product.name}</h2>
            <p className='text-sm text-gray-600 mb-2 line-clamp-2'>
              {product.description}
            </p>
            <div className='flex justify-between items-center mb-2'>
              <span className='font-bold text-lg'>
                Rs.{product.price.toFixed(2)}
              </span>
              <span className='text-sm px-2 py-1 bg-gray-100 rounded-full'>
                {product.category.name}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm'>Sleeve: {product.sleeve}</span>
            </div>
          </div>
          <div className='flex justify-between items-center mt-4'>
            <ProductDetailsDialog
              product={product}
              categories={categories}
              setReload={setReload}
            />
            <div className='flex items-center space-x-2'>
              <Switch
                checked={product.isActive}
                onCheckedChange={() =>
                  handleToggle(product._id, product.isActive)
                }
                aria-label='Toggle listing'
              />
              <span className='text-sm'>
                {isListed ? "Listed" : "Unlisted"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard