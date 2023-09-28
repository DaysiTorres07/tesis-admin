import Router from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/use_auth";
import { Loan } from "../../types";
import HttpClient from "../../utils/http_client";
import TreeTable, { ColumnData } from "../../components/tree_table";
import { FaFileAlt } from "react-icons/fa";

const MyLoans = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Loan>>([]);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/loan/" + auth.id,
      "POST",
      auth.userName,
      auth.role,
      {
        userName: auth.name,
      }
    );
    const loans: Array<Loan> = response.data ?? [];
    setTableData(loans);
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
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "soliciter",
      caption: "Solicitante",
      cssClass: "bold",
      width: 300,
    },
    {
      dataField: "details",
      caption: "Departamento",
      cssClass: "bold",
    },
    {
      dataField: "requestedHour",
      caption: "Cargpo",
      cssClass: "bold",
    },
    {
      dataField: "requestedDays",
      caption: "Cargo",
      cssClass: "bold",
    },
    {
      dataField: "typePermissions",
      caption: "Tipo de prestamo",
      cssClass: "bold",
    },
    {
      dataField: "dateS",
      caption: "Periodo",
      cssClass: "bold",
    },
    {
      dataField: "dateE",
      caption: "Mes de cobro",
      cssClass: "bold",
    },
  ];

  const buttons = {
    edit: (rowData: Loan) =>
      Router.push({
        pathname: "/myrequest/revisionLoan/" + (rowData.id as string),
      }),
    download: (rowData: Loan) =>
      auth?.bussines === "IC"
        ? Router.push({ pathname: "loan/print/" + (rowData.id as string) })
        : Router.push({ pathname: "loan/printIG/" + (rowData.id as string) }),
  };

  return (
    <>
      <title>Mis Prestamos</title>
      <h1
        className="flex items-center justify-center p-3 text-center xl:text-2xl font-semibold"
        style={{
          color: "#DC3545",
        }}
      >
        <span>MIS PRESTAMOS SOLICITADAS</span>
        <FaFileAlt size={48} style={{ marginLeft: "0.9rem" }} />
      </h1>
      <div style={{ margin: "20px", marginBottom: "3em" }}>
        <TreeTable
          keyExpr="id"
          columns={columns}
          dataSource={tableData}
          buttons={buttons}
          searchPanel={true}
          colors={{ headerBackground: "#F8F9F9", headerColor: "#CD5C5C" }}
          buttonsFirst
          paging
          showNavigationButtons
          showNavigationInfo
          pageSize={6}
          infoText={(actual, total, items) =>
            `Página ${actual} de ${total} (${items} prestamos)`
          }
        />
      </div>
    </>
  );
};
export default MyLoans;
