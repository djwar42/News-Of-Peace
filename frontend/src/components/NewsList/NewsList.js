// NewsList.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NewsLayout from './NewsLayout';
import { fetchAndSortNewsByEndpoint } from '../../services/ApiFrontpage'; // Adjust the path as needed

const LoadingContainer = styled.div`
  text-align: center;
  margin-top: 200px;
`;

const NewsList = () => {
  const [newsData, setNewsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAndSortNewsByEndpoint()
      .then((data) => {
        setNewsData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  if (error) {
    return <LoadingContainer>Error loading articles: {error}</LoadingContainer>;
  }

  if (Object.keys(newsData).length === 0) {
    return <div>No articles to display</div>;
  }

  return <NewsLayout newsData={newsData} />;
};

export default NewsList;
