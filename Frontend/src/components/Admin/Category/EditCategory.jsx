import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/AxiosConfig";
import { toast } from "sonner";
import { validateCategory } from "@/util/ValidationFunctions";

export default function EditCategory() {
  const { id } = useParams();
  const [existingCategory, setExistingCategory] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState({});


  useEffect(() => {
    async function fetchCategoryData() {
      try {
        const response = await axiosInstance.get(`/admin/category/${id}`);
        const { name, description } = response.data.categoryData;
        setExistingCategory(response.data.categoryData);
        setName(name);
        setDescription(description);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          return toast.error(err.response.data.message);
        }
        toast.error("An error occurred. Please try again.");
      }
    }
    fetchCategoryData();
  }, [id]);

  async function handleEditCategory(e) {
    const validate = validateCategory(name, description, setError);
    if (validate) {
      // Ensure to call validate()
      try {
        const response = await axiosInstance.put("/admin/category", {
          id,
          name,
          description,
        });
        toast.success(response.data.message);
        navigate("/admin/category");
      } catch (err) {
        if (err.response && err.response.status === 400) {
          toast.error(err.response.data.message);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    }
  }

  return (
    <div className='p-8 bg-white'>
      <h1 className='text-2xl font-semibold mb-2'>Edit Category</h1>

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
        <span className='text-gray-700'>Edit Category</span>
      </nav>

      <div className='max-w-2xl'>
        <h2 className='text-lg font-medium mb-4'>General Information</h2>

        <div className='mb-4'>
          <label
            htmlFor='categoryName'
            className='block text-sm font-medium text-gray-700 mb-1'>
            Category Name
          </label>
          <Input
            id='categoryName'
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder='Type category name here...'
            className='w-full'
            value={name} // Use value instead of defaultValue
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
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder='Type category description here...'
            className='w-full h-32'
            value={description} // Use value instead of defaultValue
          />
          <span className='text-red-700  mt-10 ms-2'>
            {error && error.description}
          </span>
        </div>

        <div className='flex justify-end space-x-4'>
          <Button
            onClick={() => {
              navigate("/admin/category");
            }}
            variant='outline'>
            Cancel
          </Button>

          <Button
            onClick={handleEditCategory}
            className='bg-black text-white hover:bg-gray-800'>
            Update Category
          </Button>
        </div>
      </div>
    </div>
  );
}
