import {Route, Routes} from "react-router";

import Blank from "./pages/Blank.tsx";
import DoctorListPage from "./pages/AdminPages/Doctor/DoctorListPage.tsx";
import Home from "./pages/AdminPages/Home.tsx";
import AdminProfiles from "./pages/AdminPages/AdminProfiles.tsx";

function DashboardAdminRoute  () {

    return (
        <Routes>
            <Route index path="/home" element={<Home />} />
            {/* Others Page */}
            <Route path="/profile" element={<AdminProfiles />} />
            <Route path="/doctors" element={<DoctorListPage />} />
            <Route path="/doctor/:id" element={<Blank />} />

        </Routes>
    )

}

export default DashboardAdminRoute;