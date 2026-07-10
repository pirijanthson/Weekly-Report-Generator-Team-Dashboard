from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.core.admin_auth import get_current_admin
from app.services.ai_service import ask_ai_assistant

router = APIRouter(
    prefix="/dashboard/ai",
    tags=["AI Assistant"]
)

class ChatTurn(BaseModel):
    role: str # "user" or "assistant"
    message: str

class AIChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatTurn]] = None

@router.post("/chat")
def chat_with_assistant(
    request: AIChatRequest,
    admin=Depends(get_current_admin)
):
    history_list = []
    if request.history:
        for turn in request.history:
            history_list.append({
                "role": turn.role,
                "message": turn.message
            })
            
    response_text = ask_ai_assistant(request.message, history_list)
    
    return {
        "success": True,
        "response": response_text
    }
