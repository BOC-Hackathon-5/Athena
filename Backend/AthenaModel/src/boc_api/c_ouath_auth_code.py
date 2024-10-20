import requests

def get_oauth_token(client_id, client_secret, auth_code):
    url = "https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2/oauth2/token"
    headers = {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "authorization_code",
        "client_id": client_id,
        "client_secret": client_secret,
        "code": auth_code,
        "scope": "UserOAuth2Security"
    }

    response = requests.post(url, headers=headers, data=data)

    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        print(f"Failed to get OAuth token: {response.status_code} - {response.text}")
        return None

# Replace with your actual client ID, client secret, and authorization code

