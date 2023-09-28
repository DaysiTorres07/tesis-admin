import Router from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/use_auth";
import { Permission } from "../../types";
import HttpClient from "../../utils/http_client";
import TreeTable, { ColumnData } from "../../components/tree_table";
import { StateField } from "../../styles/views/indexStyled";
import { Pendiente } from "../../utils/constants";
import { FaFileAlt } from "react-icons/fa";

const MyRequestPermissions = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Permission>>([]);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/permission/" + auth.id,
      "POST",
      auth.userName,
      auth.role,
      {
        userName: auth.name,
      }
    );
    const permissions: Array<Permission> = response.data ?? [];
    setTableData(permissions);
    setLoading(false);
  };

  // ejecuta la funcion al renderizar la vista
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
      caption: "Fecha de registro",
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
      caption: "Permiso escogido",
      cssClass: "bold",
      width: 250,
    },
    {
      dataField: "details",
      caption: "Detalle",
      cssClass: "bold",
    },
    {
      dataField: "requestedHour",
      caption: "Total Horas",
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
    edit: (rowData: Permission) =>
      Router.push({
        pathname: "/myrequest/revisionPermissions/" + (rowData.id as string),
      }),
    download: (rowData: Permission) =>
      Router.push({ pathname: "/permission/print/" + (rowData.id as string) }),
  };

  return (
    <>
      <title>Mis Permisos</title>
      <h1
        className="flex items-center justify-center p-3 text-center xl:text-2xl font-semibold"
        style={{
          color: "#DC3545",
        }}
      >
        <span>MIS PERMISOS SOLICITADAS</span>
        <FaFileAlt size={48} style={{ marginLeft: "0.9rem" }} />
      </h1>
      <div style={{ margin: "20px", marginBottom: "3em" }}>
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
          pageSize={10}
          infoText={(actual, total, items) =>
            `Página ${actual} de ${total} (${items} permisos)`
          }
        />
      </div>
    </>
  );
};
export default MyRequestPermissions;
