from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"status": "Multilingual.AI running"}
