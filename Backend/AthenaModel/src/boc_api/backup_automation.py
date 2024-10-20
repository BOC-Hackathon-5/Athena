from flask import Flask, request, jsonify
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
CORS(app)
# Initialize user data
user_data = {
    "client_id": "2d4f1f9a222906e2a45f2cd2d33dcd1a",
    "client_secret": "2d4870d2b438462df00ba6f431d6c14f",
    "subscriptionId": "",
    "accountNumber": "",
    "bearerToken": "",
    "subscription": ""
}




if __name__ == '__main__':
    try:
        current_bearer_token = get_bearer_token(user_data['client_id'], user_data['client_secret'])
        print("Acquired new bearer token:", current_bearer_token, "\n")

        sub_id_response = create_subscription(current_bearer_token)
        if 'subscriptionId' in sub_id_response:
            sub_id = sub_id_response['subscriptionId']
            print("New subscription ID:", sub_id)
        else:
            print("Failed to create subscription:", sub_id_response)
            exit()

        input("Press Enter to proceed.")

        webbrowser.open(SUBSCRIPTION_OAUTH_URL + sub_id)
        input("PRESS ENTER")

        auth_code = input("Please enter input!")

        access_token = get_oauth_token(user_data['client_id'],user_data['client_secret'],auth_code)

        updated_subscription = update_subscription(access_token, sub_id)
        if updated_subscription:
            print("Subscription successfully updated:", updated_subscription, "\n")
        else:
            print("Failed to update subscription:", updated_subscription)

    except Exception as e:
        print(f"An error occurred: {e}")

    subscription_info = retrieve_subscription(access_token, sub_id)
    print("Subscription info:", subscription_info, "\n")

    # Step 5: Retrieve Account Balance
    account_number = "351092345676"
    balance_info = inspect_account_balance(current_bearer_token, sub_id, account_number)
    print("Balance details:", balance_info, "\n")
    # Assuming balance_details is already defined
    current_balance = next(balance['amount'] for account in balance_info for balance in account['balances'] if
                           balance['balanceType'] == 'CURRENT')
    print(current_balance)

    # Step 6: Retrieve Account Statement
  #  statement_info = retrieve_statement(current_oauth_token, sub_id, account_number)
  #  print("Account statement:", statement_info, "\n")

    # Step 7: Load Payment-Related Data
  #  payment_details = get_payment_data()
  #  print("Loaded payment details:", payment_details, '\n')

    # Step 8: Generate a Signed Payment Request
  #  signed_request = sign_payment_request(
  #      payment_details['debtor'],
   #     payment_details['creditor'],
    #    payment_details['amount'],
    #    payment_details['details']
    #)
    #print("Generated signed payment request:", signed_request, '\n')

    # Step 9: Initiate Payment Process
    #payment_result = initiate_payment(signed_request, current_bearer_token, sub_id)
   # print("Payment initiation result:", payment_result, '\n')
