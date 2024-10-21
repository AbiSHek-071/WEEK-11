import React, { useState } from "react";
import { Star, Heart, Minus, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function Product() {
  const [mainImage, setMainImage] = useState(
    "https://res.cloudinary.com/dneqndzyc/image/upload/v1729063471/gng8no4sv7ioevnzqzvv.jpg"
  );
  const [quantity, setQuantity] = useState(1);

  const thumbnails = [
    "https://res.cloudinary.com/dneqndzyc/image/upload/v1729083721/z8qdighg4i7c9p4lnc5o.jpg",
    "https://res.cloudinary.com/dneqndzyc/image/upload/v1729083721/z8qdighg4i7c9p4lnc5o.jpg",
    "https://res.cloudinary.com/dneqndzyc/image/upload/v1729083721/z8qdighg4i7c9p4lnc5o.jpg",
    "https://res.cloudinary.com/dneqndzyc/image/upload/v1729083721/z8qdighg4i7c9p4lnc5o.jpg",
  ];

  const relatedProducts = [
    { name: "H&M Oversized Grey Relaxed Fit", price: "INR 1299" },
    { name: "H&M Oversized Grey Relaxed Fit", price: "INR 1299" },
    { name: "H&M Oversized Grey Relaxed Fit", price: "INR 1299" },
    { name: "H&M Oversized Grey Relaxed Fit", price: "INR 1299" },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid md:grid-cols-2 gap-8'>
        {/* Product Images */}
        <div>
          <div style={{width:"500px"}}>
            <img
              src={mainImage}
              alt='Glinter Black Hoodie'
              className='object-contain w-full h-auto rounded-lg mb-4'
            />
          </div>
          <div className='grid grid-cols-4 gap-2'>
            {thumbnails.map((thumb, index) => (
              <img
                key={index}
                src={thumb}
                alt={`Thumbnail ${index + 1}`}
                className='w-full h-auto rounded-lg cursor-pointer'
                onClick={() => setMainImage(thumb)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className='text-3xl font-bold mb-2'>Glinter Black Hoodie</h1>
          <p className='text-gray-600 mb-2'>Men's winter hoodie collection</p>
          <div className='flex items-center mb-2'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className='w-5 h-5 fill-yellow-400 text-yellow-400'
              />
            ))}
            <span className='ml-2 text-gray-600'>(5,007 Reviews)</span>
          </div>
          <p className='text-2xl font-bold mb-4'>INR 1699.00</p>
          <p className='mb-4'>
            Stay warm and stylish with our men's winter hoodie collection.
            Crafted from premium materials, this hoodie offers a cozy fit and
            sleek design, perfect for any casual outing.
          </p>

          <div className='mb-4'>
            <p className='font-semibold mb-2'>Size</p>
            <div className='flex space-x-2'>
              {["S", "M", "L", "XL"].map((size) => (
                <Button key={size} variant='outline'>
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div className='flex items-center space-x-4 mb-4'>
            <div className='flex items-center border rounded-md'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className='h-4 w-4' />
              </Button>
              <span className='px-4'>{quantity}</span>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setQuantity(quantity + 1)}>
                <Plus className='h-4 w-4' />
              </Button>
            </div>
            <Button className='flex-grow'>ADD TO CART</Button>
            <Button variant='outline' size='icon'>
              <Heart className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Description and Additional Information */}
      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-4'>Descriptions</h2>
        <p className='mb-4'>
          Elevate your winter wardrobe with our Glinter Black Hoodie, designed
          for the modern man who values both style and comfort. Crafted from
          high-quality, durable fabric, this hoodie offers excellent warmth and
          insulation during colder months, making it the perfect go-to piece for
          casual outings or relaxed days at home.
        </p>
        <h3 className='text-xl font-bold mb-2'>Additional Information</h3>
        <ul className='list-disc list-inside mb-4'>
          <li>Color: Black</li>
          <li>Size: Large (L)</li>
          <li>Material: High-quality cotton blend for warmth and durability</li>
        </ul>
      </div>

      {/* Reviews */}
      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-4'>Reviews</h2>
        {[1, 2].map((review) => (
          <Card key={review} className='mb-4'>
            <CardContent className='p-4'>
              <div className='flex items-center mb-2'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-5 h-5 fill-yellow-400 text-yellow-400'
                  />
                ))}
              </div>
              <h3 className='font-bold'>Sarah M.</h3>
              <p>
                Absolutely love this hoodie! The material is super soft and
                keeps me warm during chilly days. The fit is perfect—not too
                tight and not too loose, and the black color goes with
                everything. The hoodie is stylish enough to wear out but also
                comfortable for lounging at home. The front pocket is spacious,
                and the drawstring hood adds a nice touch. Overall, this is
                easily one of the best hoodies I've owned. Highly recommend it
                for anyone looking for a cozy yet sleek winter staple!
              </p>
            </CardContent>
          </Card>
        ))}
        <Button variant='outline' className='w-full'>
          Show More
        </Button>
      </div>

      {/* Write a Review */}
      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-4'>Write a Review</h2>
        <div className='mb-4'>
          <p className='mb-2'>What is it like to Product?</p>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className='w-6 h-6 text-gray-300 cursor-pointer' />
            ))}
          </div>
        </div>
        <div className='mb-4'>
          <p className='mb-2'>Review Content</p>
          <Textarea
            placeholder='Write your review here...'
            className='w-full'
          />
        </div>
        <Button className='bg-yellow-400 text-black hover:bg-yellow-500'>
          Submit Review
        </Button>
      </div>

      {/* Related Products */}
      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-4'>Related Product</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {relatedProducts.map((product, index) => (
            <Card key={index}>
              <CardContent className='p-4'>
                <img
                  src='/placeholder.svg?height=200&width=200'
                  alt={product.name}
                  className='w-full h-auto mb-2 rounded-lg'
                />
                <h3 className='font-semibold'>{product.name}</h3>
                <p>{product.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
