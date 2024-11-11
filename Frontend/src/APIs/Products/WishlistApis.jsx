import axiosInstance from "@/AxiosConfig";
import Product from "@/components/User/Product";

//add item to wishlist
export const addToWishListApi = async (product_id, user_id) => {
  return await axiosInstance.post("/user/wishlist/add", {
    product_id,
    user_id,
  });
};

//remove item from wishlist
export const removeFromWishListApi = async (product_id, user_id) => {
  return await axiosInstance.post("/user/wishlist/remove", {
    product_id,
    user_id,
  });
};

//check item exist on wishlist or not
export const checkIsExistOnWishlistApi = async (product_id, user_id) => {
  return await axiosInstance.get("/user/wishlist/isexist", {
    params: { product_id, user_id },
  });
};

//fetch wishlist items of the user
export const fetchWishlistApi = async (user_id) => {
  return await axiosInstance.get("/user/wishlist", {
    params: { user_id },
  });
};

//move item to cart
export const moveItemtoCartApi = async (product_id, user_id) => {
  return await axiosInstance.post("/user/whishlist/movetocart", {
    product_id,
    user_id,
  });
};

//check if product is on cart
export const checkisExistonCart = async (product_id, size) => {
  return await axiosInstance.post("/user/whishlist/isoncart", {
    product_id,
    size,
  });
};
