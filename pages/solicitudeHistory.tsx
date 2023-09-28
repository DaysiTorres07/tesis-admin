import React, { useState } from "react";
import Router from "next/router";
import { useAuth } from "../lib/hooks/use_auth";
import TabContainer, { TabPanel } from "../lib/components/tab_container";
import SolicitudeICHistoryPanel from "../lib/layouts/companyHistory/inmoconstrucciones";
import { CheckPermissions } from "../lib/utils/check_permissions";
import SolicitudeIGHistoryPanel from "../lib/layouts/companyHistory/inmogestion";
import SolicitudeCalderonHistoryPanel from "../lib/layouts/companyHistory/calderon";
import SolicitudeBalconHistoryPanel from "../lib/layouts/companyHistory/balcon";
import SolicitudeRecaudacionesHistoryPanel from "../lib/layouts/companyHistory/recaudaciones";
import AdvanceICHistoryPanel from "../lib/layouts/companyHistoryAdvance/inmoconstrucciones";
import AdvanceIGHistoryPanel from "../lib/layouts/companyHistoryAdvance/inmogestion";
import AdvanceCalderonHistoryPanel from "../lib/layouts/companyHistoryAdvance/calderon";
import AdvanceBalconHistoryPanel from "../lib/layouts/companyHistoryAdvance/balcon";
import Sidebar from "../lib/components/sidebar";
import RoleLayout from "../lib/layouts/role_layout";

// Inicio de la app
const SolicitudeHistory = () => {
  const { auth } = useAuth();
  const [dates, setDates] = useState<Array<string>>([]);

  const tabPanels: Array<TabPanel> = [
    {
      name: "Inmoconstrucciones",
      content: <SolicitudeICHistoryPanel dates={dates} />,
    },
    {
      name: "Inmogestión",
      content: <SolicitudeIGHistoryPanel dates={dates} />,
    },
    {
      name: "Calderon",
      content: <SolicitudeCalderonHistoryPanel dates={dates} />,
    },
    {
      name: "Balcon",
      content: <SolicitudeBalconHistoryPanel dates={dates} />,
    },
    {
      name: "Recaudaciones",
      content: <SolicitudeRecaudacionesHistoryPanel dates={dates} />,
    },
  ];
  const advancePanels: Array<TabPanel> = [
    {
      name: "Inmoconstrucciones",
      content: <AdvanceICHistoryPanel dates={dates} />,
    },
    {
      name: "Inmogestión",
      content: <AdvanceIGHistoryPanel dates={dates} />,
    },
    {
      name: "Calderon",
      content: <AdvanceCalderonHistoryPanel dates={dates} />,
    },
    {
      name: "Balcon",
      content: <AdvanceBalconHistoryPanel dates={dates} />,
    },
  ];

  return (
    <>
      <RoleLayout permissions={[0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14]}>
        <title>Historial de Solicitudes y Anticipos</title>
        <div className="flex h-full">
          <div className="md:w-1/6 max-w-none">
            <Sidebar />
          </div>
          <div className="w-12/12 md:w-5/6 flex items-center justify-center">
            <div className="w-11/12 bg-white my-14">
              <div className="grid grid-cols-1">
                <div className="grid md:grid-cols-4 items-center justify-center my-3 gap-3"> 
                  <div className="mx-auto">
                      <button
                      className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
                      onClick={() => Router.back()}
                      >
                      Volver
                      </button> 
                  </div>
                </div>
                <div className="mt-5">
                  {CheckPermissions(auth, [8]) ? (
                    <SolicitudeIGHistoryPanel dates={dates} />
                  ) : null}
                </div>

                {CheckPermissions(auth, [0, 1, 2, 3, 4, 5, 6, 7, 9, 14]) ? (
                  <TabContainer tabPanels={tabPanels} />
                ) : null}
                <div className="grid md:grid-cols-4 items-center justify-center my-3 gap-3"> 
                  <div className="mx-auto">
                      <button
                      className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
                      onClick={() => Router.back()}
                      >
                      Volver
                      </button> 
                  </div>
                </div>
                {CheckPermissions(auth, [8]) ? (
                  <AdvanceIGHistoryPanel dates={dates} />
                ) : null}

                {CheckPermissions(auth, [0, 1, 2, 3, 4, 5, 6, 7, 9, 14]) ? (
                  <TabContainer tabPanels={advancePanels} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </RoleLayout>
    </>
  );
};
export default SolicitudeHistory;
