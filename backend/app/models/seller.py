from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SellerBase(BaseModel):
    name: str
    email: str
    mobile: str
    home_address: str
    pickup_address: str
    business_name: str
    pan_card: str
    bank_account_number: str
    ifsc_code: str
    gstin: Optional[str] = None
    photo_url: Optional[str] = None
    bank_statement_url: Optional[str] = None
    address_proof_url: Optional[str] = None
    trademark_certificate_url: Optional[str] = None
    authorization_letter_url: Optional[str] = None

class SellerCreate(SellerBase):
    user_id: str

class SellerUpdate(BaseModel):
    name: Optional[str] = None
    mobile: Optional[str] = None
    home_address: Optional[str] = None
    pickup_address: Optional[str] = None
    business_name: Optional[str] = None
    pan_card: Optional[str] = None
    bank_account_number: Optional[str] = None
    ifsc_code: Optional[str] = None
    gstin: Optional[str] = None
    photo_url: Optional[str] = None
    bank_statement_url: Optional[str] = None
    address_proof_url: Optional[str] = None
    trademark_certificate_url: Optional[str] = None
    authorization_letter_url: Optional[str] = None

class SellerResponse(SellerBase):
    id: str
    user_id: str
    verification_status: str
    verification_notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
