import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Token from "./pages/Token";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/token" element={<Token />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;