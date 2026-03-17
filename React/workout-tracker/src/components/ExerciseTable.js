import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import ChatBot from './ChatBot';
function ExerciseTable() {
  const {t} = useTranslation();

  // Datos de ejemplo de ejercicios categorizados
  const exercises = [
    {
      name: 'Squats',
      category: 'legs',
      descriptionKey: 'squatsDesc',
      techniqueKey: 'squatsTechnique',
      equipmentKey: 'squatsEquipment',
      musclesKey: 'squatsMuscles',
      tipsKey: 'squatsTips',
    },
    {
      name: 'Deadlifts',
      category: 'back',
      descriptionKey: 'deadliftsDesc',
      techniqueKey: 'deadliftsTechnique',
      equipmentKey: 'deadliftsEquipment',
      musclesKey: 'deadliftsMuscles',
      tipsKey: 'deadliftsTips',
    },
    {
      name: 'Bench Press',
      category: 'chest',
      descriptionKey: 'benchPressDesc',
      techniqueKey: 'benchPressTechnique',
      equipmentKey: 'benchPressEquipment',
      musclesKey: 'benchPressMuscles',
      tipsKey: 'benchPressTips',
    },
    {
      name: 'Lunges',
      category: 'legs',
      descriptionKey: 'lungesDesc',
      techniqueKey: 'lungesTechnique',
      equipmentKey: 'lungesEquipment',
      musclesKey: 'lungesMuscles',
      tipsKey: 'lungesTips',
    },
    {
      name: 'Pull-ups',
      category: 'back',
      descriptionKey: 'pullUpsDesc',
      techniqueKey: 'pullUpsTechnique',
      equipmentKey: 'pullUpsEquipment',
      musclesKey: 'pullUpsMuscles',
      tipsKey: 'pullUpsTips',
    },
    {
      name: 'Push-ups',
      category: 'chest',
      descriptionKey: 'pushUpsDesc',
      techniqueKey: 'pushUpsTechnique',
      equipmentKey: 'pushUpsEquipment',
      musclesKey: 'pushUpsMuscles',
      tipsKey: 'pushUpsTips',
    },
    {
      name: 'Leg Press',
      category: 'legs',
      descriptionKey: 'legPressDesc',
      techniqueKey: 'legPressTechnique',
      equipmentKey: 'legPressEquipment',
      musclesKey: 'legPressMuscles',
      tipsKey: 'legPressTips',
    },
    {
      name: 'Rows',
      category: 'back',
      descriptionKey: 'rowsDesc',
      techniqueKey: 'rowsTechnique',
      equipmentKey: 'rowsEquipment',
      musclesKey: 'rowsMuscles',
      tipsKey: 'rowsTips',
    },
    {
      name: 'Dips',
      category: 'chest',
      descriptionKey: 'dipsDesc',
      techniqueKey: 'dipsTechnique',
      equipmentKey: 'dipsEquipment',
      musclesKey: 'dipsMuscles',
      tipsKey: 'dipsTips',
    },
    {
      name: 'Calf Raises',
      category: 'legs',
      descriptionKey: 'calfRaisesDesc',
      techniqueKey: 'calfRaisesTechnique',
      equipmentKey: 'calfRaisesEquipment',
      musclesKey: 'calfRaisesMuscles',
      tipsKey: 'calfRaisesTips',
    },
  ];

  const categories = {
    legs: t('legs'),
    back: t('back'),
    chest: t('chest'),
  };

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredExercises =
    selectedCategory === 'all'
      ? exercises
      : exercises.filter((ex) => ex.category === selectedCategory);

  return (
    <div className="page-container">
      <div className="main-container">
        <h1>{t('exerciseTable')}</h1>

        {/* Navegación simple */}
        <nav style={{marginBottom: '20px'}}>
          <Link
            to="/"
            style={{
              marginRight: '20px',
              color: '#6366f1',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            {t('home')}
          </Link>
          <span style={{color: '#6366f1', fontWeight: 'bold'}}>
            {t('exerciseTable')}
          </span>
        </nav>

        {/* Filtro por categoría */}
        <div style={{marginBottom: '20px'}}>
          <label style={{marginRight: '10px', fontWeight: '500'}}>
            {t('filterByCategory')}:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="language-selector"
            style={{minWidth: '120px'}}
          >
            <option value="all">{t('all')}</option>
            <option value="legs">{t('legs')}</option>
            <option value="back">{t('back')}</option>
            <option value="chest">{t('chest')}</option>
          </select>
        </div>

        {/* Tabla de ejercicios */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr style={{backgroundColor: '#6366f1', color: 'white'}}>
              <th
                style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}
              >
                {t('exercise')}
              </th>
              <th
                style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}
              >
                {t('category')}
              </th>
              <th
                style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}
              >
                {t('description')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredExercises.map((exercise, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f8fafc' : 'white',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <td style={{padding: '12px', fontWeight: '500'}}>
                  {exercise.name}
                </td>
                <td style={{padding: '12px'}}>
                  {categories[exercise.category]}
                </td>
                <td style={{padding: '12px'}}>{t(exercise.descriptionKey)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredExercises.length === 0 && (
          <p style={{textAlign: 'center', marginTop: '20px', color: '#64748b'}}>
            {t('noExercisesFound')}
          </p>
        )}
      </div>

      {/* ChatBot integrado */}
      <ChatBot exercises={exercises} />
    </div>
  );
}

export default ExerciseTable;
