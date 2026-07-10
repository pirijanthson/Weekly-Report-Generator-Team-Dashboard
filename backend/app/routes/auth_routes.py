from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.user_schema import UserRegister
from app.services.auth_service import register_user, login_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================
# User Registration
# ==========================

@router.post("/register")
def register(user: UserRegister):

    return register_user(user)



# ==========================
# User Login
# ==========================

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    return login_user(
        form_data.username,
        form_data.password
    )