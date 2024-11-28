import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/AxiosConfig";
import Pagination from "../../shared/Pagination";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import { fetchPrdOfferApi } from "@/APIs/Products/Offer";
import { FolderX } from "lucide-react";

export default function ImprovedProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [reload, setReload] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 9;
  async function fetchProducts() {
    try {
      const response = await axiosInstance.get(
        `/admin/products?page=${page}&limit=${limit}`
      );
      setTotalPages(response.data.totalPages);
      setPage(response.data?.currentPage);
      const res = await axiosInstance.get("/admin/categories/active");
      setCategories(res.data.categories);
      setProducts(response.data.products);
      if (reload) setReload(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // return toast.error(err.response.data.message);
      }
    }
  }
  async function fetchPrdOffer() {
    try {
      const response = await fetchPrdOfferApi();
      setOffers(response.data.productOffer);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPrdOffer();
    fetchProducts();
  }, [page, reload]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6 inline-block">Product List</h1>

        <Button
          onClick={() => {
            navigate("/admin/addproduct");
          }}
          className=""
        >
          Add Product
        </Button>
      </div>
      <p className="text-gray-500 mb-5">Dashboard &gt; product</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
        {products.length != 0 &&
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              offers={offers}
              categories={categories}
              setReload={setReload}
            />
          ))}
      </div>
      {products.length == 0 && (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <FolderX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900">
              No Products added yet
            </h1>
          </div>
        </div>
      )}
      {products.length != 0 && (
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      )}
    </div>
  );
}
