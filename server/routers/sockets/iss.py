import asyncio

import httpx
from fastapi import APIRouter, WebSocket

router = APIRouter()


async def fetch_iss_location():
    async with httpx.AsyncClient() as client:
        r = await client.get("http://api.open-notify.org/iss-now.json")
        data = r.json()
        return {
            "lat": float(data["iss_position"]["latitude"]),
            "lon": float(data["iss_position"]["longitude"]),
            "timestamp": data["timestamp"],
        }


@router.websocket("/ws/iss")
async def websocket_iss(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await fetch_iss_location()
        await websocket.send_json(data)
        await asyncio.sleep(1)
