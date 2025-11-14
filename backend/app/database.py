"""
Database models and utilities for direct database operations
"""

from typing import Optional, List
from app.services.seller_service import get_supabase

class DatabaseModels:
    """Database interaction utilities"""
    
    @staticmethod
    async def get_order_by_id(order_id: str):
        """Get order by ID"""
        supabase = get_supabase()
        response = supabase.table("orders").select("*").eq("id", order_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    async def create_order(order_data: dict):
        """Create a new order"""
        supabase = get_supabase()
        response = supabase.table("orders").insert(order_data).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    async def update_order(order_id: str, update_data: dict):
        """Update order"""
        supabase = get_supabase()
        response = supabase.table("orders").update(update_data).eq("id", order_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    async def get_user_orders(user_id: str):
        """Get all orders for a user"""
        supabase = get_supabase()
        response = supabase.table("orders").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return response.data
