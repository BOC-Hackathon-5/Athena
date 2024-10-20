import requests
import uuid
import time

def retrieve_subscription(bearer_token, subscription_id):
    url = f"https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2/v1/subscriptions/{subscription_id}"
    headers = {
        "Authorization": f"Bearer {bearer_token}",
        "Content-Type": "application/json",
        "journeyId": str(uuid.uuid4()),
        "timeStamp": str(int(time.time() * 1000))
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to retrieve subscription: {response.status_code} - {response.text}")
        return None


