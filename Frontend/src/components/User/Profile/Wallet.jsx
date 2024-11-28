import React, { useEffect, useState } from "react";
import { Plus, ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import axiosInstance from "@/AxiosConfig";

import { toast } from "sonner";
import { useSelector } from "react-redux";
import { addMoneytoWalletApi, fetchWalletInfoApi } from "@/APIs/Profile/Wallet";

function Wallet() {
  const userData = useSelector((store) => store.user.userDatas);
  const [reload, setReload] = useState(false);
  //total balance
  const [balance, setBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //Entered amount in the add amount popup
  const [amount, setAmount] = useState(0);
  //transaction array
  const [transactions, setTransactions] = useState([]);

  const handleAddMoney = async () => {
    try {
      if (amount > 2000) {
        return toast.error("You cannot add money above 2000 at a time");
      } else if (amount < 0) {
        return toast.error("Negative values are not accepted");
      }

      const response = await addMoneytoWalletApi(amount, userData._id);
      setReload(true);
      setIsModalOpen(false);
      return toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };
  async function fetchWalletInfo() {
    try {
      const response = await fetchWalletInfoApi(userData._id);
      console.log("myWallet======>", response.data.myWallet);

      setBalance(response.data.myWallet.balance);
      setTransactions(response.data.myWallet.transactions);
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  }

  useEffect(() => {
    fetchWalletInfo();
    setReload(false);
  }, [reload]);
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">My Wallet</h1>
          <div className="flex gap-2 text-sm text-gray-500">
            <span>home</span>
            <span>/</span>
            <span>profile</span>
            <span>/</span>
            <span className="text-black">wallet</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Available Balance</p>
              <h2 className="text-3xl font-bold">₹{balance.toFixed(2)}</h2>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Money
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Transaction History</h2>
          </div>
          <div className="divide-y">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.transaction_type === "credit"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {transaction.transaction_type === "credit" ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {transaction.transaction_type === "credit"
                        ? "Money Added"
                        : "Payment"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(
                        transaction.transaction_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium w-full text-center ${
                        transaction.transaction_status === "completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.transaction_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.transaction_status}
                    </span>
                  </div>
                  <p
                    className={`text-lg font-semibold w-28 text-right ${
                      transaction.transaction_type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.transaction_type === "credit" ? "+" : "-"}₹
                    {transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Add Money to Wallet</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="₹0.00"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <button
                onClick={handleAddMoney}
                className="w-full bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add Money
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallet;
