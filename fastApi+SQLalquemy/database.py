from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL de la base de datos SQLite
DATABASE_URL = "sqlite:///./sports.db"

# Crea el motor de la base de datos
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
# Crea una clase de sesión para interactuar con la base de datos
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
# Base declarativa para definir modelos
Base = declarative_base()
# Generador de sesión de base de datos para usar con dependencias (FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()