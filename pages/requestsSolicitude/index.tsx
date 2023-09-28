import Router from "next/router";
import { useAuth } from "../../lib/hooks/use_auth";
import ICPanelListOfOne from "../../lib/layouts/listOfOneSolicitude/inmoconstrucciones";
import { CheckPermissions } from "../../lib/utils/check_permissions";
import TabContainer, { TabPanel } from "../../lib/components/tab_container";
import IGPanelListOfOne from "../../lib/layouts/listOfOneSolicitude/inmogestion";
import CalderonPanelListOfOne from "../../lib/layouts/listOfOneSolicitude/calderon";
import BalconPanelListOfOne from "../../lib/layouts/listOfOneSolicitude/balcon";
import Sidebar from "../../lib/components/sidebar";

const MySolicitudes = () => {
  const { auth } = useAuth();

  const tabPanels: Array<TabPanel> = [
    {
      name: "Inmoconstrucciones",
      content: <ICPanelListOfOne />,
    },
    {
      name: "Inmogestion",
      content: <IGPanelListOfOne />,
    },
    {
      name: "Calderon",
      content: <CalderonPanelListOfOne />,
    },
    {
      name: "Balcon",
      content: <BalconPanelListOfOne />,
    },
  ];

  return (
    <>
      <title>Solicitudes de Pagos</title>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <div className="grid md:grid-cols-3 items-center justify-center my-5 gap-3">
              <div className="mx-auto">
                <button
                  className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                  onClick={() =>
                    Router.push({ pathname: "/solicitudeHistory" })
                  }
                >
                  Historial de Solicitudes
                </button>
              </div>
              <div className="mx-auto">
                <button
                  className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                  onClick={() => Router.push({ pathname: "/beneficiary" })}
                >
                  Beneficiarios
                </button>
              </div>
              <div className="mx-auto">
                <button
                  className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                  onClick={() => Router.push({ pathname: "/requestsAdvance" })}
                >
                  Anticipos
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
              {CheckPermissions(auth, [8]) ? <IGPanelListOfOne /> : null}

              {CheckPermissions(auth, [0, 1, 2, 3, 4, 5, 6, 7, 9, 14]) ? (
                <TabContainer tabPanels={tabPanels} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MySolicitudes;
