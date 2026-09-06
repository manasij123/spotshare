import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PublicSharePage from "./pages/PublicSharePage";
import ExpiredPage from "./pages/ExpiredPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/share/:shareId" element={<PublicSharePage />} />
      <Route path="/expired" element={<ExpiredPage />} />
      <Route path="*" element={<ExpiredPage notFound />} />
    </Routes>
  );
}
