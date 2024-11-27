import axiosInstance from "@/AxiosConfig";

export const addMoneytoWalletApi = async (amount, _id) => {
  return await axiosInstance.post("/user/wallet/add-money", { amount, _id });
};

export const fetchWalletInfoApi = async (_id) => {
  return await axiosInstance.get("/user/wallet", {
    params: {
      _id,
    },
  });
};
