import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

type InteractiveLogoProps = {
  /** Use when the logo is on a dark background (e.g. dark hero) so the hint is visible */
  dark?: boolean;
};

const InteractiveLogo = ({ dark }: InteractiveLogoProps) => {
  const navigate = useNavigate();
  const [showHint, setShowHint] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hintVisible = showHint || isHovered;

  // Show "Click to login" after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 5000);
    return () => clearTimeout(t);
  }, []);

  // Wobbly floating animation with randomized values
  const floatingVariants = {
    floating: {
      y: [0, -12, -8, -15, -10, 0],
      x: [0, 3, -2, 4, -3, 0],
      rotate: [0, 1.5, -1, 2, -1.5, 0],
    }
  };

  const handleClick = () => {
    navigate("/auth#login");
  };

  return (
    <div className="flex justify-center mb-8 py-10">
      <motion.div
        className="relative cursor-pointer group"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="relative w-32 h-32 md:w-40 md:h-40"
          variants={floatingVariants}
          animate="floating"
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Ambient Glow - darker shadow when on dark background */}
          <div
            className={`absolute inset-0 rounded-full blur-2xl animate-pulse ${dark ? "bg-orange-600/40 shadow-[0_0_60px_rgba(0,0,0,0.5)]" : "bg-gradient-to-r from-orange-400 to-orange-600 opacity-30"}`}
          />

          {/* Logo - darker drop shadow in dark mode so it reads on dark bg */}
          <img
            src="/claude-logo.png"
            alt="Claude Logo"
            className={`relative w-full h-full object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_30px_rgba(300,122,14,0.8)] ${dark ? "drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)]" : "drop-shadow-2xl"}`}
          />

          {/* Click hint - appears after 3s or on hover (hover shows it earlier) */}
          <motion.div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 10,
              opacity: hintVisible ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <span className={`text-xs font-medium whitespace-nowrap ${dark ? "text-gray-400" : "text-muted-foreground"}`}>
              Click to login
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InteractiveLogo;