import Router from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import { useAuth } from "../../../hooks/use_auth";
import { StateField } from "../../../styles/views/indexStyled";
import { FactureRecaudaciones, SolicitudeRecaudaciones } from "../../../types";
import { CheckPermissions } from "../../../utils/check_permissions";
import { Elaborando, Pendiente } from "../../../utils/constants";
import HttpClient from "../../../utils/http_client";
import LoadingContainer from "../../../components/loading_container";
import ConfirmModal from "../../../components/modals/confirm";

type Props = {
  dates: Array<string>;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  inTabs?: boolean;
};

// Inicio de la app
const RecaudacionesPanel = (props: Props) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<SolicitudeRecaudaciones>>(
    []
  );
  const [itemToDelete, setItemToDelete] = useState<string>(null);

  const loadData = async () => {
    setLoading(true);
    if (
      props.dates[0] === undefined ||
      props.dates[0] === "" ||
      props.dates[1] === undefined ||
      props.dates[1] === ""
    ) {
      var response = await HttpClient(
        "/api/solicitudeRecaudaciones",
        "GET",
        auth.userName,
        auth.role
      );
    } else {
      var response = await HttpClient(
        "/api/solicitudeRecaudaciones?dates=" +
          props.dates[0] +
          "+" +
          props.dates[1],
        "GET",
        auth.userName,
        auth.role
      );
    }
    const solicitudesRecaudaciones: Array<SolicitudeRecaudaciones> =
      response.data ?? [];
    setTableData(solicitudesRecaudaciones);
    setLoading(false);
  };

  const showConfirmModal = (factureRecaudacionesId: string) =>
    setItemToDelete(factureRecaudacionesId);
  const hideConfirmModal = () => setItemToDelete(null);

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
        const facturesRecaudaciones: Array<FactureRecaudaciones> = params.value;
        let total = 0;
        if (facturesRecaudaciones.length > 0)
          facturesRecaudaciones.forEach((item: FactureRecaudaciones) => {
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
      dataField: "contableState",
      caption: "Contabilidad",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
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
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
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
  ];

  const buttons = {
    edit: (rowData: FactureRecaudaciones) =>
      !CheckPermissions(auth, [8])
        ? Router.push({
            pathname: "/solicitudeRecaudaciones/edit/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
    delete: async (rowData: FactureRecaudaciones) => {
      CheckPermissions(auth, [0])
        ? showConfirmModal(rowData.id)
        : toast.error("No puedes eliminar una Solicitud");
    },
    download: (rowData: FactureRecaudaciones) =>
      !CheckPermissions(auth, [8])
        ? Router.push({
            pathname:
              "/solicitudeRecaudaciones/print/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
  };

  return (
    <>
      <h2 className="text-center fw-bold my-4 d-none d-md-block">
        SOLICITUDES EMPRESA: RECAUDACIONES
      </h2>
      <h6 className="text-center fw-bold my-4 d-block d-md-none">
        SOLICITUDES EMPRESA: RECAUDACIONES
      </h6>
      <button
        className="mb-4"
        onClick={() =>
          CheckPermissions(auth, [0, 1])
            ? Router.push({ pathname: "/solicitudeRecaudaciones/new" })
            : toast.info("No puede ingresar solicitudes")
        }
      >
        Crear Solicitud
      </button>
      <LoadingContainer visible={loading} miniVersion>
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
          pageSize={15}
          infoText={(actual, total, items) =>
            `Página ${actual} de ${total} (${items} solicitudes)`
          }
        />

        <ConfirmModal
          visible={itemToDelete !== null}
          close={() => setItemToDelete(null)}
          onDone={async () => {
            await HttpClient(
              "/api/solicitudeRecaudaciones/" + itemToDelete,
              "DELETE",
              auth.userName,
              auth.role
            );
            hideConfirmModal();
            await loadData();
          }}
        />
      </LoadingContainer>
    </>
  );
};
export default RecaudacionesPanel;
