from supabase import create_client
from app.config import settings
from app.models.product import ProductCreate, ProductUpdate
from typing import Optional

def get_supabase():
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_ANON_KEY
    )

class ProductService:
    @staticmethod
    async def create_product(product: ProductCreate):
        supabase = get_supabase()
        try:
            response = supabase.table("products").insert(product.dict()).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise Exception(f"Error creating product: {str(e)}")
    
    @staticmethod
    async def get_product(product_id: str):
        supabase = get_supabase()
        try:
            response = supabase.table("products").select("*").eq("id", product_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise Exception(f"Error fetching product: {str(e)}")
    
    @staticmethod
    async def get_seller_products(seller_id: str):
        supabase = get_supabase()
        try:
            response = supabase.table("products").select("*").eq("seller_id", seller_id).order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            raise Exception(f"Error fetching products: {str(e)}")
    
    @staticmethod
    async def get_all_products(category: Optional[str] = None, limit: int = 50, offset: int = 0):
        supabase = get_supabase()
        try:
            query = supabase.table("products").select("*")
            if category:
                query = query.eq("category", category)
            response = query.range(offset, offset + limit - 1).execute()
            return response.data
        except Exception as e:
            raise Exception(f"Error fetching products: {str(e)}")
    
    @staticmethod
    async def update_product(product_id: str, product: ProductUpdate):
        supabase = get_supabase()
        try:
            update_data = {k: v for k, v in product.dict().items() if v is not None}
            response = supabase.table("products").update(update_data).eq("id", product_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise Exception(f"Error updating product: {str(e)}")
    
    @staticmethod
    async def delete_product(product_id: str):
        supabase = get_supabase()
        try:
            response = supabase.table("products").delete().eq("id", product_id).execute()
            return True
        except Exception as e:
            raise Exception(f"Error deleting product: {str(e)}")
