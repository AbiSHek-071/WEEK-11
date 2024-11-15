("use client");

import React, { useEffect, useState } from "react";
import axiosInstance from "@/AxiosConfig";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { fetchBannersAdminApi, toggelBannerApi } from "@/APIs/Banner/Banner";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Banner = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [reload, setReload] = useState(false);

  async function onToggle(_id, isActive) {
    try {
      const response = await toggelBannerApi(_id, isActive);
      toast.success(response.data.message);
      setReload(true);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
      console.log(err);
    }
  }

  async function fetchBanners() {
    try {
      const response = await fetchBannersAdminApi();
      setBanners(response?.data?.banners);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    fetchBanners();
    setReload(false);
  }, [reload]);
  return (
    <div className="w-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold">Banners</h1>
        <p className="text-gray-500">Dashboard &gt; Banners</p>
      </div>
      <button
        onClick={() => {
          navigate("/admin/add-banner");
        }}
        className="bg-black rounded-sm text-white font-semibold px-4 py-2 ms-auto my-5"
      >
        Add Banner
      </button>
      <div className="grid  gap-6 lg:grid-cols-2">
        {banners.map((banner, index) => (
          <div className=" relative w-full h-[calc(50vh-2rem)] overflow-hidden">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
                <div className="max-w-lg absolute bottom-16 left-4 sm:left-6 md:left-8 lg:left-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                    {banner.title}
                  </h2>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">
                    {banner.subtitle}
                  </h3>
                  <p className="text-lg sm:text-xl text-white mb-3">
                    {banner.advertisement}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white p-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={banner.isActive}
                    onCheckedChange={() =>
                      onToggle(banner._id, banner.isActive)
                    }
                  />
                  <span className="text-sm text-gray-700">
                    {banner.isActive ? "Listed" : "Unlisted"}
                  </span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    banner.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {banner.isActive ? "Listed" : "Unlisted"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
