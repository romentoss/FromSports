# Chatbot con IA para Ejercicios

## ⚠️ IMPORTANTE: Configuración Segura

**La API key de OpenRouter debe configurarse en el BACKEND, no en el frontend.** Esto es por seguridad - las variables de entorno del frontend son visibles en el navegador.

## Configuración del Backend (Obligatoria para IA)

### 1. Instalar dependencias del backend

```bash
cd fastApi+SQLalquemy
pip install -r requirements.txt
```

### 2. Configurar variables de entorno

En la carpeta `fastApi+SQLalquemy`, copia `.env.example` como `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` y agrega tu API key real:

```env
OPENROUTER_API_KEY=tu_api_key_real_de_openrouter_aqui
```

### 3. Obtén tu API Key de OpenRouter

- Ve a https://openrouter.ai/keys
- Crea una cuenta gratuita
- Genera tu API key
- **Nunca subas este archivo .env al repositorio**

## Cómo funciona

1. **Frontend**: Envía preguntas al backend (`/chatbot`)
2. **Backend**: Hace llamadas seguras a OpenRouter con la API key
3. **Respuesta**: El backend devuelve la respuesta de IA al frontend
4. **Fallback**: Si no hay API key, usa respuestas predefinidas

## Inicio de la aplicación

### Backend (Terminal 1)

```bash
cd fastApi+SQLalquemy
python main.py
# o
uvicorn main:app --reload
```

### Frontend (Terminal 2)

```bash
cd React/workout-tracker
npm start
```

## Funcionalidades del Chatbot

- **Respuestas inteligentes**: Claude-3-Haiku explica ejercicios con detalle
- **Multidioma**: Responde en español, inglés, francés, portugués
- **Categorías**: Lista ejercicios por grupos musculares
- **Información detallada**: Técnica, equipos, músculos, consejos
- **Fallback robusto**: Funciona sin API key usando respuestas locales

## Seguridad

✅ **API key segura**: Nunca expuesta en el navegador  
✅ **Backend protegido**: Llamadas server-to-server  
✅ **Variables de entorno**: No incluidas en el bundle del frontend  
✅ **Fallback automático**: Funciona sin configuración de IA
