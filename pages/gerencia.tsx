import { useState } from "react";
import GeneralReportModal from "../lib/components/modals/generalReport";
import Sidebar from "../lib/components/sidebar";
import { useAuth } from "../lib/hooks/use_auth";
import RoleLayout from "../lib/layouts/role_layout";

const Gerencia = () => {
  const { auth } = useAuth();
  const [modalVisibleGR, setModalVisibleGR] = useState<boolean>(false);

  const showModalGR = () => setModalVisibleGR(true);
  return (
    <>
      <RoleLayout permissions={[0, 4, 5, 18, 32]}>
        <title>Gerencia</title>
        <div className="flex h-screen">
          <div className="md:w-1/6 max-w-none">
            <Sidebar />
          </div>
          <div className="w-12/12 md:w-5/6 flex justify-center">
            <div className="w-11/12 bg-white my-14">
              <h1 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
                Gerencia
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 m-2 text-center">
                <div>
                  <button
                    onClick={showModalGR}
                    className="bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded whitespace-nowrap"
                  >
                    Reporte de Solicitudes
                  </button>
                </div>
                <div>
                  <button className="bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                    Botón 2
                  </button>
                </div>
                <div>
                  <button className="bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                    Botón 3
                  </button>
                </div>
                <div>
                  <button className="bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                    Botón 4
                  </button>
                </div>
                <div>
                  <button className="bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                    Botón 5
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <GeneralReportModal
          visible={modalVisibleGR}
          close={() => {
            setModalVisibleGR(null);
          }}
        />
      </RoleLayout>
    </>
  );
};
export default Gerencia;
