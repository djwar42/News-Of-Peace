import boto3
from decimal import Decimal
from collections import defaultdict
from datetime import datetime, timedelta
from boto3.dynamodb.conditions import Key

def fetch_articles_by_source(source_id, date, news_table):
    # Fetches articles from the news table based on source_id and date
    response = news_table.query(
        IndexName='SourceIdPublishedAtDayIndex',
        KeyConditionExpression=Key('source_id').eq(source_id) & Key('published_at_day').eq(date)
    )
    return response['Items']

def batch_write_articles(articles, source_info_mapping, target_table):
    print(f"\n\n>> WRITING TO: {target_table}\n")

    # Empty the target table
    response = target_table.scan()
    items = response['Items']
    for item in items:
        target_table.delete_item(
            Key={'id': item['id']}
        )

    # Prepares articles
    batch_articles = []
    for article in articles:
        source_info = source_info_mapping.get(article['source_id'], {})
        article_item = {
            "id": article['id'],
            "source_id": article['source_id'],
            "author": article.get("author").replace('"', "'") if article.get("author") is not None else "",
            "title": article.get("title").replace('"', "'") if article.get("title") is not None else "",
            "content": article.get("content").replace('\r\n', ' ').replace('\r', ' ').replace('\n', ' ').replace('"', "'") if article.get("content") is not None else "",
            "url": article['url'],
            "url_to_image": article['url_to_image'],
            "published_at": article['published_at'],
            "category": article['category'],
            "sentiment": str(article['sentiment']),
            "importance": str(article['importance']) if article.get("importance") is not None else "",
            "combinedscore": str(calculate_combined_score(article)),
            "order": articles.index(article),
            "source_name": source_info.get('name', ''),
            "source_url": source_info.get('url', '')
        }
        batch_articles.append(article_item)
        # print(f"{article_item['source_id']}({articles.index(article)}) {article_item['published_at']} {article_item['title']}, Sentiment: {article_item['sentiment']}, Importance: {article_item['importance']}, Combined: {calculate_combined_score(article)}")

    # Batch writes articles
    with target_table.batch_writer() as batch:
        for i, article in enumerate(batch_articles):
            batch.put_item(Item=article)
            if (i + 1) % 25 == 0 or i == len(batch_articles) - 1:
                batch_count = 25 if (i + 1) % 25 == 0 else (i + 1) % 25
                print(f"Batch of {batch_count} articles written to the table.")


def calculate_combined_score(article):
    sentiment = float(article['sentiment']) if 'sentiment' in article else 0.0
    importance = float(article.get('importance', Decimal(0)))
    return (1 * sentiment) + (0.3 * importance)

def make_url_friendly(text):
    return text.lower().replace(' ', '_')

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    news_table = dynamodb.Table('news')
    top_news_table = dynamodb.Table('top_frontpage_news')
    sources_table = dynamodb.Table('sources')

    print(f"<< SORTING NEWS CATEGORICALLY >>")

    # Fetches source information from the sources table
    sources_response = sources_table.scan()
    source_info_mapping = {item['id']: {'url': item.get('url', ''), 'name': item.get('name', '')} for item in sources_response['Items']}

    # Generates a list of dates for the last 10 days
    dates = [(datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(10)]
    articles_by_day = defaultdict(list)

    # Fetches and sorts articles for each day
    for date in dates:
        for source_id in source_info_mapping.keys():
            items = fetch_articles_by_source(source_id, date, news_table)
            articles_by_day[date].extend(items)
        articles_by_day[date].sort(key=lambda x: calculate_combined_score(x), reverse=True)

    # Concatenates sorted articles from all days
    all_sorted_articles = []
    for day in sorted(articles_by_day.keys(), reverse=True):
        all_sorted_articles.extend(articles_by_day[day])

    # Selects the top 17 articles
    top_articles = all_sorted_articles[:17]

    # Process and write articles to the top_news_table
    batch_write_articles(top_articles, source_info_mapping, top_news_table)

    # Remaining articles
    remaining_articles = all_sorted_articles[17:]

    # Predefined categories
    categories = ['Entertainment', 'Lifestyle', 'Technology', 'Politics', 'Business', 
                  'Law and Order', 'Environment', 'Sports', 'Science', 'Health', 
                  'Education', 'General']

    # Initialize dictionaries for all news and frontpage news with URL-friendly names
    categorized_articles_all_news = {make_url_friendly(f"{category}_all_news"): [] for category in categories}
    categorized_articles_frontpage_news = {make_url_friendly(f"{category}_frontpage_news"): [] for category in categories}

    for article in all_sorted_articles:
        category = article.get('category')
        if category:
            url_friendly_category = make_url_friendly(category)
            if f"{url_friendly_category}_all_news" in categorized_articles_all_news:
                categorized_articles_all_news[f"{url_friendly_category}_all_news"].append(article)

    for article in remaining_articles:
        category = article.get('category')
        if category:
            url_friendly_category = make_url_friendly(category)
            if f"{url_friendly_category}_frontpage_news" in categorized_articles_frontpage_news:
                categorized_articles_frontpage_news[f"{url_friendly_category}_frontpage_news"].append(article)

    # Optionally, print the count of articles in each category
    print("\n")
    for category, articles in categorized_articles_all_news.items():
        print(f"Category '{category}' has {len(articles)} articles (including top 17).")
    
    print("\n")
    for category, articles in categorized_articles_frontpage_news.items():
        print(f"Category '{category}' has {len(articles)} articles (excluding top 17).")


    # Write top 9 frontpage news and top 60 all news for each category
    for category in categories:
        url_friendly_category = make_url_friendly(category)
        top_9_frontpage = categorized_articles_frontpage_news[f"{url_friendly_category}_frontpage_news"][:9]
        frontpage_table = dynamodb.Table(f"{url_friendly_category}_frontpage_news")
        batch_write_articles(top_9_frontpage, source_info_mapping, frontpage_table)

        top_60_all_news = categorized_articles_all_news[f"{url_friendly_category}_all_news"][:60]
        all_news_table = dynamodb.Table(f"{url_friendly_category}_all_news")
        batch_write_articles(top_60_all_news, source_info_mapping, all_news_table)

    print(f"<< DONE ! >>")

if __name__ == "__main__":
    lambda_handler(None, None)
