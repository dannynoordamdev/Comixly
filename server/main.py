import models.models as _  # noqa: F401
import uvicorn
from database import Base, engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.auth import router as auth_router
from routers.nasa import router as nasa_router
from routers.sockets.iss import router as iss_socket
from routers.user import router as user_router

app = FastAPI()
app.include_router(nasa_router)
app.include_router(auth_router, tags=["Authentication"])
app.include_router(user_router, tags=["Authentication"])
app.include_router(iss_socket)


Base.metadata.create_all(bind=engine)

origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
