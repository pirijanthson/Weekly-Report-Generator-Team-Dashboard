from fastapi import APIRouter, Depends
from app.schemas.admin_schema import AdminLogin
from app.services.admin_service import admin_login, logout_admin
from app.core.admin_auth import get_current_admin

router = APIRouter(
    prefix="/admins",
    tags=["Admins"]
)

@router.post("/login")
def login(admin: AdminLogin):
    return admin_login(admin.email, admin.password)

@router.post("/logout")
def logout(admin=Depends(get_current_admin)):
    return logout_admin()