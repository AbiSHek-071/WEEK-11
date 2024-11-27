import axiosInstance from "@/AxiosConfig";

//add product offer
export const addProductOfferApi = async (
  id,
  productName,
  offerName,
  offerValue,
  offerExpairyDate,
  target_type
) => {
  return await axiosInstance.post("/admin/product/offer", {
    id,
    productName,
    offerName,
    offerValue,
    offerExpairyDate,
    target_type,
  });
};

export const addCategoryOfferApi = async (
  id,
  CategoryName,
  offerName,
  offerValue,
  offerExpairyDate,
  target_type
) => {
  return await axiosInstance.post("/admin/category/offer", {
    id,
    CategoryName,
    offerName,
    offerValue,
    offerExpairyDate,
    target_type,
  });
};

export const checkOfferExistApi = async (id) => {
  return await axiosInstance.get("/admin/product/offer-isexist", {
    params: {
      id,
    },
  });
};

export const removeOffer = async (_id) => {
  return await axiosInstance.delete("/admin/offer", { params: { _id } });
};

export const fetchCatOfferApi = async () => {
  return await axiosInstance.get("/admin/offer/category");
};

export const fetchPrdOfferApi = async () => {
  return await axiosInstance.get("/admin/offer/product");
};

export const findProductAndCategoryOfferApi = async (
  product_id,
  category_id,
  product_price
) => {
  return await axiosInstance.get("/user/findoffer", {
    params: {
      product_id,
      category_id,
      product_price,
    },
  });
};
