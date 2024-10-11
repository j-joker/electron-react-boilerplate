import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TextInput from './components/Input';

function Hello() {
  return (
    <div>
      hello
      <TextInput onSubmit={() => {}} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
