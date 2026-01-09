from pydantic import BaseModel
from typing import Tuple, Dict

class RiskAssessment(BaseModel):
    global_risk_score: int
    status: str
    active_threats: int

class CorrelationEngine:
    @staticmethod
    def calculate_risk(identity_risk: int, vulnerability_score: int) -> Dict:
        """
        Combines Identity Risk (0-100) and Code Vulnerability Score (0-100)
        to determine the Global Risk Score.
        """
        
        # Base logic: If both are high, risk is Critical (100)
        # Weightage: Identity 40%, Code 60%, but synergy adds multipliers.
        
        base_score = (identity_risk * 0.4) + (vulnerability_score * 0.6)
        
        status = "NORMAL"
        
        # Synergy Detection: High Identity Risk + High Vulnerability = CRITICAL
        if identity_risk > 50 and vulnerability_score > 50:
            final_score = 100
            status = "CRITICAL_SYSTEM_LOCK"
        elif identity_risk > 80 or vulnerability_score > 80:
            final_score = max(base_score, 85)
            status = "HIGH_RISK"
        elif identity_risk > 50 or vulnerability_score > 50:
            final_score = max(base_score, 60)
            status = "MODERATE_RISK"
        else:
            final_score = base_score
            status = "SECURE"
            
        return {
            "global_risk_score": int(final_score),
            "status": status,
            "active_threats": 1 if final_score > 50 else 0
        }

    @staticmethod
    def calculate_global_risk(identity_risk: int, vulnerability_score: int) -> Tuple[int, str]:
        # Legacy compat method
        res = CorrelationEngine.calculate_risk(identity_risk, vulnerability_score)
        return res["global_risk_score"], res["status"]
