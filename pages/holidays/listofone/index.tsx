import Router from "next/router";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Holidays } from "../../../lib/types";
import { useAuth } from "../../../lib/hooks/use_auth";
import HttpClient from "../../../lib/utils/http_client";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";
import { StateField } from "../../../lib/styles/views/indexStyled";
import { Pendiente } from "../../../lib/utils/constants";
import LoadingContainer from "../../../lib/components/loading_container";
import Sidebar from "../../../lib/components/sidebar";

const MyRequest = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Holidays>>([]);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/holidays/" + auth.id,
      "POST",
      auth.userName,
      auth.role,
      {
        userName: auth.userName,
      }
    );
    const solicitudes: Array<Holidays> = response.data ?? [];
    setTableData(solicitudes);
    setLoading(false);
  };

  // ejecuta funcion al renderizar la vista
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnData[] = [
    {
      dataField: "number",
      caption: "#",
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "date",
      caption: "Fecha de Registro",
      cssClass: "bold",
      width: 150,
    },
    {
      dataField: "soliciter",
      caption: "Solicitante",
      cssClass: "bold",
      width: 280,
    },
    {
      dataField: "typePermissions",
      caption: "Vacaciones Escogidas",
      cssClass: "bold",
      width: 250,
    },
    {
      dataField: "details",
      caption: "Detalle",
      cssClass: "bold",
    },
    {
      dataField: "requestedDays",
      caption: "Total Dias",
      cssClass: "bold",
      width: 60,
      alignment: "center",
    },
    {
      dataField: "state",
      caption: "Estado",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
  ];

  const buttons = {
    edit: (rowData: Holidays) =>
      Router.push({
        pathname: "/myrequest/revision/" + (rowData.id as string),
      }),
    download: (rowData: Holidays) =>
      Router.push({ pathname: "/holidays/print/" + (rowData.id as string) }),
  };

  return (
    <>
      <title>Mis Vacaciones</title>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <LoadingContainer visible={loading} miniVersion>
              <h1 className="text-center my-4 mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                MIS VACACIONES SOLICITADAS
              </h1>
              <div className="grid grid-cols-1 m-4">
                <TreeTable
                  keyExpr="id"
                  dataSource={tableData}
                  columns={columns}
                  buttons={buttons}
                  searchPanel={true}
                  colors={{
                    headerBackground: "#F8F9F9",
                    headerColor: "#CD5C5C",
                  }}
                  buttonsFirst
                  paging
                  showNavigationButtons
                  showNavigationInfo
                  pageSize={10}
                  infoText={(actual, total, items) =>
                    `Página ${actual} de ${total} (${items} vacaciones)`
                  }
                />
              </div>
              <div>
                <button
                  className="m-4 text-center bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                  onClick={() => Router.back()}
                >
                  Volver
                </button>
              </div>
            </LoadingContainer>
          </div>
        </div>
      </div>
    </>
  );
};
export default MyRequest;
