import { Star } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import axiosInstance from '@/AxiosConfig';
import Product from './Product';

function UserReviews({product,onReviewsUpdate}) {
   

  

const userData = useSelector((store) => store.user.userDatas);
const [reload,setReload] = useState(false)
const [rating, setRating] = useState(0);
const[review,setReview] = useState("")
const [userReviews,setUserReviews] = useState([])
const [message, setMessage] = useState(null);
  useEffect(() => {
    setReload(false);
    async function fetchRevies() {
      try {
        const response = await axiosInstance.get(
          `/user/products/${product._id}/reviews`
        );
        setUserReviews(response.data.reviews);

        const totalReviews = response.data.reviews.length;
        const averageRating =
          response.data.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / totalReviews;

        onReviewsUpdate({ averageRating, totalReviews });
      } catch (err) {
        console.log(err);

        if (err.response && err.response.status === 404) {
          return setMessage(err.response.data.message);
        }
        toast.error("An error occurred. Please try again.");
      }
    }
    fetchRevies();
  }, [reload]);
  const handleRatingClick = (index) => {
    setRating(index + 1); 
  };
  async function handleSubmitReview() {
    try {      
      if(!userData){
        return toast.error("You need to log in to post a review.");
      }     
      const response = await axiosInstance.post("/user/product/review", {
        userId: userData._id,
        productId: product._id,
        rating,
        review,
      });
      setReload(true)
      return toast.success(response.data.message);
    } catch (err) {
      console.log(err);
        if (err.response && err.response.status === 400) {
          return toast.error(err.response.data.message);
        }
      if (err.response && err.response.status === 404) {
        return toast.error(err.response.data.message);
      }
      toast.error("An error occurred. Please try again.");
    }
  }

  const [visibleReviews, setVisibleReviews] = useState(3); // Initially show 3 reviews
  const totalReviews = userReviews.length;

  
  const handleShowMore = () => {
    setVisibleReviews(totalReviews);
  };
  const handleShowLess = ()=>{
    setVisibleReviews(3); 
  }

  return (
    <>
      <div className='mt-12 px-52'>
        <h2 className='text-2xl font-bold mb-4'>Reviews</h2>
        {/* Display only the number of reviews as per visibleReviews */}
        {userReviews.slice(0, visibleReviews).map((review) => (
          <Card key={review._id} className='mb-4'>
            <CardContent className='p-4'>
              <div className='flex items-center mb-2'>
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-5 h-5 fill-yellow-400 text-yellow-400'
                  />
                ))}
              </div>
              <h3 className='font-bold'>{review.user.name}</h3>
              <p>{review.description}</p>
            </CardContent>
          </Card>
        ))}

        {/* Step 3: Conditionally render "Show More" button if there are more reviews */}
        {visibleReviews < totalReviews && (
          <div className='flex justify-center'>
            <span
              className='cursor-pointer font-bold text-blue-500'
              onClick={handleShowMore}>
              Show More
            </span>
          </div>
        )}
        {visibleReviews == totalReviews && (
          <div className='flex justify-center'>
            <span
              className='cursor-pointer font-bold text-blue-500'
              onClick={handleShowLess}>
              Show Less
            </span>
          </div>
        )}
      </div>

      {/* Write a Review */}
      <div className='mt-12 px-52 mb-12'>
        <h2 className='text-2xl font-bold mb-4'>Write a Review</h2>
        <div className='mb-4'>
          <p className='mb-2'>How's the product, Post your opinion here...?</p>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                onClick={() => handleRatingClick(i)}
                className={`w-7 h-7 cursor-pointer ${
                  i < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}

            <p className='ml-4'>Rating: {rating} out of 5</p>
          </div>
        </div>
        <div className='mb-4'>
          <p className='mb-2'>Review Content</p>
          <Textarea
            onChange={(e) => {
              setReview(e.target.value);
            }}
            placeholder='Write your review here...'
            className='w-full'
          />
        </div>
        <Button onClick={handleSubmitReview} className=' hover:bg-yellow-500'>
          Submit Review
        </Button>
      </div>
    </>
  );
}

export default UserReviews