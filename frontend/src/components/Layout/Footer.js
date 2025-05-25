// Footer.js
import React from 'react'
import styled from 'styled-components'

// Updated Styled component for the footer container
const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  color: #000;
  font-family: 'DomaineDisplay', serif;
  margin-top: 100px;
`

const FooterTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DomaineDisplay', serif;
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 2rem;

  p {
    padding-top: 12px;
    margin: 0;
  }
`

const Logo = styled.img`
  height: 60px;
  width: 60px;
`

// Styled component for the footer content
const FooterContent = styled.div`
  text-align: center;
  padding-bottom: 20px;
`

const Footer = () => (
  <FooterContainer>
    <FooterContent>
      <FooterTitle>
        <Logo src={`${process.env.PUBLIC_URL}/logo192.png`} alt='NewsOfPeace' />
        <p>
          News<span style={{ display: 'inline-block', width: '1.5px' }}></span>
          Of<span style={{ display: 'inline-block', width: '4.2px' }}></span>
          Peace
        </p>
      </FooterTitle>
      <p>Bringing the good news to you every day.</p>
      <p>
        Website by{' '}
        <a target='_BLANK' href='https://github.com/djwar42'>
          Daniel Joel Warner
        </a>
      </p>
    </FooterContent>
  </FooterContainer>
)

export default Footer
