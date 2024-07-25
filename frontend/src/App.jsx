import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Bills from "./components/Bills";
import Paydays from "./components/Paydays";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bills" element={<Bills />} />
        <Route path="paydays" element={<Paydays />} />
        {/* <Route path="sign-in" element={<SignIn />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
