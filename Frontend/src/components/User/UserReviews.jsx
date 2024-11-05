import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axiosInstance from "@/AxiosConfig";

function UserReviews({ product, onReviewsUpdate }) {
  const userData = useSelector((store) => store.user.userDatas);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [userReviews, setUserReviews] = useState([]);
  const [message, setMessage] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(
        `/user/products/${product._id}/reviews`
      );
      setUserReviews(response.data.reviews);

      const totalReviews = response.data.reviews.length;
      const averageRating =
        response.data.reviews.reduce((sum, review) => sum + review.rating, 0) /
        totalReviews;

      onReviewsUpdate({ averageRating, totalReviews });
    } catch (err) {
      // console.log(err);
      if (err.response && err.response.status === 404) {
        return setMessage(err.response.data.message);
      }
      toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product._id, onReviewsUpdate]); // Remove reload dependency

  const handleRatingClick = (index) => {
    setRating(index + 1);
  };

  async function handleSubmitReview() {
    try {
      if (!userData) {
        return toast.error("You need to log in to post a review.");
      }
      const response = await axiosInstance.post("/user/product/review", {
        userId: userData._id,
        productId: product._id,
        rating,
        review,
      });
      await fetchReviews(); // Trigger re-fetch of reviews directly
      setReview("");
      setRating(0);

      return toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 400) {
        return toast.error(err.response.data.message);
      }
      if (err.response && err.response.status === 403) {
        return toast.error(err.response.data.message);
      }
      if (err.response && err.response.status === 404) {
        return toast.error(err.response.data.message);
      }
      toast.error("An error occurred. Please try again.");
    }
  }

  const handleShowMore = () => {
    setShowAllReviews(true);
  };

  const handleShowLess = () => {
    setShowAllReviews(false);
  };

  const visibleReviews = showAllReviews ? userReviews : userReviews.slice(0, 3);

  return (
    <div className='container mx-auto px-4 md:px-6 lg:px-8 py-8'>
      <h2 className='text-2xl font-bold mb-6'>Reviews</h2>
      {message&& <span>{message}</span>}
      <div className='space-y-4 mb-8'>
        {visibleReviews.map((review) => (
          <Card key={review._id} className='w-full'>
            <CardContent className='p-4'>
              <div className='flex items-center mb-2'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className='ml-2 text-sm text-gray-600'>
                  {review.rating} out of 5
                </span>
              </div>
              <h3 className='font-semibold text-lg'>{review.user.name}</h3>
              <p className='text-gray-700 mt-2'>{review.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {userReviews.length > 3 && !showAllReviews && (
        <div className='flex justify-center'>
          <span
            className='cursor-pointer font-bold text-blue-500 hover:text-blue-700'
            onClick={handleShowMore}>
            Show More
          </span>
        </div>
      )}
      {showAllReviews && userReviews.length > 3 && (
        <div className='flex justify-center'>
          <span
            className='cursor-pointer font-bold text-blue-500 hover:text-blue-700'
            onClick={handleShowLess}>
            Show Less
          </span>
        </div>
      )}

      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-4'>Write a Review</h2>
        <div className='space-y-4'>
          <div>
            <p className='mb-2'>How's the product? Post your opinion here...</p>
            <div className='flex items-center'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  onClick={() => handleRatingClick(i)}
                  className={`w-8 h-8 cursor-pointer ${
                    i < rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <p className='ml-4 text-lg'>Rating: {rating} out of 5</p>
            </div>
          </div>
          <div>
            <p className='mb-2'>Review Content</p>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder='Write your review here...'
              className='w-full min-h-[100px]'
            />
          </div>
          <Button
            onClick={handleSubmitReview}
            className='w-full sm:w-auto px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md transition duration-300'>
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserReviews;
