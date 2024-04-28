// src/styles/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

import DomaineDisplayFont from '../assets/fonts/DomaineDisplay.woff';
import DomaineDispMediumFont from '../assets/fonts/DomaineDispMedium.woff';
import DomaineDispBoldFont from '../assets/fonts/DomaineDispBold.woff';
import GeographEditThinFont from '../assets/fonts/GeographEditThin.woff';
import GeographEditLightFont from '../assets/fonts/GeographEditLight.woff';
import GeographEditFont from '../assets/fonts/GeographEdit.woff';
import GeographEditMediumFont from '../assets/fonts/GeographEditMedium.woff';
import GeographEditBoldFont from '../assets/fonts/GeographEditBold.woff';


const GlobalStyle = createGlobalStyle`

    @font-face {
        font-family: 'DomaineDisplay';
        src: url('${DomaineDisplayFont}') format('woff');
        font-weight: normal;
        font-style: normal;
    }

    @font-face {
        font-family: 'DomaineDisplay';
        src: url('${DomaineDispMediumFont}') format('woff');
        font-weight: 500; /* Medium */
        font-style: normal;
    }

    @font-face {
        font-family: 'DomaineDisplay';
        src: url('${DomaineDispBoldFont}') format('woff');
        font-weight: bold; /* Bold */
        font-style: normal;
    }


    @font-face {
        font-family: 'GeographEdit';
        src: url('${GeographEditThinFont}') format('woff');
        font-weight: 200; /* Thin */
        font-style: normal;
    }
      
    @font-face {
        font-family: 'GeographEdit';
        src: url('${GeographEditLightFont}') format('woff');
        font-weight: 300; /* Light */
        font-style: normal;
    }

    @font-face {
        font-family: 'GeographEdit';
        src: url('${GeographEditFont}') format('woff');
        font-weight: normal; /* Normal */
        font-style: normal;
    }

    @font-face {
        font-family: 'GeographEdit';
        src: url('${GeographEditMediumFont}') format('woff');
        font-weight: 500; /* Medium */
        font-style: normal;
    }

    @font-face {
        font-family: 'GeographEdit';
        src: url('${GeographEditBoldFont}') format('woff');
        font-weight: bold; /* Bold */
        font-style: normal;
    }
      

    body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'GeographEdit', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        background-color: #FFF;
    }
`;



export default GlobalStyle;
