# FromSports - Workout Tracker 💪

Aplicación completa de seguimiento de entrenamientos con FastAPI (backend) y React (frontend). Permite registrar ejercicios, series, repeticiones y peso, con búsqueda, gráficos de progreso y chatbot inteligente.

## 🏗️ Arquitectura

- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Frontend**: React + React Router + Recharts + i18next
- **Chatbot**: OpenRouter (Claude-3-Haiku) con fallback seguro
- **Internacionalización**: Español, Inglés, Francés, Portugués

## 🚀 Inicio Rápido

### 1. Clonar y configurar

```bash
# Backend: Instalar dependencias
cd fastApi+SQLalquemy
pip install -r requirements.txt

# Frontend: Instalar dependencias
cd ../React/workout-tracker
npm install
```

### 2. Configurar API Key (Opcional pero recomendado)

Para activar el chatbot con IA, configura OpenRouter en el backend:

```bash
cd fastApi+SQLalquemy
cp .env.example .env
# Edita .env y agrega tu OPENROUTER_API_KEY
```

### 3. Iniciar servicios

**Opción A: Manual**

Terminal 1 (Backend):

```bash
cd fastApi+SQLalquemy
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Terminal 2 (Frontend):

```bash
cd React/workout-tracker
npm start
```

**Opción B: Script (Linux/Mac)**

```bash
chmod +x start-backend.sh
./start-backend.sh
# Luego en otra terminal: cd React/workout-tracker && npm start
```

## 🔒 Seguridad del Chatbot

**IMPORTANTE**: La API key de OpenRouter se configura en el **backend**, no en el frontend. Esto es por seguridad - las variables `REACT_APP_*` son visibles en el navegador.

- ✅ API key segura en el servidor
- ✅ Llamadas server-to-server
- ✅ Fallback automático a respuestas locales
- ✅ Sin exposición de secrets en el frontend

## 🌟 Características

### Backend (FastAPI)

- ✅ CRUD completo de workouts
- ✅ Búsqueda por nombre
- ✅ Base de datos SQLite local
- ✅ API RESTful
- ✅ Chatbot con IA integrada

### Frontend (React)

- ✅ Interfaz moderna y responsive
- ✅ Formulario de registro de ejercicios
- ✅ Tabla de ejercicios con filtros
- ✅ Gráficos de progreso (barras, líneas, circular)
- ✅ Chatbot inteligente multidioma
- ✅ Internacionalización completa

### Chatbot

- 🤖 Respuestas con IA (Claude-3-Haiku)
- 🌍 Multidioma (ES/EN/FR/PT)
- 💪 Información detallada de ejercicios
- 🔄 Fallback robusto
- 💬 Interfaz conversacional

## 📁 Estructura del Proyecto

```
FromSports/
├── fastApi+SQLalquemy/          # Backend FastAPI
│   ├── main.py                  # API principal + chatbot
│   ├── models.py                # Modelos SQLAlchemy
│   ├── schemas.py               # Esquemas Pydantic
│   ├── crud.py                  # Operaciones CRUD
│   ├── database.py              # Configuración DB
│   ├── .env                     # Variables de entorno (API key)
│   └── .env.example             # Plantilla de configuración
├── React/workout-tracker/       # Frontend React
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── locales/             # Traducciones i18n
│   │   └── i18n.js              # Configuración i18n
│   └── .env.example             # Config frontend (sin secrets)
└── README.md                    # Este archivo
```

## 🔧 Desarrollo

### Backend

- **URL**: http://localhost:8000
- **Docs API**: http://localhost:8000/docs
- **Health check**: http://localhost:8000/health

### Frontend

- **URL**: http://localhost:3000
- **Build**: `npm run build`
- **Test**: `npm test`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo desarrollo. 💪

---

**Desarrollado con ❤️ para la comunidad fitness**
