// NewsCardBySource.js
import React from 'react';
import styled from 'styled-components';
import NewsItemBySource from './NewsItemBySource';

const CardContainer = styled.div`
  background: #FFF;
  border-radius: 25px; 
  color: #000;
  padding: 1rem;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const SourceHeader = styled.div`
  font-family: 'DomaineDisplay', serif;
  color: #000;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
`;

const SourceLink = styled.a`
  text-decoration: none;
  
`;

const SourceImage = styled.img`
  max-height: 30px;
`;

const NewsCardBySource = ({ sourceName, sourceId, sourceUrl, articles }) => (
  <CardContainer>
    <SourceHeader>
      <SourceLink href={sourceUrl} target="_blank" rel="noopener noreferrer">
        <SourceImage src={`/sources/${sourceId}.png`} alt={sourceName} />
      </SourceLink>
    </SourceHeader>
    {articles.map((article) => (
      <NewsItemBySource
        key={article.id}
        title={article.title}
        imageUrl={article.url_to_image}
        url={article.url}
        publishedAt={article.published_at}
      />
    ))}
  </CardContainer>
);

export default NewsCardBySource;
