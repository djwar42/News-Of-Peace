# GetSentiment.py
import json
import os
import math
from ApiHandler import api_request

openai_api_key = os.environ['OPENAI_API_KEY']

# Get a sentiment score for a news article from 1 to 10
def get_sentiment_score(title, description):
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
            """
        }],
        'temperature': 0,
        'max_tokens': 256,
        'tools': [{
            'type': 'function',
            'function': {
                'name': 'analyze_sentiment',
                'description': 'Give a news story a sentiment rating score from 1 to 10',
                'parameters': {
                    'type': 'object',
                    'properties': {
                        'score': {
                            'type': 'number',
                            'description': 'Sentiment rating as an integer from 1 to 10'
                        }
                    }
                }
            }
        }],
        'tool_choice': {
            'type': 'function', 
            'function': {
                'name': 'analyze_sentiment'
            }
        }
    }

    response = api_request(url, headers, post_data=json.dumps(data))
    if response:
        function_call = response.get('choices', [{}])[0].get('message', {}).get('tool_calls', [{}])[0].get('function')
        if function_call and function_call['name'] == "analyze_sentiment":
            arguments = json.loads(function_call['arguments'])
            score = arguments.get('score', None)
            if score is not None:
                score = math.floor(score) 
            return score
    return None
