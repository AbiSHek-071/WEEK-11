import { useEffect, useState } from "react";
import Address from "../Profile/Address";
import axiosInstance from "@/AxiosConfig";
import { useSelector } from "react-redux";
import visa from "../../../assets/visa.png"
import master from "../../../assets/master.png";
import rupya from "../../../assets/rupya.png";
import { toast as reactToast, ToastContainer } from "react-toastify";
import { toast } from "sonner";

export default function Checkout() {
    const userData = useSelector((store) => store.user.userDatas);
    const [selectedAddress, setSelectedAddress] = useState(null);
     const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
      const [cartItems, setCartItems] = useState([]);
      const [subtotal, setSubtota] = useState(0);
    async function fetchCartItems() {
      try {
        const response = await axiosInstance.get(`/user/cart/${userData._id}`);
        setCartItems(response.data.cartItems.items);
        console.log(response.data.cartItems);

        setSubtota(response.data.cartItems.totalCartPrice);
      } catch (err) {
        console.log(err);
        if (err.response) {
          return toast.error(err.response.data.message);
        }
      }
    }
    

     const handlePaymentMethodChange = (event) => {
       setSelectedPaymentMethod(event.target.value);
     };
     
     async function handlePlaceOrder() {
      try {
        if(!selectedAddress){
          return reactToast.warn("select an adress before proceeds");
        }
        if(!selectedPaymentMethod){
          return reactToast.warn("select an Payment before proceeds");
        }
        console.log(cartItems);
        const response = axiosInstance.post("/user/order", {
          user: userData._id,
          cartItems,
          subtotal,
          shipping_address: selectedAddress._id,
          payment_method:selectedPaymentMethod,
        });
        return toast.success(response.data.message)
        
      } catch (err) {
        console.log(err);
        return toast.error(err.response.data.message)
      }
     }

    useEffect(()=>{
        fetchCartItems()
    },[])
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Billing Details</h1>
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='w-full lg:w-2/3'>
          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>
              select an Addresses from your addresses
            </h2>
            <div className='space-y-4'>
              <Address
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
              />
            </div>
          </section>
          <section>
            <h2 className='text-xl font-semibold mb-4'>Payment Method</h2>
            <p className='mb-2'>Select any payment method</p>
            <div className='space-y-2'>
              {/* Card */}
              <label className='flex items-center justify-between cursor-pointer'>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    value='card'
                    className='w-6 h-6 border-2 border-gray-400 rounded-full mr-2'
                    onChange={handlePaymentMethodChange}
                    checked={selectedPaymentMethod === "card"}
                  />
                  <span>Debit Card / Credit Card</span>
                </div>
                <div className='flex space-x-2'>
                  <img src={master} alt='Mastercard' className='w-8 h-8' />
                  <img src={visa} alt='Visa' className='w-8 h-8' />
                  <img src={rupya} alt='Rupya' className='w-8 h-8' />
                </div>
              </label>

              {/* Wallet */}
              <label className='flex items-center justify-between cursor-pointer'>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    value='wallet'
                    className='w-6 h-6 border-2 border-gray-400 rounded-full mr-2'
                    onChange={handlePaymentMethodChange}
                    checked={selectedPaymentMethod === "wallet"}
                  />
                  <span>Wallet</span>
                </div>
              </label>

              {/* UPI Method */}
              <label className='flex items-center justify-between cursor-pointer'>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    value='upi'
                    className='w-6 h-6 border-2 border-gray-400 rounded-full mr-2'
                    onChange={handlePaymentMethodChange}
                    checked={selectedPaymentMethod === "upi"}
                  />
                  <span>UPI Method</span>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label className='flex items-center justify-between cursor-pointer'>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    value='Cash on Delivery'
                    className='w-6 h-6 border-2 border-gray-400 rounded-full mr-2'
                    onChange={handlePaymentMethodChange}
                    checked={selectedPaymentMethod === "Cash on Delivery"}
                  />
                  <span>Cash on delivery</span>
                </div>
              </label>
            </div>
          </section>
        </div>
        <div className='w-full lg:w-1/3'>
          <div className='bg-gray-100 p-6 rounded-md'>
            {cartItems.map((item) =>
              item.qty >= 1 ? (
                <div key={item._id} className='flex items-center mb-4'>
                  <div className='w-16 h-20 bg-gray-300 mr-4 overflow-hidden'>
                    <img
                      src={item?.productId?.images[0]}
                      alt={item?.productId?.images[1]}
                    />
                  </div>
                  <div className='w-full'>
                    <h3 className='font-semibold'>{item.productId.name}</h3>
                    <p>INR{item.salePrice.toFixed(2)}</p>
                    <p> Size: {item.size}</p>
                  </div>
                  <p>QTY:{item.qty}</p>
                </div>
              ) : null
            )}
            <div className='border-t pt-4 mt-4'>
              <div className='flex justify-between mb-2'>
                <span>Subtotal:</span>
                <span>INR {subtotal}</span>
              </div>
              <div className='flex justify-between mb-2'>
                <span>Shipping:</span>
                <span>INR 0.00</span>
              </div>
              <div className='flex justify-between font-semibold'>
                <span>Total:</span>
                <span>INR {subtotal}</span>
              </div>
            </div>
            <div className='mt-4 flex'>
              <input
                type='text'
                placeholder='Coupon code'
                className='flex-grow border rounded-l-md px-4 py-2'
              />
              <button className='bg-gray-900 text-white px-4 py-2 rounded-r-md'>
                Apply Coupon
              </button>
            </div>
            <button
              onClick={handlePlaceOrder}
              className='mt-4 w-full bg-gray-900 text-white py-3 rounded-md'>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
