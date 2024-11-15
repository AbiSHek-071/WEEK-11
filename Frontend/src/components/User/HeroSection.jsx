import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchBannersApi } from "@/APIs/Banner/Banner";

const HeroSection = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  async function fetchBanners() {
    try {
      const response = await fetchBannersApi();
      setBanners(response?.data?.banners);
      console.log("banners", response.data.banners);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchBanners();
    let interval;
    if (isAutoplay && banners.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, banners.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoplay(false);
  };

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? banners.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setIsAutoplay(false);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === banners.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setIsAutoplay(false);
  };

  if (banners.length > 0) {
    return (
      <section className="relative w-full h-screen overflow-hidden">
        <AnimatePresence initial={false}>
          {banners.length > 0 && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img
                src={banners[currentIndex]?.image}
                alt={banners[currentIndex]?.title || "Banner"}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-24">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="max-w-lg absolute bottom-72 left-72"
                  >
                    <h2 className="text-5xl font-bold text-white mb-2">
                      {banners[currentIndex]?.title}
                    </h2>
                    <h3 className="text-4xl font-semibold text-white mb-4">
                      {banners[currentIndex]?.subtitle}
                    </h3>
                    <p className="text-2xl text-white mb-6">
                      {banners[currentIndex]?.advertisement}
                    </p>
                    <Button
                      onClick={() => {
                        navigate("/shop");
                      }}
                      size="lg"
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" /> SHOP NOW
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slider indicators */}
        <div className="absolute z-30 flex space-x-3 bottom-5 left-1/2 -translate-x-1/2">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-6" : "bg-white/50"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        {/* Slider controls */}
        <button
          type="button"
          className="absolute top-1/2 left-4 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
          onClick={goToPrevious}
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="sr-only">Previous</span>
        </button>
        <button
          type="button"
          className="absolute top-1/2 right-4 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
          onClick={goToNext}
        >
          <ChevronRight className="w-6 h-6" />
          <span className="sr-only">Next</span>
        </button>

        {/* Autoplay toggle */}
        <button
          type="button"
          className="absolute top-4 right-4 z-30 bg-black/30 hover:bg-black/50 text-white px-3 py-1 rounded-full text-sm transition-all duration-300"
          onClick={() => setIsAutoplay(!isAutoplay)}
        >
          {isAutoplay ? "Pause" : "Play"}
        </button>
      </section>
    );
  }
};

export default HeroSection;
