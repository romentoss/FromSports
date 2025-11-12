from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
import crud, models, schemas
from database import SessionLocal, engine, Base
from typing import Optional

# Crear las tablas si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configurar CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
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