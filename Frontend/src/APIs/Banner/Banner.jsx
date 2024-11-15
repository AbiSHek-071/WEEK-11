import axiosInstance from "@/AxiosConfig";

export const addBannerApi = async (title, subtitle, advertisement, image) => {
  console.log("image::::::", image);
  console.log("title::::::", title);
  console.log("subtitle::::::", subtitle);
  console.log("advertisement::::::", advertisement);
  return await axiosInstance.post("/admin/banner", {
    title,
    subtitle,
    advertisement,
    image,
  });
};
export const fetchBannersAdminApi = async () => {
  return await axiosInstance.get("/admin/banner");
};

export const fetchBannersApi = async () => {
  return await axiosInstance.get("/user/banner");
};

export const toggelBannerApi = async (_id, isActive) => {
  return await axiosInstance.patch("/admin/banner/status", {
    _id,
    isActive,
  });
};
