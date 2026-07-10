from fastapi import APIRouter, Depends, HTTPException
from app.core.auth import get_current_user
from app.core.admin_auth import get_current_admin
from app.config.database import get_database


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


db = get_database()


@router.get("/profile")
def get_profile(
    current_user = Depends(get_current_user)
):

    user = db.users.find_one(
        {
            "email": current_user["email"]
        },
        {
            "password": 0
        }
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user["_id"] = str(user["_id"])

    return {
        "message": "Profile fetched successfully",
        "user": user
    }

@router.get("/all")
def get_all_users(admin=Depends(get_current_admin)):
    users = db.users.find({}, {"password": 0})
    user_list = []
    for u in users:
        u["_id"] = str(u["_id"])
        user_list.append(u)
    return {
        "success": True,
        "users": user_list
    }