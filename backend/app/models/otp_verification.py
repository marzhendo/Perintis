from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from ..database import Base


class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    code = Column(String, nullable=False)
    purpose = Column(String, default="reset_password", nullable=False)  # e.g., "reset_password", "email_verification"
    is_verified = Column(Boolean, default=False, nullable=False)
    failed_attempts = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    expires_at = Column(DateTime, nullable=False)
