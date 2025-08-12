from datetime import datetime, timedelta

import httpx
from config import Settings, get_settings
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter()


# Async function to fetch the url
async def fetch_neo_data(api_key: str, days: int = 3):
    start_date = datetime.today().date() - timedelta(days=3)
    end_date = datetime.today().date() + timedelta(days=days)
    url = f"https://api.nasa.gov/neo/rest/v1/feed?start_date={start_date}&end_date={end_date}&api_key={api_key}"

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url)

    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"NASA API Error: {response.status_code}",
        )


# function to process the retrieved data and return a formatted summary.
def process_neo_data(neo_json: dict):
    neo_list = []
    near_earth_objects = neo_json.get("near_earth_objects", {})

    dates = list(near_earth_objects.keys())

    for date, neos in neo_json.get("near_earth_objects", {}).items():
        neo_list.extend(neos)

    total = len(neo_list)

    hazardous_asteroids = []
    for neo in neo_list:
        if neo.get("is_potentially_hazardous_asteroid"):
            name = neo.get("name")
            close_approach = neo.get("close_approach_data", [])
            if close_approach:
                miss_distance_str = (
                    close_approach[0].get("miss_distance", {}).get("kilometers")
                )
                try:
                    miss_distance_km = round(float(miss_distance_str), 2)
                except (TypeError, ValueError):
                    miss_distance_km = None
            else:
                miss_distance_km = None

            hazardous_asteroids.append(
                {"name": name, "miss_distance_km": miss_distance_km}
            )

    summary = {
        "date_range": f"Captured from {min(dates)} to {max(dates)}",
        "total_asteroids": total,
        "hazardous_count": len(hazardous_asteroids),
        "hazardous_asteroids": hazardous_asteroids,
    }

    return summary


## Request to fetch near earth objects that uses both functions.
@router.get("/nasa/near_earth_objects", status_code=status.HTTP_200_OK)
async def near_earth_objects(settings: Settings = Depends(get_settings)):
    api_key = settings.nasa_api_key
    neo_data = await fetch_neo_data(api_key)
    summary = process_neo_data(neo_data)
    return summary


## Request to fetch daily image of NASA
@router.get("/nasa/image_of_the_day", status_code=status.HTTP_200_OK)
async def get_daily_image(settings: Settings = Depends(get_settings)):
    api_key = settings.nasa_api_key
    url = f"https://api.nasa.gov/planetary/apod?api_key={api_key}"

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url)

    if response.status_code == 200:
        pass
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image URL found in NASA response.",
        )

    data = response.json()
    daily_image_url = data.get("url")
    daily_image_description = data.get("explanation")
    daily_image_title = data.get("title")

    if not daily_image_url and not daily_image_description and not daily_image_title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image URL found in NASA response.",
        )

    return {
        "title": daily_image_title,
        "details": daily_image_description,
        "url": daily_image_url,
    }
