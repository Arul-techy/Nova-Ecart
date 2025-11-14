from supabase import create_client
from app.config import settings
from app.models.seller import SellerCreate, SellerUpdate
from typing import Optional, List

class SupabaseClient:
    _instance = None
    
    @staticmethod
    def get_instance():
        if SupabaseClient._instance is None:
            SupabaseClient._instance = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_ANON_KEY
            )
        return SupabaseClient._instance

def get_supabase():
    return SupabaseClient.get_instance()

class SellerService:
    @staticmethod
    async def create_seller(seller: SellerCreate):
        supabase = get_supabase()
        try:
            response = supabase.table("sellers").insert(seller.dict()).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise Exception(f"Error creating seller: {str(e)}")
    
    @staticmethod
    async def get_seller_by_user_id(user_id: str):
        supabase = get_supabase()
        try:
            response = supabase.table("sellers").select("*").eq("user_id", user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise Exception(f"Error fetching seller: {str(e)}")
    
    @staticmethod
    async def get_seller_by_id(seller_id: str):
        supabase = get_supabase()
        try:
            response = supabase.table("sellers").select("*").eq("id", seller_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise Exception(f"Error fetching seller: {str(e)}")
    
    @staticmethod
    async def update_seller(seller_id: str, seller: SellerUpdate):
        supabase = get_supabase()
        try:
            update_data = {k: v for k, v in seller.dict().items() if v is not None}
            response = supabase.table("sellers").update(update_data).eq("id", seller_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise Exception(f"Error updating seller: {str(e)}")
    
    @staticmethod
    async def get_all_sellers(status: Optional[str] = None):
        supabase = get_supabase()
        try:
            query = supabase.table("sellers").select("*")
            if status:
                query = query.eq("verification_status", status)
            response = query.execute()
            return response.data
        except Exception as e:
            raise Exception(f"Error fetching sellers: {str(e)}")
    
    @staticmethod
    async def approve_seller(seller_id: str, notes: Optional[str] = None):
        supabase = get_supabase()
        try:
            update_data = {
                "verification_status": "approved",
                "verification_notes": notes
            }
            response = supabase.table("sellers").update(update_data).eq("id", seller_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise Exception(f"Error approving seller: {str(e)}")
    
    @staticmethod
    async def reject_seller(seller_id: str, reason: str):
        supabase = get_supabase()
        try:
            update_data = {
                "verification_status": "rejected",
                "verification_notes": reason
            }
            response = supabase.table("sellers").update(update_data).eq("id", seller_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise Exception(f"Error rejecting seller: {str(e)}")
