// NewsItemBySource.js
import React from 'react';
import styled, { css } from 'styled-components';
import { formatDistanceStrict, parseISO } from 'date-fns';

const ItemContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem 0;
  border-top: 1px solid #CCC;
  text-decoration: none;

  &:last-child {
    padding: 1rem 0 0.3rem 0;
  }
`;

const imageStyles = css`
  width: 70px;
  height: 70px;
  min-width: 70px;
  min-height: 70px;
  border-radius: 8px;
  margin-left: 1rem;
  background-color: #757575; 
`;

const Image = styled.img`
  ${imageStyles}
  object-fit: cover;
`;

const Placeholder = styled.div`
  ${imageStyles}
`;

const TitleContainer = styled.div`
  position: relative;
`;

const Title = styled.h3`
  font-size: 1rem; 
  color: #000; 
  margin: 0; 
  font-weight: normal; 
  flex: 1; 
  min-height: 50px;

  a {
    text-decoration: none;
    color: #000;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const DateText = styled.div`
  font-size: 0.7rem;
  color: #aaa;
  padding-top: 7px;
`;

const NewsItemBySource = ({ title, imageUrl, url, publishedAt }) => {
  const timeAgo = formatDistanceStrict(parseISO(publishedAt), new Date());

  return (
    <ItemContainer>
      <TitleContainer>
        <Title><a href={url} target="_blank" rel="noopener noreferrer">{title}</a></Title>
        <DateText>{timeAgo} ago</DateText>
      </TitleContainer>

      <a href={url} target="_blank" rel="noopener noreferrer">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} loading="lazy" />
        ) : (
          <Placeholder></Placeholder>
        )}
      </a>
    </ItemContainer>
  );
};

export default NewsItemBySource;
