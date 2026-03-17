import React, {useState, useEffect, Suspense} from 'react';
import '../App.css';
import WorkoutList from './WorkoutList';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
const WorkoutChart = React.lazy(() => import('./WorkoutChart'));
const WorkoutBarChart = React.lazy(() => import('./WorkoutBarChart'));
const WorkoutPieChart = React.lazy(() => import('./WorkoutPieChart'));

function Home() {
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

  const [chartType, setChartType] = useState('line'); // "line", "bar", "pie"
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [editingId, setEditingId] = useState(null); // <-- id del workout que se está editando
  const [searchExercise, setSearchExercise] = useState('');
  const [chartData, setChartData] = useState([]);
  // UX states
  const [formErrors, setFormErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [successTimestamp, setSuccessTimestamp] = useState(null);
  const [errorTimestamp, setErrorTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);

  // Obtener todos los workouts del backend
  const fetchWorkouts = async (name = '') => {
    setLoading(true);
    let url = 'http://127.0.0.1:8000/workouts';
    if (name) url += `?name=${encodeURIComponent(name)}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setWorkouts(data);
      if (name) {
        const chartDataFormatted = data
          .filter((w) => w.date && w.weight != null)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((w) => ({
            date: new Date(w.date).toLocaleDateString(
              getLocale(i18n.language),
              {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              },
            ),
            weight: w.weight,
            sets: w.sets,
            reps: w.reps,
          }));
        setChartData(chartDataFormatted);
      } else {
        setChartData([]);
      }
    } catch (err) {
      setFormErrors({general: t('errorLoad')});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Manejar submit del formulario (crear o editar)
  // Validación de formulario
  const validateForm = () => {
    const errors = {};
    if (!exercise.trim()) errors.exercise = t('exerciseRequired');
    if (sets === '' || isNaN(Number(sets)) || Number(sets) <= 0)
      errors.sets = t('setsRequired');
    if (reps === '' || isNaN(Number(reps)) || Number(reps) <= 0)
      errors.reps = t('repsRequired');
    if (weight === '' || isNaN(Number(weight)) || Number(weight) < 0)
      errors.weight = t('weightRequired');
    return errors;
  };

  // Mostrar errores solo después de intentar enviar
  const [formTouched, setFormTouched] = useState(false);

  useEffect(() => {
    if (!formTouched) return;
    const errors = validateForm();
    setFormErrors((prev) => {
      // Solo mantener errores actuales
      const newErrors = {};
      for (const key in errors) {
        if (errors[key]) newErrors[key] = errors[key];
      }
      // Mantener error general si existe
      if (prev.general) newErrors.general = prev.general;
      return newErrors;
    });
    // Si no hay errores de campo, limpiar error general
    if (Object.keys(errors).length === 0 && formErrors.general) {
      setFormErrors({});
    }
    // eslint-disable-next-line
  }, [exercise, sets, reps, weight, formTouched]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormTouched(true);
    setSuccessMsg('');
    setSuccessTimestamp(null);
    setErrorTimestamp(null);
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setErrorTimestamp(Date.now());
      return;
    }

    setLoading(true);
    const workoutData = {
      id: editingId || Date.now(),
      name: exercise.trim(),
      sets: Number(sets) || 0,
      reps: Number(reps) || 0,
      weight: Number(weight) || 0,
    };

    try {
      let res;
      if (editingId) {
        // Editar workout existente
        res = await fetch(`http://127.0.0.1:8000/workouts/${editingId}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(workoutData),
        });
      } else {
        // Crear workout nuevo
        res = await fetch('http://127.0.0.1:8000/workouts', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(workoutData),
        });
      }

      if (!res.ok) throw new Error('Error al guardar workout');

      // Limpiar formulario y modo edición
      setExercise('');
      setSets('');
      setReps('');
      setWeight('');
      setEditingId(null);
      setFormErrors({});
      setFormTouched(false);
      setSuccessMsg(editingId ? t('successEdit') : t('successAdd'));
      setSuccessTimestamp(Date.now());

      fetchWorkouts();
    } catch (error) {
      setSuccessMsg('');
      setFormErrors({general: t('errorSave')});
      setErrorTimestamp(Date.now());
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar workout en el formulario para editar
  const setEditingWorkout = (workout) => {
    setExercise(workout.name);
    setSets(workout.sets);
    setReps(workout.reps);
    setWeight(workout.weight);
    setEditingId(workout.id);
  };

  // Eliminar workout con confirmación
  const handleDelete = async (id) => {
    setSuccessMsg('');
    setFormErrors({});
    setSuccessTimestamp(null);
    setErrorTimestamp(null);
    const confirmDelete = window.confirm(t('confirmDelete'));
    if (!confirmDelete) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/workouts/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar workout');
      setWorkouts(workouts.filter((w) => w.id !== id));
      setSuccessMsg(t('successDelete'));
      setSuccessTimestamp(Date.now());
    } catch (error) {
      setFormErrors({general: t('errorDelete')});
      setSuccessMsg('');
      setErrorTimestamp(Date.now());
      console.error(error);
    }
  };

  // Auto-hide notifications after 3.5 seconds
  useEffect(() => {
    if (successMsg && successTimestamp) {
      const timer = setTimeout(() => {
        setSuccessMsg('');
        setSuccessTimestamp(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successMsg, successTimestamp]);

  useEffect(() => {
    if (formErrors.general && errorTimestamp) {
      const timer = setTimeout(() => {
        setFormErrors((prev) => ({...prev, general: undefined}));
        setErrorTimestamp(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [formErrors.general, errorTimestamp]);

  return (
    <div className="page-container">
      <div className="main-container">
        <h1>{t('title')}</h1>

        <div style={{textAlign: 'center', marginBottom: 20}}>
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="language-selector"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="pt">Português</option>
          </select>
        </div>

        <div style={{textAlign: 'center', marginBottom: 20}}>
          <Link
            to="/exercises"
            style={{
              color: '#6366f1',
              textDecoration: 'none',
              fontWeight: 'bold',
              marginRight: 20,
            }}
          >
            {t('exerciseTable')}
          </Link>
        </div>

        {/* Navegación */}
        <nav style={{marginBottom: '20px'}}>
          <span style={{color: '#6366f1', fontWeight: 'bold'}}>
            {t('home')}
          </span>
          <Link
            to="/exercises"
            style={{
              marginLeft: '20px',
              color: '#6366f1',
              textDecoration: 'none',
            }}
          >
            {t('exerciseTable')}
          </Link>
        </nav>

        <div className="search-bar">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchExercise}
            onChange={(e) => setSearchExercise(e.target.value)}
          />
          <button onClick={() => fetchWorkouts(searchExercise)}>
            {t('search')}
          </button>
          <button
            onClick={() => {
              setSearchExercise('');
              fetchWorkouts();
            }}
          >
            {t('showAll')}
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <input
              type="text"
              placeholder={t('exercise')}
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className={formErrors.exercise ? 'input-error' : ''}
            />
            {formErrors.exercise && (
              <span className="error-msg">{formErrors.exercise}</span>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <input
              type="number"
              placeholder={t('sets')}
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              min="1"
              className={formErrors.sets ? 'input-error' : ''}
            />
            {formErrors.sets && (
              <span className="error-msg">{formErrors.sets}</span>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <input
              type="number"
              placeholder={t('reps')}
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              min="1"
              className={formErrors.reps ? 'input-error' : ''}
            />
            {formErrors.reps && (
              <span className="error-msg">{formErrors.reps}</span>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <input
              type="number"
              placeholder={t('weight')}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0"
              step="0.1"
              className={formErrors.weight ? 'input-error' : ''}
            />
            {formErrors.weight && (
              <span className="error-msg">{formErrors.weight}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || Object.keys(formErrors).length > 0}
          >
            {loading ? t('saving') : editingId ? t('saveChanges') : t('add')}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setExercise('');
                setSets('');
                setReps('');
                setWeight('');
                setEditingId(null);
                setFormErrors({});
                setSuccessMsg('');
              }}
            >
              {t('cancel')}
            </button>
          )}
          {formErrors.general && (
            <span className="error-msg">{formErrors.general}</span>
          )}
          {successMsg && <span className="success-msg">{successMsg}</span>}
        </form>

        {chartData.length > 0 && (
          <div className="chart-container">
            <h3
              style={{textAlign: 'center', color: '#6366f1', marginBottom: 10}}
            >
              {t('chartTitle')}
            </h3>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <button
                onClick={() => setChartType('line')}
                style={{
                  background: chartType === 'line' ? '#6366f1' : '#e0e7ff',
                  color: chartType === 'line' ? '#fff' : '#6366f1',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t('lines')}
              </button>
              <button
                onClick={() => setChartType('bar')}
                style={{
                  background: chartType === 'bar' ? '#f59e42' : '#e0e7ff',
                  color: chartType === 'bar' ? '#fff' : '#f59e42',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t('bars')}
              </button>
              <button
                onClick={() => setChartType('pie')}
                style={{
                  background: chartType === 'pie' ? '#10b981' : '#e0e7ff',
                  color: chartType === 'pie' ? '#fff' : '#10b981',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t('pie')}
              </button>
            </div>
            <Suspense
              fallback={
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 120,
                  }}
                >
                  <div className="loader" style={{marginBottom: 8}}></div>
                  <span style={{color: '#6366f1', fontWeight: 600}}>
                    {t('loadingChart')}
                  </span>
                </div>
              }
            >
              {chartType === 'line' && <WorkoutChart data={chartData} />}
              {chartType === 'bar' && <WorkoutBarChart data={chartData} />}
              {chartType === 'pie' && <WorkoutPieChart data={chartData} />}
            </Suspense>
          </div>
        )}

        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
            <span style={{color: '#6366f1', fontWeight: 600, marginLeft: 8}}>
              {t('loading')}
            </span>
          </div>
        )}
        {/* Show error/success outside form for fetch/delete actions */}
        {formErrors.general && errorTimestamp && (
          <div className="error-msg" style={{textAlign: 'center'}}>
            {formErrors.general}
            <span style={{fontSize: '0.85em', marginLeft: 8, color: '#64748b'}}>
              ({new Date(errorTimestamp).toLocaleTimeString()})
            </span>
          </div>
        )}
        {successMsg && successTimestamp && (
          <div className="success-msg" style={{textAlign: 'center'}}>
            {successMsg}
            <span style={{fontSize: '0.85em', marginLeft: 8, color: '#64748b'}}>
              ({new Date(successTimestamp).toLocaleTimeString()})
            </span>
          </div>
        )}

        <div className="workout-list">
          <WorkoutList
            workouts={workouts}
            setEditingWorkout={setEditingWorkout}
            deleteWorkout={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
