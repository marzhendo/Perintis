import time
from collections import defaultdict
from fastapi import Request, HTTPException

class SimpleRateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.history = defaultdict(list)

    def __call__(self, request: Request):
        # Cloud Run uses a reverse proxy load balancer.
        # We MUST read X-Forwarded-For to get the real client IP,
        # otherwise request.client.host will be the internal load balancer's IP
        # which changes frequently between requests.
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
        else:
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
copywriter_limiter = SimpleRateLimiter(max_requests=5, window_seconds=60)
validate_limiter = SimpleRateLimiter(max_requests=5, window_seconds=60)
register_limiter = SimpleRateLimiter(max_requests=3, window_seconds=60)
login_limiter = SimpleRateLimiter(max_requests=5, window_seconds=60)
forgot_password_limiter = SimpleRateLimiter(max_requests=5, window_seconds=60)
reset_password_limiter = SimpleRateLimiter(max_requests=5, window_seconds=60)
