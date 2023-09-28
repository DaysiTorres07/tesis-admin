import React from "react";
import Sidebar from "../lib/components/sidebar";
import Vacation from "../lib/components/rrhh/vacaciones";
import { useAuth } from "../lib/hooks/use_auth";
import Permisos from "../lib/components/rrhh/permisos";
import { CheckPermissions } from "../lib/utils/check_permissions";
import TabContainer from "../lib/components/tab_container";
import Loans from "../lib/components/rrhh/loans";
import Router from "next/router";
import RoleLayout from "../lib/layouts/role_layout";

const Rrhh = () => {
  const { auth } = useAuth();

  const tabPanels = [
    {
      name: "Vacaciones",
      content: <Vacation />,
    },
    {
      name: "Permisos",
      content: <Permisos />,
    },
    {
      name: "Prestamos",
      content: <Loans />,
    },
  ];

  return (
    <>
    <RoleLayout permissions={[0, 10, 33]}>
      <title>RRHH y Contabilidad</title>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
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

export default Rrhh;
