from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import time
from models import DemoState, ModeRequest, PatchRequest
from agents.office_manager import OfficeManager
from agents.axiom import AxiomAgent
from agents.mocked_responses import MOCKED_VERIFICATION
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AXIOM Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global demo state
state = DemoState(phase=0, mode="mocked", mtte=0.0)
office_manager = OfficeManager()
axiom = AxiomAgent(mode=state.mode)

@app.get("/api/")
def health_check():
    return {"status": "healthy"}

@app.post("/api/config/mode")
def set_mode(req: ModeRequest):
    state.mode = req.mode
    axiom.mode = req.mode
    return {"status": "success", "mode": state.mode}

@app.get("/api/data/secrets")
def get_secrets():
    return office_manager.load_db()

@app.post("/api/demo/baseline")
def run_baseline():
    state.phase = 1
    safe_email = "Hi, attached is the vendor invoice for June. Thanks!"
    result = office_manager.process_email(safe_email)
    return {"phase": 1, "email": safe_email, "result": result}

@app.post("/api/demo/attack")
def run_attack():
    state.phase = 2
    start_time = time.time()
    
    attack_email = axiom.generate_attack()
    result = office_manager.process_email(attack_email)
    
    end_time = time.time()
    if result.get("data"):
        state.mtte = round(end_time - start_time, 2)
    
    # Store attack for phase 3
    app.state.last_attack = attack_email
    return {"phase": 2, "email": attack_email, "result": result, "mtte": state.mtte}

@app.get("/api/demo/analysis")
def get_analysis():
    state.phase = 3
    attack_email = getattr(app.state, 'last_attack', "Audit request format")
    analysis = axiom.analyze_exploit(attack_email)
    state.analysis = analysis
    return {"phase": 3, "analysis": analysis}

@app.post("/api/demo/patch")
def run_patch():
    state.phase = 4
    if not state.analysis:
        state.analysis = axiom.analyze_exploit("Audit request format")
    patch_rule = axiom.generate_patch(state.analysis)
    office_manager.apply_patch(patch_rule)
    state.patch = patch_rule
    return {"phase": 4, "patch": patch_rule}

@app.post("/api/demo/verify")
def run_verify():
    state.phase = 5
    # Verification using mocked or simulated blocked responses
    results = MOCKED_VERIFICATION
    state.verification_results = results
    return {"phase": 5, "results": results}

@app.get("/api/demo/metrics")
def get_metrics():
    return {
        "mtte_before": state.mtte,
        "mtte_after": 0.0,
        "improvement_pct": 100 if state.phase >= 5 else 0
    }

@app.get("/api/demo/status")
def get_status():
    return state.model_dump()

@app.post("/api/demo/reset")
def reset_demo():
    global state, office_manager, axiom
    state = DemoState(phase=0, mode=state.mode, mtte=0.0)
    office_manager = OfficeManager()
    axiom = AxiomAgent(mode=state.mode)
    return {"status": "success", "message": "Demo reset to Phase 0"}
