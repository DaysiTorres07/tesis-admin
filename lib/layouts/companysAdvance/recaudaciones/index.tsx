import Router from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingContainer from "../../../components/loading_container";
import ConfirmModal from "../../../components/modals/confirm";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import { useAuth } from "../../../hooks/use_auth";
import { StateField } from "../../../styles/views/indexStyled";
import {
  AdvanceRecaudaciones,
  FactureAdvanceRecaudaciones,
} from "../../../types";
import { CheckPermissions } from "../../../utils/check_permissions";
import { Abierto, Elaborando, Pendiente } from "../../../utils/constants";
import HttpClient from "../../../utils/http_client";

type Props = {
  dates: Array<string>;
};

const AdvanceRecaudacionesPanel = (props: Props) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<AdvanceRecaudaciones>>([]);
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
        "/api/advanceRecaudaciones",
        "GET",
        auth.userName,
        auth.role
      );
    } else {
      var response = await HttpClient(
        "/api/advanceRecaudaciones?dates=" +
          props.dates[0] +
          "¡" +
          props.dates[1],
        "GET",
        auth.userName,
        auth.role
      );
    }
    const advancesRecaudaciones: Array<AdvanceRecaudaciones> =
      response.data ?? [];
    setTableData(advancesRecaudaciones);
    setLoading(false);
  };

  const showConfirmModal = (factureAdvanceRecaudacionesId: string) =>
    setItemToDelete(factureAdvanceRecaudacionesId);
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
      cssClass: "bold",
      width: 100,
      cellRender: (params) => {
        const facturesAdvanceRecaudaciones: Array<FactureAdvanceRecaudaciones> =
          params.value;
        let total = 0;
        if (facturesAdvanceRecaudaciones.length > 0)
          facturesAdvanceRecaudaciones.forEach(
            (item: FactureAdvanceRecaudaciones) => {
              total += item.value ?? 0;
            }
          );
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
    edit: (rowData: FactureAdvanceRecaudaciones) =>
      Router.push({
        pathname: "/advanceRecaudaciones/edit/" + (rowData.id as string),
      }),
    delete: async (rowData: FactureAdvanceRecaudaciones) => {
      CheckPermissions(auth, [0])
        ? showConfirmModal(rowData.id)
        : toast.error("No puedes eliminar un Anticipo");
    },
    download: (rowData: FactureAdvanceRecaudaciones) =>
      Router.push({
        pathname: "/advanceRecaudaciones/print/" + (rowData.id as string),
      }),
  };

  return (
    <>
      <h2 className="text-center fw-bold my-4 d-none d-md-block text-black">
        ANTICIPOS EMPRESA: RECAUDACIONES
      </h2>
      <h6 className="text-center fw-bold my-4 d-block d-md-none text-black">
        ANTICIPOS EMPRESA: RECAUDACIONES
      </h6>
      <button
        className="mb-4"
        onClick={() =>
          CheckPermissions(auth, [0, 1])
            ? Router.push({ pathname: "/advanceRecaudaciones/new" })
            : toast.error("No puede ingresar anticipos")
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
              "/api/advanceRecaudaciones/" + itemToDelete,
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

export default AdvanceRecaudacionesPanel;
