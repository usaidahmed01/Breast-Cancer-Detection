"""Local API foundation. No medical data or model inference at this checkpoint."""

from typing import Literal

from fastapi import FastAPI, Response
from pydantic import BaseModel


class HealthResponse(BaseModel):
    schemaVersion: Literal["0.1"] = "0.1"
    service: Literal["breast-ai-api"] = "breast-ai-api"
    status: Literal["ok"] = "ok"
    modelStatus: Literal["not_loaded"] = "not_loaded"


app = FastAPI(
    title="Breast AI API",
    version="0.2.0",
    description="Local application foundation; no image analysis endpoints yet.",
)


@app.get("/api/v1/health", response_model=HealthResponse, tags=["System"])
def health(response: Response) -> HealthResponse:
    response.headers["Cache-Control"] = "no-store"
    return HealthResponse()
