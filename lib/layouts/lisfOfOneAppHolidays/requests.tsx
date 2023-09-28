import Router from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/use_auth";
import { Holidays } from "../../types";
import HttpClient from "../../utils/http_client";
import TreeTable, { ColumnData } from "../../components/tree_table";
import { StateField } from "../../styles/views/indexStyled";
import { Pendiente } from "../../utils/constants";
import LoadingContainer from "../../components/loading_container";
import { FaFileAlt } from "react-icons/fa";
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
        userName: auth.name,
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
      width: 70,
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
      width: 260,
    },
    {
      dataField: "typePermissions",
      caption: "Vacaciones Escogidas",
      cssClass: "bold",
      width: 230,
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
      <title>ANCON | Ver Mis Vacaciones</title>

      <LoadingContainer visible={loading} miniVersion>
        <h1
          className="flex items-center justify-center p-3 text-center xl:text-2xl font-semibold"
          style={{
            color: "#DC3545",
          }}
        >
          <span>MIS VACACIONES SOLICITADAS</span>
          <FaFileAlt size={48} style={{ marginLeft: "0.9rem" }} />
        </h1>

        <div style={{ margin: "20px", marginBottom: "5em" }}>
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
      </LoadingContainer>
    </>
  );
};
export default MyRequest;
