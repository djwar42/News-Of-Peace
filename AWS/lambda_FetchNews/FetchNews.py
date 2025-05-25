import os
import json
import math
import boto3
import hashlib
from datetime import datetime
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util import Retry
import logging

# Enable urllib3 debug logging for retries
#logging.getLogger("urllib3").setLevel(logging.DEBUG)

news_api_key = os.environ['NEWS_API_KEY']
openai_api_key = os.environ['OPENAI_API_KEY']
dynamodb = boto3.resource('dynamodb')

def api_request(url, headers, max_retries=3, post_data=None):
    #print(f"Starting API request to {url}")
    start_time = time.time()

    # Define a retry strategy
    retry_strategy = Retry(
        total=max_retries,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["HEAD", "GET", "OPTIONS", "POST"],
        backoff_factor=0.5,
        raise_on_status=False
    )
    #print(f"Retry strategy: max_retries={max_retries}, backoff_factor=0.5, status_forcelist={retry_strategy.status_forcelist}")

    # Mount it on a session
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session = requests.Session()
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    #print("Session configured with retry adapter")

    try:
        method = "POST" if post_data else "GET"
        #print(f"Sending {method} request with headers: {headers}, data: {post_data}")
        request_start = time.time()
        
        # Make the request
        response = session.post(url, headers=headers, json=post_data, timeout=5) if post_data else session.get(url, headers=headers, timeout=5)
        
        request_duration = time.time() - request_start
        #print(f"Request completed in {request_duration:.2f} seconds, status code: {response.status_code}")

        # Check if response is successful
        #print("Checking response status")
        #response.raise_for_status()

        # Parse JSON
        #json_start = time.time()
        result = response.json()
        #print(f"JSON parsing completed in {time.time() - json_start:.2f} seconds")
        #print(f"Total request time: {time.time() - start_time:.2f} seconds")
        return result

    except requests.exceptions.HTTPError as errh:
        print(f"HTTP Error: {errh}, Response: {getattr(errh.response, 'text', 'No response')}")
    except requests.exceptions.ConnectionError as errc:
        print(f"Connection Error: {errc}")
    except requests.exceptions.Timeout as errt:
        print(f"Timeout Error: {errt}")
    except requests.exceptions.RequestException as err:
        print(f"Request Error: {err}")

    print(f"Request failed, returning None. Total time: {time.time() - start_time:.2f} seconds")
    return None

def get_importance(title, description):
    #print('Getting importance for story...')
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openai_api_key}"
    }
    data = {
        'model': 'gpt-4.1-nano',
        'messages': [{
            'role': 'system',
            'content': 'You are a news analyst. Return a JSON object with a single key "score" containing an integer from 1 to 10 based on the importance of the news story.'
        }, {
            'role': 'user',
            'content': f"""
Rate the importance of this news story from 1 to 10:

- 1 to 4: Unimportant
- 5: Neutral
- 6 to 10: Important

Guidelines with Examples:
- Stories with large ramifications for many people: 6-10
  - New law passed affecting national healthcare: 9
  - Major breakthrough in renewable energy technology: 8
  - Significant diplomatic agreement reached between nations: 10
- Stories of neutral importance: 5
  - Minor changes in local government policies: 5
  - New educational program launched in several schools: 5
- Stories that are frivolous or trite, or do not affect the majority of the people: 1-4
  - Local celebrity spotted at a restaurant: 2
  - Annual flower show held in town: 4
  - A new business mogul has joined the elite club of super-rich: 4
- Stories about Sports, Boxing, Football, Basketball, UFC, NFL: 1
- Stories relating to sales or promotions: 1
  - Supermarket announces a weekend discount sale: 1
  - New fashion line released by a celebrity: 1
  - Promo Code for Eagles-Seahawks Get $150: 1
- Specific Examples:
  - Cat saved from a tree: 1
  - Change in interest rates affecting house prices: 5
  - Beginning (or end) of a war: 10
  - Crash or sudden rise in the stock market: 8

News Story: {title}
Description: {description}
Return a JSON object with a single key 'score' containing the integer score.
            """
        }],
        'response_format': {
            'type': 'json_schema',
            'json_schema': {
                'name': 'story_importance',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'score': {
                            'type': 'integer',
                            'description': 'Importance score from 1 to 10'
                        }
                    },
                    'required': ['score'],
                    'additionalProperties': False
                },
                'strict': True
            }
        },
        'temperature': 0,
        'max_tokens': 256
    }

    response = api_request(url, headers, post_data=data)
    if response:
        if 'choices' in response and response['choices']:
            message = response['choices'][0].get('message', {})
            if message.get('refusal'):
                print(f"OpenAI refused request: {message['refusal']}")
                return None
            content = json.loads(message.get('content', '{}'))
            return content.get('score')
    return None

