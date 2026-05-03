from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def root():
    return {"status": "VitalSync ML service alive ✅"}