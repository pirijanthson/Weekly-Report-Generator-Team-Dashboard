import os
import json
import urllib.request
import urllib.error
from app.config.database import get_database

def get_reports_context():
    db = get_database()
    reports = db.weekly_reports.find({}, {
        "_id": 0,
        "full_name": 1,
        "email": 1,
        "week_start": 1,
        "project": 1,
        "tasks_completed": 1,
        "tasks_planned": 1,
        "blockers": 1,
        "hours_worked": 1
    })
    
    context_lines = []
    for r in reports:
        # tasks completed
        completed = r.get("tasks_completed", [])
        completed_strs = []
        for t in completed:
            if isinstance(t, dict):
                completed_strs.append(t.get("title", t.get("name", str(t))))
            else:
                completed_strs.append(str(t))
        completed_txt = ", ".join(completed_strs) if completed_strs else "None"

        # tasks planned
        planned = r.get("tasks_planned", [])
        planned_strs = []
        for t in planned:
            if isinstance(t, dict):
                planned_strs.append(t.get("title", t.get("name", str(t))))
            else:
                planned_strs.append(str(t))
        planned_txt = ", ".join(planned_strs) if planned_strs else "None"

        blockers = r.get("blockers", "None")
        if not blockers or blockers.strip() == "":
            blockers = "None"
            
        context_lines.append(
            f"Member: {r.get('full_name')} ({r.get('email')})\n"
            f"Week Start: {r.get('week_start')}\n"
            f"Project: {r.get('project')}\n"
            f"Completed Tasks: {completed_txt}\n"
            f"Planned Tasks: {planned_txt}\n"
            f"Blockers: {blockers}\n"
            f"Hours Worked: {r.get('hours_worked', 0)}\n"
            "---"
        )
    return "\n".join(context_lines)

def run_mock_fallback(user_message):
    # Retrieve data stats to make the fallback intelligent
    db = get_database()
    total_reports = db.weekly_reports.count_documents({})
    reports_with_blockers = list(db.weekly_reports.find({"blockers": {"$exists": True, "$ne": ""}}))
    blocker_count = len(reports_with_blockers)
    
    projects = db.weekly_reports.distinct("project")
    members = db.weekly_reports.distinct("email")
    
    blocker_details = []
    for r in reports_with_blockers:
        blocker_details.append(f"- {r.get('full_name')} on project '{r.get('project')}': \"{r.get('blockers')}\"")
    blockers_text = "\n".join(blocker_details) if blocker_details else "No open blockers reported."

    summary = (
        f"🤖 **[AI Demo Mode]** *Note: Set `GEMINI_API_KEY` in the backend `.env` file to enable live AI responses.*\n\n"
        f"Here is an automated overview of your team's reports database:\n"
        f"- **Team Members**: {len(members)} active members ({', '.join(members) if members else 'None'})\n"
        f"- **Total Submitted Reports**: {total_reports}\n"
        f"- **Projects Tracked**: {len(projects)} ({', '.join(projects) if projects else 'None'})\n"
        f"- **Open Blockers**: {blocker_count}\n\n"
        f"**Reported Blockers**:\n{blockers_text}\n\n"
        f"To assist further, you can ask questions like 'What are the current blockers?', 'Who is working on what?', or setup your Gemini API Key in the backend `.env` to start asking arbitrary questions!"
    )
    return summary

def ask_ai_assistant(user_message, history=None):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.strip() == "" or api_key.startswith("YOUR_"):
        return run_mock_fallback(user_message)

    reports_context = get_reports_context()
    
    # Prepend context to the first prompt
    system_instruction = (
        "You are TeamPulse AI, a powerful, helpful coding and team dashboard assistant for managers.\n"
        "Below is the current weekly reports context retrieved directly from the dashboard MongoDB database.\n"
        f"--- DATABASE WEEKLY REPORTS CONTEXT ---\n{reports_context}\n---------------------------------------\n"
        "Your task is to answer the manager's query based strictly on the database context. "
        "Highlight achievements, summarize work, flag active blockers, identify workload imbalances (e.g. some members logging too many hours or others with zero), "
        "and mention missing reports. Keep your responses structured with markdown, bullet points, and highlight member names/emails."
    )

    # Format content turns for Gemini
    contents = []
    
    # Add history
    if history:
        for turn in history:
            role = "model" if turn.get("role") == "assistant" else "user"
            contents.append({
                "role": role,
                "parts": [{"text": turn.get("message", "")}]
            })
            
    # Add new user message prepended with system instruction
    contents.append({
        "role": "user",
        "parts": [{"text": f"{system_instruction}\n\nManager Query: {user_message}"}]
    })

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 1000
        }
    }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    req_body = json.dumps(payload).encode("utf-8")
    
    req = urllib.request.Request(
        url,
        data=req_body,
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            candidates = res_data.get("candidates", [])
            if candidates:
                content = candidates[0].get("content", {})
                parts = content.get("parts", [])
                if parts:
                    return parts[0].get("text", "No response received.")
            return "Failed to parse AI response. Please check raw API response."
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8")
        print(f"Gemini API HTTP Error: {error_msg}")
        return f"⚠️ API Error (HTTP {e.code}): Failed to connect to Gemini API. Details: {e.reason}. Please make sure your GEMINI_API_KEY is correct."
    except Exception as e:
        print(f"AI Assistant Error: {str(e)}")
        return f"⚠️ Error: Failed to communicate with AI Assistant. Details: {str(e)}"
