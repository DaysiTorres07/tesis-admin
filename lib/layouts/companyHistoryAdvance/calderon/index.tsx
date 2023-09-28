import Router from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingContainer from "../../../components/loading_container";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import { useAuth } from "../../../hooks/use_auth";
import { StateField } from "../../../styles/views/indexStyled";
import { AdvanceCalderon, FactureAdvanceCalderon } from "../../../types";
import { CheckPermissions } from "../../../utils/check_permissions";
import { Abierto, Elaborando, Pendiente } from "../../../utils/constants";
import HttpClient from "../../../utils/http_client";

type Props = {
  dates: Array<string>;
};

// Inicio de la app
const AdvanceCalderonHistoryPanel = (props: Props) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<AdvanceCalderon>>([]);

  const loadData = async () => {
    setLoading(true);
    if (
      props.dates[0] === undefined ||
      props.dates[0] === "" ||
      props.dates[1] === undefined ||
      props.dates[1] === ""
    ) {
      var response = await HttpClient(
        "/api/advanceCalderon/advanceHistory",
        "GET",
        auth.userName,
        auth.role
      );
    } else {
      var response = await HttpClient(
        "/api/advanceCalderon/advanceHistory?dates=" +
          props.dates[0] +
          "¡" +
          props.dates[1],
        "GET",
        auth.userName,
        auth.role
      );
    }
    const solicitudesCalderon: Array<AdvanceCalderon> = response.data ?? [];
    setTableData(solicitudesCalderon);
    setLoading(false);
  };

  // ejecuta funcion al renderizar la vista
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dates]);

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
        const facturesAdvanceCalderon: Array<FactureAdvanceCalderon> =
          params.value;
        let total = 0;
        if (facturesAdvanceCalderon.length > 0)
          facturesAdvanceCalderon.forEach((item: FactureAdvanceCalderon) => {
            total += item.value ?? 0;
          });
        const formato = total.toLocaleString(navigator.language, {
          minimumFractionDigits: 2,
        });
        return (
          <p style={{ margin: 2 }}>
            <strong>${formato}</strong>
          </p>
        );
      },
      cssClass: "bold",
      width: 100,
    },
    {
      dataField: "soliciterState",
      caption: "Solicitante",
      cellRender: (params) => <StateField state={params.value ?? Elaborando} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "paymentTreasuryState",
      caption: "Tesorería",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "financialState",
      caption: "Financiero",
      cellRender: (params) => <StateField state={params.value ?? Elaborando} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "imageTreasuryState",
      caption: "Pagos",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "contableAdvanceState",
      caption: "Contabilidad",
      cellRender: (params) => <StateField state={params.value ?? Abierto} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
  ];

  const buttons = {
    download: (rowData: FactureAdvanceCalderon) =>
      Router.push({
        pathname: "/advanceCalderon/print/" + (rowData.id as string),
      }),
    edit: (rowData: FactureAdvanceCalderon) =>
      !CheckPermissions(auth, [8])
        ? Router.push({
            pathname: "/advanceCalderon/editHistory/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
  };

  return (
    <>
      {/* <h3 className="text-center my-4 mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
        HISTORIAL DE ANTICIPOS CALDERON
      </h3> */}
            <p className="mb-2  font-semibold font-serif text-center" style={{
                  color: "#4b5563",
                  
                }}>
              Historial de ANTICIPOS:{" "}                
              <em
                style={{
                  color: "#610d9a",
                  fontStyle: "normal",
                  fontSize: "30px",
                  fontFamily: "Lato"
                }}
              >
              CALDERÓN
              </em>
            </p>
      <LoadingContainer visible={loading} miniVersion>
        <TreeTable
          keyExpr="id"
          dataSource={tableData}
          columns={columns}
          buttons={buttons}
          searchPanel={true}
          colors={{ headerBackground: "#F8F9F9", headerColor: "black" }}
          buttonsFirst
          paging
          showNavigationButtons
          showNavigationInfo
          pageSize={20}
          infoText={(actual, total, items) =>
            `Página ${actual} de ${total} (${items} solicitudes)`
          }
        />
      </LoadingContainer>
    </>
  );
};
export default AdvanceCalderonHistoryPanel;
