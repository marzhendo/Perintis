from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from ..database import Base


class ForumThread(Base):
    __tablename__ = "forum_threads"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    content = Column(String, nullable=False)
    report_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User")


class ForumComment(Base):
    __tablename__ = "forum_comments"

    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(Integer, ForeignKey("forum_threads.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)
    report_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User")


class ForumLike(Base):
    __tablename__ = "forum_likes"

    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(Integer, ForeignKey("forum_threads.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint('thread_id', 'user_id', name='uq_thread_user_like'),
    )
