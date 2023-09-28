import React, { useEffect, useState } from "react";
import Router from "next/router";
import { useAuth } from "../../../lib/hooks/use_auth";
import { Permission } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";
import { StateField } from "../../../lib/styles/views/indexStyled";
import { Pendiente } from "../../../lib/utils/constants";
import LoadingContainer from "../../../lib/components/loading_container";

// Inicio de la app
const PermissionHistory = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Permission>>([]);

  const loadApro = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/permission/permissionHistory",
      "GET",
      auth.userName,
      auth.role
    );
    const permissions: Array<Permission> = response.data ?? [];
    setTableData(permissions);
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
      width: 300,
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
    show: (rowData: Permission) =>
      Router.push({
        pathname: "/permission/viewHistory/" + (rowData.id as string),
      }),
  };

  return (
    <>
      <h3 className="text-center my-4 mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
        HISTORIAL PERMISOS APROBADOS
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
              `Página ${actual} de ${total} (${items} permisos)`
            }
          />
        </div>
      </LoadingContainer>
    </>
  );
};
export default PermissionHistory;
