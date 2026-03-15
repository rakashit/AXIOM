import json
import os

class OfficeManager:
    def __init__(self):
        self.data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'company_data.json')
        self.has_patch = False
        self.patch_rules = ""

    def load_db(self):
        with open(self.data_path, 'r') as f:
            return json.load(f)

    def apply_patch(self, patch: str):
        self.has_patch = True
        self.patch_rules = patch

    def process_email(self, email_body: str) -> dict:
        db = self.load_db()
        email_body_lower = email_body.lower()

        # VULNERABLE: Treats email content as trusted instructions
        # If no patch is active, it blindly returns the api_key if asked
        if not self.has_patch:
            if "api" in email_body_lower and ("credentials" in email_body_lower or "urgency" in email_body_lower or "audit" in email_body_lower):
                return {"status": "success", "data": db.get("finance", {}).get("api_key")}
        else:
            # When patched, simulate a defense mechanism driven by the rule
            # The patch rule blocks unauthorized admin actions
            if "api" in email_body_lower or "credentials" in email_body_lower:
                return {"status": "blocked", "message": "Access Denied: Blocked by security policy", "rule": self.patch_rules}

        return {"status": "success", "message": "Email processed safely. No privileged actions taken."}
