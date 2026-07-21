from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from ..database import get_db
from ..models.user import User
from ..models.blog import BlogPost
from ..dependencies.auth import get_current_user
from ..schemas.fase2_schemas import BlogPostCreate, BlogPostResponse, AuthorInfo
from ..services import activity_service

router = APIRouter(prefix="/blog", tags=["blog"])

def _build_author_info(user: User) -> AuthorInfo:
    return AuthorInfo(id=user.id, name=user.name, badge="Admin" if user.role == "admin" else "Wirausaha")

@router.get("/posts", response_model=list[BlogPostResponse])
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
    result = []
    for p in posts:
        author_info = _build_author_info(p.author)
        result.append(BlogPostResponse(
            id=p.id,
            title=p.title,
            content=p.content,
            created_at=p.created_at,
            author=author_info
        ))
    return result

@router.post("/posts", response_model=BlogPostResponse, status_code=201)
def create_post(data: BlogPostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Hanya admin yang dapat mempublikasikan artikel blog")
    
    post = BlogPost(
        title=data.title,
        content=data.content,
        author_id=current_user.id
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    
    # Log activity
    activity_service.log_activity(db, current_user.id, "blog", f"Mempublikasikan artikel blog baru: '{post.title}'")
    
    author_info = _build_author_info(current_user)
    return BlogPostResponse(
        id=post.id,
        title=post.title,
        content=post.content,
        created_at=post.created_at,
        author=author_info
    )

@router.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Hanya admin yang dapat menghapus artikel blog")
    
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Artikel blog tidak ditemukan")
        
    db.delete(post)
    db.commit()
    return {"status": "success", "message": "Artikel blog berhasil dihapus"}
