import Footer from '../components/ui/Footer'
import Navbar from '../components/ui/Navbar'
import Cart from '../components/User/Shoppings/Cart'
import React from 'react'

function CartPage() {
  return (
    <>
    <Navbar/>
    <Cart className="mt-16" />
    <Footer/>
    </>
  )
}

export default CartPage