import requests
import json
import time

LOG_URL = "http://localhost:5000/api/logs"  
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer your_token" 
}

def send_log_to_server(log_data):
    retries = 3
    for attempt in range(retries):
        try:
            log_data.pop('_id', None)

            response = requests.post(LOG_URL, data=json.dumps(log_data), headers=headers, timeout=30)

            if response.status_code == 201:
                print(f"Log sent successfully.")
                break 
            else:
                print(f"Failed to send log, status code: {response.status_code}")
                print(f"Response body: {response.text}")  # Display the response body
                # If status code is not 201, retry
                if attempt < retries - 1:
                    print(f"Retrying... ({attempt + 1}/{retries})")
                    time.sleep(2)  # Wait 2 seconds before retrying
        except requests.exceptions.RequestException as e:
            # Catch any request-related exceptions (e.g., connection issues)
            print(f"Error sending log: {e}")
            if attempt < retries - 1:
                print(f"Retrying... ({attempt + 1}/{retries})")
                time.sleep(2)  # Wait 2 seconds before retrying

# Example log data to test the function
log_data = {
    'source': 'Microsoft-Windows-Kernel-Power',
    'event_type': '566',
    'message': '88 31 48 2 45237267 68150 70704 68055 70704 49 0 false 31',
    'severity': 'medium',
    'hostname': 'SUJI',
    'level': 'medium',
    'timestamp': '2025-05-06T04:40:50.747Z'
}

# Send the log to the server
send_log_to_server(log_data)
