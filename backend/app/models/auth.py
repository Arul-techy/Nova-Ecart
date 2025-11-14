from pydantic import BaseModel, EmailStr
from typing import Optional

class SignUpRequest(BaseModel):
    email: EmailStr
    password: str

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    user_id: str
    email: str
    access_token: str
    refresh_token: Optional[str] = None
