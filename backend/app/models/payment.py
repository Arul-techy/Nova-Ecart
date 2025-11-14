from pydantic import BaseModel
from typing import Optional

class PaymentRequest(BaseModel):
    product_id: str
    amount: float
    currency: str = "USDT"

class PaymentResponse(BaseModel):
    payment_url: str
    order_id: str
    status: str

class CryptomusCallback(BaseModel):
    order_id: str
    status: str
    payment_id: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
