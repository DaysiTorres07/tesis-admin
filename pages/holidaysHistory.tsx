import RoleLayout from "../lib/layouts/role_layout";
import HolidaysHistory from "./holidays/history/solicitudeHistory";
import HolidaysHistoryRe from "./holidays/history/solicitudeHistoryRe";
import TabContainer, { TabPanel } from "../lib/components/tab_container";
import { CheckPermissions } from "../lib/utils/check_permissions";
import Sidebar from "../lib/components/sidebar";
import { useAuth } from "../lib/hooks/use_auth";
import Router from "next/router";

const HistoryVacation = () => {
  const { auth } = useAuth();
  const tabPanels: Array<TabPanel> = [
    {
      name: "Aprobada",
      content: <HolidaysHistory />,
    },
    {
      name: "Rechazadas",
      content: <HolidaysHistoryRe />,
    },
  ];
  return (
    <>
      <RoleLayout permissions={[0, 10, 33]}>
        <title>Historial de vacaciones A/R</title>
        <div className="flex h-full">
          <div className="md:w-1/6 max-w-none">
            <Sidebar />
          </div>
          <div className="w-12/12 md:w-5/6 flex items-center justify-center">
            <div className="w-11/12 bg-white my-14">
              <div className="grid grid-cols-1 mt-5">
                {CheckPermissions(auth, [0, 10, 33]) ? (
                  <TabContainer tabPanels={tabPanels} />
                ) : null}
              </div>
              <button
                className="bg-transparent m-5 hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                onClick={() => Router.back()}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </RoleLayout>
    </>
  );
};
export default HistoryVacation;
