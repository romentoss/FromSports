from datetime import datetime

from sqlalchemy.orm import Session
import models, schemas
# Crea un nuevo registro de entrenamiento en la base de datos
def create_workout(db: Session, workout: schemas.WorkoutCreate):
    workout_date = workout.date
    if isinstance(workout_date, str): 
        try:
            workout_date = datetime.fromisoformat(workout_date.replace("Z", "+00:00"))
        except Exception:
            workout_date = datetime.utcnow()

    db_workout = models.Workout(
        name=workout.name.strip(),
        sets=workout.sets,
        reps=workout.reps,
        weight=workout.weight,
        date=workout_date or datetime.utcnow(),
    )
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout

# Devuelve todos los entrenamientos almacenados en la base de datos
def get_workouts(db: Session):
    return db.query(models.Workout).all()

# Obtiene un entrenamiento específico por su ID
def get_workout(db: Session, workout_id: int):
    return db.query(models.Workout).filter(models.Workout.id == workout_id).first()

# Actualiza los datos de un entrenamiento existente
def update_workout(db: Session, workout_id: int, workout: schemas.WorkoutCreate):
    db_workout = get_workout(db, workout_id)
    if not db_workout:
        return None

    db_workout.name = workout.name.strip()
    db_workout.sets = workout.sets
    db_workout.reps = workout.reps
    db_workout.weight = workout.weight
    db_workout.date = workout.date

    db.commit()
    db.refresh(db_workout)
    return db_workout

# Elimina un entrenamiento de la base de datos
def delete_workout(db: Session, workout_id: int):
    db_workout = get_workout(db, workout_id)
    if not db_workout:
        return None

    db.delete(db_workout)
    db.commit()
    return db_workout

# Obtiene todos los entrenamientos que coinciden con un nombre específico
def get_workouts_by_name(db: Session, name: str):
    return db.query(models.Workout).filter(models.Workout.name == name).all()