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
      <section className="relative w-full h-[80vh] sm:h-screen  overflow-hidden">
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
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-16 sm:pb-20 md:pb-24">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl absolute bottom-16 sm:bottom-24 md:bottom-32 lg:bottom-72 left-4 sm:left-8 md:left-16 lg:left-72"
                  >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                      {banners[currentIndex]?.title}
                    </h2>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-2 sm:mb-4">
                      {banners[currentIndex]?.subtitle}
                    </h3>
                    <p className="text-sm sm:text-xl md:text-2xl text-white mb-4 sm:mb-6">
                      {banners[currentIndex]?.advertisement}
                    </p>
                    <Button
                      onClick={() => {
                        navigate("/shop");
                      }}
                      size="lg"
                      className="bg-white text-black hover:bg-gray-200 text-sm sm:text-base"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />{" "}
                      SHOP NOW
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slider indicators */}
        <div className="absolute z-30 flex space-x-2 sm:space-x-3 bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-4 sm:w-6" : "bg-white/50"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        {/* Slider controls */}
        <button
          type="button"
          className="absolute top-1/2 left-2 sm:left-4 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 sm:p-2 rounded-full transition-all duration-300"
          onClick={goToPrevious}
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          <span className="sr-only">Previous</span>
        </button>
        <button
          type="button"
          className="absolute top-1/2 right-2 sm:right-4 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 sm:p-2 rounded-full transition-all duration-300"
          onClick={goToNext}
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          <span className="sr-only">Next</span>
        </button>

        {/* Autoplay toggle */}
        <button
          type="button"
          className="absolute top-2 sm:top-4 right-2 sm:right-4 z-30 bg-black/30 hover:bg-black/50 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm transition-all duration-300"
          onClick={() => setIsAutoplay(!isAutoplay)}
        >
          {isAutoplay ? "Pause" : "Play"}
        </button>
      </section>
    );
  }
};

export default HeroSection;
