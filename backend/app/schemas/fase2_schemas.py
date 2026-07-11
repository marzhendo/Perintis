from pydantic import BaseModel
from datetime import datetime

# --- Forum Schemas ---

class ForumThreadCreate(BaseModel):
    title: str
    category: str
    content: str

class AuthorInfo(BaseModel):
    name: str
    badge: str

class ForumThreadResponse(BaseModel):
    id: int
    title: str
    category: str
    content: str
    created_at: datetime
    author: AuthorInfo
    comments_count: int
    likes_count: int
    is_liked_by_me: bool = False  # Dinamis jika user login

    model_config = {"from_attributes": True}

class ForumCommentCreate(BaseModel):
    content: str

class ForumCommentResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    author: AuthorInfo

    model_config = {"from_attributes": True}

# --- Notification Schemas ---

class NotificationResponse(BaseModel):
    id: int
    type: str
    title: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class UnreadCountResponse(BaseModel):
    count: int

# --- Profile Schemas ---

class UserActivityResponse(BaseModel):
    id: int
    type: str
    description: str
    created_at: datetime

    model_config = {"from_attributes": True}

class ProfileStatsResponse(BaseModel):
    validasi_count: int
    simulasi_count: int
    forum_count: int
    hari_aktif: int
    recent_activities: list[UserActivityResponse]

class ProfileUpdateRequest(BaseModel):
    name: str | None = None
    phone: str | None = None
    bio: str | None = None
