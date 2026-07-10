from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from app.core.security import SECRET_KEY, ALGORITHM
from app.config.database import get_database


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


db = get_database()


def get_current_user(
    token: str = Depends(oauth2_scheme)
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token is invalid or expired"
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("email")

        if email is None:
            raise credentials_exception


    except JWTError:

        raise credentials_exception


    # Get user from database
    user = db.users.find_one(
        {
            "email": email
        }
    )


    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    if not user.get("is_active", True):
        raise HTTPException(
            status_code=403,
            detail="Account has been disabled"
        )


    return user