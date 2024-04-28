# GetSentiment.py
import json
import os
from ApiHandler import api_request

openai_api_key = os.environ['OPENAI_API_KEY']

# Get a category for a news story
def get_news_category(title, description):
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openai_api_key}"
    }
    data = {
        'model': 'gpt-3.5-turbo',
        'messages': [{
            'role': 'user', 
            'content': f"""
Categorize the given news story into one of the these categories

- Categories
    Entertainment, Lifestyle, Technology, Politics, Business, Law and Order, Environment, Sports, Science, Health, Education, General

News Story: {title}
Description: {description}
            """
        }],
        'temperature': 0,
        'max_tokens': 256,
        'tools': [{
            'type': 'function',
            'function': {
                'name': 'categorize_story',
                'description': 'Categorize a news story',
                'parameters': {
                    'type': 'object',
                    'properties': {
                        'category': {
                            'type': 'string',
                            'description': 'The category that the news story belongs to, select General if there is no clear categorization',
                            'enum': ['Entertainment', 'Lifestyle', 'Technology', 'Politics', 'Business', 'Law and Order', 'Environment', 'Sports', 'Science', 'Health', 'Education', 'General']
                        }
                    }
                }
            }
        }],
        'tool_choice': {
            'type': 'function', 
            'function': {
                'name': 'categorize_story'
            }
        }
    }

    response = api_request(url, headers, post_data=json.dumps(data))
    if response:
        function_call = response.get('choices', [{}])[0].get('message', {}).get('tool_calls', [{}])[0].get('function')
        if function_call and function_call['name'] == "categorize_story":
            arguments = json.loads(function_call['arguments'])
            category = arguments.get('category', None) 
            return category
    return None
