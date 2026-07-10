from fastapi import HTTPException, status
from app.config.database import get_database
from app.utils.security import hash_password, verify_password, verify_password
from app.core.security import create_access_token

db = get_database()


def register_user(user):

    existing_user = db.users.find_one({"email": user.email})

    if existing_user:
        return {
            "success": False,
            "message": "Email already exists"
        }

    user_data = {
        "full_name": user.full_name,
        "contact_no": user.contact_no,
        "email": user.email,
        "password": hash_password(user.password),
        "role": "employee",
        "is_active": True
    }

    db.users.insert_one(user_data)

    return {
        "success": True,
        "message": "Registration successful"
    }

def login_user(email: str, password: str):
    user = db.users.find_one({"email": email})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid email or password"
        )
    
    password_match = verify_password(password, user["password"])

    if not password_match:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token({"user_id": str(user["_id"]), "email": user["email"], "role": user["role"]})

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "full_name": user["full_name"],
            "email": user["email"],
            "role": user["role"]
        }
    }