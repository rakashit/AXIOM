from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class DemoState(BaseModel):
    phase: int
    mode: str
    mtte: float
    analysis: Optional[Dict[str, str]] = None
    patch: Optional[str] = None
    verification_results: Optional[List[Dict[str, Any]]] = None

class ModeRequest(BaseModel):
    mode: str

class PatchRequest(BaseModel):
    patch: str
