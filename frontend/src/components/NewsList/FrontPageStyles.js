import styled from 'styled-components';

export const Cell = styled.div`
  padding: 20px;
  background-color: #FFF;
  border-radius: 10px;
`;

export const FrontPage = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 7px;
  background-color: #fef1e5;
  max-width: 1280px;
  margin: 0 auto;
`;

export const MidPage = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 7px;
  background-color: #fef1e5;
  max-width: 1280px;
  margin: 0 auto;
`;

export const MobileFrontPage = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 7px;
  background-color: #fef1e5;
  margin: 0 auto;
`;

export const SectionTitle = styled.h1`
  max-width: 1280px;
  margin: 100px auto 10px auto;
  padding-left: 30px;
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
  font-family: 'DomaineDisplay',serif;
`;

export const SectionTitleTop = styled(SectionTitle)`
  margin: 30px auto 15px auto;
`;

export const SectionTitleMobile = styled(SectionTitle)`
  margin: 100px auto 15px auto;
  font-size: 2rem;
`;

export const SectionTitleMobileTop = styled(SectionTitleMobile)`
  margin: 30px auto 15px auto;
`;

export const ArticleContainer = styled.div`
  // Styles for ArticleContainer
`;

export const Category = styled.div`
  color: blue;
  font-size: 0.7rem;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  min-height: 40px;
  margin-bottom: 10px;
`;

export const Content = styled.p`
`;

export const Image = styled.img`
  width: 100%;
  background-color: #ccc;
  margin: 0 0 1rem 0;
  height: 155px;
  object-fit: cover;
`;

export const Link = styled.a`
  text-decoration: none;
  color: #000;
  &:hover {
    text-decoration: underline;
  }
`;

export const SourceImage = styled.img`
  max-height: 20px;
  margin-bottom: 3px;
`;

export const Spacer = styled.div`
  height: 5px;
  width: 20px;
  background-color: #fef1e5;
  margin: 17px 0 18px 0; 
`;

export const Time = styled.div`
  font-size: 0.8rem;
  font-family: 'DomaineDisplay',serif;
  color: #777;
`;

export const ArticleContainerTiny = styled.div`
  ${Title} {
    font-size: 1rem;
  }
`;

export const ArticleContainerLarge = styled.div`
  ${Title} {
    font-size: 2rem;
  }

  ${Image} {
    height: 350px;
  }
`;

export const ArticleTinyImageTile = styled.div`
  display: flex;
  justify-content: space-between;

  ${Image} {
    width: 65px;
    height: 65px;
    min-width: 60px;
    border-radius: 5px;
    margin: 0 0 0 15px;
  }
`;
