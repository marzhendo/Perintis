from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.notification import Notification

def create_notification(db: Session, user_id: int, type: str, title: str, message: str):
    notif = Notification(
        user_id=user_id,
        type=type,
        title=title,
        message=message
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif

def get_notifications(db: Session, user_id: int):
    return db.query(Notification).filter(Notification.user_id == user_id)\
             .order_by(Notification.created_at.desc()).all()

def mark_as_read(db: Session, notification_id: int, user_id: int) -> bool:
    """
    Mark read hanya jika user_id cocok. Return True jika success, False jika tidak ketemu/bukan milik user.
    """
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    
    if notif:
        notif.is_read = True
        db.commit()
        return True
    return False

def get_unread_count(db: Session, user_id: int) -> int:
    return db.query(Notification).filter(
        Notification.user_id == user_id, 
        Notification.is_read == False
    ).count()
