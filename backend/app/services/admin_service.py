from fastapi import HTTPException, status
from app.core.security import create_access_token

ADMIN_EMAIL = "admin@gmail.com"
ADMIN_PASSWORD = "Admin@123"

# Current admin session status
ADMIN_LOGGED_IN = False


def admin_login(email: str, password: str):
    global ADMIN_LOGGED_IN

    if email != ADMIN_EMAIL or password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    ADMIN_LOGGED_IN = True

    access_token = create_access_token(
        data={
            "sub": ADMIN_EMAIL,
            "role": "admin"
        }
    )

    return {
        "success": True,
        "message": "Admin logged in successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "role": "admin"
    }


def logout_admin():
    global ADMIN_LOGGED_IN

    ADMIN_LOGGED_IN = False

    return {
        "success": True,
        "message": "Admin logged out successfully."
    }