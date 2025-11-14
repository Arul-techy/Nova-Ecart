import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Supabase
    SUPABASE_URL: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    # Cryptomus
    CRYPTOMUS_MERCHANT_ID: str = os.getenv("CRYPTOMUS_MERCHANT_ID", "")
    CRYPTOMUS_API_KEY: str = os.getenv("CRYPTOMUS_API_KEY", "")
    CRYPTOMUS_API_URL: str = os.getenv("CRYPTOMUS_API_URL", "https://api.cryptomus.com/v1")
    
    # Site
    SITE_URL: str = os.getenv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000")
    API_URL: str = os.getenv("API_URL", "http://localhost:8000")
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:8000"]
    
    class Config:
        env_file = ".env.local"
        case_sensitive = True

settings = Settings()
