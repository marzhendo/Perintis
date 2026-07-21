from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.forum import ForumThread, ForumComment, ForumLike

def get_all_threads(db: Session):
    return db.query(ForumThread).order_by(ForumThread.created_at.desc()).all()

def create_thread(db: Session, user_id: int, title: str, category: str, content: str):
    thread = ForumThread(
        user_id=user_id,
        title=title,
        category=category,
        content=content
    )
    db.add(thread)
    db.commit()
    db.refresh(thread)
    return thread

def get_thread_by_id(db: Session, thread_id: int):
    return db.query(ForumThread).filter(ForumThread.id == thread_id).first()

def get_comments_for_thread(db: Session, thread_id: int):
    return db.query(ForumComment).filter(ForumComment.thread_id == thread_id).order_by(ForumComment.created_at.asc()).all()

def create_comment(db: Session, thread_id: int, user_id: int, content: str):
    comment = ForumComment(
        thread_id=thread_id,
        user_id=user_id,
        content=content
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

def toggle_like(db: Session, thread_id: int, user_id: int) -> bool:
    """
    Cek apakah user_id sudah like thread_id.
    Jika sudah -> unlike (delete). Return False (berarti sekarang not liked).
    Jika belum -> like (create). Return True (berarti sekarang liked).
    """
    like = db.query(ForumLike).filter(ForumLike.thread_id == thread_id, ForumLike.user_id == user_id).first()
    if like:
        db.delete(like)
        db.commit()
        return False
    else:
        new_like = ForumLike(thread_id=thread_id, user_id=user_id)
        db.add(new_like)
        db.commit()
        return True

def get_like_count(db: Session, thread_id: int) -> int:
    return db.query(ForumLike).filter(ForumLike.thread_id == thread_id).count()

def get_comment_count(db: Session, thread_id: int) -> int:
    return db.query(ForumComment).filter(ForumComment.thread_id == thread_id).count()

def is_liked_by_user(db: Session, thread_id: int, user_id: int) -> bool:
    return db.query(ForumLike).filter(ForumLike.thread_id == thread_id, ForumLike.user_id == user_id).first() is not None

def edit_thread(db: Session, thread_id: int, title: str, category: str, content: str):
    thread = db.query(ForumThread).filter(ForumThread.id == thread_id).first()
    if thread:
        thread.title = title
        thread.category = category
        thread.content = content
        db.commit()
        db.refresh(thread)
    return thread

def delete_thread(db: Session, thread_id: int):
    thread = db.query(ForumThread).filter(ForumThread.id == thread_id).first()
    if thread:
        db.query(ForumLike).filter(ForumLike.thread_id == thread_id).delete()
        db.query(ForumComment).filter(ForumComment.thread_id == thread_id).delete()
        db.delete(thread)
        db.commit()
        return True
    return False

def get_comment_by_id(db: Session, comment_id: int):
    return db.query(ForumComment).filter(ForumComment.id == comment_id).first()

def edit_comment(db: Session, comment_id: int, content: str):
    comment = db.query(ForumComment).filter(ForumComment.id == comment_id).first()
    if comment:
        comment.content = content
        db.commit()
        db.refresh(comment)
    return comment

def delete_comment(db: Session, comment_id: int):
    comment = db.query(ForumComment).filter(ForumComment.id == comment_id).first()
    if comment:
        db.delete(comment)
        db.commit()
        return True
    return False

def report_thread(db: Session, thread_id: int):
    thread = db.query(ForumThread).filter(ForumThread.id == thread_id).first()
    if thread:
        thread.report_count = (thread.report_count or 0) + 1
        db.commit()
        db.refresh(thread)
    return thread

def report_comment(db: Session, comment_id: int):
    comment = db.query(ForumComment).filter(ForumComment.id == comment_id).first()
    if comment:
        comment.report_count = (comment.report_count or 0) + 1
        db.commit()
        db.refresh(comment)
    return comment
