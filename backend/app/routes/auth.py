from fastapi import APIRouter, HTTPException, Depends, status
from app.models.auth import SignUpRequest, SignInRequest, AuthResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/sign-up", response_model=AuthResponse)
async def sign_up(request: SignUpRequest):
    """Create a new user account"""
    try:
        result = await AuthService.sign_up(request)
        return AuthResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/sign-in", response_model=AuthResponse)
async def sign_in(request: SignInRequest):
    """Sign in with email and password"""
    try:
        result = await AuthService.sign_in(request)
        return AuthResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/sign-out")
async def sign_out(access_token: str):
    """Sign out the current user"""
    try:
        await AuthService.sign_out(access_token)
        return {"message": "Signed out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/user")
async def get_user(access_token: str):
    """Get current user information"""
    try:
        result = await AuthService.get_user(access_token)
        return result
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
