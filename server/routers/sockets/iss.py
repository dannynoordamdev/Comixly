import asyncio

import httpx
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


async def fetch_iss_location():
    async with httpx.AsyncClient(timeout=5.0) as client:
        r = await client.get("http://api.open-notify.org/iss-now.json")
        data = r.json()
        return {
            "lat": float(data["iss_position"]["latitude"]),
            "lon": float(data["iss_position"]["longitude"]),
            "timestamp": data["timestamp"],
        }


@router.websocket("/iss")
async def websocket_iss(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            try:
                data = await fetch_iss_location()
            except Exception as e:
                await websocket.send_json({"error": str(e)})
                await asyncio.sleep(3)
                continue

            await websocket.send_json(data)
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        print("Client disconnected")