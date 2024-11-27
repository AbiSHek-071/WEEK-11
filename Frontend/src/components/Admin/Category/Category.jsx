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
import { PlusCircle, Pencil, MoreVertical, FolderX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/AxiosConfig";
import { Switch } from "../../ui/switch";
import { toast } from "sonner";
import Pagination from "../../shared/Pagination";
import { fetchCatOfferApi, removeOffer } from "@/APIs/Products/Offer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [offer, setOffer] = useState([]);
  const limit = 5;

  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  async function fetchData() {
    try {
      const response = await axiosInstance.get(
        `/admin/categories?page=${page}&limit=${limit}`
      );
      setTotalPages(response.data.totalPages);
      setCategories(response.data.categories);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return toast.error(err.response.data.message);
      }
      // toast.error("An error occurred. Please try again.");
    }
  }

  function handleEdit(id) {
    navigate(`/admin/editcategory/${id}`);
  }

  async function handleToggle(_id, isActive) {
    try {
      const response = await axiosInstance.put(
        "/admin/categories/toggle-status",
        { _id, isActive }
      );
      toast.success(response.data.message);
      setToggle(!toggle);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return toast.error(err.response.data.message);
      }
      toast.error("An error occurred. Please try again.");
    }
  }

  async function removeCategoryOffer(_id) {
    try {
      const response = await removeOffer(_id);
      toast.success(response.data.message);
      setReload(true);
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  }

  async function fetchCatOffer() {
    try {
      const response = await fetchCatOfferApi();
      setOffer(response.data.categoryOffer);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchData();
    fetchCatOffer();
    setReload(false);
  }, [toggle, page, reload]);

  return (
    <>
    

    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold">Categories</h1>
          <p className="text-gray-500">Dashboard &gt; Category</p>
        </div>
        <Button
          onClick={() => navigate("/admin/addcategory")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Create Category
        </Button>
      </div>
      <div className="overflow-x-auto">
        {categories.length != 0 && <Table className="w-full bg-white shadow-md rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Category Name</TableHead>
              <TableHead className="hidden sm:table-cell">Added</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead>Offer</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

          

            {categories.map((category) => {
              const categoryOffer = offer.find(
                (f) => f.target_id === category._id
              );

              return (
                <TableRow key={category._id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="hidden sm:table-cell font-medium">
                    {category.createdAt}
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-medium">
                    {category.isActive ? "Enabled" : "Disabled"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {categoryOffer ? `${categoryOffer.offer_value}%` : "0%"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(category._id)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggle(category._id, category.isActive)
                            }
                          >
                            {category.isActive ? "Disable" : "Enable"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (categoryOffer) {
                                removeCategoryOffer(categoryOffer.target_id);
                              } else {
                                navigate(
                                  `/admin/category-offer/${category._id}/${category.name}`
                                );
                              }
                            }}
                          >
                            {categoryOffer ? "Remove Offer" : "Add Offer"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>}
        {categories.length == 0 && <div className="flex items-center justify-center h-[50vh]">
      <div className="text-center">
        <FolderX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-900">No categories added yet</h1>
      </div>
    </div>}
      </div>
      <div className="mt-4">
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div></>
    
  );
}
