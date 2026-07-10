from fastapi import Depends, HTTPException, Request
from jose import jwt, JWTError

from app.core.security import SECRET_KEY, ALGORITHM
import app.services.admin_service as admin_service


def get_current_admin(
    request: Request
):

    # Get Authorization header manually
    authorization = request.headers.get("Authorization")


    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )


    try:

        scheme, token = authorization.split(" ")

    except ValueError:

        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format"
        )


    if scheme.lower() != "bearer":

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication scheme"
        )


    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )


        email = payload.get("sub")
        role = payload.get("role")


        if role != "admin":

            raise HTTPException(
                status_code=403,
                detail="Admin access required"
            )
        
        if not admin_service.ADMIN_LOGGED_IN:

            raise HTTPException(
                status_code=401,
                detail="Admin session expired. Please login again."
    )


        return {
            "email": email,
            "role": role
        }


    except JWTError as e:

        print("JWT ERROR:", e)

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
        