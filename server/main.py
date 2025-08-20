import models.models as _  # noqa: F401
import uvicorn
from database import Base, engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.auth import router as auth_router
from routers.comic import router as comic_router
from routers.user import router as user_router

app = FastAPI()


@app.get("/healthy")
def health_check():
    return {"status": "Healthy"}


app.include_router(comic_router, tags=["Comics"])
app.include_router(auth_router, tags=["Authentication"])
app.include_router(user_router, tags=["Authentication"])


Base.metadata.create_all(bind=engine)


origins = [
    "http://localhost:5173",               # dev
    "https://stellarsightings.app",        # production
    "https://www.stellarsightings.app",    # www production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
