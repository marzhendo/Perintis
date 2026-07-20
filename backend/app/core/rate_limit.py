import time
from collections import defaultdict
from fastapi import Request, HTTPException

class SimpleRateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.history = defaultdict(list)

    def __call__(self, request: Request):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        
        self.history[client_ip] = [ts for ts in self.history[client_ip] if now - ts < self.window_seconds]
        
        if len(self.history[client_ip]) >= self.max_requests:
            raise HTTPException(
                status_code=429,
                detail="Terlalu banyak permintaan. Silakan coba lagi nanti."
            )
            
        self.history[client_ip].append(now)

# Rate limiters
copywriter_limiter = SimpleRateLimiter(max_requests=1, window_seconds=60) # Temporary 1/min
register_limiter = SimpleRateLimiter(max_requests=3, window_seconds=60)
login_limiter = SimpleRateLimiter(max_requests=5, window_seconds=60)
forgot_password_limiter = SimpleRateLimiter(max_requests=5, window_seconds=60)
reset_password_limiter = SimpleRateLimiter(max_requests=5, window_seconds=60)
