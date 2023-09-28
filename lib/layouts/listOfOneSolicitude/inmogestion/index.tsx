import Router from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import { useAuth } from "../../../hooks/use_auth";
import { StateField } from "../../../styles/views/indexStyled";
import { FactureInmogestion, SolicitudeInmogestion } from "../../../types";
import { CheckPermissions } from "../../../utils/check_permissions";
import { Elaborando, Pendiente } from "../../../utils/constants";
import HttpClient from "../../../utils/http_client";
import LoadingContainer from "../../../components/loading_container";
import ConfirmModal from "../../../components/modals/confirm";


// Inicio de la app
const IGPanelListOfOne = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<SolicitudeInmogestion>>([]);
  const [itemToDelete, setItemToDelete] = useState<string>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/solicitudeInmogestion/" + auth.id,
      "POST",
      auth.userName,
      auth.role,
      {
        userName: auth.userName
      }
    )
    const solicitudesInmogestion: Array<SolicitudeInmogestion> =
      response.data ?? [];
    setTableData(solicitudesInmogestion);
    setLoading(false);
  };

  const showConfirmModal = (factureInmogestionId: string) =>
    setItemToDelete(factureInmogestionId);
  const hideConfirmModal = () => setItemToDelete(null);

  // ejecuta funcion al renderizar la vista
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
        const facturesInmogestion: Array<FactureInmogestion> = params.value;
        let total = 0;
        if (facturesInmogestion.length > 0)
          facturesInmogestion.forEach((item: FactureInmogestion) => {
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
    edit: (rowData: FactureInmogestion) =>
      !CheckPermissions(auth, [1])
        ? Router.push({
            pathname: "/solicitudeInmogestion/edit/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
    delete: async (rowData: FactureInmogestion) => {
      CheckPermissions(auth, [0])
        ? showConfirmModal(rowData.id)
        : toast.error("No puedes eliminar una Solicitud");
    },
    download: (rowData: FactureInmogestion) =>
      !CheckPermissions(auth, [1])
        ? Router.push({
            pathname: "/solicitudeInmogestion/print/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
  };

  return (
    <>
      <h2 className="text-center my-4 mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
        SOLICITUDES EMPRESA: INMOGESTION
      </h2>
      <p>
        RUC: <strong>1791299930001</strong>
      </p>
      <button
        className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded my-3"
        onClick={() =>
          CheckPermissions(auth, [0, 8])
            ? Router.push({ pathname: "/solicitudeInmogestion/new" })
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
              "/api/solicitudeInmogestion/" + itemToDelete,
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
export default IGPanelListOfOne;
