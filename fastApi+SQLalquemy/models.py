from sqlalchemy import Column, Integer, String, Float, DateTime  
from database import Base
from datetime import datetime 

# Modelo de la tabla 'workouts' en la base de datos
class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    reps = Column(Integer)
    sets = Column(Integer)
    date = Column(DateTime, default=datetime.utcnow)
    weight = Column(Float)