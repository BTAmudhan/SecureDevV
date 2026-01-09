import random
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional

class UserSession(BaseModel):
    id: str
    user: str
    ip_address: str
    location: str
    risk_level: str  # Safe, MFA Fatigue, Impossible Travel
    timestamp: str

class CodeAnalysisResult(BaseModel):
    files_analyzed: int
    vulnerabilities_found: int
    owasp_top_10: List[str]
    secure_rewrite_suggestion: str
    vulnerability_score: int

class IdentityService:
    @staticmethod
    def get_mock_sessions() -> List[UserSession]:
        sessions = [
            UserSession(
                id="sess_001", user="dev_alex", ip_address="192.168.1.5", location="New York, USA",
                risk_level="Safe", timestamp=datetime.now().isoformat()
            ),
            UserSession(
                id="sess_002", user="dev_sam", ip_address="45.33.22.11", location="London, UK",
                risk_level="Impossible Travel", timestamp=datetime.now().isoformat()
            ),
             UserSession(
                id="sess_003", user="admin_kate", ip_address="203.0.113.5", location="New York, USA",
                risk_level="MFA Fatigue", timestamp=datetime.now().isoformat()
            ),
             UserSession(
                id="sess_004", user="dev_mike", ip_address="10.0.0.50", location="Austin, USA",
                risk_level="Safe", timestamp=datetime.now().isoformat()
            ),
        ]
        return sessions
        
    @staticmethod
    def get_current_user_risk(user: str) -> int:
        # Mock logic: return high risk for specific users
        if "sam" in user or "kate" in user:
            return random.randint(60, 90)
        return random.randint(0, 20)

class CodeService:
    @staticmethod
    def analyze_code_mock(code_snippet: str) -> CodeAnalysisResult:
        # Simple keyword matching to simulate AI analysis
        vulnerabilities = []
        score = 0
        rewrite = ""
        
        lower_code = code_snippet.lower()
        
        if "select * from" in lower_code and "where" in lower_code and ("%s" not in lower_code and "?" not in lower_code):
            vulnerabilities.append("SQL Injection (OWASP A03:2021)")
            score += 60
            rewrite = "Use parameterized queries. Example: `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`"
        
        if "password" in lower_code and ("print" in lower_code or "console.log" in lower_code):
             vulnerabilities.append("Sensitive Data Exposure (OWASP A01:2021)")
             score += 40
             rewrite += "\nNever log sensitive information like passwords."
             
        if "eval(" in lower_code:
            vulnerabilities.append("Insecure Deserialization / Remote Code Execution")
            score += 80
            rewrite += "\nAvoid using eval()."
            
        if not vulnerabilities:
            rewrite = "Code looks clean."
            score = random.randint(0, 10)
            
        return CodeAnalysisResult(
            files_analyzed=1,
            vulnerabilities_found=len(vulnerabilities),
            owasp_top_10=vulnerabilities,
            secure_rewrite_suggestion=rewrite,
            vulnerability_score=score
        )
