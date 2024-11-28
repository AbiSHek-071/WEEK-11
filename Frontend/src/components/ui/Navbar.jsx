"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, User, ShoppingCart, Menu, X, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SearchComponent from "./SearchComponent";
import { useSelector } from "react-redux";
import PopupBox from "./PopupBox";

export default function Navbar() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user.userDatas);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {}, []);

  return (
    <nav className="text-black bg-white p-4 z-[999] relative transition-all duration-300 drop-shadow-xl">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold">Stitchers</div>
        <div className="hidden md:flex flex-grow justify-center">
          <div className="space-x-6">
            <Link to="/home" className="hover:text-gray-700">
              Home
            </Link>
            <Link to="/shop" className="hover:text-gray-700">
              Shop
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            onClick={() => {
              navigate("/wishlist");
            }}
            variant="ghost"
            size="icon"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => {
              navigate("/cart");
            }}
            variant="ghost"
            size="icon"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          {userData ? (
            <div
              onClick={() => {
                navigate("/profile/myprofile");
              }}
              className="flex items-center cursor-pointer justify-center bg-gray-300 text-black rounded-full w-10 h-10 font-bold"
            >
              {userData.name.charAt(0).toUpperCase()}
              {userData.name.charAt(userData.name.length - 1).toUpperCase()}
            </div>
          ) : (
            <Button
              onClick={() => {
                navigate("/login");
              }}
              className="bg-black text-white hidden md:inline-flex hover:scale-105"
            >
              Login
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[2000] transition-opacity duration-300"
          onClick={toggleMenu}
        >
          <div
            className={`fixed right-0 top-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[3000] ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-white h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={toggleMenu}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="bg-white mt-8 flex flex-col space-y-4">
                <Link to="/home" className="text-black hover:text-gray-700">
                  Home
                </Link>
                <Link to="/shop" className="text-black hover:text-gray-700">
                  Shop
                </Link>
                <Link to="#" className="text-black hover:text-gray-700">
                  Our Story
                </Link>
                <Link to="#" className="text-black hover:text-gray-700">
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <PopupBox isOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} />
    </nav>
  );
}
