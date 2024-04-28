// ApiFrontpage.js
import axios from 'axios';

const API_ENDPOINT = 'https://c6ge9sxm6a.execute-api.us-east-1.amazonaws.com/prod/';

const endpoints = [
  'top_frontpage_news',
  'business_frontpage_news',
  'education_frontpage_news',
  'entertainment_frontpage_news',
  'environment_frontpage_news',
  'health_frontpage_news',
  'law_and_order_frontpage_news',
  'lifestyle_frontpage_news',
  'politics_frontpage_news',
  'science_frontpage_news',
  'sports_frontpage_news',
  'technology_frontpage_news'
];

const retryRequest = async (url, retries = 3) => {
  try {
    return await axios.get(url);
  } catch (error) {
    if (retries === 1) throw error;
    return await retryRequest(url, retries - 1);
  }
};

export const fetchAndSortNewsByEndpoint = async () => {
  try {
    const fetchPromises = endpoints.map(endpoint => retryRequest(`${API_ENDPOINT}${endpoint}`));

    const responses = await Promise.all(fetchPromises);

    const sortedNewsByEndpoint = {};
    responses.forEach((response, index) => {
      const endpoint = endpoints[index];
      sortedNewsByEndpoint[endpoint] = response.data.items.sort((a, b) => a.order - b.order);
    });

    return sortedNewsByEndpoint;

  } catch (error) {
    throw error;
  }
};
