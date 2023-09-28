import Router from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingContainer from "../../../components/loading_container";
import ConfirmModal from "../../../components/modals/confirm";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import { useAuth } from "../../../hooks/use_auth";
import { StateField } from "../../../styles/views/indexStyled";
import { AdvanceInmogestion, FactureAdvanceInmogestion } from "../../../types";
import { CheckPermissions } from "../../../utils/check_permissions";
import { Abierto, Elaborando, Pendiente } from "../../../utils/constants";
import HttpClient from "../../../utils/http_client";

type Props = {
  dates: Array<string>;
};

const AdvanceInmogestionPanel = (props: Props) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<AdvanceInmogestion>>([]);
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
        "/api/advanceInmogestion",
        "GET",
        auth.userName,
        auth.role
      );
    } else {
      var response = await HttpClient(
        "/api/advanceInmogestion?dates=" +
          props.dates[0] +
          "¡" +
          props.dates[1],
        "GET",
        auth.userName,
        auth.role
      );
    }
    const advances: Array<AdvanceInmogestion> = response.data ?? [];
    setTableData(advances);
    setLoading(false);
  };

  const showConfirmModal = (factureAdvanceInmogestionId: string) =>
    setItemToDelete(factureAdvanceInmogestionId);
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
        const facturesAdvanceInmogestion: Array<FactureAdvanceInmogestion> =
          params.value;
        let total = 0;
        if (facturesAdvanceInmogestion.length > 0)
          facturesAdvanceInmogestion.forEach(
            (item: FactureAdvanceInmogestion) => {
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
    edit: (rowData: FactureAdvanceInmogestion) =>
      !CheckPermissions(auth, [1])
        ? Router.push({
            pathname: "/advanceInmogestion/edit/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
    delete: async (rowData: FactureAdvanceInmogestion) => {
      CheckPermissions(auth, [0])
        ? showConfirmModal(rowData.id)
        : toast.error("No puedes eliminar un Anticipo");
    },
    download: (rowData: FactureAdvanceInmogestion) =>
      !CheckPermissions(auth, [1])
        ? Router.push({
            pathname: "/advanceInmogestion/print/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
  };

  return (
    <>
      {/* <h2 className="text-center my-4 mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
        ANTICIPOS EMPRESA: INMOGESTIÓN
      </h2>
      <p>
        RUC: <strong>1791299930001</strong>
      </p> */}
            <p className="mb-2  font-semibold text-center">
              Anticipos Empresa:{" "}                
              <em
                style={{
                  color: "#64748b",
                  fontStyle: "normal",
                  fontSize: "30px",
                  // fontFamily: "Lato"
                }}
              >
              INMOGESTIÓN {" "}
              </em>
              <em
                style={{
                  color: "#bb22dd",
                  fontStyle: "normal",
                  fontSize: "14px",
                  // fontFamily: "Lato"
                }}
              >
              RUC: <strong>1791299930001</strong>
              </em>
            </p>
      <button
        className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent my-3 rounded-full text-sm"
        onClick={() =>
          CheckPermissions(auth, [0, 8])
            ? Router.push({ pathname: "/advanceInmogestion/new" })
            : toast.error("No puede ingresar anticipos de inmogestion")
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
          pageSize={20}
          infoText={(actual, total, items) =>
            `Página ${actual} de ${total} (${items} anticipos)`
          }
        />

        <ConfirmModal
          visible={itemToDelete !== null}
          close={() => setItemToDelete(null)}
          onDone={async () => {
            await HttpClient(
              "/api/advanceInmogestion/" + itemToDelete,
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

export default AdvanceInmogestionPanel;
