import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Bills from "./components/Bills";
import Paydays from "./components/Paydays";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import PageNotFound from "./components/PageNotFound";
import Landing from "./components/Landing";
import { PrivateRoutes } from "./components/PrivateRoutes";
import { useContext } from "react";
import AuthContext from "./hooks/AuthContext";

function App() {
  const { loading } = useContext(AuthContext);

  return loading ? (
    <></>
  ) : (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route path="" element={<Landing />} />
        <Route element={<PrivateRoutes />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bills" element={<Bills />} />
          <Route path="paydays" element={<Paydays />} />
        </Route>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
