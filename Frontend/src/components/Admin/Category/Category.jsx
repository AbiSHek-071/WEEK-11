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
import { PlusCircle, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/AxiosConfig";
import { Switch } from "../../ui/switch";
import { toast } from "sonner";
import Pagination from "../../shared/Pagination";
import { fetchCatOfferApi } from "@/APIs/Products/Offer";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [offer, setOffer] = useState([]);
  const limit = 5;

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
      toast.error("An error occurred. Please try again.");
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
  }, [toggle, page]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-500">Dashboard &gt; Category</p>
        </div>
        <Button
          onClick={() => navigate("/admin/addcategory")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Create Category
        </Button>
      </div>
      <Table className="bg-white shadow-md rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Category Name</TableHead>
            <TableHead>Added</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Offer</TableHead>
            <TableHead>Offer Actions</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            // Check if the current category has an offer
            const categoryOffer = offer.find(
              (f) => f.target_id === category._id
            );

            return (
              <TableRow key={category._id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="font-medium">
                  {category.createdAt}
                </TableCell>
                <TableCell className="font-medium">
                  {category.isActive ? "Enabled" : "Disabled"}discount
                </TableCell>
                <TableCell className="font-medium">
                  {categoryOffer ? `${categoryOffer.offer_value}%` : "0%"}
                </TableCell>
                <TableCell className="font-medium">
                  {categoryOffer ? (
                    <button
                      onClick={() => {
                        // Handle removing offer
                        navigate(
                          `/admin/remove-category-offer/${category._id}`
                        );
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
                    >
                      Remove Offer
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        navigate(
                          `/admin/category-offer/${category._id}/${category.name}`
                        );
                      }}
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-200"
                    >
                      Add Offer
                    </button>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <Button
                      onClick={() => handleEdit(category._id)}
                      variant="ghost"
                      size="icon"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Switch
                      checked={category.isActive}
                      onCheckedChange={() =>
                        handleToggle(category._id, category.isActive)
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}
