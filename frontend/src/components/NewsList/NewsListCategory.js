// NewsListCategory.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NewsLayoutCategory from './NewsLayoutCategory';
import { fetchAndSortNewsByEndpoint } from '../../services/ApiCategory';

const LoadingContainer = styled.div`
  text-align: center;
  margin-top: 200px;
`;

const NewsListCategory = ({ category, category_name }) => {
  const [categoryNews, setCategoryNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    fetchAndSortNewsByEndpoint(category)
      .then(data => {
        // As we are fetching a single category, data will be an object with a single key (category)
        setCategoryNews(data[category] || []);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [category]); // Dependency array ensures the effect runs again if the category prop changes

  if (isLoading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  if (error) {
    return <LoadingContainer>Error loading articles: {error}</LoadingContainer>;
  }

  if (categoryNews.length === 0) {
    return <div>No articles to display in this category</div>;
  }

  return <NewsLayoutCategory newsData={categoryNews} category_name={category_name} />;
};

export default NewsListCategory;
