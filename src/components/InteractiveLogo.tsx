import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const InteractiveLogo = () => {
  const navigate = useNavigate();

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
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 blur-2xl opacity-30 animate-pulse rounded-full" />

          {/* Logo */}
          <img
            src="/claude-logo.png"
            alt="Claude Logo"
            className="relative w-full h-full object-contain drop-shadow-2xl transition-transform duration-300 group-hover:drop-shadow-[0_0_30px_rgba(251,146,60,0.5)]"
          />

          {/* Click hint - appears on hover */}
          <motion.div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ y: 10 }}
            whileHover={{ y: 0 }}
          >
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              Click to login
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InteractiveLogo;