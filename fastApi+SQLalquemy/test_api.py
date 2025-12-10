import pytest
from fastapi.testclient import TestClient
from main import app
from models import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import get_db

# Configuración de base de datos en memoria para testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Sobrescribir la dependencia de get_db para usar la base de datos de test
@pytest.fixture(scope="function", autouse=True)
def override_get_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_health_check():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"

def test_create_and_get_workout():
    data = {
        "name": "Test",
        "sets": 3,
        "reps": 10,
        "weight": 80.0,
        "date": "2024-01-01T00:00:00"
    }
    resp = client.post("/workouts", json=data)
    assert resp.status_code == 200
    workout = resp.json()
    assert workout["name"] == "Test"
    # Obtener todos
    resp2 = client.get("/workouts")
    assert resp2.status_code == 200
    assert any(w["name"] == "Test" for w in resp2.json())

def test_update_workout():
    # Crear
    data = {"name": "A", "sets": 1, "reps": 1, "weight": 1, "date": "2024-01-01T00:00:00"}
    resp = client.post("/workouts", json=data)
    workout = resp.json()
    # Actualizar
    update = {"name": "B", "sets": 2, "reps": 2, "weight": 2, "date": "2024-01-02T00:00:00"}
    resp2 = client.put(f"/workouts/{workout['id']}", json=update)
    assert resp2.status_code == 200
    updated = resp2.json()
    assert updated["name"] == "B"
    assert updated["sets"] == 2

def test_delete_workout():
    # Crear
    data = {"name": "A", "sets": 1, "reps": 1, "weight": 1, "date": "2024-01-01T00:00:00"}
    resp = client.post("/workouts", json=data)
    workout = resp.json()
    # Borrar
    resp2 = client.delete(f"/workouts/{workout['id']}")
    assert resp2.status_code == 200
    # Comprobar que ya no existe
    resp3 = client.get("/workouts")
    assert all(w["id"] != workout["id"] for w in resp3.json())
