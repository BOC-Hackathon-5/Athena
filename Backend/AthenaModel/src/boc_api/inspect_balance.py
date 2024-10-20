import requests
import uuid
import time

def inspect_account_balance(bearer_token, subscription_id, account_number):
    url = f"https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2/v1/accounts/{account_number}/balance"
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
        print(f"Failed to inspect account balance: {response.status_code} - {response.text}")
        return None

