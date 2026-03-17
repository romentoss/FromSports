# Chatbot con IA para Ejercicios

## Configuración de la API de IA

Para activar respuestas inteligentes con IA, necesitas configurar una API. Se recomienda usar OpenAI:

### 1. Obtén tu API Key de OpenAI

- Ve a https://platform.openai.com/
- Crea una cuenta y obtén tu API key

### 2. Configura las variables de entorno

Crea un archivo `.env` en la raíz del proyecto React:

```env
REACT_APP_OPENAI_API_KEY=tu_api_key_aquí
```

### 3. Instala dependencias adicionales (opcional)

```bash
npm install dotenv
```

### 4. El chatbot funcionará automáticamente

Una vez configurada la API key, el chatbot intentará usar IA primero, y si falla, usará respuestas predefinidas como fallback.

## Funcionalidades del Chatbot

- **Respuestas inteligentes**: Explica ejercicios con detalle usando IA
- **Multidioma**: Responde en el idioma seleccionado por el usuario
- **Categorías**: Puede listar ejercicios por categoría (piernas, espalda, pecho)
- **Información detallada**: Da consejos sobre técnica, músculos y recomendaciones
- **Interfaz intuitiva**: Diseño moderno con indicador de "escribiendo"

## Cómo usar

1. Ve a la página de tabla de ejercicios
2. Haz clic en el botón flotante del chatbot (💬)
3. Pregunta sobre cualquier ejercicio o categoría
4. El chatbot responderá automáticamente

## Ejemplos de preguntas

- "¿Cómo se hace el squat correctamente?"
- "¿Qué ejercicios hay para espalda?"
- "Explícame el bench press"
- "Recomiéndame ejercicios para piernas"
