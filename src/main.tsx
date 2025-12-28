import "leaflet/dist/leaflet.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import Auth from "./components/Auth.tsx";
import { AuthContextProvider } from "./context/AuthContextProvider.tsx";
import "./index.css";

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="about" element={<>about</>} />
        <Route path="auth" element={<Auth />} />
      </Routes>
    </AuthContextProvider>
  </BrowserRouter>
);
