import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import { Toaster } from "sonner";
import "./App.css";

function App() {
  return (
    <main className="min-h-screen bg-[#EDEDDD] dark:bg-[#303D24] text-[#2D4531] dark:text-[#EDEDDD] p-2 overflow-auto relative">
      <Toaster 
        richColors 
        closeButton 
        position="bottom-center"
        toastOptions={{
          className: "!bg-background-light dark:!bg-secondary !text-foreground-light dark:!text-foreground",
          descriptionClassName: "!text-foreground-light dark:!text-foreground",
          style: {
            bottom: '4rem',
          }
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;