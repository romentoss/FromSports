import React, {useState, useRef, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import i18n from '../i18n';

function ChatBot({exercises}) {
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: t('chatbotWelcome'),
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular respuesta del bot (aquí iría la lógica de IA)
    setTimeout(
      () => {
        const botResponse = generateBotResponse(inputMessage, exercises);
        setMessages((prev) => [
          ...prev,
          {
            text: botResponse,
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
      },
      1000 + Math.random() * 2000,
    ); // Simular delay de respuesta
  };

  const generateBotResponse = async (userInput, exercises) => {
    const input = userInput.toLowerCase();

    // Primero intentar respuestas inteligentes con IA
    try {
      const aiResponse = await getAIResponse(userInput, exercises);
      if (aiResponse) {
        return aiResponse;
      }
    } catch (error) {
      console.log('AI not available, using fallback responses');
    }

    // Fallback a respuestas predefinidas
    const exercise = exercises.find(
      (ex) =>
        ex.name.toLowerCase().includes(input) ||
        input.includes(ex.name.toLowerCase()),
    );

    if (exercise) {
      let response = `${i18n.t('exerciseInfo')}: ${exercise.name}\n\n`;
      response += `${i18n.t('category')}: ${i18n.t(exercise.category)}\n\n`;
      response += `${i18n.t('description')}: ${i18n.t(exercise.descriptionKey)}\n\n`;

      // Agregar información detallada si está disponible
      if (exercise.techniqueKey) {
        response += `${i18n.t('techniqueLabel')}\n${i18n.t(exercise.techniqueKey)}\n\n`;
      }
      if (exercise.equipmentKey) {
        response += `${i18n.t('equipmentLabel')}\n${i18n.t(exercise.equipmentKey)}\n\n`;
      }
      if (exercise.musclesKey) {
        response += `${i18n.t('musclesLabel')}\n${i18n.t(exercise.musclesKey)}\n\n`;
      }
      if (exercise.tipsKey) {
        response += `${i18n.t('tipsLabel')}\n${i18n.t(exercise.tipsKey)}\n\n`;
      }

      response += `${i18n.t('askMore')}`;
      return response;
    }

    // Respuestas generales
    if (
      input.includes('hola') ||
      input.includes('hello') ||
      input.includes('hi')
    ) {
      return i18n.t('chatbotGreeting');
    }

    if (input.includes('ejercicio') || input.includes('exercise')) {
      return `${i18n.t('availableExercises')}: ${exercises.map((ex) => ex.name).join(', ')}\n\n${i18n.t('askSpecific')}`;
    }

    if (
      input.includes('piernas') ||
      input.includes('legs') ||
      input.includes('jambes') ||
      input.includes('pernas')
    ) {
      const legExercises = exercises.filter((ex) => ex.category === 'legs');
      return `${i18n.t('legExercises')}: ${legExercises.map((ex) => ex.name).join(', ')}\n\n${i18n.t('askDetails')}`;
    }

    if (
      input.includes('espalda') ||
      input.includes('back') ||
      input.includes('dos') ||
      input.includes('costas')
    ) {
      const backExercises = exercises.filter((ex) => ex.category === 'back');
      return `${i18n.t('backExercises')}: ${backExercises.map((ex) => ex.name).join(', ')}\n\n${i18n.t('askDetails')}`;
    }

    if (
      input.includes('pecho') ||
      input.includes('chest') ||
      input.includes('poitrine') ||
      input.includes('peito')
    ) {
      const chestExercises = exercises.filter((ex) => ex.category === 'chest');
      return `${i18n.t('chestExercises')}: ${chestExercises.map((ex) => ex.name).join(', ')}\n\n${i18n.t('askDetails')}`;
    }

    return i18n.t('chatbotDefault');
  };

  // Función para obtener respuesta de IA
  // Función para obtener respuesta de IA
  const getAIResponse = async (userInput, exercises) => {
    try {
      // Llamada al backend en lugar de OpenRouter directamente
      const response = await fetch('http://localhost:8000/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          language: i18n.language || 'es',
        }),
      });

      if (!response.ok) {
        console.log('Backend API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();

      // Si el backend indica que use fallback, devolver null
      if (data.source === 'fallback' || data.source === 'error') {
        console.log('Backend fallback:', data.response);
        return null;
      }

      return data.response;
    } catch (error) {
      console.error('Error calling backend API:', error);
      return null;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante del chatbot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#6366f1',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          💬
        </button>
      )}

      {/* Ventana del chatbot */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '350px',
            height: '500px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#6366f1',
              color: 'white',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{margin: 0, fontSize: '16px'}}>
              {t('exerciseChatbot')}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0',
              }}
            >
              ×
            </button>
          </div>

          {/* Mensajes */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              backgroundColor: '#f8fafc',
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent:
                    message.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '8px 12px',
                    borderRadius: '18px',
                    backgroundColor:
                      message.sender === 'user' ? '#6366f1' : 'white',
                    color: message.sender === 'user' ? 'white' : '#374151',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '18px',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    color: '#6b7280',
                  }}
                >
                  {t('typing')}...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '16px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: 'white',
            }}
          >
            <div style={{display: 'flex', gap: '8px'}}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('askAboutExercise')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  outline: 'none',
                  fontSize: '14px',
                }}
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  opacity: !inputMessage.trim() || isTyping ? 0.5 : 1,
                }}
              >
                {t('send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;
