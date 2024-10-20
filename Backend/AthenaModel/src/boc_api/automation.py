from flask import Flask, jsonify
import json
from time import sleep
import webbrowser
from flask_cors import CORS

# Importing core functions from individual modules
from a_get_bearer_token import get_bearer_token
from b_create_subscription import create_subscription
from c_ouath_auth_code import get_oauth_token
from d_retrieve_subscription import retrieve_subscription
from e_update_subscription import update_subscription
from inspect_balance import inspect_account_balance

# Define URLs for OAuth authorization redirects
SUBSCRIPTION_OAUTH_URL = 'https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2/oauth2/authorize?response_type=code&redirect_uri=https://localhost&scope=UserOAuth2Security&client_id=2d4f1f9a222906e2a45f2cd2d33dcd1a&subscriptionid='
PAYMENT_OAUTH_URL = 'https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2/oauth2/authorize?response_type=code&redirect_uri=http://localhost&scope=UserOAuth2Security&client_id=bd230620-1aa5-4509-858c-81e902d5c7e4&paymentid='

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize user data
user_data = {
    "client_id": "2d4f1f9a222906e2a45f2cd2d33dcd1a",
    "client_secret": "2d4870d2b438462df00ba6f431d6c14f",
    "subscriptionId": "",
    "accountNumber": "",
    "bearerToken": "",
    "subscription": ""
}

# Variable to store the fetched balance
stored_balance = None


def retrieve_balance():
    global stored_balance
    try:
        # Step 1: Acquire bearer token
        current_bearer_token = get_bearer_token(user_data['client_id'], user_data['client_secret'])
        print("Acquired new bearer token:", current_bearer_token)

        # Step 2: Create subscription
        sub_id_response = create_subscription(current_bearer_token)
        if 'subscriptionId' in sub_id_response:
            sub_id = sub_id_response['subscriptionId']
            print("New subscription ID:", sub_id)
        else:
            print("Failed to create subscription:", sub_id_response)
            return

        # Step 3: Redirect to OAuth authorization
        input("Press Enter to proceed.")
        webbrowser.open(SUBSCRIPTION_OAUTH_URL + sub_id)
        input("PRESS ENTER")

        # Step 4: Retrieve OAuth token
        auth_code = input("Please enter input!")
        access_token = get_oauth_token(user_data['client_id'], user_data['client_secret'], auth_code)

        # Step 5: Update subscription
        updated_subscription = update_subscription(access_token, sub_id)
        if not updated_subscription:
            print("Failed to update subscription")
            return

        # Step 6: Retrieve Account Balance
        account_number = "351092345676"
        balance_info = inspect_account_balance(current_bearer_token, sub_id, account_number)
        print("Balance details:", balance_info)

        # Extract current balance
        current_balance = next(balance['amount'] for account in balance_info for balance in account['balances'] if
                               balance['balanceType'] == 'CURRENT')

        # Store the balance for future API calls
        stored_balance = current_balance

    except Exception as e:
        print(f"An error occurred while retrieving balance: {e}")


@app.route('/get_balance', methods=['GET'])
def get_account_balance():
    if stored_balance is not None:
        return jsonify({"balance": stored_balance})
    else:
        return jsonify({"error": "Balance not available"}), 500


if __name__ == '__main__':
    retrieve_balance()  # Fetch the balance once when the app starts
    app.run(debug=True)
