from fastapi import FastAPI, APIRouter, HTTPException, status, Query
import httpx
from pydantic import BaseModel
from config import Settings, get_settings
from models.models import Comic
from dependencies.db_dependency import db_dep

app = FastAPI()
router = APIRouter()
settings = get_settings()
COMICVINE_API_KEY = settings.comic_api_key
BASE_URL = "https://comicvine.gamespot.com/api"

HEADERS = {
    "User-Agent": "FastAPI Comic App"  
}

    
    

@router.get("/comic-series/{volume_name}", status_code=status.HTTP_200_OK)
async def get_comic_series(
    volume_name: str, limit: int = Query(5, description="Max number of series to return"), publisher: str = Query(None, description="Optional: filter by publisher name")
):
   
    search_url = f"{BASE_URL}/search/"
    params = {
        "api_key": COMICVINE_API_KEY,
        "format": "json",
        "resources": "volume",
        "query": volume_name,
        "limit": limit
    }

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(search_url, headers=HEADERS, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to fetch comic data. Status code: {response.status_code}"
        )

    data = response.json()
    if "results" not in data or not data["results"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No comic series found."
        )

    # Filter by publisher if requested
    filtered_volumes = []
    for v in data["results"]:
        pub_name = v.get("publisher", {}).get("name")
        if publisher:
            if pub_name and pub_name.lower() != publisher.lower():
                continue
        filtered_volumes.append({
            "id": v.get("id"),
            "name": v.get("name"),
            "publisher": pub_name,
            "start_year": v.get("start_year"),
            "description": v.get("description"),
            "image": v.get("image", {}).get("original_url")
        })

    if not filtered_volumes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No comic series found with the specified publisher filter."
        )

    return {"volumes": filtered_volumes}

@router.get("/comic-series/{volume_id}/issues", status_code=status.HTTP_200_OK)
async def get_comic_issues(volume_id: int):
    issues_url = f"{BASE_URL}/issues/"
    params = {
        "api_key": COMICVINE_API_KEY,
        "format": "json",
        "filter": f"volume:{volume_id}",
        "sort": "issue_number:asc",
        "limit": 100,
        "offset": 0
    }

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(issues_url, headers=HEADERS, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to fetch comic issues. Status code: {response.status_code}"
        )

    data = response.json()
    if "results" not in data or not data["results"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No comic issues found."
        )

    issues = [
        {
            "id": issue.get("id"),
            "name": issue.get("name"),
            "issue_number": issue.get("issue_number"),
            "cover_date": issue.get("cover_date"),
            "description": issue.get("description"),
            "image": issue.get("image", {}).get("original_url")
        }
    for issue in sorted(data["results"], key=lambda x: x.get("issue_number"))        
    ]
    

    return {"issues": issues}

@router.get("/popular-comics", status_code=status.HTTP_200_OK)
async def get_popular_comics(
    limit: int = Query(8, description="Number of comics to return"),
    sort_by: str = Query("cover_date", description="Field to sort by: cover_date or issue_count")
):
    issues_url = f"{BASE_URL}/issues/"
    params = {
        "api_key": COMICVINE_API_KEY,
        "format": "json",
        "sort": f"{sort_by}:desc",
        "limit": limit
    }

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(issues_url, headers=HEADERS, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to fetch popular comics. Status code: {response.status_code}"
        )

    data = response.json()
    if "results" not in data or not data["results"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No popular comics found."
        )

    popular_comics = [
        {
            "id": issue.get("id"),
            "title": issue.get("name") or issue.get("volume", {}).get("name"),
            "volume_name": issue.get("volume", {}).get("name"),
            "issue_number": issue.get("issue_number"),
            "cover_date": issue.get("cover_date"),
            "image": issue.get("image", {}).get("original_url")
        }
        for issue in data["results"]
    ]

    return {"popular_comics": popular_comics}

