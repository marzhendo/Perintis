from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
import logging

logger = logging.getLogger("uvicorn")

def debug_key_func(request: Request) -> str:
    client_ip = request.client.host if request.client else "NO_CLIENT"
    logger.info(f"[RATE_LIMIT_DEBUG] key={client_ip}, client={request.client}")
    return client_ip

limiter = Limiter(key_func=debug_key_func)
