from supabase import create_client
from app.config import settings
from app.models.auth import SignUpRequest, SignInRequest

def get_supabase():
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_ANON_KEY
    )

class AuthService:
    @staticmethod
    async def sign_up(request: SignUpRequest):
        """Sign up a new user"""
        supabase = get_supabase()
        try:
            response = supabase.auth.sign_up({
                "email": request.email,
                "password": request.password
            })
            return {
                "user_id": response.user.id,
                "email": response.user.email,
                "access_token": response.session.access_token if response.session else None
            }
        except Exception as e:
            raise Exception(f"Error signing up: {str(e)}")
    
    @staticmethod
    async def sign_in(request: SignInRequest):
        """Sign in a user"""
        supabase = get_supabase()
        try:
            response = supabase.auth.sign_in_with_password({
                "email": request.email,
                "password": request.password
            })
            return {
                "user_id": response.user.id,
                "email": response.user.email,
                "access_token": response.session.access_token
            }
        except Exception as e:
            raise Exception(f"Error signing in: {str(e)}")
    
    @staticmethod
    async def sign_out(access_token: str):
        """Sign out a user"""
        supabase = get_supabase()
        try:
            supabase.auth.sign_out()
            return True
        except Exception as e:
            raise Exception(f"Error signing out: {str(e)}")
    
    @staticmethod
    async def get_user(access_token: str):
        """Get current user info"""
        supabase = get_supabase()
        try:
            response = supabase.auth.get_user(access_token)
            return {
                "user_id": response.user.id,
                "email": response.user.email
            }
        except Exception as e:
            raise Exception(f"Error fetching user: {str(e)}")
