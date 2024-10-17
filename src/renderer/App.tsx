import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import TextInput from "./components/Input";
import Star from "./Star";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Star />} />
      </Routes>
    </Router>
  );
}
