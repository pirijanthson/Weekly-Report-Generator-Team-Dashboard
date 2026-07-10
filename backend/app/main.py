from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.database import get_database
from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router
from app.routes.admin_routes import router as admin_router
from app.routes.report_routes import router as report_router
from app.routes.dashbord_routes import router as dashboard_router
from app.routes.project_routes import router as project_router
from app.routes.ai_routes import router as ai_router

app = FastAPI(
    title="Weekly Report Generator API",
    version="1.0.0",
    description="Backend API for the Weekly Report Generator & Team Dashboard"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(admin_router)
app.include_router(report_router)
app.include_router(dashboard_router)
app.include_router(project_router)
app.include_router(ai_router)

@app.get("/")
def home():
    return {
        "message": "Weekly Report Generator Backend Running"
    }


@app.get("/test-db")
def test_db():
    db = get_database()
    return {
        "status": "MongoDB Connected",
        "database": db.name
    }