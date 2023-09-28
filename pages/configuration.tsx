import React from "react";
import TabContainer, { TabPanel } from "../lib/components/tab_container";
import ProvidersPanel from "../lib/layouts/config/provider";
import DeparmentsPanel from "../lib/layouts/config/departments";
import ProjectsPanel from "../lib/layouts/config/projects";
import UsersPanel from "../lib/layouts/config/users";
import RoleLayout from "../lib/layouts/role_layout";
import CentersPanel from "../lib/layouts/config/centros_costos";
import CentersIgPanel from "../lib/layouts/config/centros_costosInmogestion";
import CentersCalderonPanel from "../lib/layouts/config/centros_costrosCalderon";
import CentersBalconPanel from "../lib/layouts/config/centros_CostosBalcon";
import ProvidersBalconPanel from "../lib/layouts/config/providerBalcon";
import ProvidersInmogestionPanel from "../lib/layouts/config/providerInmogestion";
import ProvidersRecaudacionesPanel from "../lib/layouts/config/providerRecaudaciones";
import ProvidersCalderonPanel from "../lib/layouts/config/providerCalderon";
import Banks from "../lib/layouts/config/banks";
import Sidebar from "../lib/components/sidebar";

const Configuration = () => {
  const tabPanels: Array<TabPanel> = [
    {
      name: "Usuarios",
      content: <UsersPanel />,
    },
    {
      name: "Departamentos",
      content: <DeparmentsPanel />,
    },
    {
      name: "Proyectos",
      content: <ProjectsPanel />,
    },
    {
      name: "Proveedores IC",
      content: <ProvidersPanel />,
    },
    {
      name: "Proveedores IG",
      content: <ProvidersInmogestionPanel />,
    },
    {
      name: "Proveedores Calderon",
      content: <ProvidersCalderonPanel />,
    },
    {
      name: "Proveedores Balcon",
      content: <ProvidersBalconPanel />,
    },
    {
      name: "Proveedores Recaudaciones",
      content: <ProvidersRecaudacionesPanel />,
    },
    {
      name: "CC IC",
      content: <CentersPanel />,
    },
    {
      name: "CC IG",
      content: <CentersIgPanel />,
    },
    {
      name: "CC Calderon",
      content: <CentersCalderonPanel />,
    },
    {
      name: "CC Balcon",
      content: <CentersBalconPanel />,
    },
    {
      name: "Bancos",
      content: <Banks />,
    },
  ];

  return (
    <RoleLayout permissions={[0]}>
      <title>Configuracion del sistema</title>

      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
              <TabContainer
                tabPanels={tabPanels}
                style={{ padding: "40px 0" }}
              />
            </div>
          </div>
        </div>
      </div>
    </RoleLayout>
  );
};
export default Configuration;
