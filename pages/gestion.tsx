import Head from "next/head";
import CalculoMoras from "../lib/components/moras/calculoMoras";
import EstadosCuenta from "../lib/components/moras/estadosCuentas";
import Morosos from "../lib/components/moras/morosos";
import Sidebar from "../lib/components/sidebar";
import TabContainer from "../lib/components/tab_container";
import { useAuth } from "../lib/hooks/use_auth";
import RoleLayout from "../lib/layouts/role_layout";

const Gestion = () => {
  const { auth } = useAuth();

  const tabPanels = [
    {
      name: "Consulta de Moras",
      content: <CalculoMoras />,
    },
    {
      name: "Clientes en Mora",
      content: <Morosos />,
    },
    {
      name: "Estados de cuenta",
      content: <EstadosCuenta />,
    },
  ];
  return (
    <>
      <RoleLayout permissions={[0, 3, 4, 5, 14, 15, 16, 17, 18]}>
        <Head>
          <style>
            {`
          @media print {
            .no-imprimir {
              display: none;
            }
            body {
                background: white !important;
            }
          }
        `}
          </style>
        </Head>
        <title>Gestion y Credito</title>
        <div className="flex h-screen">
          <div className="md:w-1/6 max-w-none">
            <Sidebar />
          </div>
          <div className="w-12/12 md:w-5/6">
            <div className="w-11/12 bg-white my-14 mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2 no-imprimir">
                <TabContainer tabPanels={tabPanels} />
              </div>
            </div>
            <div className="w-11/12 bg-white mx-auto">
              <div>
                <h1>Gestion</h1>
              </div>
            </div>
          </div>
        </div>
      </RoleLayout>
    </>
  );
};
export default Gestion;
