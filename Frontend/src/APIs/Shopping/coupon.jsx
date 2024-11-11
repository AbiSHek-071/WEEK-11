import axiosInstance from "@/AxiosConfig";

//add coupon
export const AddCouponApi = async (coupon) => {
  return await axiosInstance.post("/admin/coupon", { coupon });
};
