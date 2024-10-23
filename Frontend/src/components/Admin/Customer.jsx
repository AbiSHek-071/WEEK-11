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

import { useNavigate } from "react-router-dom";
import axiosInstance from "@/AxiosConfig";

import { toast } from "sonner";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/slice/userSlice";

export default function Customer() {
  const userData = useSelector((store)=>store.user.userDatas)

  
  const dispatch = useDispatch()
  const [users,setUsers] = useState([]);
  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get("/admin/users");
       
        setUsers(response.data.users);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          return toast.error(err.response.data.message);
        }
        toast.error("An error occurred. Please try again.");
      }
    }
    fetchData();
  }, [toggle]);
 async function handleStatus(_id, isActive) {
   try {
     const response = await axiosInstance.put("/admin/users/block", {
       _id,
       isActive,
       toast,
     });
     setToggle(!toggle)
     toast.success(response.data.message);
  
     
     
       dispatch(logoutUser());
  
   } catch (err) {
     if (err.response && err.response.status === 404) {
       return toast.error(err.response.data.message);
     }
     toast.error("An error occurred. Please try again.");
   }
 }

  return (
    <div className='p-8 bg-gray-50'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Consumers List</h1>
          <p className='text-sm text-gray-500 mt-1'>Dashboard &gt; Consumers</p>
        </div>
        <div className='flex w-full sm:w-auto max-w-sm items-center space-x-2'>
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Search consumers'
              className='pl-10 pr-4 py-2 w-full'
            />
          </div>
          <Button type='submit' className='whitespace-nowrap'>
            Search
          </Button>
        </div>
      </div>
      <div className='bg-white shadow-md rounded-lg overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow className='bg-gray-100'>
              <TableHead className='w-[100px]'>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className='text-right'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} className='hover:bg-gray-50'>
                <TableCell className='py-6'>
                  <div className='flex items-center justify-center'>
                    <div className='w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center shadow-inner'>
                      <span className='text-3xl font-bold text-gray-700'>
                        {user.name
                          ? user.name
                              .split(" ")
                              .map((name) => name[0].toUpperCase())
                              .join("")
                          : ""}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='font-medium'>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || "Not yet Added"}</TableCell>
                <TableCell className='text-right'>
                  <Button
                    onClick={() => handleStatus(user._id, user.isActive)}
                    variant={user.isActive ? "destructive" : "default"}
                    size='sm'>
                    {user.isActive ? "Block" : "Unblock"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
