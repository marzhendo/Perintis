from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.fase2_schemas import ProfileUpdateRequest

def update_profile(db: Session, user: User, data: ProfileUpdateRequest) -> User:
    """
    Hanya update field yang tidak None.
    Catatan: Email tidak boleh diupdate dari sini.
    """
    if data.name is not None:
        user.name = data.name
    if data.phone is not None:
        user.phone = data.phone
    if data.bio is not None:
        user.bio = data.bio
    
    db.commit()
    db.refresh(user)
    return user
