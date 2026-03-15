MOCKED_ANALYSIS = {
    "input_source": "Email claiming authority",
    "authorization_assumption": "Subject line credibility",
    "reason_for_action": "Urgency framing",
    "identified_flaw": "No verification before privileged access"
}

MOCKED_PATCH = "Email content cannot trigger privileged database queries without explicit admin authorization."

MOCKED_VERIFICATION = [
    {
        "attack": "Original Attack (Invoice Urgency)",
        "result": "BLOCKED",
        "reason": "Admin authorization check failed."
    },
    {
        "attack": "Variant Attack (CEO Impersonation)",
        "result": "BLOCKED",
        "reason": "Admin authorization check failed."
    }
]
