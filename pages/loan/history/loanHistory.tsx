import Router from "next/router";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import LoadingContainer from "../../../lib/components/loading_container";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";
import { useAuth } from "../../../lib/hooks/use_auth";
import { StateField } from "../../../lib/styles/views/indexStyled";
import { Loan } from "../../../lib/types";
import { Pendiente } from "../../../lib/utils/constants";
import HttpClient from "../../../lib/utils/http_client";

const LoanHistory = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Loan>>([]);

  const loadApro = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/loan/loanHistory",
      "GET",
      auth.userName,
      auth.role
    );
    const loans: Array<Loan> = response.data ?? [];
    setTableData(loans);
    setLoading(false);
  };

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
      caption: "Cargo",
      cssClass: "bold",
    },
    {
      dataField: "requestedDays",
      caption: "Prestamo",
      cssClass: "bold",
    },
    {
      dataField: "typePermissions",
      caption: "Tipo de prestamos",
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
    {
      dataField: "state",
      caption: "Estado",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      cssClass: "bold",
      alignment: "center",
    },
  ];

  const buttons = {
    show: (rowData: Loan) =>
      Router.push({ pathname: "/loan/viewHistory/" + (rowData.id as string) }),
  };

  return (
    <>
      <h3 className="text-danger py-4 text-center xl:text-3xl font-semibold">
        PRESTAMOS APROBADOS
      </h3>
      <LoadingContainer visible={loading} miniVersion>
        <div style={{ marginBottom: "4em" }}>
          <TreeTable
            keyExpr="id"
            dataSource={tableData}
            columns={columns}
            searchPanel={true}
            buttons={buttons}
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
export default LoanHistory;
