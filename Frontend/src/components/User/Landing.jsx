"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

import banner from "../../assets/banner.png";
import productImg from "../../assets/shirt.png";

export default function Landing() {
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      image: banner,
      title: "Classic Exclusive",
      subtitle: "Men's Collection",
      discount: "UPTO 40% OFF",
    },
    {
      image: banner,
      title: "Summer Essentials",
      subtitle: "Women's Collection",
      discount: "UPTO 50% OFF",
    },
    {
      image: banner,
      title: "Trendy Accessories",
      subtitle: "New Arrivals",
      discount: "STARTING AT $19.99",
    },
  ];

  const categories = [
    { name: "Casual Wear", icon: "👕" },
    { name: "Formals", icon: "🕴️" },
    { name: "Party Wear", icon: "🎉" },
    { name: "Sports Wear", icon: "🏃" },
  ];

  const products = Array(8).fill({
    name: "H&M",
    description: "Oversized Grey Relaxed Fit",
    price: "INR 1,299",
    image: productImg,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='relative w-full h-[calc(100vh-80px)] max-h-[800px] overflow-hidden'>
        <div
          className='flex h-full transition-transform duration-500 ease-in-out'
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
          {banners.map((banner, index) => (
            <div key={index} className='w-full h-full flex-shrink-0 relative'>
              <img
                src={banner.image}
                alt={banner.title}
                layout='fill'
                objectFit='cover'
                priority={index === 0}
              />
              <div className='absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-start p-8 md:p-16'>
                <h2 className='text-white text-xl md:text-3xl font-bold mb-2'>
                  {banner.title}
                </h2>
                <h1 className='text-white text-3xl md:text-5xl font-bold mb-4'>
                  {banner.subtitle}
                </h1>
                <p className='text-white text-xl md:text-2xl mb-6'>
                  {banner.discount}
                </p>
                <Button size='lg'>SHOP NOW</Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant='outline'
          size='icon'
          className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75'
          onClick={prevBanner}>
          <ChevronLeft className='h-6 w-6' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75'
          onClick={nextBanner}>
          <ChevronRight className='h-6 w-6' />
        </Button>
      </section>

      <div className='container mx-auto px-4 py-12'>
        {/* Shop by Categories */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-center'>
            Shop by Categories
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {categories.map((category, index) => (
              <div
                key={index}
                className='bg-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 p-6 flex flex-col items-center justify-center'>
                <span className='text-4xl mb-4'>{category.icon}</span>
                <p className='text-lg font-semibold text-center'>
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold mb-8 text-center'>New Arrivals</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {products.map((item, index) => (
              <Card
                key={index}
                className='overflow-hidden transition-shadow duration-300 hover:shadow-xl'>
                <CardContent className='p-0'>
                  <div className='relative' style={{ paddingTop: "150%" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                  <div className='p-4'>
                    <h3 className='font-bold text-lg'>{item.name}</h3>
                    <p className='text-sm text-gray-600 mb-2'>
                      {item.description}
                    </p>
                    <p className='font-bold text-lg'>{item.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Top Selling */}
        <section>
          <h2 className='text-3xl font-bold mb-8 text-center'>Top Selling</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {products.map((item, index) => (
              <Card
                key={index}
                className='overflow-hidden transition-shadow duration-300 hover:shadow-xl'>
                <CardContent className='p-0'>
                  <div className='relative' style={{ paddingTop: "150%" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                  <div className='p-4'>
                    <h3 className='font-bold text-lg'>{item.name}</h3>
                    <p className='text-sm text-gray-600 mb-2'>
                      {item.description}
                    </p>
                    <p className='font-bold text-lg'>{item.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
