// FrontPageMobile.js
import React from 'react';
import { Cell, MobileFrontPage, SectionTitleMobile, SectionTitleMobileTop, ArticleContainer, ArticleContainerTiny, ArticleContainerLarge, Category, Title, Content, Time, Image, Link, SourceImage, Spacer, ArticleTinyImageTile } from './FrontPageStyles';
import { formatDistanceStrict, parseISO } from 'date-fns';


const FrontPageMobile = ({ newsData }) => {

  // Data arrays
  const topFrontpageNews = newsData['top_frontpage_news'] || [];
  const politics_frontpage_news = newsData['politics_frontpage_news'] || [];
  const science_frontpage_news = newsData['science_frontpage_news'] || [];
  const technology_frontpage_news = newsData['technology_frontpage_news'] || [];
  const environment_frontpage_news = newsData['environment_frontpage_news'] || [];
  const entertainment_frontpage_news = newsData['entertainment_frontpage_news'] || [];
  const business_frontpage_news = newsData['business_frontpage_news'] || [];
  const health_frontpage_news = newsData['health_frontpage_news'] || [];
  const law_and_order_frontpage_news = newsData['law_and_order_frontpage_news'] || [];
  const sports_frontpage_news = newsData['sports_frontpage_news'] || [];
  const education_frontpage_news = newsData['education_frontpage_news'] || [];
  const lifestyle_frontpage_news = newsData['lifestyle_frontpage_news'] || [];
  

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
        {sectionTitle && <SectionTitleMobile>{sectionTitle}</SectionTitleMobile>}
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
      <SectionTitleMobileTop>Top News</SectionTitleMobileTop>
      {renderSection("", topFrontpageNews)}
      {renderSection("Politics", politics_frontpage_news)}
      {renderSection("Science", science_frontpage_news)}
      {renderSection("Technology", technology_frontpage_news)}
      {renderSection("Environment", environment_frontpage_news)}
      {renderSection("Entertainment", entertainment_frontpage_news)}
      {renderSection("Business", business_frontpage_news)}
      {renderSection("Health", health_frontpage_news)}
      {renderSection("Law and Order", law_and_order_frontpage_news)}
      {renderSection("Sports", sports_frontpage_news)}
      {renderSection("Education", education_frontpage_news)}
      {renderSection("Lifestyle", lifestyle_frontpage_news)}
    </>
  );
};

export default FrontPageMobile;
