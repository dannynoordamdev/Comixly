from fastapi import APIRouter, Query, status
from typing import Annotated
from dependencies.db_dependency import db_dep
from fastapi import APIRouter, Depends, HTTPException
from models.models import Series, Users, ComicLibrary, Comic
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import joinedload
from starlette import status

from .auth import get_current_user


router = APIRouter()

user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post("/user/library", status_code=status.HTTP_201_CREATED)
async def create_user_library(name: str, user: user_dependency, db: db_dep):
    new_library = ComicLibrary(user_id=user["id"], name=name)
    db.add(new_library)
    db.commit()
    db.refresh(new_library)
    return {"library": new_library}

@router.get("/user/library", status_code=status.HTTP_200_OK)
async def get_user_library(user: user_dependency, db: db_dep):
    check_for_library = db.query(ComicLibrary).filter(ComicLibrary.user_id == user["id"]).all()
    if not check_for_library:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Library not found.")
    return {"library": check_for_library}

@router.post("/user/library/series", status_code=status.HTTP_201_CREATED)
async def add_series_to_library(
    external_series_id: int,
    comic_library_id: int,
    user: user_dependency,
    series_title: str,
    series_description: str,
    db: db_dep
):

    library = db.query(ComicLibrary).filter(
        ComicLibrary.id == comic_library_id,
        ComicLibrary.user_id == user["id"]
    ).first()
    if not library:
        raise HTTPException(status_code=404, detail="Library not found.")

    series = db.query(Series).filter(Series.id == external_series_id).first()

    if not series:
        series = Series(
            id=external_series_id,
            title=series_title,
            description=series_description
        )
        db.add(series)
        db.commit()
        db.refresh(series)

    if series not in library.series:
        library.series.append(series)
        db.commit()
        db.refresh(library)

    return {
        "library_id": library.id,
        "name": library.name,
        "series": [{"id": s.id, "title": s.title, "description": s.description} for s in library.series]
    }

@router.get("/user/library/series", status_code=status.HTTP_200_OK)
async def get_user_library_series(user: user_dependency, db: db_dep, library_id: int):
    library = db.query(ComicLibrary).filter(ComicLibrary.user_id == user["id"], ComicLibrary.id == library_id).first()
    if not library:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Library not found.")

    return {
        "library_id": library.id,
        "name": library.name,
        "series": [{"id": s.id, "title": s.title, "description": s.description} for s in library.series]
    }

@router.delete("/user/library/series", status_code=status.HTTP_204_NO_CONTENT)
async def delete_series_from_library(
    user: user_dependency,
    db: db_dep,
    library_id: int,
    series_id: int
):
    library = db.query(ComicLibrary).filter(ComicLibrary.user_id == user["id"], ComicLibrary.id == library_id).first()
    if not library:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Library not found.")

    series = db.query(Series).filter(Series.id == series_id).first()
    if not series:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Series not found in library.")

    library.series.remove(series)
    db.commit()

    return {"detail": "Series removed from library."}

@router.delete("/user/library", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_library(user: user_dependency, db: db_dep, library_id: int):
    library = db.query(ComicLibrary).filter(ComicLibrary.user_id == user["id"], ComicLibrary.id == library_id).first()
    if not library:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Library not found.")

    db.delete(library)
    db.commit()
    return {"detail": "Library deleted."}