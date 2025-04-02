import {Route, Routes} from "react-router";
import Home from "./pages/Dashboard/Home.tsx";
import UserProfiles from "./pages/UserProfiles.tsx";
import Calendar from "./pages/Calendar.tsx";
import FormElements from "./pages/Forms/FormElements.tsx";
import BasicTables from "./pages/Tables/BasicTables.tsx";
import Alerts from "./pages/UiElements/Alerts.tsx";
import Avatars from "./pages/UiElements/Avatars.tsx";
import Badges from "./pages/UiElements/Badges.tsx";
import Buttons from "./pages/UiElements/Buttons.tsx";
import Images from "./pages/UiElements/Images.tsx";
import Videos from "./pages/UiElements/Videos.tsx";
import LineChart from "./pages/Charts/LineChart.tsx";
import BarChart from "./pages/Charts/BarChart.tsx";
import PatientListPage from "./pages/Patient/PatientListPage.tsx";

function DashboardUserRoute  () {

    return (
        <Routes>
                <Route index path="/home" element={<Home />} />

                {/* Others Page */}
                <Route path="/profile" element={<UserProfiles />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/patients" element={<PatientListPage />} />
                <Route path="/patient/:id" element={<PatientListPage />} />


                {/* Forms */}
                <Route path="/form-elements" element={<FormElements />} />

                {/* Tables */}
                <Route path="/basic-tables" element={<BasicTables />} />

                {/* Ui Elements */}
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/avatars" element={<Avatars />} />
                <Route path="/badge" element={<Badges />} />
                <Route path="/buttons" element={<Buttons />} />
                <Route path="/images" element={<Images />} />
                <Route path="/videos" element={<Videos />} />

                {/* Charts */}
                <Route path="/line-chart" element={<LineChart />} />
                <Route path="/bar-chart" element={<BarChart />} />

        </Routes>
    )

}

export default DashboardUserRoute;