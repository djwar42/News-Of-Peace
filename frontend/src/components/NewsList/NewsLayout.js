// NewsLayout.js
import React, { useState, useEffect } from 'react';
import FrontPageDesktop from './FrontPageDesktop';
import FrontPageMobile from './FrontPageMobile';

const NewsLayout = ({ newsData }) => {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    viewportWidth <= 1024 ? 
    <FrontPageMobile newsData={newsData} /> : 
    <FrontPageDesktop newsData={newsData} />
  );
};

export default NewsLayout;
