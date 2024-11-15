import { useEffect, useState } from "react";
import Address from "../Profile/Address";
import axiosInstance from "@/AxiosConfig";
import { useSelector } from "react-redux";
import visa from "../../../assets/visa.png";
import master from "../../../assets/master.png";
import rupya from "../../../assets/rupya.png";
import verify from "../../../assets/verify.svg";

import { toast as reactToast, ToastContainer } from "react-toastify";
import { toast } from "sonner";
import { Button } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { appyCouponApi } from "@/APIs/Shopping/coupon";
import PaymentComponent from "@/util/PaymentComponent";
import { fetchWalletInfoApi } from "@/APIs/Profile/Wallet";
import ConfirmationModal from "@/components/shared/confirmationModal";

export default function Checkout() {
  const userData = useSelector((store) => store.user.userDatas);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [cartItems, setCartItems] = useState([]);

  //SUBTOTAL STATE
  const [total_amount, settotal_amount] = useState(0);
  //TOTAL DISCOUNT AMOUNT
  const [total_discount, settotal_discount] = useState(0);
  //COUPON DISCOUNT WITHOUT OFFERS
  const [coupon_Discount, setcoupon_Discount] = useState(0);
  //GRAND TOTAL PRICE
  const [total_price_with_discount, settotal_price_with_discount] = useState(0);

  //wallet balance
  const [Walletbalance, setWalletBalance] = useState(0);

  const [cart_id, setCart_id] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [orderDetails, setOrderDetails] = useState({});
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [placedAt, setPlacedAt] = useState(null);
  const [placedTime, setPlacedTime] = useState(null);

  const [couponCode, setCouponCode] = useState("");
  const [verifiedCouponCode, setverifiedCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);

  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  const navigate = useNavigate();

  //------------------FETCH ALL ITEMS FROM THE CART FOR CHECKOUT---------------------
  async function fetchCartItems() {
    try {
      const response = await axiosInstance.get(`/user/cart/${userData._id}`);
      //items in the cart
      setCartItems(response.data.cartItems.items);
      //id of the cart
      setCart_id(response.data.cartItems._id);
      //total price for entaire cart
      settotal_amount(response.data.cartItems.totalCartPrice);
      //discount amount from the offer
      const offerDiscount = response.data.cartItems.total_discount;
      console.log("Offer Discount ::::::::::>", offerDiscount);
      //total_discount for the order offerDiscount+coupon_Discount
      console.log("coupon_discount::::::>", coupon_Discount);
      settotal_discount(offerDiscount + coupon_Discount);
      console.log("Total Discount::::>", offerDiscount + coupon_Discount);
    } catch (err) {
      console.log(err);
      if (err.response) {
        return toast.error(err.response.data.message);
      }
    }
  }

  //------------------SELECTING PAYMENT METHOD---------------------
  const handlePaymentMethodChange = async (event) => {
    console.log(event.target.value);

    setSelectedPaymentMethod(event.target.value);
    if (event.target.value === "wallet") {
      const response = await fetchWalletInfoApi(userData._id);
      setWalletBalance(response.data.myWallet.balance);
    } else {
      setWalletBalance(0);
    }
  };

  //-----------------HANDLE PLACE ORDER------------------------------
  async function handlePlaceOrder() {
    try {
      if (!selectedAddress) {
        return reactToast.warn("select an adress before proceeds");
      }
      if (!selectedPaymentMethod) {
        return reactToast.warn("select an Payment before proceeds");
      }

      //+++++++++++++++CONSOLE TESTED++++++++++++++++++++++++++++++++

      // console.log("user::::::::>", userData._id);
      // console.log("cartItems::::::::>", cartItems);
      // console.log("total_amount::::::::>", total_amount);
      // console.log("total_discount::::::::>", total_discount);
      // console.log("coupon_discount::::::::>", coupon_Discount);
      // console.log(
      //   " total_price_with_discount::::::::>",
      //   total_price_with_discount
      // );
      // console.log("shipping address::::::::>", selectedAddress);
      // console.log("payment method::::::::>", selectedPaymentMethod);
      // console.log("cart_id::::::::>", cart_id);

      const response = await axiosInstance.post("/user/order", {
        //id of the user who order's
        user: userData._id,
        //items in the order
        cartItems,
        //grand total Amount of the order
        total_amount,
        //total discount the user get couponDisocunt+offerDiscount
        total_discount,
        //coupon discount
        coupon_Discount,
        //Grand total amount he paid after coupon discount total_amount - couponDiscount
        total_price_with_discount,
        //His shipping address
        shipping_address: selectedAddress,
        //method of payment
        payment_method: selectedPaymentMethod,
        //id of his cart
        cart_id,
      });
      setOrderDetails(response?.data?.order);
      //SETTING DELIVERY DATE
      const formattedDate = new Date(
        response.data.order.delivery_by
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      setDeliveryDate(formattedDate);

      //SETTING PLACED AT DATE
      const formattedPlaceDate = new Date(
        response.data.order.delivery_by
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setPlacedAt(formattedPlaceDate);
      const formattedTime = new Date(
        response.data.order.delivery_by
      ).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setPlacedTime(formattedTime);

      onOpen();
      return toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      const errorMessage =
        err.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  }

  //-----------JUST NAVIGATIONS-----------
  function onExit() {
    navigate("/");
  }
  function onViewOrder() {
    navigate("/profile/orders");
  }
  //---------------------APPLY COUPON LOGIC----------------
  async function handleApplyCoupon() {
    try {
      const response = await appyCouponApi(couponCode);
      const data = response.data.CouponData;
      setCouponData(data);

      const discountPercentage = data.discount_value;
      const calculatedDiscount = (total_amount * discountPercentage) / 100;

      if (data.min_purchase_amount < total_amount) {
        setcoupon_Discount(calculatedDiscount);
        setverifiedCouponCode(data.code);
      } else {
        toast.error("Sorry, the coupon is not valid for this purchase.");
        handleRemoveCoupon();
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
      console.error(err);
    }
  }
  //----------COUPON REMOVAL LOGIC-----------------
  function handleRemoveCoupon() {
    settotal_price_with_discount(total_price_with_discount + coupon_Discount);
    setcoupon_Discount(0);
    settotal_discount(total_discount - coupon_Discount);
    setCouponData(null);
    setCouponDiscount(0);
  }

  //pay with wallet
  function handleWalletPayment() {
    if (Walletbalance < total_price_with_discount) {
      return toast.error(
        "Your wallet balance is insufficient to complete this payment"
      );
    }

    //modal data
    setModalContent({
      title: "Wallet Payment",
      message:
        "You are about to complete this payment using your wallet balance. Do you want to proceed?",
      onConfirm: handlePlaceOrder,
    });
    setModalOpen(true);
  }

  //--------------TOTAL PRICE CALCULATION WITH AND WITHOUT COUPON------------
  useEffect(() => {
    fetchCartItems();

    if (couponData) {
      const discount = coupon_Discount;
      const maxDiscount = couponData.max_discount_amount;
      const minPurchaseAmount = couponData.min_purchase_amount;

      if (total_amount > minPurchaseAmount) {
        const effectiveDiscount = Math.min(discount, maxDiscount);

        setcoupon_Discount(effectiveDiscount);
        settotal_price_with_discount(total_amount - effectiveDiscount);
      } else {
        toast.error("Sorry, the coupon is not valid for this purchase.");
      }
    } else {
      settotal_price_with_discount(total_amount);
      setcoupon_Discount(0);
      setCouponData(null);
    }
  }, [total_discount, coupon_Discount, total_amount, couponData]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* --------ORDER DETAILS POP UP MODAL */}
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onExit}
        className="bg-white border shadow-lg "
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="mx-auto">Order Summary</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center">
                  <img src={verify} alt="" className="h-20 my-5" />
                  <h2 className="flex">Payment successfully Completed</h2>
                  <Table
                    aria-label="Example static collection table"
                    className="my-7"
                  >
                    <TableHeader>
                      <TableColumn>OrderId</TableColumn>
                      <TableColumn className="text-right">
                        {orderDetails?.order_id}
                      </TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>Date</TableCell>
                        <TableCell className="text-right">{placedAt}</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Time</TableCell>
                        <TableCell className="text-right">
                          {placedTime}
                        </TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>Payment Method</TableCell>
                        <TableCell className="text-right">
                          {orderDetails?.payment_method}
                        </TableCell>
                      </TableRow>

                      {/* Conditional Rendering for Coupon Discount */}
                      {orderDetails?.coupon_discount > 0 && (
                        <TableRow key="5">
                          <TableCell>Coupon Discount</TableCell>
                          <TableCell className="text-right">
                            -INR {orderDetails?.coupon_discount}.00
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Conditional Rendering for Total Savings */}
                      {orderDetails?.total_discount > 0 && (
                        <TableRow key="6">
                          <TableCell>Total Savings</TableCell>
                          <TableCell className="text-right">
                            -INR {orderDetails?.total_discount}.00
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Display 'Free' if shipping_fee is 0 */}
                      <TableRow key="7">
                        <TableCell>Shipping Fee</TableCell>
                        <TableCell className="text-right">
                          {orderDetails?.shipping_fee === 0
                            ? "Free"
                            : `INR ${orderDetails?.shipping_fee}.00`}
                        </TableCell>
                      </TableRow>

                      <TableRow key="4">
                        <TableCell>Amount</TableCell>
                        <TableCell className="text-right">
                          INR {orderDetails?.total_price_with_discount}.00
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <h1 className="text-green-700 font-bold">
                    Arriving By {deliveryDate}
                  </h1>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onExit}>
                  Continue Shopping
                </Button>
                <Button color="primary" onPress={onViewOrder}>
                  View Order
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <h1 className="text-3xl font-bold mb-6">Billing Details</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              select an Addresses from your addresses
            </h2>
            <div className="space-y-4">
              <Address
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
              />
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

            <p className="mb-2">Select any payment method</p>
            <div className="space-y-2">
              {/* Card */}
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Razor Pay"
                    className="w-6 h-6 border-2 border-gray-400 rounded-full mr-2"
                    onChange={handlePaymentMethodChange}
                    checked={selectedPaymentMethod === "Razor Pay"}
                  />
                  <span>Razor Pay (Card/Net Banking/UPI)</span>
                </div>
                <div className="flex space-x-2">
                  <img src={master} alt="Mastercard" className="w-8 h-8" />
                  <img src={visa} alt="Visa" className="w-8 h-8" />
                  <img src={rupya} alt="Rupya" className="w-8 h-8" />
                </div>
              </label>

              {/* Wallet */}
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    className="w-6 h-6 border-2 border-gray-400 rounded-full mr-2"
                    onChange={handlePaymentMethodChange}
                    checked={selectedPaymentMethod === "wallet"}
                  />
                  <span>Wallet</span>
                </div>
              </label>

              {Walletbalance > 0 && (
                <div className="ml-8 mt-2 text-gray-700 font-medium flex items-center">
                  <span className="text-gray-500 mr-2">
                    Total Wallet Balance:
                  </span>
                  <span className="text-green-600">
                    Rs {Walletbalance.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Cash on Delivery */}
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    className="w-6 h-6 border-2 border-gray-400 rounded-full mr-2"
                    onChange={handlePaymentMethodChange}
                    checked={selectedPaymentMethod === "Cash on Delivery"}
                  />
                  <span>Cash on delivery</span>
                </div>
              </label>
            </div>
          </section>
        </div>
        {/* ===========billing section=============== */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-100 p-6 rounded-md">
            {cartItems.map((item) =>
              item.qty >= 1 ? (
                <div key={item._id} className="flex items-center mb-4">
                  <div className="w-16 h-20 bg-gray-300 mr-4 overflow-hidden">
                    <img
                      src={item?.productId?.images[0]}
                      alt={item?.productId?.images[1]}
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="font-semibold">{item.productId.name}</h3>
                    <p>INR{item.discountedAmount.toFixed(2)}</p>
                    {item.discountAmount > 0 && (
                      <p className="text-red-400">
                        you saved {item.discountAmount * item.qty}₹
                      </p>
                    )}
                    <p> Size: {item.size}</p>
                  </div>
                  <p>QTY:{item.qty}</p>
                </div>
              ) : null
            )}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>INR {total_amount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span className="text-green-500">Free</span>
              </div>

              {/* COUPONCODE */}
              {verifiedCouponCode && (
                <div className="flex justify-between mb-2">
                  <span>Coupon Code:</span>
                  <span>
                    <b>{verifiedCouponCode}</b>
                  </span>
                </div>
              )}
              {/* COUPON DISCOUND */}
              {couponDiscount > 0 && (
                <div className="flex justify-between mb-2">
                  <span>Coupon Discount:</span>
                  <span>{couponDiscount}%</span>
                </div>
              )}
              {coupon_Discount > 0 && (
                <div className="flex justify-between mb-2">
                  <span>Coupon Discount Amount:</span>
                  <span>INR{coupon_Discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>INR {total_price_with_discount.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 flex">
              <input
                type="text"
                placeholder="Coupon code"
                className="flex-grow border rounded-l-md px-4 py-2"
                onChange={(e) => {
                  setCouponCode(e.target.value);
                }}
              />
              {couponData ? (
                <button
                  onClick={handleRemoveCoupon}
                  className="bg-gray-900 text-white px-4 py-2 rounded-r-md"
                >
                  Remove Coupon
                </button>
              ) : (
                <button
                  onClick={handleApplyCoupon}
                  className="bg-gray-900 text-white px-4 py-2 rounded-r-md"
                >
                  Apply Coupon
                </button>
              )}
            </div>
            {selectedPaymentMethod == "Cash on Delivery" && (
              <Button
                onClick={handlePlaceOrder}
                // onPress={onOpen}
                className="mt-4 w-full h-16 rounded-md"
                color="primary"
              >
                {" "}
                Place Order
              </Button>
            )}
            {selectedPaymentMethod == "Razor Pay" && selectedAddress && (
              <PaymentComponent
                total={total_price_with_discount.toFixed(2)}
                handlePlaceOrder={handlePlaceOrder}
              />
            )}
            {selectedPaymentMethod == "wallet" && selectedAddress && (
              <Button
                onClick={handleWalletPayment}
                // onPress={onOpen}
                className="mt-4 w-full h-16 rounded-md"
                color="primary"
              >
                {" "}
                Pay with your wallet
              </Button>
            )}
            {selectedPaymentMethod == "" || selectedAddress == "" ? (
              <Button className="mt-4 w-full h-16 rounded-md" color="primary">
                Select a payment method and Address
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={modalContent.onConfirm}
      />
    </div>
  );
}
