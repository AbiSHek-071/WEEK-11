import React, { useEffect, useState } from "react";
import { Star, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import FilterSidebar from "./FilterSidebar";
import ProductCardContainer from "../ui/ProductCardContainer";
import SearchComponent from "../ui/SearchComponent";
import { toast } from "sonner";
import axiosInstance from "@/AxiosConfig";
import Pagination from "../shared/Pagination";

const ShopNow = () => {
  //filtering
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    sleeve: [],
    size: [],
  });
  //ALL OTHER STATES.......................................................
  const [search, setsearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  //FUNCTIONS.......................................................
  async function fetchNewArraivals() {
    try {
      const response = await axiosInstance.get(`/user/products`, {
        params: {
          page,
          limit,
          category: selectedFilters.category.join(","),
          sleeve: selectedFilters.sleeve.join(","),
          size: selectedFilters.size.join(","),
          search,
          sortBy,
        },
      });

      setTotalPages(response.data.totalPages);
      setProducts(response.data.productData);
    } catch (err) {
      console.error("Error fetching products:", err);

      if (err.response && err.response.status === 400) {
        return toast.error(err.response.data.message);
      }

      toast.error("An error occurred. Please try again.");
    }
  }
  //USE EFFECT...............................
  useEffect(() => {
    fetchNewArraivals();
    console.log(search);
  }, [page, selectedFilters, search, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Responsive Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden mb-4">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <FilterSidebar
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              className="mt-4"
            />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <FilterSidebar
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          className="hidden lg:block w-64 flex-shrink-0"
        />

        {/* Main Content */}
        <div className="flex-grow pl-8 pr-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">Products</h1>
            <div className="flex gap-5">
              <SearchComponent setsearch={setsearch} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort by: {sortBy} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("newest")}>
                    Newest
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setSortBy("price-low-to-high")}
                  >
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy("price-high-to-low")}
                  >
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name-a-to-z")}>
                    Name: aA - zZ
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name-z-to-a")}>
                    Name: zZ - aA
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("")}>
                    No Sort
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Product Grid */}
          <ProductCardContainer products={products} />
        </div>
      </div>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default ShopNow;
