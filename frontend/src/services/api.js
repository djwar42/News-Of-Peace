// api.js
import axios from 'axios';

const API_ENDPOINT = 'https://c6ge9sxm6a.execute-api.us-east-1.amazonaws.com/prod/thenews';

export const fetchArticles = async () => {
  try {
    const response = await axios.get(API_ENDPOINT);
    
    return response.data.items || []; 

  } catch (error) {
    throw error;
  }
};
