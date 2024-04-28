// NewsLayoutCategory.js
import React, { useState, useEffect } from 'react';
import FrontPageCategoryDesktop from './FrontPageCategoryDesktop';
import FrontPageCategoryMobile from './FrontPageCategoryMobile';

const NewsLayoutCategory = ({ newsData, category_name }) => {
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
    <FrontPageCategoryMobile newsData={newsData} category_name={category_name} /> : 
    <FrontPageCategoryDesktop newsData={newsData} category_name={category_name} />
  );
};

export default NewsLayoutCategory;
