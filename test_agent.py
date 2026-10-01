import requests
import json

url = "http://localhost:8000/api/v1/ai/agent"
payload = {
    "message": "Explain what happened.",
    "context": {
        "learning": {
            "overallMastery": 35,
            "topSkills": [],
            "weakSkills": ["Phishing Awareness (35)"]
        }
    }
}
headers = {'Content-Type': 'application/json'}

try:
    response = requests.post(url, json=payload, headers=headers)
    print("STATUS_CODE:", response.status_code)
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(e)
