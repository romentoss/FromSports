import React from 'react';
import {useTranslation} from 'react-i18next';

function WorkoutList({workouts, setEditingWorkout, deleteWorkout}) {
  const {t, i18n} = useTranslation();

  const getLocale = (lang) => {
    const locales = {
      en: 'en-US',
      fr: 'fr-FR',
      pt: 'pt-BR',
      es: 'es-ES',
    };
    return locales[lang] || 'es-ES';
  };

  return (
    <>
      <h2 style={{color: '#6366f1', textAlign: 'center', marginBottom: 18}}>
        {t('workoutList')}
      </h2>
      <div
        className="workout-list"
        style={{
          display: 'flex',
          gap: '9rem',
          flexWrap: 'wrap',
          width: '90%',
          justifyContent: 'center',
        }}
      >
        {workouts.map((w) => (
          <div key={w.id} className="workout-card">
            <p>
              <b>{t('exerciseLabel')}</b> {w.name}
            </p>
            <p>
              <b>{t('weightLabel')}</b> {w.weight} kg
            </p>
            <p>
              <b>{t('repsLabel')}</b> {w.reps}
            </p>
            <p>
              <b>{t('setsLabel')}</b> {w.sets}
            </p>
            <p>
              <b>{t('dateLabel')}</b>{' '}
              {new Date(w.date).toLocaleDateString(getLocale(i18n.language))}
            </p>
            <div>
              <button onClick={() => setEditingWorkout(w)}>{t('edit')}</button>
              <button onClick={() => deleteWorkout(w.id)}>{t('delete')}</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default WorkoutList;
