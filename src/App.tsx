import { Routes, Route } from "react-router-dom";
import VehiculoPage from "./pages/Vehiculos";
function App() {
  return (
    <Routes>
      <Route path="/vehiculos" element={<VehiculoPage />} />
    </Routes>
  );
}
export default App;
