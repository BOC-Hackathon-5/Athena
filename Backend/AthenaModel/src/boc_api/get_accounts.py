import requests
import uuid
import time

def get_all_accounts(bearer_token, subscription_id):
    url = "https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2/v1/accounts"
    headers = {
        "Authorization": f"Bearer {bearer_token}",
        "Content-Type": "application/json",
        "subscriptionId": subscription_id,
        "journeyId": str(uuid.uuid4()),
        "timeStamp": str(int(time.time() * 1000))
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to retrieve accounts: {response.status_code} - {response.text}")
        return None

# Replace with your actual bearer token and subscription ID
#