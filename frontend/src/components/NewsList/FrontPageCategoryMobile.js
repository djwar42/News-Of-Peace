// FrontPageMobile.js
import React from 'react';
import { Cell, MobileFrontPage, SectionTitleMobile, SectionTitleMobileTop, ArticleContainer, ArticleContainerTiny, ArticleContainerLarge, Category, Title, Content, Time, Image, Link, SourceImage, Spacer, ArticleTinyImageTile } from './FrontPageStyles';
import { formatDistanceStrict, parseISO } from 'date-fns';


const FrontPageMobile = ({ newsData, category_name }) => {

  const renderArticleTypeTiny = (article, withImage, withContent, withSpacer) => (
    <ArticleContainerTiny key={article.id}>
      <SourceImage src={`/sources/${article.source_id}.png`} alt={article.source_name} />
      {/* <Category>{article.category}</Category> */}
      <ArticleTinyImageTile>
      <Link href={article.url} target="_blank" rel="noopener noreferrer">
        <Title>{article.title}</Title>
      </Link>
      <Image src={article.url_to_image} alt={article.title} loading="lazy" />
      </ArticleTinyImageTile>
      {withContent && <Content>{article.content}</Content>}
      <Time>{formatDistanceStrict(parseISO(article.published_at), new Date())} ago</Time>
      {withSpacer && <Spacer />}
    </ArticleContainerTiny>
  );

  const renderSection = (sectionTitle, sectionData) => {
    return (
      <>
        {sectionTitle && <SectionTitleMobileTop>{sectionTitle}</SectionTitleMobileTop>}
        <MobileFrontPage>
          {sectionData.map((article, index) => (
            <Cell key={article.id}>
              {renderArticleTypeTiny(article, index <= 3)}
            </Cell>
          ))}
        </MobileFrontPage>
      </>
    );
  };

  return (
    <>
      {renderSection(category_name, newsData)}
    </>
  );
};

export default FrontPageMobile;
