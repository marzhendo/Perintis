from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router
from .api.auth_routes import router as auth_router
from .api.forum_routes import router as forum_router
from .api.notification_routes import router as notification_router
from .api.profile_routes import router as profile_routes
from .database import engine, Base
from . import models  # noqa: F401 — import agar SQLAlchemy mendaftarkan semua model sebelum create_all

app = FastAPI(title="Perintis API")

# ---------------------------------------------------------------------------
# Inisialisasi database — create tables if not exist
# ---------------------------------------------------------------------------
Base.metadata.create_all(bind=engine)

@app.on_event("startup")
def startup_event():
    import threading
    from .services.pihps_service import start_price_updater
    thread = threading.Thread(target=start_price_updater, daemon=True)
    thread.start()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)

app.include_router(router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(forum_router, prefix="/api")
app.include_router(notification_router, prefix="/api")
app.include_router(profile_routes, prefix="/api")


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code in (400, 422):
        code = "VALIDATION_ERROR"
    elif exc.status_code == 401:
        code = "UNAUTHORIZED"
    elif exc.status_code == 404:
        code = "NOT_FOUND"
    else:
        code = "INTERNAL_ERROR"
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": str(exc.detail), "code": code},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    if errors:
        first_error = errors[0]
        loc = ".".join(str(l) for l in first_error.get("loc", []))
        msg = first_error.get("msg", "")
        message = f"Validation error at '{loc}': {msg}"
    else:
        message = "Validation error"

    return JSONResponse(
        status_code=422,
        content={"message": message, "code": "VALIDATION_ERROR"},
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unexpected error occurred")
    return JSONResponse(
        status_code=500,
        content={"message": "Terjadi kesalahan pada server.", "code": "INTERNAL_ERROR"},
    )

@app.get("/health")
def health():
    return {"status": "ok"}
