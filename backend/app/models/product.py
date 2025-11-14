from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    title: str
    description: str
    price: float
    category: str
    stock: int

class ProductCreate(ProductBase):
    seller_id: str

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    stock: Optional[int] = None

class ProductResponse(ProductBase):
    id: str
    seller_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
