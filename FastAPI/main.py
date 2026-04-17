from fastapi import FastAPI, Depends, HTTPException  
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from database import engine, Base
from model import Posts
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from sqlalchemy import select, delete, update
from pydantic import BaseModel, Field, field_validator, model_validator
from fastapi.middleware.cors import CORSMiddleware as corsMid

app = FastAPI()

app.add_middleware(
    corsMid,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

async_session = async_sessionmaker(engine, expire_on_commit=False)

@app.on_event('startup')
async def startup():
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

async def get_db():
    async with async_session() as session:
        yield session
app.mount("/static", StaticFiles(directory="static"), name="static")
class Model_Post(BaseModel):
    id: int
    foto: str
    hedP: str
    contP: str


async def proverka(model):
    if model is None:
        raise HTTPException(status_code=404, detail="По запросу ничего не найдено")
    return model

@app.post("/posts")
async def post_pt(model: Model_Post, db: AsyncSession = Depends(get_db)):
    posts = Posts(id_posts=model.id, foto=model.foto, headerP=model.hedP, contentP=model.contP)
    db.add(posts)
    await db.commit()
    await db.refresh(posts)
    return {"id": posts.id_posts, "foto": posts.foto, "headerP": posts.headerP, "contentP": posts.contentP}

@app.get("/posts")
async def get_pt(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Posts))
    posts = res.scalars().all()
    return posts
