// ApiCategory.js
import axios from 'axios';

const API_ENDPOINT = 'https://c6ge9sxm6a.execute-api.us-east-1.amazonaws.com/prod/';

const endpoints = [
  'top_all_news',
  'business_all_news',
  'education_all_news',
  'entertainment_all_news',
  'environment_all_news',
  'health_all_news',
  'law_and_order_all_news',
  'lifestyle_all_news',
  'politics_all_news',
  'science_all_news',
  'sports_all_news',
  'technology_all_news'
];

const retryRequest = async (url, retries = 3) => {
  try {
    return await axios.get(url);
  } catch (error) {
    if (retries === 1) throw error;
    return await retryRequest(url, retries - 1);
  }
};

export const fetchAndSortNewsByEndpoint = async (specificEndpoint = null) => {
  try {
    let fetchPromises;

    if (specificEndpoint) {
      // Fetch a specific endpoint
      fetchPromises = [retryRequest(`${API_ENDPOINT}${specificEndpoint}`)];
    } else {
      // Fetch all endpoints
      fetchPromises = endpoints.map(endpoint => retryRequest(`${API_ENDPOINT}${endpoint}`));
    }

    const responses = await Promise.all(fetchPromises);

    const sortedNewsByEndpoint = {};
    responses.forEach((response, index) => {
      const endpoint = specificEndpoint || endpoints[index];
      sortedNewsByEndpoint[endpoint] = response.data.items.sort((a, b) => a.order - b.order);
    });

    return sortedNewsByEndpoint;

  } catch (error) {
    throw error;
  }
};
