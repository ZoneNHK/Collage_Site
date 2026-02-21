import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

VK_TOKEN = "485a429c485a429c485a429c744b64bd734485a485a429c21c3a9a91ac90849a9e6495d"

@app.get("/news")
async def get_news():
    response = httpx.get("https://api.vk.com/method/wall.get", params={
        "domain": "itdongtu",
        "count": 5,
        "access_token": VK_TOKEN,
        "v": "5.131"
    })
    data = response.json()
    posts = data["response"]["items"]
    
    result = []
    for post in posts:
        photo = ""
        if "attachments" in post:
            for attachment in post["attachments"]:
                if attachment["type"] == "photo":
                    photo = attachment["photo"]["sizes"][-1]["url"]
                    break

        result.append({
            "text": post["text"],
            "date": post["date"],
            "id": post["id"],
            "photo": photo
        })
    
    return result