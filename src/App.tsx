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
        closeButton={true}
        position="bottom-center"
        swipeDirection={["up", "left", "right"]}
        toastOptions={{
          className: "!bg-secondary dark:!bg-background-light !text-foreground dark:!text-foreground-light max-w-[280px] !text-xs",
          descriptionClassName: "!text-foreground dark:!text-foreground-light !text-xs",
          style: {
            bottom: '4rem',
            padding: '8px 12px',
            minHeight: '40px',
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