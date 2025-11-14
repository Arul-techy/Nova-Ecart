import hashlib
import base64
import json
import httpx
from app.config import settings
from app.models.payment import PaymentRequest, PaymentResponse
from datetime import datetime

class CryptomusService:
    @staticmethod
    def generate_signature(payload: str, api_key: str) -> str:
        """Generate MD5 signature for Cryptomus API"""
        message = base64.b64encode(payload.encode()).decode() + api_key
        return hashlib.md5(message.encode()).hexdigest()
    
    @staticmethod
    async def create_payment(payment: PaymentRequest, user_id: str):
        """Create a payment request with Cryptomus"""
        try:
            order_id = f"order_{payment.product_id}_{int(datetime.now().timestamp())}"
            
            payment_data = {
                "amount": str(payment.amount),
                "currency": payment.currency,
                "order_id": order_id,
                "url_return": f"{settings.SITE_URL}/store?payment=success",
                "url_callback": f"{settings.API_URL}/api/cryptomus/callback",
                "is_payment_multiple": False,
                "lifetime": 7200,  # 2 hours
                "to_currency": payment.currency,
            }
            
            payload = json.dumps(payment_data)
            signature = CryptomusService.generate_signature(
                payload,
                settings.CRYPTOMUS_API_KEY
            )
            
            headers = {
                "Content-Type": "application/json",
                "merchant": settings.CRYPTOMUS_MERCHANT_ID,
                "sign": signature
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.CRYPTOMUS_API_URL}/payment",
                    json=payment_data,
                    headers=headers,
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return PaymentResponse(
                        payment_url=result.get("url"),
                        order_id=order_id,
                        status="pending"
                    )
                else:
                    raise Exception(f"Cryptomus API error: {response.text}")
                    
        except Exception as e:
            raise Exception(f"Error creating payment: {str(e)}")
    
    @staticmethod
    async def verify_callback(data: dict, signature: str) -> bool:
        """Verify Cryptomus callback signature"""
        try:
            payload = json.dumps(data)
            expected_signature = CryptomusService.generate_signature(
                payload,
                settings.CRYPTOMUS_API_KEY
            )
            return signature == expected_signature
        except Exception as e:
            raise Exception(f"Error verifying callback: {str(e)}")
    
    @staticmethod
    async def process_payment_callback(data: dict):
        """Process payment callback from Cryptomus"""
        try:
            order_id = data.get("order_id")
            status = data.get("status")
            
            # Update order status in database
            # This should be implemented based on your database schema
            
            return {
                "order_id": order_id,
                "status": status,
                "processed": True
            }
        except Exception as e:
            raise Exception(f"Error processing callback: {str(e)}")
