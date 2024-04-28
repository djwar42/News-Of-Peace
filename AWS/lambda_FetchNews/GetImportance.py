# GetSentiment.py
import json
import os
from ApiHandler import api_request

openai_api_key = os.environ['OPENAI_API_KEY']

# Get a category for a news story
def get_importance(title, description):
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
            """
        }],
        'temperature': 0,
        'max_tokens': 256,
        'tools': [{
            'type': 'function',
            'function': {
                'name': 'story_importance',
                'description': 'Give a news story an importance score from 1 to 10',
                'parameters': {
                    'type': 'object',
                    'properties': {
                        'score': {
                            'type': 'number',
                            'description': 'Importance score as an integer from 1 to 10'
                        }
                    }
                }
            }
        }],
        'tool_choice': {
            'type': 'function', 
            'function': {
                'name': 'story_importance'
            }
        }
    }

    response = api_request(url, headers, post_data=json.dumps(data))
    if response:
        function_call = response.get('choices', [{}])[0].get('message', {}).get('tool_calls', [{}])[0].get('function')
        if function_call and function_call['name'] == "story_importance":
            arguments = json.loads(function_call['arguments'])
            score = arguments.get('score', None) 
            return score
    return None
