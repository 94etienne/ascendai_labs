import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Training from "./pages/Training";
import Internships from "./pages/Internships";
import Teams from "./pages/Teams";
import Work from "./pages/Work";
import About from "./pages/About";
import Apply from "./pages/Apply";
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import Dashboard from "./pages/Dashboard";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="training" element={<Training />} />
          <Route path="internships" element={<Internships />} />
          <Route path="teams" element={<Teams />} />
          <Route path="work" element={<Work />} />
          <Route path="about" element={<About />} />
          <Route path="apply" element={<Apply />} />
          <Route path="login" element={<Login />} />
          <Route path="set-password" element={<SetPassword />} />
          <Route path="verify" element={<Verify />} />
          <Route path="verify/:serial" element={<Verify />} />

          {/* signed-in only */}
          <Route
            path="dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
