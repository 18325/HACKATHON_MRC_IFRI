import Metrics from "../../components/statistic/Metrics.tsx";
import RecentAppointments from "../../components/statistic/RecentAppointments.tsx";
import PageMeta from "../../components/common/PageMeta";
import {useAxiosPrivate} from "../../hooks/useAxiosPrivate.ts";
import {Stat} from "../../types/medicalTypes.ts";
import {useQuery} from "@tanstack/react-query";

export default function Home() {

    const axiosPrivate = useAxiosPrivate();
    const fetchStat  =  async (): Promise<Stat> => {
        const response = await axiosPrivate.get(`/statistic`)
        return response.data as Stat;
    }

    const {isLoading,error,isError,   data:stat } = useQuery({
        queryKey: ['stat'],
        queryFn: fetchStat,
    })

  return (
    <>
      <PageMeta
        title="Tableau de bord"
        description="Une application dédiée aux médecin pour la gestion des patients"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <Metrics isLoading={isLoading} error={error} isError={isError} stat ={stat}/>
        </div>

        <div className="col-span-12 ">
          <RecentAppointments isLoading={isLoading} isError={isError} error={error} stat ={stat}/>
        </div>
      </div>
    </>
  );
}
