// FrontPageDesktop.js
import React from 'react';
import { Cell, FrontPage, MidPage, SectionTitle, SectionTitleTop, ArticleContainer, ArticleContainerTiny, ArticleContainerLarge, Category, Title, Content, Time, Image, Link, SourceImage, Spacer, ArticleTinyImageTile } from './FrontPageStyles';
import { formatDistanceStrict, parseISO } from 'date-fns';


const FrontPageDesktop = ({ newsData, category_name }) => {

  const renderArticleTypeLarge = (article, withImage, withContent, withSpacer) => (
    <ArticleContainerLarge key={article.id}>
      {withImage && <Image src={article.url_to_image} alt={article.title} loading="lazy" />}
      <SourceImage src={`/sources/${article.source_id}.png`} alt={article.source_name} />
      {/* <Category>{article.category}</Category> */}
      <Link href={article.url} target="_blank" rel="noopener noreferrer">
        <Title>{article.title}</Title>
      </Link>
      {withContent && <Content>{article.content}</Content>}
      <Time>{formatDistanceStrict(parseISO(article.published_at), new Date())} ago</Time>
      {withSpacer && <Spacer />}
    </ArticleContainerLarge>
  );

  const renderArticleTypeNormal = (article, withImage, withContent, withSpacer) => (
    <ArticleContainer key={article.id}>
      {withImage && <Image src={article.url_to_image} alt={article.title} loading="lazy" />}
      <SourceImage src={`/sources/${article.source_id}.png`} alt={article.source_name} />
      {/* <Category>{article.category}</Category> */}
      <Link href={article.url} target="_blank" rel="noopener noreferrer">
        <Title>{article.title}</Title>
      </Link>
      {withContent && <Content>{article.content}</Content>}
      <Time>{formatDistanceStrict(parseISO(article.published_at), new Date())} ago</Time>
      {withSpacer && <Spacer />}
    </ArticleContainer>
  );
  
  const renderArticleTypeTiny = (article, withImage, withContent, withSpacer) => (
    <ArticleContainerTiny key={article.id}>
      {/* {withImage && } */}
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


  const renderMidSection = (sectionData) => {
    return (
      <>
        <MidPage>
          {/* Row of 3 */}
          <Cell style={{ gridArea: '1 / 1 / span 1 / span 1' }}>
            {renderArticleTypeTiny(sectionData[0], true, false, false, false)}
          </Cell>
          
          <Cell style={{ gridArea: '1 / 2 / span 1 / span 1' }}>
            {renderArticleTypeTiny(sectionData[1], true, false, false, false)}
          </Cell>

          <Cell style={{ gridArea: '1 / 3 / span 1 / span 1' }}>
            {renderArticleTypeTiny(sectionData[2], true, false, false, false)}
          </Cell>

          {/* Row of 3 */}
          <Cell style={{ gridArea: '2 / 1 / span 1 / span 1' }}>
            {renderArticleTypeTiny(sectionData[3], true, false, false, false)}
          </Cell>
          
          <Cell style={{ gridArea: '2 / 2 / span 1 / span 1' }}>
            {renderArticleTypeTiny(sectionData[4], true, false, false, false)}
          </Cell>

          <Cell style={{ gridArea: '2 / 3 / span 1 / span 1' }}>
            {renderArticleTypeTiny(sectionData[5], true, false, false, false)}
          </Cell>

          {/* Row of 3 */}
          <Cell style={{ gridArea: '3 / 1 / span 1 / span 1' }}>
            {renderArticleTypeTiny(sectionData[6], true, false, false, false)}
          </Cell>
          
          <Cell style={{ gridArea: '3 / 2 / span 1 / span 1' }}>
            {renderArticleTypeTiny(sectionData[7], true, false, false, false)}
          </Cell>

          <Cell style={{ gridArea: '3 / 3 / span 1 / span 1' }}>
            {renderArticleTypeTiny(sectionData[8], true, false, false, false)}
          </Cell>

        </MidPage>
      </>
    );
  };


  const renderTopSection = (sectionData) => {
    return (
      <>
        <FrontPage>
          {/* Left 2 Articles */}
          <Cell style={{ gridArea: '1 / 1 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[1], true, false, false)}
          </Cell>

          <Cell style={{ gridArea: '2 / 1 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[2], true, false, false)}
          </Cell>
          
          {/* Main Article */}
          <Cell style={{ gridArea: '1 / 2 / span 2 / span 2' }}>
            {renderArticleTypeLarge(sectionData[0], true, false, false)}
          </Cell>
          
          {/* Right 2 Articles */}
          <Cell style={{ gridArea: '1 / 4 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[3], true, false, false)}
          </Cell>

          <Cell style={{ gridArea: '2 / 4 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[4], true, false, false)}
          </Cell>
          
          {/* Row of 4 */}
          <Cell style={{ gridArea: '3 / 1 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[5], true, false, false, false)}
          </Cell>
          
          <Cell style={{ gridArea: '3 / 2 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[6], true, false, false, false)}
          </Cell>

          <Cell style={{ gridArea: '3 / 3 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[7], true, false, false, false)}
          </Cell>

          <Cell style={{ gridArea: '3 / 4 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[8], true, false, false, false)}
          </Cell>

          {/* Row of 4 */}
          <Cell style={{ gridArea: '4 / 1 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[0], true, false, false, false)}
          </Cell>
          
          <Cell style={{ gridArea: '4 / 2 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[10], true, false, false, false)}
          </Cell>

          <Cell style={{ gridArea: '4 / 3 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[11], true, false, false, false)}
          </Cell>

          <Cell style={{ gridArea: '4 / 4 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[12], true, false, false, false)}
          </Cell>

          {/* Row of 4 */}
          <Cell style={{ gridArea: '4 / 1 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[13], true, false, false, false)}
          </Cell>
          
          <Cell style={{ gridArea: '4 / 2 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[14], true, false, false, false)}
          </Cell>

          <Cell style={{ gridArea: '4 / 3 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[15], true, false, false, false)}
          </Cell>

          <Cell style={{ gridArea: '4 / 4 / span 1 / span 1' }}>
            {renderArticleTypeNormal(sectionData[16], true, false, false, false)}
          </Cell>
        </FrontPage>
      </>
    )
  };  

  {/* 1: first grid row.
    2: second grid column.
    span 2: across two rows
    span 2: across two columns */}

  return (
    <>
      {/* Top Frontpage News Section */}
      <SectionTitleTop>{category_name}</SectionTitleTop>
      {renderTopSection(newsData.slice(0, 17))}

      <div style={{height: '100px'}}></div>
      {renderMidSection(newsData.slice(17))}

      <div style={{height: '100px'}}></div>
      {renderMidSection(newsData.slice(26))}

      <div style={{height: '100px'}}></div>
      {renderMidSection(newsData.slice(35))}

      <div style={{height: '100px'}}></div>
      {renderMidSection(newsData.slice(44))}

      {/* <div style={{height: '100px'}}></div>
      {renderMidSection(newsData.slice(53))} */}

    </>
  );
};

export default FrontPageDesktop;
