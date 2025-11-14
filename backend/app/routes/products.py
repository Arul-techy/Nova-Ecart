from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.models.product import ProductCreate, ProductUpdate, ProductResponse
from app.services.product_service import ProductService

router = APIRouter(prefix="/api/products", tags=["products"])

@router.post("/", response_model=ProductResponse)
async def create_product(product: ProductCreate):
    """Create a new product"""
    try:
        result = await ProductService.create_product(product)
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create product")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    """Get product by ID"""
    try:
        result = await ProductService.get_product(product_id)
        if not result:
            raise HTTPException(status_code=404, detail="Product not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/seller/{seller_id}")
async def get_seller_products(seller_id: str):
    """Get all products by a seller"""
    try:
        result = await ProductService.get_seller_products(seller_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list)
async def get_all_products(
    category: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get all products with optional filtering and pagination"""
    try:
        result = await ProductService.get_all_products(category, limit, offset)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, product: ProductUpdate):
    """Update a product"""
    try:
        result = await ProductService.update_product(product_id, product)
        if not result:
            raise HTTPException(status_code=404, detail="Product not found")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    """Delete a product"""
    try:
        await ProductService.delete_product(product_id)
        return {"message": "Product deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
