import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const MenuWrapper = styled.div`
  position: relative;
  max-width: 1280px;
  height: 55px; // Adjust this height as needed
  margin: 0;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const Menu = styled.div`
  height: 83px; // Adjust this height as needed
  margin: 0;
  padding-top: 12px;
  background: transparent;
  box-sizing: border-box;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-padding-left: 45px; // Ensure snap aligns with 40px offset

  display: flex; // Changed to flex for better control
  align-items: flex-start;
  scroll-snap-type: x mandatory; // Enable horizontal scroll snapping

  > * {
    flex: 0 0 auto; // Flex children to not grow or shrink
    scroll-snap-align: start; // Snap to the start edge of the scroll container
    font-size: 0.8rem;
    margin-right: 10px; // Adjust as needed for spacing between items
  }
`;

const Paddle = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3em;
  z-index: 10;
  border: none;
  cursor: pointer;
  background-color: #fef1e5;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    margin-top: 5px;
    fill: #e49874;
  }
  &:hover {
    background-color: #e49874;
    svg {
      fill: #FFF;
    }
  }
  &.hidden {
    display: none;
  }
  &.left-paddle {
    left: 0;
  }
  &.right-paddle {
    right: 0;
  }
`;


const HorizontalScrollMenu = ({ children }) => {
  const [menuSize, setMenuSize] = useState(0);
  const [menuVisibleSize, setMenuVisibleSize] = useState(0);
  const [menuPosition, setMenuPosition] = useState(0);
  const menuRef = useRef(null);

  const updateMenuState = () => {
    const menuWidth = menuRef.current.scrollWidth;
    const visibleWidth = menuRef.current.clientWidth + 5;
    setMenuSize(menuWidth);
    setMenuVisibleSize(visibleWidth);
  };

  useEffect(() => {
    const handleResize = () => updateMenuState();
    window.addEventListener('resize', handleResize);
    updateMenuState(); // Initial update

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setMenuPosition(menuRef.current.scrollLeft);
    };

    const menu = menuRef.current;
    menu.addEventListener('scroll', handleScroll);

    return () => {
      menu.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handlePaddleClick = (direction) => {
    const screenWidth = window.innerWidth;
    const scrollAmount = screenWidth - 120;
    const currentScroll = menuRef.current.scrollLeft;
    const newScrollPosition = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;
    menuRef.current.scroll({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };

  // Define the offset for the left paddle
  const leftPaddleOffset = 40;

  const isLeftPaddleHidden = menuPosition <= leftPaddleOffset;
  const isRightPaddleHidden = menuPosition >= menuSize - menuVisibleSize;

  // console.log('menuPosition', menuPosition);

  // console.log('menuSize - menuVisibleSize', menuSize - menuVisibleSize);

  return (
    <MenuWrapper>
      <Menu ref={menuRef}>
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, { key: index })
        )}
      </Menu>

      <Paddle className={`paddle left-paddle ${isLeftPaddleHidden ? 'hidden' : ''}`} onClick={() => handlePaddleClick('left')}>
        <svg width="24" height="24" viewBox="0 0 24 24" focusable="false"> <g transform="scale(-1, 1) translate(-24, 0)"> <path d="M7.59 18.59L9 20l8-8-8-8-1.41 1.41L14.17 12"></path> </g> </svg>
      </Paddle>
      <Paddle className={`paddle right-paddle ${isRightPaddleHidden ? 'hidden' : ''}`} onClick={() => handlePaddleClick('right')}>
        <svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><path d="M7.59 18.59L9 20l8-8-8-8-1.41 1.41L14.17 12"></path></svg>
      </Paddle>
    </MenuWrapper>
  );
};

export default HorizontalScrollMenu;