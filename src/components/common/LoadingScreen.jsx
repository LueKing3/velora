import { motion, AnimatePresence } from 'framer-motion';
import './LoadingScreen.css';

const LoadingScreen = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
        >
          <div className="loading-bg-orb loading-bg-orb-1" />
          <div className="loading-bg-orb loading-bg-orb-2" />

          <motion.div
            className="loading-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div className="loading-logo-container">
              <motion.div
                className="loading-logo-ring"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="loading-logo-ring loading-logo-ring-2"
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              <div className="loading-logo-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2L28 8V24L16 30L4 24V8L16 2Z" stroke="url(#logoGrad)" strokeWidth="1.5" fill="none"/>
                  <path d="M16 8L22 11V21L16 24L10 21V11L16 8Z" fill="url(#logoGrad)" opacity="0.3"/>
                  <path d="M16 12L19 13.5V18.5L16 20L13 18.5V13.5L16 12Z" fill="url(#logoGrad)"/>
                  <defs>
                    <linearGradient id="logoGrad" x1="4" y1="2" x2="28" y2="30">
                      <stop stopColor="#34d399"/>
                      <stop offset="1" stopColor="#06b6d4"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>

            <motion.h1
              className="loading-title"
              initial={{ opacity: 0, letterSpacing: '0.3em' }}
              animate={{ opacity: 1, letterSpacing: '0.15em' }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              VELORA
            </motion.h1>

            <motion.p
              className="loading-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Take control of your money
            </motion.p>

            <motion.div
              className="loading-bar-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="loading-bar"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.9, duration: 1.2, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
