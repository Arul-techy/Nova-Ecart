# Cryptomus Payment Integration Setup

This document explains how to configure Cryptomus payment integration for the NovaEcart store.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Cryptomus API Configuration
CRYPTOMUS_MERCHANT_ID=your_merchant_id_here
CRYPTOMUS_API_KEY=your_api_key_here
CRYPTOMUS_API_URL=https://api.cryptomus.com/v1

# Site URL (for payment callbacks)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Getting Cryptomus Credentials

1. Sign up for a Cryptomus account at [https://cryptomus.com](https://cryptomus.com)
2. Navigate to your merchant dashboard
3. Generate API credentials (Merchant ID and API Key)
4. Add these credentials to your environment variables

## How It Works

1. When a user clicks "Buy now" on a product:
   - The frontend calls `/api/cryptomus` with the product ID and price
   - The API creates a payment request with Cryptomus
   - User is redirected to Cryptomus payment page
   - After payment, user is redirected back to the store

2. Payment callbacks:
   - Cryptomus sends webhook notifications to `/api/cryptomus/callback`
   - The callback verifies the signature and processes the payment status
   - You can extend the callback handler to update orders, send emails, etc.

## Testing

For testing purposes, you can use Cryptomus test mode if available, or use their sandbox environment.

## Security Notes

- Never commit your API keys to version control
- Use environment variables for all sensitive credentials
- The callback endpoint verifies signatures to ensure requests are from Cryptomus
- Consider implementing additional security measures like rate limiting

