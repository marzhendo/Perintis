from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from ..database import get_db
from ..models.user import User
from ..dependencies.auth import get_current_user, get_current_user_optional
from ..schemas.fase2_schemas import (
    ForumThreadCreate, ForumThreadResponse, 
    ForumCommentCreate, ForumCommentResponse,
    AuthorInfo
)
from ..services import forum_service, activity_service, notification_service

router = APIRouter(prefix="/forum", tags=["forum"])

def _build_author_info(db: Session, user: User) -> AuthorInfo:
    act_count = activity_service.count_activities_by_user(db, user.id)
    now_naive = datetime.now(timezone.utc).replace(tzinfo=None)
    created_at_naive = user.created_at.replace(tzinfo=None) if user.created_at else now_naive
    hari_aktif = (now_naive - created_at_naive).days + 1
    badge = activity_service.determine_author_badge(act_count, hari_aktif)
    return AuthorInfo(name=user.name, badge=badge)

@router.get("/threads", response_model=list[ForumThreadResponse])
def get_threads(db: Session = Depends(get_db), current_user: User | None = Depends(get_current_user_optional)):
    threads = forum_service.get_all_threads(db)
    result = []
    for t in threads:
        author_info = _build_author_info(db, t.user)
        comments_count = forum_service.get_comment_count(db, t.id)
        likes_count = forum_service.get_like_count(db, t.id)
        is_liked = False
        if current_user:
            is_liked = forum_service.is_liked_by_user(db, t.id, current_user.id)
        
        result.append(ForumThreadResponse(
            id=t.id,
            title=t.title,
            category=t.category,
            content=t.content,
            created_at=t.created_at,
            author=author_info,
            comments_count=comments_count,
            likes_count=likes_count,
            is_liked_by_me=is_liked
        ))
    return result

@router.post("/threads", response_model=ForumThreadResponse, status_code=201)
def create_thread(data: ForumThreadCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    t = forum_service.create_thread(db, current_user.id, data.title, data.category, data.content)
    activity_service.log_activity(db, current_user.id, "forum", f"Membuat thread baru: '{t.title}'")
    
    author_info = _build_author_info(db, current_user)
    return ForumThreadResponse(
        id=t.id,
        title=t.title,
        category=t.category,
        content=t.content,
        created_at=t.created_at,
        author=author_info,
        comments_count=0,
        likes_count=0,
        is_liked_by_me=False
    )

@router.get("/threads/{thread_id}/comments", response_model=list[ForumCommentResponse])
def get_comments(thread_id: int, db: Session = Depends(get_db)):
    t = forum_service.get_thread_by_id(db, thread_id)
    if not t:
        raise HTTPException(status_code=404, detail="Thread tidak ditemukan")
    
    comments = forum_service.get_comments_for_thread(db, thread_id)
    result = []
    for c in comments:
        author_info = _build_author_info(db, c.user)
        result.append(ForumCommentResponse(
            id=c.id,
            content=c.content,
            created_at=c.created_at,
            author=author_info
        ))
    return result

@router.post("/threads/{thread_id}/comments", response_model=ForumCommentResponse, status_code=201)
def create_comment(thread_id: int, data: ForumCommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    t = forum_service.get_thread_by_id(db, thread_id)
    if not t:
        raise HTTPException(status_code=404, detail="Thread tidak ditemukan")
    
    c = forum_service.create_comment(db, thread_id, current_user.id, data.content)
    activity_service.log_activity(db, current_user.id, "forum", f"Membalas thread: '{t.title}'")
    
    # Notify thread owner (jangan notify diri sendiri)
    if t.user_id != current_user.id:
        notification_service.create_notification(
            db, t.user_id, "FORUM_REPLY", 
            "Balasan Baru di Thread Anda", 
            f"'{current_user.name}' membalas thread '{t.title}'"
        )
    
    author_info = _build_author_info(db, current_user)
    return ForumCommentResponse(
        id=c.id,
        content=c.content,
        created_at=c.created_at,
        author=author_info
    )

@router.post("/threads/{thread_id}/like")
def toggle_like(thread_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    t = forum_service.get_thread_by_id(db, thread_id)
    if not t:
        raise HTTPException(status_code=404, detail="Thread tidak ditemukan")
    
    liked = forum_service.toggle_like(db, thread_id, current_user.id)
    
    if liked and t.user_id != current_user.id:
        notification_service.create_notification(
            db, t.user_id, "FORUM_LIKE", 
            "Suka Baru di Thread Anda", 
            f"'{current_user.name}' menyukai thread '{t.title}'"
        )
        
    return {"status": "success", "is_liked": liked}
