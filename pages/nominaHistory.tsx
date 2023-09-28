import Router from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TreeTable, { ColumnData } from "../lib/components/tree_table";
import { useAuth } from "../lib/hooks/use_auth";
import RoleLayout from "../lib/layouts/role_layout";
import { StateField } from "../lib/styles/views/indexStyled";
import { FactureEmployees, Nomina } from "../lib/types";
import { CheckPermissions } from "../lib/utils/check_permissions";
import { Elaborando } from "../lib/utils/constants";
import HttpClient from "../lib/utils/http_client";
import LoadingContainer from "../lib/components/loading_container";
import Sidebar from "../lib/components/sidebar";

const NominaHistory = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Nomina>>([]);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/nomina/nominaHistory",
      "GET",
      auth.userName,
      auth.role
    );
    const nomina: Array<Nomina> = response.data ?? [];
    setTableData(nomina);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnData[] = [
    {
      dataField: "number",
      caption: "#",
      width: 60,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "date",
      caption: "Fecha de Registro",
      cssClass: "bold",
      width: 140,
    },
    {
      dataField: "soliciter",
      caption: "Solicitante",
      cssClass: "bold",
      width: 85,
    },
    {
      dataField: "details",
      caption: "Detalle",
      minWidth: 160,
      cssClass: "bold",
    },
    {
      dataField: "items",
      caption: "Valor Total",
      cellRender: (params) => {
        const factures: Array<FactureEmployees> = params.value;
        let total = 0;
        if (factures.length > 0)
          factures.forEach((item: FactureEmployees) => {
            total += parseFloat(item.value) ?? 0;
          });
        const formato = total.toLocaleString(navigator.language, {
          minimumFractionDigits: 2,
        });
        return (
          <p>
            <strong>${formato}</strong>
          </p>
        );
      },
      cssClass: "bold",
      width: 100,
    },
    {
      dataField: "state",
      caption: "Estado",
      cellRender: (params) => <StateField state={params.value ?? Elaborando} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
  ];

  const buttons = {
    show: (rowData: FactureEmployees) =>
      CheckPermissions(auth, [0, 3, 5, 9])
        ? Router.push({
            pathname: "/nomina/show/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
  };
  return (
    <>
      <RoleLayout permissions={[0, 3, 4, 5, 9, 10]}>
        <title>Nomina</title>

        <div className="flex h-full">
          <div className="md:w-1/6 max-w-none">
            <Sidebar />
          </div>
          <div className="w-12/12 md:w-5/6 flex items-center justify-center">
            <div className="w-11/12 bg-white my-14">
              <LoadingContainer visible={loading} miniVersion>
                <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
                  NOMINA
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-1  m-4 gap-4 mb-4">
                  <TreeTable
                    keyExpr="id"
                    dataSource={tableData}
                    columns={columns}
                    searchPanel={true}
                    buttons={buttons}
                    colors={{
                      headerBackground: "#F8F9F9",
                      headerColor: "#CD5C5C",
                    }}
                    buttonsFirst
                    paging
                    showNavigationButtons
                    showNavigationInfo
                    pageSize={15}
                    infoText={(actual, total, items) =>
                      `Página ${actual} de ${total} (${items} nominas)`
                    }
                  />
                </div>
                <button
                  className="m-4 text-center bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                  onClick={() => Router.back()}
                >
                  Volver
                </button>
              </LoadingContainer>
            </div>
          </div>
        </div>
      </RoleLayout>
    </>
  );
};

export default NominaHistory;
