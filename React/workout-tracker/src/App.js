import React, {Suspense} from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom';
const Home = React.lazy(() => import('./components/Home'));
const ExerciseTable = React.lazy(() => import('./components/ExerciseTable'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercises" element={<ExerciseTable />} />
      </Routes>
    </Suspense>
  );
}

export default App;
