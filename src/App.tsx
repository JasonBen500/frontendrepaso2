import { Routes, Route, Navigate } from "react-router-dom";
import VehiculoPage from "./pages/Vehiculos";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vehiculos" replace />} />
      <Route path="/vehiculos" element={<VehiculoPage />} />
    </Routes>
  );
}
export default App;
