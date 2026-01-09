import os
import requests
import json
from datetime import datetime
from typing import List
from mock_services import UserSession, CodeAnalysisResult

try:
    from openai import AzureOpenAI
    from azure.identity import DefaultAzureCredential
except ImportError:
    pass

class LiveIdentityService:
    def __init__(self):
        self.tenant_id = os.getenv("AZURE_TENANT_ID")
        self.client_id = os.getenv("AZURE_CLIENT_ID")
        self.client_secret = os.getenv("AZURE_CLIENT_SECRET")
        self.graph_url = "https://graph.microsoft.com/v1.0"
        self._token = None

    def _get_token(self):
        url = f"https://login.microsoftonline.com/{self.tenant_id}/oauth2/v2.0/token"
        data = {
            "client_id": self.client_id,
            "scope": "https://graph.microsoft.com/.default",
            "client_secret": self.client_secret,
            "grant_type": "client_credentials"
        }
        resp = requests.post(url, data=data)
        if resp.status_code == 200:
            return resp.json().get("access_token")
        print(f"Failed to get Entra ID token: {resp.text}")
        return None

    def get_mock_sessions(self) -> List[UserSession]:
        token = self._get_token()
        if not token:
            print("Using fallback mock data for Identity (No Token)")
            from mock_services import IdentityService as MockIdentity
            return MockIdentity.get_mock_sessions()

        headers = {"Authorization": f"Bearer {token}"}
        try:
            resp = requests.get(f"{self.graph_url}/identityProtection/riskyUsers?$top=5", headers=headers)
            if resp.status_code == 200:
                data = resp.json().get('value', [])
                sessions = []
                for user in data:
                    risk_mapping = {
                        "low": "Safe",
                        "medium": "MFA Fatigue",
                        "high": "Impossible Travel",
                        "hidden": "Safe",
                        "none": "Safe"
                    }
                    sessions.append(UserSession(
                        id=user.get('id'),
                        user=user.get('userDisplayName'),
                        ip_address="Unknown",
                        location="Unknown", 
                        risk_level=risk_mapping.get(user.get('riskLevel', 'none'), "Safe"),
                        timestamp=user.get('riskLastUpdatedDateTime')
                    ))
                return sessions if sessions else []
            else:
                print(f"Graph API Error: {resp.text}")
        except Exception as e:
            print(f"Live Identity Service Error: {e}")
            
        from mock_services import IdentityService as MockIdentity
        return MockIdentity.get_mock_sessions()

    def get_current_user_risk(self, user: str) -> int:
        sessions = self.get_mock_sessions()
        for s in sessions:
            if s.user == user:
                if s.risk_level == "Impossible Travel": return 90
                if s.risk_level == "MFA Fatigue": return 60
        return 0


class LiveCodeService:
    def __init__(self):
        self.api_key = os.getenv("AZURE_OPENAI_API_KEY")
        self.endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        self.deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o")
        
        if self.api_key and self.endpoint:
            self.client = AzureOpenAI(
                api_key=self.api_key,
                api_version="2024-02-01",
                azure_endpoint=self.endpoint
            )
        else:
            self.client = None

    def analyze_code_mock(self, code_snippet: str) -> CodeAnalysisResult:
        if not self.client:
            print("Azure OpenAI not configured, falling back to mock.")
            from mock_services import CodeService as MockCode
            return MockCode.analyze_code_mock(code_snippet)

        prompt = f"""
        Analyze the following code for security vulnerabilities.
        Return ONLY a JSON object with this structure:
        {{
            "vulnerabilities": ["List of OWASP vulnerability names"],
            "score": <0-100 integer Risk Score, where 100 is critical>,
            "rewrite": "<Secure version of the code>"
        }}
        
        Code to analyze:
        {code_snippet}
        """

        try:
            response = self.client.chat.completions.create(
                model=self.deployment,
                messages=[
                    {"role": "system", "content": "You are a senior Application Security Engineer."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            data = json.loads(content)
            
            return CodeAnalysisResult(
                files_analyzed=1,
                vulnerabilities_found=len(data.get("vulnerabilities", [])),
                owasp_top_10=data.get("vulnerabilities", []),
                secure_rewrite_suggestion=data.get("rewrite", "No rewrite suggested."),
                vulnerability_score=data.get("score", 0)
            )

        except Exception as e:
            print(f"Azure OpenAI Error: {e}")
            from mock_services import CodeService as MockCode
            return MockCode.analyze_code_mock(code_snippet)
