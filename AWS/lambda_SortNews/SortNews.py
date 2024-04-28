import boto3
from collections import defaultdict
from datetime import datetime, timedelta
from boto3.dynamodb.conditions import Key

def fetch_articles(source_id, date, news_table):
    # Fetches articles from the news table based on source_id, date, and sentiment
    response = news_table.query(
        IndexName='PublishedAtSentimentIndex',
        KeyConditionExpression=Key('published_at_day').eq(date) & Key('sentiment').gt(3),
        FilterExpression=Key('source_id').eq(source_id)
    )
    return response['Items']

def empty_table(table):
    # Empties the specified DynamoDB table
    response = table.scan()
    items = response['Items']
    for item in items:
        table.delete_item(
            Key={'id': item['id']}
        )

def batch_write_articles(table, articles):
    # Batch writes articles to the specified DynamoDB table
    with table.batch_writer() as batch:
        for article in articles:
            batch.put_item(Item=article)

def lambda_handler(event, context):
    # AWS Lambda handler function
    dynamodb = boto3.resource('dynamodb')
    news_table = dynamodb.Table('news')
    sorted_news_table = dynamodb.Table('sortednews')
    sources_table = dynamodb.Table('sources')

    print(f"<< SORTING NEWS >>\n")

    # Fetches source information from the sources table
    sources_response = sources_table.scan()
    source_info_mapping = {item['id']: {'url': item.get('url', ''), 'name': item.get('name', '')} for item in sources_response['Items']}

    # Generates a list of dates for the last five days
    dates = [(datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(5)]
    articles_by_source_and_day = defaultdict(lambda: defaultdict(list))

    # Fetches articles for each source and date
    for source_id in source_info_mapping.keys():
        for date in dates:
            items = fetch_articles(source_id, date, news_table)
            for article in items:
                day = article['published_at'].split('T')[0]
                articles_by_source_and_day[source_id][day].append(article)

    # Empty the sortednews table
    empty_table(sorted_news_table)

    # Sorts and selects the top 7 articles for each source
    for source_id, articles_by_day in articles_by_source_and_day.items():
        all_articles = []
        for day in sorted(articles_by_day.keys(), reverse=True):
            sorted_day_articles = sorted(articles_by_day[day], key=lambda x: x['sentiment'], reverse=True)
            all_articles.extend(sorted_day_articles)

        # Limit to top 7 articles per source
        sorted_articles = all_articles[:7]

        # Prepares articles for batch writing
        batch_articles = []
        for article in sorted_articles:
            source_info = source_info_mapping.get(article['source_id'], {})
            article_item = {
                "id": article['id'],
                "source_id": article['source_id'],
                "author": article.get("author").replace('"', "'") if article.get("author") is not None else "",
                "title": article.get("title").replace('"', "'") if article.get("title") is not None else "",
                "url": article['url'],
                "url_to_image": article['url_to_image'],
                "published_at": article['published_at'],
                "sentiment": str(article['sentiment']),
                "source_name": source_info.get('name', ''),
                "source_url": source_info.get('url', ''),
                "order_within_source": sorted_articles.index(article)
            }
            batch_articles.append(article_item)
            print(f"{article_item['source_id']}({sorted_articles.index(article)}) {article_item['title']}, Sentiment: {article_item['sentiment']}\n")

        # Batch writes articles for the source
        batch_write_articles(sorted_news_table, batch_articles)

if __name__ == "__main__":
    lambda_handler(None, None)
