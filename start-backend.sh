# Script para iniciar la aplicación completa
# FromSports - Workout Tracker

echo "🚀 Iniciando FromSports Workout Tracker..."
echo ""

# Verificar si existe el .env del backend
if [ ! -f "fastApi+SQLalquemy/.env" ]; then
    echo "⚠️  ADVERTENCIA: No se encontró fastApi+SQLalquemy/.env"
    echo "   Copia fastApi+SQLalquemy/.env.example como .env y configura tu API key de OpenRouter"
    echo "   El chatbot funcionará con respuestas predefinidas hasta entonces."
    echo ""
fi

echo "📦 Instalando dependencias del backend..."
cd fastApi+SQLalquemy
pip install -r requirements.txt

echo ""
echo "🔧 Iniciando backend (FastAPI) en http://localhost:8000"
echo "   Presiona Ctrl+C para detener"
echo ""
uvicorn main:app --reload --host 0.0.0.0 --port 8000