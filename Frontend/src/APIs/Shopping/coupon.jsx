import axiosInstance from "@/AxiosConfig";

//add coupon
export const AddCouponApi = async (coupon) => {
  return await axiosInstance.post("/admin/coupon", { coupon });
};

//get all coupons
export const FetchCouponsApi = async () => {
  return await axiosInstance.get("/admin/coupons");
};

//delete coupon
export const deleteCouponApi = async (_id) => {
  return await axiosInstance.delete("/admin/coupon", { params: { _id } });
};

export const appyCouponApi = async (couponCode) => {
  return await axiosInstance.get("/user/coupon", { params: { couponCode } });
};

//update coupon after order
export const updateCouponDataApi = async (coupon_id, user_id) => {
  return await axiosInstance.patch("/user/coupon", { coupon_id, user_id });
};
