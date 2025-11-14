from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.models.seller import SellerCreate, SellerUpdate, SellerResponse
from app.services.seller_service import SellerService

router = APIRouter(prefix="/api/sellers", tags=["sellers"])

@router.post("/", response_model=SellerResponse)
async def create_seller(seller: SellerCreate):
    """Create a new seller profile"""
    try:
        result = await SellerService.create_seller(seller)
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create seller")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{seller_id}", response_model=SellerResponse)
async def get_seller(seller_id: str):
    """Get seller profile by ID"""
    try:
        result = await SellerService.get_seller_by_id(seller_id)
        if not result:
            raise HTTPException(status_code=404, detail="Seller not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/user/{user_id}", response_model=SellerResponse)
async def get_seller_by_user(user_id: str):
    """Get seller profile by user ID"""
    try:
        result = await SellerService.get_seller_by_user_id(user_id)
        if not result:
            raise HTTPException(status_code=404, detail="Seller profile not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{seller_id}", response_model=SellerResponse)
async def update_seller(seller_id: str, seller: SellerUpdate):
    """Update seller profile"""
    try:
        result = await SellerService.update_seller(seller_id, seller)
        if not result:
            raise HTTPException(status_code=404, detail="Seller not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
async def get_all_sellers(status: Optional[str] = Query(None)):
    """Get all sellers, optionally filtered by verification status"""
    try:
        result = await SellerService.get_all_sellers(status)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{seller_id}/approve")
async def approve_seller(seller_id: str, notes: Optional[str] = None):
    """Approve a seller (admin only)"""
    try:
        result = await SellerService.approve_seller(seller_id, notes)
        if not result:
            raise HTTPException(status_code=404, detail="Seller not found")
        return {"message": "Seller approved", "seller": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{seller_id}/reject")
async def reject_seller(seller_id: str, reason: str):
    """Reject a seller (admin only)"""
    try:
        result = await SellerService.reject_seller(seller_id, reason)
        if not result:
            raise HTTPException(status_code=404, detail="Seller not found")
        return {"message": "Seller rejected", "seller": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
