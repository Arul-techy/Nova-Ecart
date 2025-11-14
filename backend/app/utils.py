"""
Utility functions for the backend
"""

import re
from typing import Optional

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    """Validate phone number format"""
    # Accept various phone formats
    pattern = r'^\+?1?\d{9,15}$'
    return re.match(pattern, phone.replace("-", "").replace(" ", "")) is not None

def validate_gstin(gstin: str) -> bool:
    """Validate GSTIN format (Indian GST number)"""
    pattern = r'^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$'
    return re.match(pattern, gstin.upper()) is not None if gstin else True

def validate_pan(pan: str) -> bool:
    """Validate PAN format (Indian PAN number)"""
    pattern = r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
    return re.match(pattern, pan.upper()) is not None

def validate_ifsc(ifsc: str) -> bool:
    """Validate IFSC code format (Indian bank IFSC)"""
    pattern = r'^[A-Z]{4}0[A-Z0-9]{6}$'
    return re.match(pattern, ifsc.upper()) is not None

def sanitize_string(value: str, max_length: Optional[int] = None) -> str:
    """Sanitize string input"""
    if not value:
        return ""
    sanitized = value.strip()
    if max_length:
        sanitized = sanitized[:max_length]
    return sanitized

def format_currency(amount: float, currency: str = "USD") -> str:
    """Format currency value"""
    return f"{currency} {amount:.2f}"
