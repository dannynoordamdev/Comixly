from typing import Annotated

from dependencies.db_dependency import db_dep
from fastapi import APIRouter, Depends, HTTPException
from models.models import Users
from pydantic import BaseModel, Field
from sqlalchemy.orm import joinedload
from starlette import status

from .auth import get_current_user

router = APIRouter()

user_dependency = Annotated[dict, Depends(get_current_user)]


## We let the client handle:
class UserRequestInput(BaseModel):
    email: str = Field(min_length=6, max_length=60)

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "email",
            }
        }
    }


## We send the response back to the client:
class UserResponse(BaseModel):
    id: int
    email: str
    username: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    location: str | None = None

    class Config:
        orm_mode = True


class ProfileUpdateRequest(BaseModel):
    username: str | None = Field(None, min_length=2, max_length=50)
    new_email: str | None = Field(None, max_length=50)
    bio: str | None = Field(None, max_length=500)
    avatar_url: str | None = None
    location: str | None = Field(None, max_length=100)


@router.get("/users/me", response_model=UserResponse)
async def get_user_info(user: user_dependency, db: db_dep):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required."
        )

    user_model = (
        db.query(Users)
        .options(joinedload(Users.profile))
        .filter(Users.id == user.get("id"))
        .first()
    )

    if not user_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    profile = user_model.profile[0] if user_model.profile else None
    return UserResponse(
        id=user_model.id,
        email=user_model.email,
        username=profile.username if profile else None,
        bio=profile.bio if profile else None,
        avatar_url=profile.avatar_url if profile else None,
        location=profile.location if profile else None,
    )


@router.put(
    "/users/me/update-profile",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
)
async def change_user_email(
    user: user_dependency, db: db_dep, update_data: ProfileUpdateRequest
):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Required."
        )

    # Load both the user and profile schemes
    user_model = (
        db.query(Users)
        .options(joinedload(Users.profile))
        .filter(Users.id == user.get("id"))
        .first()
    )
    if not user_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    if update_data.new_email:
        user_model.email = update_data.new_email

    # Get profile
    profile = user_model.profile[0] if user_model.profile else None
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    for field, value in update_data.model_dump(
        exclude_unset=True, exclude={"new_email"}
    ).items():
        setattr(profile, field, value)

    # Commit both changes
    db.add(user_model)
    db.add(profile)
    db.commit()
    db.refresh(user_model)
    db.refresh(profile)

    return {
        "id": user_model.id,
        "email": user_model.email,
        "username": profile.username,
        "bio": profile.bio,
        "avatar_url": profile.avatar_url,
        "location": profile.location,
    }


## Delete account and profile endpoint.
@router.delete("/users/me/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_account(user: user_dependency, db: db_dep):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required."
        )

    user_model = (
        db.query(Users)
        .options(joinedload(Users.profile))
        .filter(Users.id == user.get("id"))
        .first()
    )

    if user_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    db.delete(user_model)
    db.commit()
    return status.HTTP_204_NO_CONTENT
