import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/AxiosConfig";
import { useNavigate } from "react-router-dom";

export default function AddCategory() {
    const [cname,setCname] = useState("");
    const [description,setDescription] = useState("")
    const navigate = useNavigate()
    const [error,setError] = useState({})
    function validate() {
      const error = {};

      if (!cname?.trim()) {
        error.name = "Category name is required";
      } else if (cname.trim().length < 4) {
        error.name = "Category name must be at least 4 characters long";
      } else if (!/^[a-zA-Z\s]+$/.test(cname.trim())) {
        error.name = "Category name can only contain letters and spaces";
      }

      if (!description?.trim()) {
        error.description = "Description is required";
      } else if (description.trim().split(/\s+/).length < 3) {
        error.description = "Description must be at least 3 words";
      } else if (/^\d/.test(description.trim())) {
        error.description = "Description cannot start with a number";
      } else if (!/^[a-zA-Z0-9\s]+$/.test(description.trim())) {
        error.description =
          "Description can only contain letters, numbers, and spaces";
      }
    

      setError(error);
      if (Object.keys(error).length == 0) {
        return true;
      } else {
        return false;
      }
    }


    async function AddCategory(e){
        e.preventDefault();
        if(validate()){
         
         try {
            const response = await axiosInstance.post("/admin/categories", {
              name: cname,
              description,
            });
            toast.success(response.data.message)
            navigate("/admin/category");

         } catch (err) {
             if (err.response && err.response.status === 404) {
               return toast.error(err.response.data.message);
             }
             toast.error("An error occurred. Please try again.");
            
         }
        }
    }
    
  return (
    <div className='p-8 bg-white'>
      <h1 className='text-2xl font-semibold mb-2'>Add Category</h1>

      {/* Breadcrumb */}
      <nav className='flex mb-6 text-sm text-gray-500'>
        <a href='#' className='hover:text-gray-700'>
          Dashboard
        </a>
        <ChevronRight className='mx-2 h-4 w-4' />
        <a href='#' className='hover:text-gray-700'>
          Categories
        </a>
        <ChevronRight className='mx-2 h-4 w-4' />
        <span className='text-gray-700'>Add Category</span>
      </nav>

      <div className='max-w-2xl'>
        <h2 className='text-lg font-medium mb-4'>General Information</h2>

        <form onSubmit={AddCategory}>
          <div className='mb-4'>
            <label
              htmlFor='categoryName'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Category Name
            </label>
            <Input
              id='categoryName'
              placeholder='Type category name here...'
              className='w-full'
              onChange={(e) => {
                setCname(e.target.value);
              }}
            />
            <span className='text-red-700  mt-10 ms-2'>
              {error && error.name}
            </span>
          </div>

          <div className='mb-6'>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Description
            </label>
            <Textarea
              id='description'
              placeholder='Type category description here...'
              className='w-full h-32'
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <span className='text-red-700  mt-10 ms-2'>
              {error && error.description}
            </span>
          </div>

          <div className='flex justify-end space-x-4'>
            <Button variant='outline'>Cancel</Button>
            <Button className='bg-black text-white hover:bg-gray-800'>
              Add Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
