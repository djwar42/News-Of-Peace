# ApiHandler.py
import requests
from requests.adapters
import HTTPAdapter
from urllib3.util
import Retry

def api_request(url, headers, max_retries=20, post_data=None):
  # Define a retry strategy
  retry_strategy = Retry(
      total=max_retries,
      status_forcelist=[429, 500, 502, 503, 504],
      allowed_methods=["HEAD", "GET", "OPTIONS", "POST"],
      backoff_factor=1
  )

  # Mount it on a session
  adapter = HTTPAdapter(max_retries=retry_strategy)
  session = requests.Session()
  session.mount("https://", adapter)
  session.mount("http://", adapter)

  try:
      response = session.post(url, headers=headers, data=post_data, timeout=10) if post_data else session.get(url, headers=headers, timeout=10)

      # Check if response is successful
      response.raise_for_status()
      return response.json()

  except requests.exceptions.HTTPError as errh:
      print(f"Http Error: {errh}")
  except requests.exceptions.ConnectionError as errc:
      print(f"Error Connecting: {errc}")
  except requests.exceptions.Timeout as errt:
      print(f"Timeout Error: {errt}")
  except requests.exceptions.RequestException as err:
      print(f"Error: {err}")

  return None
