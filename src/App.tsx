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
          className: "!bg-secondary dark:!bg-background-light !text-foreground dark:!text-foreground-light !text-xs max-w-[280px] mx-auto",
          descriptionClassName: "!text-foreground dark:!text-foreground-light !text-xs",
          style: {
            bottom: '4rem',
            padding: '0.5rem',
            minHeight: '2.5rem'
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