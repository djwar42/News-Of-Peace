// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import NewsListBySource from './components/BySource/NewsListBySource';
import NewsList from './components/NewsList/NewsList';
import NewsListCategory from './components/NewsList/NewsListCategory';
import GlobalStyle from './styles/GlobalStyle';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff0e5;
  padding: 0 10px;
`;

const Content = styled.main`
  flex: 1;
`;

function App() {
  return (
    <BrowserRouter>
      <AppContainer>
        <GlobalStyle />
        <Header />
        <Content>
          <Routes>
            <Route path="/" element={<NewsList />} />
            <Route path="/by-source" element={<NewsListBySource />} />
            <Route path="/entertainment" element={<NewsListCategory category='entertainment_all_news' category_name='Entertainment'/>} />
            <Route path="/lifestyle" element={<NewsListCategory category='lifestyle_all_news' category_name='Lifestyle'/>} />
            <Route path="/technology" element={<NewsListCategory category='technology_all_news' category_name='Technology'/>} />
            <Route path="/politics" element={<NewsListCategory category='politics_all_news' category_name='Politics' />} />
            <Route path="/business" element={<NewsListCategory category='business_all_news' category_name='Business' />} />
            <Route path="/law-and-order" element={<NewsListCategory category='law_and_order_all_news' category_name='Law And Order' />} />
            <Route path="/environment" element={<NewsListCategory category='environment_all_news' category_name='Environment' />} />
            <Route path="/sports" element={<NewsListCategory category='sports_all_news' category_name='Sports' />} />
            <Route path="/science" element={<NewsListCategory category='science_all_news' category_name='Science' />} />
            <Route path="/health" element={<NewsListCategory category='health_all_news' category_name='Health' />} />
            <Route path="/education" element={<NewsListCategory category='education_all_news' category_name='Education' />} />
          </Routes>
        </Content>
        <Footer />
      </AppContainer>
    </BrowserRouter>
  );
}

export default App;
