from datetime import datetime, timezone
from sqlalchemy.orm import Session
from ..models.activity import UserActivity

def log_activity(db: Session, user_id: int, type: str, description: str):
    """
    Simpan aktivitas pengguna.
    type = 'validasi', 'simulasi', atau 'forum'
    """
    activity = UserActivity(
        user_id=user_id,
        type=type,
        description=description,
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

def count_activities_by_user(db: Session, user_id: int) -> int:
    return db.query(UserActivity).filter(UserActivity.user_id == user_id).count()

def count_activities_by_type(db: Session, user_id: int, activity_type: str) -> int:
    return db.query(UserActivity).filter(
        UserActivity.user_id == user_id, 
        UserActivity.type == activity_type
    ).count()

def get_recent_activities(db: Session, user_id: int, limit: int = 5):
    return db.query(UserActivity).filter(UserActivity.user_id == user_id)\
             .order_by(UserActivity.created_at.desc()).limit(limit).all()

def determine_author_badge(activity_count: int, hari_aktif: int) -> str:
    """
    Logic: 
    - > 10 aktivitas = 'Sangat Aktif'
    - < 7 hari = 'Pendiri Baru'
    - default = 'Pendiri UMKM'
    """
    if activity_count > 10:
        return "Sangat Aktif"
    if hari_aktif < 7:
        return "Pendiri Baru"
    return "Pendiri UMKM"
