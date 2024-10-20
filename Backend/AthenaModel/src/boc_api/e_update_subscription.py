import requests
import uuid
import time


def update_subscription(bearer_token, subscription_id):
    url = f"https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2/v1/subscriptions/{subscription_id}"
    headers = {
        "Authorization": f"Bearer {bearer_token}",
        "Content-Type": "application/json",
        "journeyId": str(uuid.uuid4()),
        "timeStamp": str(int(time.time() * 1000))
    }

    data = {
        "subscriptionId": subscription_id,
        "status": "INPROGRESS",
        "description": "SUBSCRIPTION",
        "selectedAccounts": [
            {"accountId": "351012345671"},
            {"accountId": "351092345672"},
            {"accountId": "351012345673"},
            {"accountId": "351012345674"},
            {"accountId": "351012345675"},
            {"accountId": "351092345676"}
        ],
        "accounts": {
            "transactionHistory": True,
            "balance": True,
            "details": True,
            "checkFundsAvailability": True
        },
        "payments": {
            "limit": 50,
            "currency": "string",
            "amount": 50
        },
        "expirationDate": "16/01/2025"
    }

    response = requests.patch(url, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to update subscription: {response.status_code} - {response.text}")
        return None


# replace subscription_id and auth_code from previous
#auth_code = "AAIgMmQ0ZjFmOWEyMjI5MDZlMmE0NWYyY2QyZDMzZGNkMWHSX13EPiTyV9JpxCxTPguwsDrn7Bbo4uehTFbhIwTe7BDrwz9p-QoSiIjvFM9Joaniaqkcm6O_wWtm9zSPqM6Y7IgSxXukegJAK9JoU_z9BQ"
#subscription_id = "Subid000001-1729379707386"

#updated_subscription = update_subscription(auth_code, subscription_id)
#if updated_subscription:
   # print("Updated Subscription:", updated_subscription)
