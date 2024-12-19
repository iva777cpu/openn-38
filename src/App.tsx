import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-[#EDEDDD] dark:bg-[#303D24] text-[#2D4531] dark:text-[#EDEDDD]">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;