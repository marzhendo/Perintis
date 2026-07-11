from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..dependencies.auth import get_current_user
from ..schemas.fase2_schemas import NotificationResponse, UnreadCountResponse
from ..services import notification_service

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("", response_model=list[NotificationResponse])
def get_all_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notifs = notification_service.get_notifications(db, current_user.id)
    return notifs

@router.patch("/{notif_id}/read")
def mark_notification_read(notif_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    success = notification_service.mark_as_read(db, notif_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Notifikasi tidak ditemukan")
    return {"status": "success", "message": "Notifikasi ditandai sudah dibaca"}

@router.get("/unread-count", response_model=UnreadCountResponse)
def get_unread_count(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    count = notification_service.get_unread_count(db, current_user.id)
    return UnreadCountResponse(count=count)
