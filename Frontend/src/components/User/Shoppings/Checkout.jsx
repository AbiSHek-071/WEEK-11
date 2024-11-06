import { useEffect, useState } from "react";
import Address from "../Profile/Address";
import axiosInstance from "@/AxiosConfig";
import { useSelector } from "react-redux";
import visa from "../../../assets/visa.png"
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


export default function Checkout() {
    const userData = useSelector((store) => store.user.userDatas);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtota] = useState(0);
    const [cart_id,setCart_id]= useState()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [orderDetails, setOrderDetails] = useState({});
    const [deliveryDate,setDeliveryDate] = useState(null);
    const [placedAt,setPlacedAt] = useState(null)
    const [placedTime,setPlacedTime] = useState(null)
    const navigate = useNavigate()

    async function fetchCartItems() {
      try {
        const response = await axiosInstance.get(`/user/cart/${userData._id}`);
        setCartItems(response.data.cartItems.items);
        setCart_id(response.data.cartItems._id); 

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
        console.log(selectedAddress);
        
        const response = await axiosInstance.post("/user/order", {
          user: userData._id,
          cartItems,
          subtotal,
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

        onOpen()
        return toast.success(response.data.message)
        
      } catch (err) {
        console.log(err);
        const errorMessage =
          err.response?.data?.message || "An unexpected error occurred";
  
      }
     }
     function onExit(){
        navigate("/");
     }
     function onViewOrder(){
        navigate("/profile/orders")
     }

    useEffect(()=>{
        fetchCartItems()
    },[])
  return (
    <div className='container mx-auto px-4 py-8'>
      <Modal
        backdrop='blur'
        isOpen={isOpen}
        onClose={onExit}
        className='bg-white border shadow-lg '>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='mx-auto'>Order Summary</ModalHeader>
              <ModalBody>
                <div className=' flex flex-col items-center '>
                  <img src={verify} alt='' className='h-20 my-5' />
                  <h2 className='flex'>Payment successfully Completed</h2>
                  <Table
                    aria-label='Example static collection table'
                    className='my-7'>
                    <TableHeader>
                      <TableColumn>OrderId</TableColumn>
                      <TableColumn className='text-right'>
                        {orderDetails?.order_id}
                      </TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key='1'>
                        <TableCell>Date</TableCell>
                        <TableCell className='text-right'>{placedAt}</TableCell>
                      </TableRow>
                      <TableRow key='2'>
                        <TableCell>Time</TableCell>
                        <TableCell className='text-right'>{placedTime}</TableCell>
                      </TableRow>
                      <TableRow key='3'>
                        <TableCell>Payment Method</TableCell>
                        <TableCell className='text-right'>
                          {orderDetails?.payment_method}
                        </TableCell>
                      </TableRow>
                      <TableRow key='4'>
                        <TableCell>Amount</TableCell>
                        <TableCell className='text-right'>
                          INR {orderDetails.total_amount}.00
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <h1 className='text-green-700 font-bold'>
                    Arriving By {deliveryDate}
                  </h1>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onExit}>
                  Continue Shopping
                </Button>
                <Button color='primary' onPress={onViewOrder}>
                  View Order
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
            <Button
              onClick={handlePlaceOrder}
              // onPress={onOpen}
              className='mt-4 w-full h-16 rounded-md'
              color='primary'>
              {" "}
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
