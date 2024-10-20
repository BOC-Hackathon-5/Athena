import requests
import uuid
import time


def create_subscription(bearer_token):
    url = "https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2/v1/subscriptions"
    headers = {
        "Authorization": f"Bearer {bearer_token}",
        "Content-Type": "application/json",
        "timeStamp": str(int(time.time() * 1000)),
        "journeyId": str(uuid.uuid4())
    }

    data = {
        "accounts": {
            "transactionHistory": True,
            "balance": True,
            "details": True,
            "checkFundsAvailability": True
        },
        "payments": {
            "limit": 99999999,
            "currency": "EUR",
            "amount": 999999999
        }
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 201:
        return response.json()
    else:
        print(f"Failed to create subscription: {response.status_code} - {response.text}")
        return None


# Replace bearer token with auth_code
