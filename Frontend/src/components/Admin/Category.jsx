import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Pencil, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/AxiosConfig";
import { Switch } from "../ui/switch";
import { toast } from "sonner";




export default function Category() {
  const [categories, setCategories] = useState([]);
  const [toggle,setToggle] = useState(true);
  
useEffect(() => {
  async function fetchData() {
    try {
      const response = await axiosInstance.get("/admin/category");
      console.log(response.data.categories);

      setCategories(response.data.categories);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return toast.error(err.response.data.message);
      }
      toast.error("An error occurred. Please try again.");
    }
  }
  fetchData();
}, [toggle]);
    const navigate = useNavigate()
    function handleEdit(id){
        console.log(id);
        
       navigate(`/admin/editcategory/${id}`);

    }
    async function handleToggle(_id,isActive){
       try {
         const response = await axiosInstance.post("/admin/togglecategory",{_id,isActive});
         toast.success(response.data.message)
         setToggle(toggle?false:true);
       } catch (err) {
         if (err.response && err.response.status === 400) {
           return toast.error(err.response.data.message);
         }
         toast.error("An error occurred. Please try again.");
       }
    
    }
  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>Categories</h1>
          <p className='text-gray-500'>Dashboard &gt; Category</p>
        </div>
        <Button
          onClick={() => {
            navigate("/admin/addcategory");
          }}
          className='bg-primary text-primary-foreground hover:bg-primary/90'>
          <PlusCircle className='mr-2 h-4 w-4' /> Create Category
        </Button>
      </div>
      <Table className='bg-white shadow-md rounded-lg'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[200px]'>Category Name</TableHead>
            <TableHead>Sold</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className='text-ledt'>Status</TableHead>
            <TableHead className='text-right'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category, index) => (
            <TableRow key={category._id}>
              <TableCell className='font-medium'>{category.name}</TableCell>
              <TableCell className='font-medium'>Not yet set</TableCell>
              <TableCell className='font-medium'>Not yet set</TableCell>
              <TableCell className='font-medium'>
                {category.createdAt}
              </TableCell>
              <TableCell className='font-medium align'>
                {category.isActive ? "Enabled" : "Disabled"}
              </TableCell>
              <TableCell className='text-right'>
                <div className='flex justify-end items-center space-x-2'>
                  <Button
                    onClick={() => handleEdit(category._id)}
                    variant='ghost'
                    size='icon'>
                    <Pencil className='h-4 w-4' />
                  </Button>
                  <Switch
                    checked={category.isActive}
                    onCheckedChange={() =>
                      handleToggle(category._id, category.isActive)
                    }
                    className='data-[state=checked]:bg-primary'
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
