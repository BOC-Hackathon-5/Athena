import requests
from secrets import client_id, client_secret


url = "https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2/oauth2/token"

payload = f'client_id={client_id}&client_secret={client_secret}&grant_type=client_credentials&scope=TPPOAuth2Security'
headers = {
  'x-client-certificate': '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',
  'Content-Type': 'application/x-www-form-urlencoded'
}

def getBearerToken():
    try:
        response = requests.request("POST", url, headers=headers, data=payload)
        return response.json()["access_token"]
    except:
        raise Exception("Error with getting bearer token (step 1 of OAuth)")
    