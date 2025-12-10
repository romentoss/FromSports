import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from pydantic import BaseModel, Field

from models import Base, Workout
import crud, schemas

# Configuración de base de datos en memoria para testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class WorkoutBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    sets: int = Field(..., ge=1, le=20)
    reps: int = Field(..., ge=1, le=100)
    weight: float = Field(..., ge=0)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

def test_create_workout(db):
    workout_data = schemas.WorkoutCreate(
        name="Press banca",
        sets=3,
        reps=10,
        weight=80.0,
        date=datetime.utcnow()
    )
    workout = crud.create_workout(db, workout_data)
    assert workout.id is not None
    assert workout.name == "Press banca"
    assert workout.sets == 3
    assert workout.reps == 10
    assert workout.weight == 80.0

def test_get_workouts(db):
    # Crear dos workouts
    w1 = crud.create_workout(db, schemas.WorkoutCreate(name="A", sets=1, reps=1, weight=1, date=datetime.utcnow()))
    w2 = crud.create_workout(db, schemas.WorkoutCreate(name="B", sets=2, reps=2, weight=2, date=datetime.utcnow()))
    workouts = crud.get_workouts(db)
    assert len(workouts) == 2
    assert {w.name for w in workouts} == {"A", "B"}

def test_update_workout(db):
    w = crud.create_workout(db, schemas.WorkoutCreate(name="A", sets=1, reps=1, weight=1, date=datetime.utcnow()))
    update_data = schemas.WorkoutCreate(name="B", sets=2, reps=2, weight=2, date=datetime.utcnow())
    updated = crud.update_workout(db, w.id, update_data)
    assert updated.name == "B"
    assert updated.sets == 2
    assert updated.reps == 2
    assert updated.weight == 2

def test_delete_workout(db):
    w = crud.create_workout(db, schemas.WorkoutCreate(name="A", sets=1, reps=1, weight=1, date=datetime.utcnow()))
    deleted = crud.delete_workout(db, w.id)
    assert deleted.id == w.id
    assert crud.get_workout(db, w.id) is None
