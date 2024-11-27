import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PageNotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  const textVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
  };

  const gearVariants = {
    animate: (custom) => ({
      rotate: 360,
      transition: {
        duration: custom,
        repeat: Infinity,
        ease: "linear",
      },
    }),
  };

  const Gear = ({ size, duration, className }) => (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      variants={gearVariants}
      animate="animate"
      custom={duration}
    >
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </motion.svg>
  );

  return (
    <motion.div
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden relative"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <Gear
            size={24}
            duration={15}
            className="w-16 h-16 text-gray-700 opacity-20"
          />
        </div>
        <div className="absolute right-1/4 top-1/3 transform translate-x-1/2 -translate-y-1/2">
          <Gear
            size={16}
            duration={10}
            className="w-12 h-12 text-gray-700 opacity-20"
          />
        </div>
        <div className="absolute left-1/3 bottom-1/4 transform -translate-x-1/2 translate-y-1/2">
          <Gear
            size={20}
            duration={12}
            className="w-14 h-14 text-gray-700 opacity-20"
          />
        </div>
        <div className="absolute right-1/3 bottom-1/3 transform translate-x-1/2 translate-y-1/2">
          <Gear
            size={18}
            duration={8}
            className="w-10 h-10 text-gray-700 opacity-20"
          />
        </div>
      </div>

      <motion.div className="text-center z-10" variants={textVariants}>
        <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 tracking-tighter">
          404
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 tracking-wide">
          Oops! Page not found
        </p>
      </motion.div>

      <motion.div className="relative" variants={textVariants}>
        <Gear
          size={24}
          duration={20}
          className="w-32 h-32 md:w-40 md:h-40 text-gray-200 opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <Gear
          size={24}
          duration={15}
          className="w-24 h-24 md:w-32 md:h-32 text-gray-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <Button
          onClick={() => navigate("/")}
          className="relative z-10 bg-white text-gray-900 hover:bg-gray-200 transition-colors duration-300 font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
        >
          Go Back Home
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PageNotFound;
