from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from ..database import get_db
from ..models.user import User
from ..dependencies.auth import get_current_user
from ..schemas.fase2_schemas import ProfileStatsResponse, ProfileUpdateRequest
from ..schemas.schemas import UserResponse
from ..services import activity_service, profile_service

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/stats", response_model=ProfileStatsResponse)
def get_profile_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    val_count = activity_service.count_activities_by_type(db, current_user.id, "validasi")
    sim_count = activity_service.count_activities_by_type(db, current_user.id, "simulasi")
    for_count = activity_service.count_activities_by_type(db, current_user.id, "forum")
    
    # Hitung hari aktif dari created_at user ke sekarang
    now_naive = datetime.now(timezone.utc).replace(tzinfo=None)
    created_at_naive = current_user.created_at.replace(tzinfo=None) if current_user.created_at else now_naive
    hari_aktif = (now_naive - created_at_naive).days + 1
    
    recents = activity_service.get_recent_activities(db, current_user.id, limit=5)
    
    return ProfileStatsResponse(
        validasi_count=val_count,
        simulasi_count=sim_count,
        forum_count=for_count,
        hari_aktif=hari_aktif,
        recent_activities=recents
    )

@router.patch("", response_model=UserResponse)
def update_user_profile(data: ProfileUpdateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    updated_user = profile_service.update_profile(db, current_user, data)
    return UserResponse.model_validate(updated_user)
