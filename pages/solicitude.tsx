import React, { useState } from "react";
import TabContainer from "../lib/components/tab_container";
import InmoconstruccionesPanel from "../lib/layouts/companys/inmoconstrucciones";
import InmogestionPanel from "../lib/layouts/companys/inmogestion";
import CalderonPanel from "../lib/layouts/companys/calderon";
import BalconPanel from "../lib/layouts/companys/balcon";
import Router from "next/router";
import { CheckPermissions } from "../lib/utils/check_permissions";
import { useAuth } from "../lib/hooks/use_auth";
import RoleLayout from "../lib/layouts/role_layout";
import Sidebar from "../lib/components/sidebar";

// Inicio de la app
const Solicitude = () => {
  const { auth } = useAuth();
  const [dates, setDates] = useState<Array<string>>([]);

  const tabPanels = [
    {
      name: "Inmoconstrucciones",
      content: <InmoconstruccionesPanel dates={dates} />,
    },
    {
      name: "Inmogestión",
      content: <InmogestionPanel dates={dates} />,
    },
    {
      name: "Calderon",
      content: <CalderonPanel dates={dates} />,
    },
    {
      name: "Balcon",
      content: <BalconPanel dates={dates} />,
    },
  ];

  return (
    <>
      <RoleLayout permissions={[0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14]}>
        <title>Solicitudes de Pagos</title>
        <div className="flex h-full">
          <div className="md:w-1/6 max-w-none">
            <Sidebar />
          </div>
          <div className="w-12/12 md:w-5/6 flex justify-center "> 
            <div className="w-12/12 bg-white my-14 mx-8">
              <div className="grid md:grid-cols-4 items-center justify-center my-5 gap-3"> 
                <div className="mx-auto">
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                    onClick={() =>
                      Router.push({ pathname: "/solicitudeHistory" })
                    }
                  >
                    Ver Historial 
                  </button>
                </div>
                <div className="mx-auto">
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                    onClick={() => Router.push({ pathname: "/beneficiary" })}
                  >
                    Beneficiarios
                  </button>
                </div>
                <div className="mx-auto">
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                    onClick={() => Router.push({ pathname: "/advance" })}
                  >
                    Ir a Anticipos
                  </button>
                </div>
                <div className="mx-auto">
                  <button
                  className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
                  onClick={() => Router.back()}
                  >
                  Volver
                  </button> 
              </div> 
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
                {CheckPermissions(auth, [8]) ? (
                  <InmogestionPanel lg={6} md={7} dates={dates} />
                ) : null}
                {CheckPermissions(auth, [0, 1, 2, 3, 4, 5, 6, 7, 9]) ? (
                  <TabContainer tabPanels={tabPanels} />
                ) : null}
              </div>
              <button
                className="bg-transparent m-5 hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
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
export default Solicitude;