def get_news_category(title, description):
    #print('Getting category for story...')
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openai_api_key}"
    }
    data = {
        'model': 'gpt-4.1-nano',
        'messages': [{
            'role': 'system',
            'content': 'You are a news analyst. Return a JSON object with a single key "category" containing the category name.'
        }, {
            'role': 'user',
            'content': f"""
Categorize the given news story into one of these categories:
Entertainment, Lifestyle, Technology, Politics, Business, Law and Order, Environment, Sports, Science, Health, Education, General

News Story: {title}
Description: {description}
Return a JSON object with a single key 'category' containing the category name.
            """
        }],
        'response_format': {
            'type': 'json_schema',
            'json_schema': {
                'name': 'categorize_story',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'category': {
                            'type': 'string',
                            'enum': ['Entertainment', 'Lifestyle', 'Technology', 'Politics', 'Business', 'Law and Order', 'Environment', 'Sports', 'Science', 'Health', 'Education', 'General']
                        }
                    },
                    'required': ['category'],
                    'additionalProperties': False
                },
                'strict': True
            }
        },
        'temperature': 0,
        'max_tokens': 256
    }

    response = api_request(url, headers, post_data=data)
    if response:
        if 'choices' in response and response['choices']:
            message = response['choices'][0].get('message', {})
            if message.get('refusal'):
                print(f"OpenAI refused request: {message['refusal']}")
                return None
            content = json.loads(message.get('content', '{}'))
            return content.get('category')
    return None

def get_sentiment_score(title, description):
    #print('Getting sentiment score...')
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openai_api_key}"
    }
    data = {
        'model': 'gpt-4.1-nano',
        'messages': [{
            'role': 'system',
            'content': 'You are a news analyst. Return a JSON object with a single key "score" containing an integer from 1 to 10 based on the sentiment of the news story.'
        }, {
            'role': 'user',
            'content': f"""
Rate the sentiment of this news story from 1 to 10:

- 1 to 4: Negative
- 5: Neutral
- 6 to 10: Positive

Guidelines with Examples:
- Stories about war, violence, or tragedy: 1-3
  - Major earthquake causes devastation: 1
  - Armed conflict escalates in region: 2
  - Celebrity involved in a serious car accident: 3
- Stories about political conflict: 3-4
  - Government faces corruption allegations: 3
  - Protests over controversial policy: 4
- Stories about sales or promotions: 1
  - Huge discount sale at local mall: 1
  - New phone model released with promotional offer: 1
  - Promo Code for Eagles-Seahawks Get $150: 1
- Stories about community aid or rescue: 7-8
  - Volunteers help rebuild after storm: 7
  - Firefighters save family from burning building: 8
- Stories about significant positive events: 9-10
  - New breakthrough in cancer treatment: 9
  - Countries sign agreement for peace: 10
- Stories about everyday events: 5
  - Local library to extend its opening hours: 5
  - Town holds annual arts festival: 5
- Stories about Sports, Football, Boxing, Basketball, UFC, NFL: 3
- Stories about love, hope, or heartwarming events: 6-10
  - Community rallies to support local family in need: 8
  - Stray dog adopted by loving family: 8

News Story: {title}
Description: {description}
Return a JSON object with a single key 'score' containing the integer score.
            """
        }],
        'response_format': {
            'type': 'json_schema',
            'json_schema': {
                'name': 'analyze_sentiment',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'score': {
                            'type': 'integer',
                            'description': 'Sentiment score from 1 to 10'
                        }
                    },
                    'required': ['score'],
                    'additionalProperties': False
                },
                'strict': True
            }
        },
        'temperature': 0,
        'max_tokens': 256
    }

    response = api_request(url, headers, post_data=data)
    if response:
        if 'choices' in response and response['choices']:
            message = response['choices'][0].get('message', {})
            if message.get('refusal'):
                print(f"OpenAI refused request: {message['refusal']}")
                return None
            content = json.loads(message.get('content', '{}'))
            score = content.get('score')
            return math.floor(score) if score is not None else None
    return None

def store_news(articles, source_id):
    print('Storing news articles...')
    news_table = dynamodb.Table('news')
    seen_ids = set()  # Track IDs in the batch to avoid duplicates
    with news_table.batch_writer() as batch:
        for article in articles:
            # Generate a more unique ID by including published_at
            article_key = hashlib.md5(f"{source_id}{article['title']}".encode()).hexdigest()
            
            # Check if ID is already in the batch
            if article_key in seen_ids:
                print(f"Skipping duplicate ID in batch: {article['title']} ({article['published_at']})")
                continue
                
            # Check if item exists in DynamoDB
            existing_item = news_table.get_item(Key={'id': article_key})
            if 'Item' in existing_item:
                print(f"Duplicate in table: {article['title']}")
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
            
            print(f"{article['publishedAt'].split('T')[0]}: {article['title']}\nSentiment: {sentiment_score}   Importance: {importance_score}  Category: {category}")
            
            # Add to batch and track ID
            try:
                batch.put_item(Item={
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
                seen_ids.add(article_key)
            except Exception as e:
                print(f"Error adding item to batch: {article['title']} - {str(e)}")
                continue


def fetch_and_store_news():
    start_time = time.time()
    sources = fetch_sources()
    print(f"Fetch sources took {time.time() - start_time:.2f} seconds")
    if sources:
        source = sources[0]
        print(f"\n<< SOURCE: {source['name']}, Last Polled At: {source.get('polled_at', 'Never')} >>\n")
        articles_url = f"https://newsapi.org/v2/everything?sources={source['id']}&sortBy=publishedAt&apiKey={news_api_key}"
        start_api = time.time()
        articles_response = api_request(articles_url, headers={"Content-Type": "application/json"})
        print(f"API news request took {time.time() - start_api:.2f} seconds")
        if articles_response:
            start_store = time.time()
            store_news(articles_response.get('articles', []), source['id'])
            print(f"Store news took {time.time() - start_store:.2f} seconds")
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