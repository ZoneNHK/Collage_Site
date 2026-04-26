from fastapi import FastAPI, Depends, HTTPException  
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from database import engine, Base
from model import Posts, Teacher, Specialty, Admin
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from sqlalchemy import select, delete, or_, and_, func
from pydantic import BaseModel, Field, field_validator, model_validator
from fastapi.middleware.cors import CORSMiddleware as corsMid
from admin import hash_password, verify_password, create_token, verify_token

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
app.mount("/static", StaticFiles(directory="C:/Project/FastAPI/static"), name="static")

@app.get("/")
async def root():
    return FileResponse("C:/Project/FastAPI/static/index.html")

@app.get('/admin_site')
async def adm():
    return FileResponse("C:/Project/FastAPI/static/admins/auten.html")

@app.get("/search-page")
async def search_page():
    return FileResponse("C:/Project/FastAPI/static/search.html")
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

# @app.get("/posts")
# async def get_pt(db: AsyncSession = Depends(get_db)):
#     res = await db.execute(select(Posts))
#     posts = res.scalars().all()
#     return posts


@app.get("/search/teachers")
async def search_teach(name: str = None, surname: str = None, db: AsyncSession = Depends(get_db)):
    condit = []
    if name:
        condit.append(Teacher.name.ilike(f"%{name}%"))
    if surname:
        condit.append(Teacher.surname.ilike(f"%{surname}%"))
    query = await db.execute(select(Teacher).where(or_(*condit)))
    teacher = query.scalars().all()
    await proverka(teacher)
    return teacher
    
@app.get("/search/specialty")
async def search_spec(title: str = None, desc: str = None, db: AsyncSession = Depends(get_db)):
    condit = []
    if title:
        condit.append(Specialty.title.ilike(f"%{title}%"))
    if desc:
        condit.append(Specialty.description.ilike(f"%{desc}%"))
    query = await db.execute(select(Specialty).where(or_(*condit)))
    specialty = query.scalars().all()
    await proverka(specialty)
    return specialty

@app.get("/search/posts")
async def search_post(head: str = None, cont: str = None, db: AsyncSession = Depends(get_db)):
    condit = []
    if head:
        condit.append(Posts.headerP.ilike(f"%{head}%"))
    if cont:
        condit.append(Posts.contentP.ilike(f"%{cont}%"))
    query = await db.execute(select(Posts).where(or_(*condit)))
    post = query.scalars().all()
    await proverka(post)
    return post

@app.get('/posts')
async def get_post(page: int = 1, limit: int = 3, db: AsyncSession = Depends(get_db)):
    offset = (page - 1) * limit
    result = await db.execute(select(Posts).offset(offset).limit(limit))
    posts = result.scalars().all()
    count = await db.execute(select(func.count()).select_from(Posts))
    total = count.scalar()
    return {"posts":posts, "total": total, "page":page}


def passw(admin, password):
    if not verify_password(password, admin.password):
        raise HTTPException(status_code=401, detail='Неверный пароль')
    return password

class SchemaLogin(BaseModel):
    login: str
    password: str

@app.post('/admin')
async def post_admin(model: SchemaLogin, db: AsyncSession = Depends(get_db)):
    user = Admin(login=model.login, password=hash_password(model.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"id": user.id_ad, "login": user.login, "password": user.password}

@app.post('/login')
async def login(login: str, password: str, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Admin).where(Admin.login == login))
    admin = query.scalar_one_or_none()
    await proverka(admin)
    passw(admin, password)
    token = create_token({"sub": admin.login})
    response = JSONResponse(content={"message":"Успешный вход"})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=1800
    )
    return response

@app.get("/admin/posts")
async def post_admin_posts(login: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    posts = await db.execute(select(Posts))
    return posts.scalars().all()

@app.post("/admin/posts")
async def get_admin_posts(model: Model_Post, login: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    post = Posts(foto=model.foto, headerP=model.headP, contentP=model.contP)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return {"id": post.id_posts, "foto": post.foto, "headerP": post.headerP, "contentP": post.contentP}

@app.delete("/admin/posts")
async def del_admin_posts(id: int, login: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Posts).where(Posts.id_post == id))
    post = query.scalar_one_or_none()
    await proverka(post)
    await db.delete(post)
    await db.commit()
    return {"message": "Запись удалена"}