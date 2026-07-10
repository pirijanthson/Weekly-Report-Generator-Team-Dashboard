from pydantic import BaseModel, EmailStr, field_validator
import re

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    contact_no: str
    password: str
    confirm_password: str

    @field_validator('contact_no')
    @classmethod
    def validate_contact_no(cls, value):
        pattern = r"^(?:\+94|0)7[012456789][0-9]{7}$"

        if not re.match(pattern, value):
            raise ValueError("Invalid contact number format. It should start with +94 or 0 followed by 7 and a valid digit.")
        return value
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search(r"[a-z]", value):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not re.search(r"\d", value):
            raise ValueError("Password must contain at least one digit.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError("Password must contain at least one special character.")
        return value
    
    @field_validator('confirm_password')
    @classmethod
    def passwords_match(cls, value, info):
        password = info.data.get('password')
        if password != value:
            raise ValueError("Passwords do not match.")
        return value
    
class UserLogin(BaseModel):
        email: EmailStr
        password: str