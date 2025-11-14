# Nova Ecart Python Backend

A complete rewrite of the Nova Ecart backend using Python and FastAPI.

## Features

- **Authentication**: Email/password sign-up and sign-in
- **Seller Management**: Complete seller profile management and approval workflow
- **Product Management**: Full CRUD operations for products
- **Payment Processing**: Cryptomus integration for cryptocurrency payments
- **Database**: Supabase PostgreSQL integration

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py              # Configuration settings
│   ├── main.py                # FastAPI application
│   ├── models/                # Pydantic models
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── seller.py
│   │   ├── product.py
│   │   └── payment.py
│   ├── services/              # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── seller_service.py
│   │   ├── product_service.py
│   │   └── payment_service.py
│   ├── routes/                # API endpoints
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── sellers.py
│   │   ├── products.py
│   │   └── payments.py
│   └── middleware/            # Custom middleware
│       ├── __init__.py
│       └── middleware.py
├── requirements.txt           # Python dependencies
└── .env.example              # Environment variables template
```

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and update with your values:

```bash
cp .env.example .env.local
```

### 3. Run the Server

```bash
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Create a new account
- `POST /api/auth/sign-in` - Sign in with email/password
- `POST /api/auth/sign-out` - Sign out user
- `GET /api/auth/user` - Get current user info

### Sellers
- `POST /api/sellers/` - Create seller profile
- `GET /api/sellers/{seller_id}` - Get seller by ID
- `GET /api/sellers/user/{user_id}` - Get seller by user ID
- `PUT /api/sellers/{seller_id}` - Update seller profile
- `GET /api/sellers/` - Get all sellers (with optional status filter)
- `POST /api/sellers/{seller_id}/approve` - Approve seller (admin)
- `POST /api/sellers/{seller_id}/reject` - Reject seller (admin)

### Products
- `POST /api/products/` - Create product
- `GET /api/products/{product_id}` - Get product
- `GET /api/products/seller/{seller_id}` - Get seller's products
- `GET /api/products/` - Get all products (with filtering and pagination)
- `PUT /api/products/{product_id}` - Update product
- `DELETE /api/products/{product_id}` - Delete product

### Payments
- `POST /api/cryptomus/payment` - Create payment request
- `POST /api/cryptomus/callback` - Handle Cryptomus callback
- `GET /api/cryptomus/status/{order_id}` - Get payment status

## Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Key Technologies

- **Framework**: FastAPI
- **Server**: Uvicorn
- **Database**: Supabase (PostgreSQL)
- **Validation**: Pydantic
- **HTTP Client**: HTTPX
- **Environment**: python-dotenv

## Next Steps

1. Update environment variables with your Supabase and Cryptomus credentials
2. Test API endpoints using Swagger UI
3. Connect frontend to use new Python backend
4. Deploy to production (Heroku, Railway, Render, etc.)
