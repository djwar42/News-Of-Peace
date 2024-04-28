# FetchNews.py
import os
import boto3
import hashlib
from datetime import datetime
from ApiHandler import api_request
from GetSentiment import get_sentiment_score
from GetImportance import get_importance
from GetCategory import get_news_category

news_api_key = os.environ['NEWS_API_KEY']

# Initialize a DynamoDB client
dynamodb = boto3.resource('dynamodb')

def store_news(articles, source_id):
    news_table = dynamodb.Table('news')
    for article in articles:
        article_key = hashlib.md5(f"{source_id}{article['title']}".encode()).hexdigest()
        existing_item = news_table.get_item(Key={'id': article_key})
        if 'Item' in existing_item:
            print(f"Duplicate: {article['publishedAt'].split('T')[0]}: {article['title']}\n")
            continue
        
        sentiment_score = get_sentiment_score(article['title'], article['description'])
        if sentiment_score is None:
            print("OpenAI get_sentiment_score call failed, halting.")
            return
        
        importance_score = get_importance(article['title'], article['description'])
        if importance_score is None:
            print("OpenAI get_importance call failed, halting.")
            return
        
        category = get_news_category(article['title'], article['description'])
        if category is None:
            print("OpenAI get_news_category call failed, halting.")
            return
          
        print(f"{article['publishedAt'].split('T')[0]}: {article['title']}\nSentiment: {sentiment_score}   Importance: {importance_score}  Category: {category}\n")
        
        news_table.put_item(Item={
            'id': article_key,
            'source_id': source_id,
            'author': article.get('author'),
            'title': article.get('title'),
            'description': article.get('description'),
            'url': article.get('url'),
            'url_to_image': article.get('urlToImage'),
            'published_at': article.get('publishedAt'),
            'published_at_day': article.get('publishedAt').split('T')[0],
            'content': article.get('content'),
            'sentiment': sentiment_score,
            'importance': importance_score,
            'category': category
        })

def fetch_and_store_news():
    sources = fetch_sources()
    if sources:
        source = sources[0] # only process one source per run
        print(f"\n<< SOURCE: {source['name']}, Last Polled At: {source.get('polled_at', 'Never')} >>\n")
        articles_url = f"https://newsapi.org/v2/everything?sources={source['id']}&sortBy=publishedAt&apiKey={news_api_key}"
        articles_response = api_request(articles_url, headers={"Content-Type": "application/json"})
        if articles_response:
            store_news(articles_response.get('articles', []), source['id'])
        update_polled_at(source['id'])

def fetch_sources():
    table = dynamodb.Table('sources')
    response = table.scan()
    sources = response.get('Items', [])
    return sorted(sources, key=lambda x: x.get('polled_at', '1970-01-01'))

def update_polled_at(source_id):
    table = dynamodb.Table('sources')
    table.update_item(
        Key={'id': source_id},
        UpdateExpression="SET polled_at = :val",
        ExpressionAttributeValues={':val': datetime.now().isoformat()}
    )

def lambda_handler(event, context):
    fetch_and_store_news()
    return {'statusCode': 200, 'body': 'News processing completed.'}

if __name__ == "__main__":
    lambda_handler(None, None)