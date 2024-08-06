import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import PageNotFound from "./components/PageNotFound";
import Landing from "./components/Landing";
import { PrivateRoutes } from "./components/PrivateRoutes";
import { useContext } from "react";
import AuthContext from "./hooks/AuthContext";
import { EventForm } from "./components/EventForm";
import EventList from "./components/EventList";

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
          <Route path="bills" element={<EventList />} />
          <Route path="bills/add" element={<EventForm />} />
          <Route path="paydays" element={<EventList />} />
          <Route path="paydays/add" element={<EventForm />} />
        </Route>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
