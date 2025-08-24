from database import Base
from sqlalchemy import Boolean, Table, Column, Integer, ForeignKey, String, event
from sqlalchemy.orm import relationship

comic_library_series = Table(
    "comic_library_series",
    Base.metadata,
    Column("comic_library_id", Integer, ForeignKey("comic_library.id", ondelete="CASCADE")),
    Column("series_id", Integer, ForeignKey("series.id", ondelete="CASCADE")),
)

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
    comic_libraries = relationship(
        "ComicLibrary", back_populates="user", cascade="all, delete-orphan"
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



class ComicLibrary(Base):
    __tablename__ = "comic_library"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    user = relationship("Users", back_populates="comic_libraries")
    series = relationship(
        "Series", secondary="comic_library_series", back_populates="comic_libraries"
    )

class Series(Base):
    __tablename__ = "series"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    comics = relationship("Comic", back_populates="series")
    comic_libraries = relationship(
        "ComicLibrary", secondary="comic_library_series", back_populates="series"
    )


class Comic(Base):
    __tablename__ = "comics"
    id = Column(Integer, primary_key=True, index=True)
    issue_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    release_date = Column(String, nullable=True)
    series_id = Column(Integer, ForeignKey("series.id", ondelete="CASCADE"))
    series = relationship("Series", back_populates="comics")