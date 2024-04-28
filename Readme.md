NewsOfPeace.org

A news website that uses ai sentiment analysis to sort the news based on peacefulness

- DynamoDB
  'sources'
  'news'
  'sortednews'

- Lambda function 'FetchNews' for fetching news articles from newsapi.org
  Uses OpenAI API to give each news article a Sentiment Score [1 to 10]

- Lambda function 'SortNews' for sorting news articles
  Provides 7 articles from the last 3 days
  Sorts articles by Sentiment, and Groups by Day

- API Gateway to DynamoDB with VTL

- S3 Bucket for hosting frontend React App
