"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, User, ShoppingCart, Menu, X, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SearchComponent from "./SearchComponent";
import { useSelector } from "react-redux";
import PopupBox from "./PopupBox";


export default function Navbar() {
   const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((store)=>store.user.userDatas)
 
 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`text-black bg-white p-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
      style={{
        transform: isScrolled ? "translateY(0)" : "translateY(-100%)",
        opacity: isScrolled ? 1 : 0,
      }}>
      <div className='container mx-auto flex items-center justify-between'>
        <div className='text-2xl font-bold'>Stitchers</div>
        <div className='hidden md:flex flex-grow justify-center'>
          <div className='space-x-6'>
            <Link to='/user/home' className='hover:text-gray-700'>
              Home
            </Link>
            <Link to='/user/shop' className='hover:text-gray-700'>
              Shop
            </Link>
            <Link href='#' className='hover:text-gray-700'>
              Our Story
            </Link>
            <Link href='#' className='hover:text-gray-700'>
              Contact us
            </Link>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <SearchComponent />
          <Button variant='ghost' size='icon'>
            <Heart className='h-5 w-5' />
          </Button>
          <Button variant='ghost' size='icon'>
            <ShoppingCart className='h-5 w-5' />
          </Button>
          {userData ? (
            <div
              onClick={() => setIsPopupOpen(true)}
              className='flex items-center justify-center bg-gray-300 text-black rounded-full w-10 h-10 font-bold'>
              {userData.name.charAt(0).toUpperCase()}
              {userData.name.charAt(userData.name.length - 1).toUpperCase()}
            </div>
          ) : (
            <Button
              onClick={() => {
                navigate("/user/login");
              }}
              className='bg-black text-white hidden md:inline-flex hover:scale-105'>
              Login
            </Button>
          )}

          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={toggleMenu}>
            <Menu className='h-5 w-5' />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={` fixed inset-0 bg-black bg-opacity-50  transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}>
        <div
          className={`fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}>
          <div className='p-4 bg-white h-full'>
            <Button
              variant='ghost'
              size='icon'
              className='absolute top-4 right-4'
              onClick={toggleMenu}>
              <X className='h-5 w-5' />
            </Button>
            <div className='bg-white mt-8 flex flex-col space-y-4'>
              <a href='#' className='text-black hover:text-gray-700'>
                Home
              </a>
              <a href='#' className='text-black hover:text-gray-700'>
                Shop
              </a>
              <a href='#' className='text-black hover:text-gray-700'>
                Our Story
              </a>
              <a href='#' className='text-black hover:text-gray-700'>
                Contact us
              </a>
            </div>
          </div>
        </div>
      </div>
      <PopupBox isOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} />
    </nav>
  );
}
