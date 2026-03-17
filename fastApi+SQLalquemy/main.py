from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
import crud, models, schemas
from database import SessionLocal, engine, Base
from typing import Optional
import requests
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Crear las tablas si no existen
Base.metadata.create_all(bind=engine)

# Crear las tablas si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configurar CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",  # Por si usas otro puerto
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)

# Dependencia de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API funcionando correctamente"}
# GET /workouts - lista todos o filtra por nombre
@app.get("/workouts", response_model=list[schemas.Workout])
def read_workouts(name: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Workout)
    if name:
        query = query.filter(
            func.lower(func.trim(models.Workout.name)).like(f"%{name.strip().lower()}%")
        )
    return query.all()

# POST /workouts - crear nuevo workout
@app.post("/workouts", response_model=schemas.Workout)
def create_workout(workout: schemas.WorkoutCreate, db: Session = Depends(get_db)):
    return crud.create_workout(db, workout)

# PUT /workouts/{id} - actualizar workout
@app.put("/workouts/{workout_id}", response_model=schemas.Workout)
def update_workout(workout_id: int, workout: schemas.WorkoutCreate, db: Session = Depends(get_db)):
    updated = crud.update_workout(db, workout_id, workout)
    if not updated:
        raise HTTPException(status_code=404, detail="Workout not found")
    return updated

# DELETE /workouts/{id} - borrar workout
@app.delete("/workouts/{workout_id}")
def delete_workout(workout_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_workout(db, workout_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Workout not found")
    return {"detail": "Workout deleted"}

# POST /chatbot - consulta al chatbot con IA
@app.post("/chatbot", response_model=schemas.ChatbotResponse)
def chatbot_query(request: schemas.ChatbotRequest):
    """
    Endpoint para consultas del chatbot con IA.
    Si hay API key configurada, usa OpenRouter.
    Si no, devuelve una respuesta indicando que use respuestas locales.
    """
    try:
        api_key = os.getenv("OPENROUTER_API_KEY")

        # Si no hay API key configurada, indicar que use respuestas locales
        if not api_key or api_key == "tu_api_key_de_openrouter_aqui":
            return schemas.ChatbotResponse(
                response="Para respuestas con IA, configura la API key de OpenRouter en el backend.",
                source="fallback"
            )

        # Lista de ejercicios disponibles (hardcodeada por ahora)
        exercises = [
            "Squats", "Deadlifts", "Bench Press", "Lunges", "Pull-ups",
            "Push-ups", "Leg Press", "Rows", "Dips", "Calf Raises"
        ]

        # Determinar el idioma para el prompt
        language_names = {
            "es": "español",
            "en": "inglés",
            "fr": "francés",
            "pt": "portugués"
        }
        user_language = language_names.get(request.language, "español")

        # Crear prompt para la IA
        prompt = f"""Eres un entrenador personal experto. El usuario pregunta: "{request.message}"

Ejercicios disponibles: {', '.join(exercises)}
Categorías: piernas (legs), espalda (back), pecho (chest)

Responde de manera útil y motivadora. Si preguntan sobre un ejercicio específico, da detalles sobre técnica, músculos trabajados y consejos.
Si preguntan sobre categorías, recomienda ejercicios apropiados.
Mantén la respuesta concisa pero informativa.

IMPORTANTE: Responde en {user_language}."""

        # Configuración de OpenRouter
        model = os.getenv("OPENROUTER_MODEL", "anthropic/claude-3-haiku:beta")
        max_tokens = int(os.getenv("MAX_TOKENS", "300"))

        # Llamada a OpenRouter
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
                "HTTP-Referer": "http://localhost:8000",  # O el dominio de tu app
                "X-Title": "FromSports Workout Tracker API"
            },
            json={
                "model": model,
                "messages": [
                    {
                        "role": "system",
                        "content": f"Eres un entrenador personal experto que ayuda con ejercicios de gimnasio. Responde de manera útil, motivadora y profesional. Mantén las respuestas concisas pero informativas. Responde siempre en {user_language}."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "max_tokens": max_tokens,
                "temperature": 0.7
            },
            timeout=10
        )

        if response.status_code == 200:
            data = response.json()
            if data.get("choices") and len(data["choices"]) > 0:
                ai_response = data["choices"][0]["message"]["content"]
                return schemas.ChatbotResponse(
                    response=ai_response,
                    source="ai"
                )

        # Si la API falla, devolver mensaje de fallback
        return schemas.ChatbotResponse(
            response="Lo siento, no pude obtener una respuesta de IA en este momento. Por favor, configura correctamente la API key de OpenRouter.",
            source="fallback"
        )

    except Exception as e:
        print(f"Error en chatbot: {e}")
        return schemas.ChatbotResponse(
            response="Error interno del servidor. Revisa la configuración del backend.",
            source="error"
        )