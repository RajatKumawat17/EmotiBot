from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from textblob import TextBlob
import pandas as pd
from typing import List
from pydantic import BaseModel
import json
from datetime import datetime

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://emoti-bot.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple API key authentication
API_KEY = "dyiuoxcuovrjgimjvjiilagspvkfkart"  # In production, use environment variables
api_key_header = APIKeyHeader(name="X-API-Key")

def verify_api_key(api_key: str = Depends(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key

class SentimentResponse(BaseModel):
    total_entries: int
    sentiment_distribution: dict
    entries: List[dict]

def analyze_sentiment(text: str) -> str:
    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity
    
    if polarity > 0:
        return "positive"
    elif polarity < 0:
        return "negative"
    return "neutral"

@app.post("/analyze", response_model=SentimentResponse)
async def analyze_csv(file: UploadFile = File(...), api_key: str = Depends(verify_api_key)):
    try:
        # Read CSV file
        df = pd.read_csv(file.file)
        required_columns = ["id", "text"]
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(status_code=400, detail="CSV must contain 'id' and 'text' columns")

        # Analyze sentiments
        results = []
        sentiment_counts = {"positive": 0, "negative": 0, "neutral": 0}
        
        for _, row in df.iterrows():
            sentiment = analyze_sentiment(row["text"])
            sentiment_counts[sentiment] += 1
            
            entry = {
                "id": row["id"],
                "text": row["text"],
                "sentiment": sentiment,
                "timestamp": row.get("timestamp", datetime.now().isoformat())
            }
            results.append(entry)

        return SentimentResponse(
            total_entries=len(results),
            sentiment_distribution=sentiment_counts,
            entries=results
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))