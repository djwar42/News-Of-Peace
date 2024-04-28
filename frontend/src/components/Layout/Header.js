// Header.js
import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import HorizontalScrollMenu from './HorizontalScrollMenu';


const TitleBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #000;
  background-color: #fff0e5;
`;

const Logo = styled.img`
  height: 80px;
  width: 80px;
`;

const TitleContainer = styled.div`
  text-align: center;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DomaineDisplay', serif;
  font-size: 2.2rem;
  font-weight: bold;
  line-height: 2rem;

  p {
    padding-top: 16px;
    margin: 0;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 1.2rem;
  font-weight: normal;
  font-family: 'DomaineDisplay', serif;
  margin-bottom: 30px;
`;

const NavContainer = styled.nav`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  background-color: #fff0e5;
  // border-top: 1px dotted #e49874;
  // border-bottom: 1px dotted #e49874;
  z-index: 1000;
  text-align: center;
`;

const LogoNav = styled.img`
  height: 20px;
  width: 20px;
  margin: 10px 0;
  opacity: 0;


  &.visible {
    height: 40px;
    width: 40px;
    margin: 0;
    opacity: 1;
    transition: width 0.3s ease, opacity 0.3s ease;
  }
`;



const ActiveLinkStyle = styled(NavLink)`
  padding: 0.5rem 1rem;
  border: 1px solid #444;
  border-radius: 15px;
  color: #444;
  text-decoration: none;
  white-space: nowrap;
  margin: 0 10px;

  &:hover {
    color: #000;
    font-weight: bold;
    padding: 0.5rem 0.954rem;
  }

  &.active {
    color: #000;
    font-weight: bold;
    padding: 0.5rem 0.954rem;
  }
`;


const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef();
  const currentLocation = useLocation(); 


  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > navRef.current.getBoundingClientRect().bottom;
      setIsSticky(show);
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getNavLinkClass = (path) => {
    return currentLocation.pathname === path ? 'active' : ''; // Use currentLocation here
  };

  return (
    <>
      <TitleBar>
        <TitleContainer>
          <Title>
            <Logo src={`${process.env.PUBLIC_URL}/logo192.png`} alt="NewsOfPeace" />
            <p>News<span style={{display: 'inline-block', width: '1.5px'}}></span>Of<span style={{display: 'inline-block', width: '4.2px'}}></span>Peace</p>
          </Title>
          <Subtitle>The worlds news, sorted by positivity.</Subtitle>
        </TitleContainer>
      </TitleBar>
      <NavContainer ref={navRef}>
        {/* <LogoNav
          src={`${process.env.PUBLIC_URL}/logo192.png`}
          alt="NewsOfPeace"
          className={isSticky ? 'visible' : ''}
        /> */}
        <HorizontalScrollMenu>
          <ActiveLinkStyle to="/" className={getNavLinkClass('/')}>Home</ActiveLinkStyle>
          <ActiveLinkStyle to="/politics" className={getNavLinkClass('/politics')}>Politics</ActiveLinkStyle>
          <ActiveLinkStyle to="/science" className={getNavLinkClass('/science')}>Science</ActiveLinkStyle>
          <ActiveLinkStyle to="/technology" className={getNavLinkClass('/technology')}>Technology</ActiveLinkStyle>
          <ActiveLinkStyle to="/environment" className={getNavLinkClass('/environment')}>Environment</ActiveLinkStyle>
          <ActiveLinkStyle to="/entertainment" className={getNavLinkClass('/entertainment')}>Entertainment</ActiveLinkStyle>
          <ActiveLinkStyle to="/business" className={getNavLinkClass('/business')}>Business</ActiveLinkStyle>
          <ActiveLinkStyle to="/health" className={getNavLinkClass('/health')}>Health</ActiveLinkStyle>
          <ActiveLinkStyle to="/law-and-order" className={getNavLinkClass('/law-and-order')}>Law and Order</ActiveLinkStyle>
          <ActiveLinkStyle to="/sports" className={getNavLinkClass('/sports')}>Sports</ActiveLinkStyle>
          <ActiveLinkStyle to="/education" className={getNavLinkClass('/education')}>Education</ActiveLinkStyle>
          <ActiveLinkStyle to="/lifestyle" className={getNavLinkClass('/lifestyle')}>Lifestyle</ActiveLinkStyle>

          {/* <ActiveLinkStyle to="/by-source">By Source</ActiveLinkStyle> */}
        </HorizontalScrollMenu>
      </NavContainer>
    </>
  );
};

export default Header;
