import Router from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingContainer from "../../../components/loading_container";
import ConfirmModal from "../../../components/modals/confirm";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import { useAuth } from "../../../hooks/use_auth";
import { StateField } from "../../../styles/views/indexStyled";
import { AdvanceCalderon, FactureAdvanceCalderon } from "../../../types";
import { CheckPermissions } from "../../../utils/check_permissions";
import { Abierto, Elaborando, Pendiente } from "../../../utils/constants";
import HttpClient from "../../../utils/http_client";

const AdvanceCalderonPanelListOfOne = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<AdvanceCalderon>>([]);
  const [itemToDelete, setItemToDelete] = useState<string>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/advanceCalderon/" + auth.id,
      "POST",
      auth.userName,
      auth.role,
      {
        userName: auth.userName,
      }
    );
    const advances: Array<AdvanceCalderon> = response.data ?? [];
    setTableData(advances);
    setLoading(false);
  };

  const showConfirmModal = (factureAdvanceCalderonId: string) =>
    setItemToDelete(factureAdvanceCalderonId);
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
      cssClass: "bold",
      width: 100,
      cellRender: (params) => {
        const facturesAdvanceCalderon: Array<FactureAdvanceCalderon> =
          params.value;
        let total = 0;
        if (facturesAdvanceCalderon.length > 0)
          facturesAdvanceCalderon.forEach((item: FactureAdvanceCalderon) => {
            total += item.value ?? 0;
          });
        const totalItems = total.toLocaleString(navigator.language, {
          minimumFractionDigits: 2,
        });
        return (
          <p style={{ margin: 2 }}>
            <strong>${totalItems}</strong>
          </p>
        );
      },
    },
    {
      dataField: "soliciterState",
      caption: "Solicitante",
      cssClass: "bold",
      cellRender: (params) => <StateField state={params.value ?? Elaborando} />,
      width: 80,
      alignment: "center",
    },
    {
      dataField: "paymentTreasuryState",
      caption: "Tesorería",
      cssClass: "bold",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      width: 80,
      alignment: "center",
    },
    {
      dataField: "financialState",
      caption: "Financiero",
      cssClass: "bold",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      width: 80,
      alignment: "center",
    },
    {
      dataField: "imageTreasuryState",
      caption: "Pagos",
      cssClass: "bold",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      width: 80,
      alignment: "center",
    },
    {
      dataField: "contableAdvanceState",
      caption: "Contabilidad",
      cssClass: "bold",
      cellRender: (params) => <StateField state={params.value ?? Abierto} />,
      width: 80,
      alignment: "center",
    },
  ];

  const buttons = {
    edit: (rowData: FactureAdvanceCalderon) =>
      Router.push({
        pathname: "/advanceCalderon/edit/" + (rowData.id as string),
      }),
    delete: async (rowData: FactureAdvanceCalderon) => {
      CheckPermissions(auth, [0])
        ? showConfirmModal(rowData.id)
        : toast.error("No puedes eliminar un Anticipo");
    },
    download: (rowData: FactureAdvanceCalderon) =>
      Router.push({
        pathname: "/advanceCalderon/print/" + (rowData.id as string),
      }),
  };

  return (
    <>
      <h2 className="text-center my-4 mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
        ANTICIPOS EMPRESA: CALDERON
      </h2>
      <p>
        RUC: <strong>1791819365001</strong>
      </p>
      <button
        className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded my-3"
        onClick={() =>
          CheckPermissions(auth, [0, 1, 14])
            ? Router.push({ pathname: "/advanceCalderon/new" })
            : toast.error("No puede ingresar solicitudes")
        }
      >
        Crear Anticipo
      </button>
      <LoadingContainer visible={loading} miniVersion>
        <TreeTable
          keyExpr="id"
          dataSource={tableData}
          columns={columns}
          buttons={buttons}
          searchPanel={true}
          colors={{ headerBackground: "#c0c0c0", headerColor: "#000000" }}
          buttonsFirst
          paging
          showNavigationButtons
          showNavigationInfo
          pageSize={15}
          infoText={(actual, total, items) =>
            `Página ${actual} de ${total} (${items} anticipos)`
          }
        />

        <ConfirmModal
          visible={itemToDelete !== null}
          close={() => setItemToDelete(null)}
          onDone={async () => {
            await HttpClient(
              "/api/advanceCalderon/" + itemToDelete,
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

export default AdvanceCalderonPanelListOfOne;
