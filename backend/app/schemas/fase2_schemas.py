from pydantic import BaseModel, Field
from datetime import datetime

# --- Forum Schemas ---

class ForumThreadCreate(BaseModel):
    title: str = Field(..., max_length=200)
    category: str
    content: str = Field(..., max_length=2000)

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
    content: str = Field(..., max_length=1000)

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
    name: str
    email: str
    phone: str | None = None
    bio: str | None = None
    validasi_count: int
    simulasi_count: int
    forum_count: int
    hari_aktif: int
    recent_activities: list[UserActivityResponse]

class ProfileUpdateRequest(BaseModel):
    name: str | None = Field(None, max_length=100)
    phone: str | None = Field(None, max_length=20)
    bio: str | None = Field(None, max_length=500)
