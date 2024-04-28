// NewsListBySource.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NewsCard from './NewsCardBySource';
import { fetchArticles } from '../../services/api';

const ListHeading = styled.h1`
  font-size: 1.5rem;
  font-weight: 400;
  max-width: 1120px;
  margin: 1.5rem auto 0 auto;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
  align-items: start;
  padding: 7px;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: 1220px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 12px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 12px;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  margin-top: 200px;
`;

const NewsListBySource = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles()
      .then((data) => {
        setArticles(data);
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

  const articlesBySource = articles.reduce((acc, article) => {
    // Initialize source if not already in accumulator
    acc[article.source_id] = acc[article.source_id] || {
      source_name: article.source_name,
      source_url: article.source_url,
      source_id: article.source_id,
      articles: []
    };
    // Add article to the source
    acc[article.source_id].articles.push(article);
    return acc;
  }, {});

  // Sort articles within each source by order_within_source
  for (const source in articlesBySource) {
    articlesBySource[source].articles.sort((a, b) => a.order_within_source - b.order_within_source);
  }

  // Convert object to array and sort by source name alphabetically
  const sortedSources = Object.entries(articlesBySource)
    .sort((a, b) => a[1].source_name.localeCompare(b[1].source_name));
    
  return (
    <>
      <ListHeading>News By Source</ListHeading>
      <ListContainer>
      {sortedSources.map(([sourceId, sourceData]) => (
        <NewsCard
          key={sourceId}
          sourceName={sourceData.source_name}
          sourceId={sourceData.source_id}
          sourceUrl={sourceData.source_url}
          articles={sourceData.articles}
        />
      ))}
    </ListContainer>
    </>
  );
};

export default NewsListBySource;
