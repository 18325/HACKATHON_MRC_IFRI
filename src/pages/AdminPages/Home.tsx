
import PageMeta from "../../components/common/PageMeta";
import AdminMetrics from "../../components/statistic/AdminMetrics.tsx";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Tableau de board"
        description="Une application dédiée aux médecin pour la gestion des patients"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 ">
          <AdminMetrics />
        </div>
      </div>
    </>
  );
}
