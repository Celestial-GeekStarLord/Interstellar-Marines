import React from 'react';
import { motion } from 'framer-motion';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="landing-title"
        >
          Welcome to StarTrek
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="landing-description"
        >
          Explore the universe with StarTrek. NASA’s images capture billions of pixels, far beyond what your screen can show. With our platform, you can zoom, label, and interactively explore ultra-high-resolution images—even using hand gestures to navigate and uncover cosmic details like never before.    </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="landing-actions"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
            onClick={() => onNavigate('home')}
          >
            View
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary"
            onClick={() => onNavigate('navigate')}
          >
            Navigate
          </motion.button>
        </motion.div>
      </div>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
          color: #fff;
        }

        .landing-content {
          max-width: 900px;
          text-align: center;
          background: rgba(0, 0, 0, 0.4);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        .landing-title {
          font-size: 56px;
          font-weight: 900;
          background: linear-gradient(90deg, #ff6ec4, #7873f5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 24px;
        }

        .landing-description {
          font-size: 18px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 48px;
        }

        .landing-actions {
          display: flex;
          gap: 24px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 14px 32px;
          font-size: 18px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ff6ec4 0%, #7873f5 100%);
          color: #fff;
        }

        .btn-primary:hover {
          box-shadow: 0 8px 20px rgba(255, 110, 196, 0.5);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 2px solid #fff;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
          .landing-title {
            font-size: 40px;
          }

          .landing-description {
            font-size: 16px;
          }

          .landing-actions {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
