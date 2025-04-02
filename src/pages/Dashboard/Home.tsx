import Metrics from "../../components/statistic/Metrics.tsx";
import MonthlySalesChart from "../../components/statistic/MonthlySalesChart";
import StatisticsChart from "../../components/statistic/StatisticsChart";
import MonthlyTarget from "../../components/statistic/MonthlyTarget";
import RecentOrders from "../../components/statistic/RecentOrders";
import DemographicCard from "../../components/statistic/DemographicCard";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="AI4CKD"
        description="Une application dédiée aux médecin pour la gestion des patients"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <Metrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
