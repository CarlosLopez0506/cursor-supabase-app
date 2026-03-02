# ml-api/app/routes/predict.py

from fastapi import APIRouter, HTTPException

from app.models.schema import PredictionInput, PredictionOutput
from app.services.predictor import predictor

router = APIRouter()


@router.post("/predict", response_model=PredictionOutput)
def predict(input_data: PredictionInput):
    if not predictor.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="Model not available. Ensure model.pkl exists in ml-api/model/.",
        )
    result = predictor.predict(input_data.features)
    return PredictionOutput(**{k: v for k, v in result.items() if k in ("prediction", "confidence", "label")})