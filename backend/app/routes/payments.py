from fastapi import APIRouter, HTTPException
from app.models.payment import PaymentRequest, PaymentResponse, CryptomusCallback
from app.services.payment_service import CryptomusService

router = APIRouter(prefix="/api/cryptomus", tags=["payments"])

@router.post("/payment", response_model=PaymentResponse)
async def create_payment(payment: PaymentRequest, user_id: str):
    """Create a new payment request"""
    try:
        result = await CryptomusService.create_payment(payment, user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/callback")
async def handle_callback(data: dict, signature: str):
    """Handle payment callback from Cryptomus"""
    try:
        # Verify the callback signature
        is_valid = await CryptomusService.verify_callback(data, signature)
        if not is_valid:
            raise HTTPException(status_code=401, detail="Invalid signature")
        
        # Process the callback
        result = await CryptomusService.process_payment_callback(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/status/{order_id}")
async def get_payment_status(order_id: str):
    """Get payment status for an order"""
    try:
        # Implement based on your database schema
        return {"order_id": order_id, "status": "pending"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
