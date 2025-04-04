import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import useAuth from "./hooks/useAuth.ts";
import DashboardUserRoute from "./DashboardUserRoute.tsx";
import DashboardAdminRoute from "./DashboardAdminRoute.tsx";
import PersistLogin from "./keeplogin/PersistLogin.tsx";
import RequireAuth from "./keeplogin/RequireAuth.tsx";

export default function App() {

  const {auth} = useAuth();

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<PersistLogin/>}>
            <Route element={<RequireAuth/>}>
              <Route element={<AppLayout />}>
                {
                  auth.role === "admin"?
                      <Route path="/admin/*" element={<DashboardAdminRoute/>}/>
                      :<Route path="/user/*" element={<DashboardUserRoute/>}/>

                }
              </Route>
            </Route>
          </Route>
          {/* Auth Layout */}
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
