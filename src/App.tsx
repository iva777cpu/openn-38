import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <div className="fixed inset-0 bg-[#EDEDDD] dark:bg-[#303D24] text-[#2D4531] dark:text-[#EDEDDD] overflow-auto">
      <div className="min-h-screen p-4">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;