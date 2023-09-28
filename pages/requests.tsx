import { useAuth } from "../lib/hooks/use_auth";
import Sidebar from "../lib/components/sidebar";
import MyRequest from "../lib/layouts/lisfOfOneAppHolidays/requests";
import { CheckPermissions } from "../lib/utils/check_permissions";
import TabContainer from "../lib/components/tab_container";
import MyRequestPermissions from "../lib/layouts/lisfOfOneAppHolidays/requestPermissions";
import MyLoans from "../lib/layouts/lisfOfOneAppHolidays/requestLoan";
import Router from "next/router";

const LisfOfOneHolidays = () => {
  const { auth } = useAuth();

  const tabPanels = [
    {
      name: "Vacaciones",
      content: <MyRequest />,
    },
    {
      name: "Permisos",
      content: <MyRequestPermissions />,
    },
    {
      name: "Prestamos",
      content: <MyLoans />,
    },
  ];

  return (
    <>
      <title>ANCON | Ver Mis Vacaciones</title>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
              {CheckPermissions(
                auth,
                [
                  0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                  18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
                  33, 34, 35, 36, 37, 38, 39, 40,
                ]
              ) ? (
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
    </>
  );
};
export default LisfOfOneHolidays;
