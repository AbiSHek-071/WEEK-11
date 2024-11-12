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
  //

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

  const navigate = useNavigate();

  //------------------FETCH ALL ITEMS FROM THE CART FOR CHECKOUT---------------------
  async function fetchCartItems() {
    try {
      const response = await axiosInstance.get(`/user/cart/${userData._id}`);
      setCartItems(response.data.cartItems.items);
      setCart_id(response.data.cartItems._id);
      settotal_amount(response.data.cartItems.totalCartPrice);
    } catch (err) {
      console.log(err);
      if (err.response) {
        return toast.error(err.response.data.message);
      }
    }
  }

  //------------------SELECTING PAYMENT METHOD---------------------
  const handlePaymentMethodChange = (event) => {
    console.log("selectedPaymentMethod----------->", event.target.value);
    setSelectedPaymentMethod(event.target.value);
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

      const response = await axiosInstance.post("/user/order", {
        user: userData._id,
        cartItems,
        total_amount,
        total_discount,
        coupon_Discount,
        total_price_with_discount,
        shipping_address: selectedAddress,
        payment_method: selectedPaymentMethod,
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
        settotal_discount(calculatedDiscount);
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
      settotal_discount(0);
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
                      <TableRow key="5">
                        <TableCell>Coupon Discount</TableCell>
                        <TableCell className="text-right">
                          -INR {orderDetails?.coupon_discount}.00
                        </TableCell>
                      </TableRow>
                      <TableRow key="6">
                        <TableCell>Total Savings</TableCell>
                        <TableCell className="text-right">
                          -INR {orderDetails?.total_discount}.00
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
                    <p>INR{item.salePrice.toFixed(2)}</p>
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
                  <span>INR{coupon_Discount}</span>
                </div>
              )}

              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>INR {total_price_with_discount}</span>
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
            {selectedPaymentMethod == "Razor Pay" && (
              <PaymentComponent
                total={total_price_with_discount}
                handlePlaceOrder={handlePlaceOrder}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
