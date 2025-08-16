import os
from datetime import datetime, timedelta, timezone
from typing import Annotated

from dependencies.db_dependency import db_dep
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from models.models import Users
from passlib.context import CryptContext
from pydantic import BaseModel, Field

router = APIRouter()

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oath2_bearer = OAuth2PasswordBearer(tokenUrl="/token")

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


def authenticate_user(db, username: str, password: str):
    user = db.query(Users).filter(Users.email == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user


def create_access_token(email: str, user_id: int, expires_delta: timedelta):
    encode = {"sub": email, "id": user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str, Depends(oath2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: int = payload.get("id")
        if email is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return {"email": email, "id": user_id}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


class UserRequestInput(BaseModel):
    email: str = Field(min_length=5, max_length=100)
    password: str = Field(min_length=8, max_length=100)

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "user@email.com",
                "password": "AStrongPassword",
            }
        }
    }


class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True


## Endpoint for creating a new User
@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def create_user(db: db_dep, create_user_request: UserRequestInput):
    new_user = Users(
        email=create_user_request.email,
        hashed_password=bcrypt_context.hash(create_user_request.password),
        is_activated=False,
    )
    if db.query(Users).filter(Users.email == new_user.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account already exists.",
        )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/token", status_code=status.HTTP_200_OK)
async def login_for_access_token(
    db: db_dep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.is_deactivated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This account has been deactivated.",
        )

    token = create_access_token(
        email=user.email,
        user_id=user.id,
        expires_delta=timedelta(minutes=30),
    )
    return {"access_token": token, "token_type": "bearer"}
