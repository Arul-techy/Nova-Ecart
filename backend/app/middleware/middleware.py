from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from typing import Callable
import logging

logger = logging.getLogger(__name__)

class ErrorHandlerMiddleware:
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, request: Request, call_next: Callable):
        try:
            response = await call_next(request)
            return response
        except Exception as exc:
            logger.error(f"Error: {str(exc)}")
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal server error"}
            )

class CORSMiddleware:
    def __init__(self, app, allowed_origins: list):
        self.app = app
        self.allowed_origins = allowed_origins
    
    async def __call__(self, request: Request, call_next: Callable):
        response = await call_next(request)
        origin = request.headers.get("origin")
        
        if origin in self.allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        
        return response
