import React, { useState } from "react";
import { AdvanceInmogestion, FactureAdvanceInmogestion, ResponseData } from "../../../lib/types";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";
import { useAuth } from "../../../lib/hooks/use_auth";
import FormatedDate from "../../../lib/utils/formated_date";
import { useFormik } from "formik";
import Router from "next/router";
import HttpClient from "../../../lib/utils/http_client";
import { toast } from "react-toastify";
import ConfirmModal from "../../../lib/components/modals/confirm";
import LoadingContainer from "../../../lib/components/loading_container";
import { UploadSolicitudeImages } from "../../../lib/utils/upload_solicitude_images";
import RoleLayout from "../../../lib/layouts/role_layout";
import { Abierto, Elaborando, Pendiente } from "../../../lib/utils/constants";
import FactureAdvanceIgModal from "../../../lib/components/modals/factureAdvanceIg";
import Sidebar from "../../../lib/components/sidebar";

// Inicio de la app
const NewFactureAdvance = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Array<FactureAdvanceInmogestion>>([]);
  const [initialValues, _setInitialValues] = useState<AdvanceInmogestion>({
    number: 0,
    soliciter: auth?.userName,
    date: FormatedDate(),
    details: "",
    items: [],
    advanceState: Abierto,
    soliciterState: Elaborando,
    contableState: Pendiente,
    contableAdvanceState: Abierto,
    imageTreasuryState: Pendiente,
    paymentTreasuryState: Pendiente,
    financialState: Pendiente,
    applicantDate: FormatedDate(),
    accountantDate: FormatedDate(),
    contableAdvanceDate: FormatedDate(),
    advanceDate: FormatedDate(),
    treasuryDate: FormatedDate(),
    financialDate: FormatedDate(),
    imageTreasuryDate: FormatedDate(),
    itemsComment: [],
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string>(null);
  const [editingFactureAdvance, setEditingFactureAdvance] =
    useState<FactureAdvanceInmogestion | null>(null);

  const formik = useFormik<AdvanceInmogestion>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: AdvanceInmogestion) => {
      if (formData.details.trim() === "") {
        toast.warning("El campo detalle no puede estar vacío");
        return;
      }
      setLoading(true);
      const facutureAdvanceInmogestionItems = await UploadSolicitudeImages(
        items
      );
      const response: ResponseData = await HttpClient(
        "/api/advanceInmogestion",
        "POST",
        auth.userName,
        auth.role,
        { ...formData, items: facutureAdvanceInmogestionItems }
      );
      if (response.success) {
        toast.success("Anticipo creado correctamente!");
      } else {
        toast.warning(response.message);
      }
      setLoading(false);
      Router.back();
    },
  });

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const showConfirmModal = (factureAdvanceInmogestionId: string) =>
    setItemToDelete(factureAdvanceInmogestionId);
  const hideConfirmModal = () => setItemToDelete(null);

  const columns: ColumnData[] = [
    {
      dataField: "centerCostIg.name",
      caption: "Centro de Costos",
      cssClass: "bold",
    },
    {
      dataField: "providerIg.name",
      caption: "Proveedor",
      cssClass: "bold",
    },
    {
      dataField: "providerIg.emailIg",
      caption: "Email Prov",
      cssClass: "bold",
    },
    {
      dataField: "details",
      caption: "Detalle",
      cssClass: "bold",
    },
    {
      dataField: "value",
      caption: "Valor",
      cssClass: "bold",
    },
    {
      dataField: "beneficiary",
      caption: "Beneficiario",
      cssClass: "column-teso",
    },
    {
      dataField: "identificationCard",
      caption: "Cedula o RUC",
      cssClass: "column-teso",
    },
    {
      dataField: "bank",
      caption: "Banco de Beneficiario",
      cssClass: "column-teso",
    },
    {
      dataField: "accountBank",
      caption: "Numero de Cuenta",
      cssClass: "column-teso",
    },
    {
      dataField: "accountType",
      caption: "Tipo de Cuenta",
      cssClass: "column-teso",
    },
  ];

  const buttons = {
    edit: (rowData: FactureAdvanceInmogestion) => {
      setEditingFactureAdvance(rowData);
      showModal();
    },
    delete: (rowData: FactureAdvanceInmogestion) =>
      showConfirmModal(rowData.id),
  };

  return (
    <RoleLayout permissions={[0, 8]}>
      <title>IG | Crear Anticipo</title>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-12/12 bg-white my-14 mx-8">
            {/* <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
              Nuevo Anticipo
            </h3> */}
                        <p className="my-4    text-center">               
              <em
                style={{
                  color: "#334155",
                  fontStyle: "normal",
                  fontSize: "24px",
                  fontFamily: "Lato",
                  fontWeight: "bold",
                }}
              >
              ANTICIPO {" "} 
              </em>  
              <em
                style={{
                  color: "#94a3b8",
                  fontStyle: "normal",
                  fontSize: "24px",
                  fontFamily: "Lato"
                }}
              >
              INMOGESTIÓN
              </em>              
            </p>
            <LoadingContainer visible={loading} miniVersion>
              <div className="grid grid-cols-1 md:grid-cols-3 m-4 gap-4 text-center">
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Solicitante
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Solicitante"
                    value={formik.values.soliciter}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Fecha de Creación
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    value={formik.values.date}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                  Detalle General Anticipo
                  </label>
                  <input
                    className="border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-500"
                    type="text"
                    placeholder="Detalle General Anticipo"
                    value={formik.values.details}
                    name="details"
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 m-4 gap-4 text-center">
                <div>
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                    onClick={showModal}
                  >
                    Agregar Item
                  </button>
                </div>
                <div>
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                    onClick={() => formik.handleSubmit()}
                  >
                    Guardar Anticipo
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
                <TreeTable
                  dataSource={items.sort((a, b) => {
                    let fa = a.centerCostIg.name.toLowerCase(),
                      fb = b.centerCostIg.name.toLowerCase();

                    if (fa < fb) {
                      return -1;
                    }
                    if (fa > fb) {
                      return 1;
                    }
                    return 0;
                  })}
                  columns={columns}
                  buttons={buttons}
                  searchPanel={true}
                  buttonsFirst
                  colors={{
                    headerBackground: "#c0c0c0",
                    headerColor: "#000000",
                  }}
                  paging
                  showNavigationButtons
                  showNavigationInfo
                  pageSize={20}
                  infoText={(actual, total, items) =>
                    `Página ${actual} de ${total} (${items} facturas)`
                  }
                />
              </div>
              <button
                className="bg-transparent m-5 hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
                onClick={() => Router.back()}
              >
                Volver
              </button>
              <FactureAdvanceIgModal
                visible={modalVisible}
                close={hideModal}
                initialData={editingFactureAdvance}
                onDone={(newItem: FactureAdvanceInmogestion) => {
                  if (editingFactureAdvance === null) {
                    setItems((oldData) => [
                      ...oldData,
                      { ...newItem, id: `${oldData.length + 1}` },
                    ]);
                  } else {
                    setItems((oldData) =>
                      oldData.map((element: FactureAdvanceInmogestion) =>
                        element.id === newItem.id ? newItem : element
                      )
                    );
                    setEditingFactureAdvance(null);
                  }
                }}
              />
              <ConfirmModal
                visible={itemToDelete !== null}
                close={() => setItemToDelete(null)}
                onDone={() => {
                  setItems((oldData) => [
                    ...oldData.filter(
                      (item: FactureAdvanceInmogestion) =>
                        item.id !== itemToDelete
                    ),
                  ]);
                  hideConfirmModal();
                }}
              />
            </LoadingContainer>
          </div>
        </div>
      </div>
    </RoleLayout>
  );
};
export default NewFactureAdvance;
