import React, { useEffect, useState } from "react";
import Router from "next/router";
import { useAuth } from "../../../lib/hooks/use_auth";
import HttpClient from "../../../lib/utils/http_client";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";
import { StateField } from "../../../lib/styles/views/indexStyled";
import { Pendiente } from "../../../lib/utils/constants";
import LoadingContainer from "../../../lib/components/loading_container";
import { Holidays } from "../../../lib/types";

// Inicio de la app
const HolidaysHistory = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Holidays>>([]);

  const loadApro = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/holidays/solicitudeHistory",
      "GET",
      auth.userName,
      auth.role
    );
    const solicitudes: Array<Holidays> = response.data ?? [];
    setTableData(solicitudes);
    setLoading(false);
  };

  // ejecuta funcion al renderizar la vista
  useEffect(() => {
    loadApro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnData[] = [
    {
      dataField: "number",
      caption: "#",
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "date",
      caption: "Fecha de Registro",
      cssClass: "bold",
    },
    {
      dataField: "soliciter",
      caption: "Solicitante",
      cssClass: "bold",
    },
    {
      dataField: "details",
      caption: "Detalle",
      cssClass: "bold",
    },

    {
      dataField: "state",
      caption: "Solicitante",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      alignment: "center",
      cssClass: "bold",
    },
  ];

  const buttons = {
    show: (rowData: Holidays) =>
      Router.push({
        pathname: "/holidays/viewHistory/" + (rowData.id as string),
      }),
  };

  return (
    <>
        <h3 className="text-center my-4 mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
          HISTORIAL VACACIONES APROBADAS
        </h3>
        <LoadingContainer visible={loading} miniVersion>
          <div style={{ marginBottom: "4em" }}>
            <TreeTable
              keyExpr="id"
              dataSource={tableData}
              columns={columns}
              buttons={buttons}
              searchPanel={true}
              colors={{ headerBackground: "#F8F9F9", headerColor: "#CD5C5C" }}
              buttonsFirst
              paging
              showNavigationButtons
              showNavigationInfo
              pageSize={6}
              infoText={(actual, total, items) =>
                `Página ${actual} de ${total} (${items} solicitudes)`
              }
            />
          </div>
        </LoadingContainer>
    </>
  );
};
export default HolidaysHistory;
