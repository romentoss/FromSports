from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Esquema base para un entrenamiento
class WorkoutBase(BaseModel):
    name: str
    sets: int
    reps: int
    weight: float
    date: Optional[datetime] = None

    @property
    def date_str(self) -> Optional[str]:
        if self.date:
            return self.date.strftime("%d/%m/%Y")  # día/mes/año
        return None

# Esquema para crear un nuevo entrenamiento (hereda de WorkoutBase)
class WorkoutCreate(WorkoutBase):
    pass

# Esquema que incluye el ID de la base de datos
class Workout(WorkoutBase):
    id: int

    class Config:
        model_config = {"from_attributes": True}