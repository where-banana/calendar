import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NoPage from './components/NoPage';

function App() {
    return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    );
}

export default App;
