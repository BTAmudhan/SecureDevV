from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Union
import os
import random

from correlation_engine import CorrelationEngine, RiskAssessment
# Import both service types
from mock_services import IdentityService as MockIdentity, CodeService as MockCode
from live_services import LiveIdentityService, LiveCodeService
from mock_services import UserSession, CodeAnalysisResult

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# --- CONFIGURATION ---
# For Demo: Defaulting to TRUE to show the user the Live Mode activation
# Checks env var first, defaults to True if not present to satisfy demo req
use_live_env = os.getenv("USE_LIVE_SERVICES", "True").lower()
USE_LIVE_SERVICES = use_live_env == "true"

# Service Factory
if USE_LIVE_SERVICES:
    print("🚀 SYSTEM: Starting in LIVE MODE (Azure OpenAI + Entra ID)")
    identity_service = LiveIdentityService()
    code_service = LiveCodeService()
else:
    print("⚠️ SYSTEM: Starting in MOCK MODE")
    identity_service = MockIdentity()
    code_service = MockCode()

app = FastAPI(title="SecureDev-Trust API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    mode = "LIVE" if USE_LIVE_SERVICES else "MOCK"
    return {"status": "running", "system": "SecureDev_Trust_Core", "mode": mode}

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    # 1. Get Identity Risks
    # In live mode, this fetches from Graph API
    sessions = identity_service.get_mock_sessions()
    risky_sessions = [s for s in sessions if s.risk_level != "Safe"]
    
    # 2. Calculate Identity Risk Component
    # We take the max risk of any active user to determine the 'Identity Threat Level'
    # LiveService: uses specific user logic or simplified max logic
    current_identity_risk = 0
    if sessions:
        # Just grab the highest risk from sessions for the dashboard summary
        # Map levels to scores: Safe=0, MFA Fatigue=60, Impossible Travel=90
        risk_scores = []
        for s in sessions:
            if s.risk_level == "Impossible Travel": risk_scores.append(90)
            elif s.risk_level == "MFA Fatigue": risk_scores.append(60)
            else: risk_scores.append(0)
        current_identity_risk = max(risk_scores) if risk_scores else 0

    # 3. Code Risk Component
    # Ideally this comes from the last scan DB, for now we simulate state or random
    # To demonstrate correlation, we'll randomize it in mock, 
    # but in LIVE mode we might default to 0 until a scan happens.
    current_vul_score = random.randint(0, 30) if not USE_LIVE_SERVICES else 0
    
    # Calculate Global Risk
    risk_assessment = CorrelationEngine.calculate_risk(current_identity_risk, current_vul_score)
    
    return {
        "global_risk": risk_assessment,
        "active_sessions": len(sessions),
        "threats_detected": len(risky_sessions),
        "recent_vulnerabilities": 2 if current_identity_risk > 50 else 0
    }

@app.get("/api/identity/sessions", response_model=List[UserSession])
def get_sessions():
    return identity_service.get_mock_sessions()

@app.post("/api/auditor/analyze", response_model=CodeAnalysisResult)
def analyze_code(code: str = Body(..., embed=True)):
    # 1. Run Analysis (AI or Mock)
    result = code_service.analyze_code_mock(code)
    
    # 2. Correlate with 'Current User'
    # In a real app, we'd get the user from the JWT.
    # We'll hardcode 'dev_sam' (the risky user) for the demo flow if in Mock,
    # or just use a generic check in Live.
    
    # Let's say we want to show the Correlation Engine effect:
    # We fetch the risk of the "current user"
    user_risk = identity_service.get_current_user_risk("dev_sam") 
    
    # 3. Calculate Dynamic Global Risk based on this specific action
    correlation = CorrelationEngine.calculate_risk(user_risk, result.vulnerability_score)
    
    # OPTIONAL: You could return the correlated risk in the response too, 
    # but the frontend mostly cares about the code analysis result here.
    
    return result

@app.get("/api/events")
def get_security_events():
    events = [
        {"id": 1, "type": "warning", "message": "Admin login from new IP (45.33.22.11)", "timestamp": "2 mins ago"},
        {"id": 2, "type": "success", "message": "Automated security scan completed. No critical issues.", "timestamp": "10 mins ago"},
        {"id": 3, "type": "info", "message": "User 'dev_alex' committed to 'main'.", "timestamp": "15 mins ago"},
    ]
    
    # In Live Mode, we might fetch real alerts, but for now we keep the feed mocked/static 
    # unless we want to map Graph alerts here too.
    
    if random.random() > 0.7:
         events.insert(0, {"id": 0, "type": "critical", "message": "CRITICAL: Correlation Engine detected simultaneous Identity/Code risk.", "timestamp": "Just now"})
    
    return events
