from database import Base
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, event
from sqlalchemy.orm import relationship


class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    is_activated = Column(Boolean)
    is_deactivated = Column(Boolean, default=False)
    profile = relationship(
        "UserProfile", back_populates="user", cascade="all, delete-orphan"
    )


class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    username = Column(String, unique=True, nullable=True)
    bio = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    country = Column(String, nullable=True)
    city = Column(String, nullable=True)
    user = relationship("Users", back_populates="profile")


@event.listens_for(Users, "after_insert")
def create_profile(mapper, connection, target):
    connection.execute(UserProfile.__table__.insert().values(user_id=target.id))
