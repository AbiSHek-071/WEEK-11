import React from "react";

export default function Footer() {
  return (
    <footer className='bg-black text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='col-span-1 md:col-span-1'>
            <h2 className='text-2xl font-bold mb-4'>Stitchers</h2>
            <p className='text-sm text-gray-400'>
              Grab top styles at exclusive discounts for a limited time. Shop
              now and elevate your wardrobe without breaking the bank!
            </p>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>POPULAR</h3>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='text-gray-400 hover:text-white'>
                  Shirt
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white'>
                  T-Shirt
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white'>
                  Jackets
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white'>
                  Hoodies
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>MENU</h3>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='text-gray-400 hover:text-white'>
                  All Category
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white'>
                  Gift Cards
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white'>
                  Special Events
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white'>
                  Testimonial
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white'>
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>OTHER</h3>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='text-gray-400 hover:text-white'>
                  Tracking Package
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white'>
                  FAQ
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white'>
                  About Us
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white'>
                  Contact Us
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-white'>
                  Terms and Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
