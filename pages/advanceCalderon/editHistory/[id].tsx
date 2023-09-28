import React, { useEffect, useState } from "react";
import {
  ResponseData,
  CloudImage,
  Comment,
  FactureAdvanceCalderon,
  AdvanceCalderon,
} from "../../../lib/types";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";
import { useFormik } from "formik";
import HttpClient from "../../../lib/utils/http_client";
import { toast } from "react-toastify";
import Router from "next/router";
import LoadingContainer from "../../../lib/components/loading_container";
import { UploadSolicitudeImages } from "../../../lib/utils/upload_solicitude_images";
import ImageModal, {
  ImageModalProps,
} from "../../../lib/components/modals/image";
import { useAuth } from "../../../lib/hooks/use_auth";
import { Abierto, Aprobado, Pendiente } from "../../../lib/utils/constants";
import { FinanField } from "../../../lib/styles/views/financialStyled";
import FormatedDate from "../../../lib/utils/formated_date";
import { CheckPermissions } from "../../../lib/utils/check_permissions";
import ConfirmModal from "../../../lib/components/modals/confirm";
import ComentModal from "../../../lib/components/modals/coment";
import FactureAdvanceCalderonModal from "../../../lib/components/modals/factureAdvanceCalderon";
import Sidebar from "../../../lib/components/sidebar";

// Inicio de la app
const EditFactureAdvance = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [itemsComment, setItemsComment] = useState<Array<Comment>>([]);
  const [items, setItems] = useState<Array<FactureAdvanceCalderon>>([]);
  const [initialValues, setInitialValues] = useState<AdvanceCalderon>({
    number: 0,
    soliciter: "",
    date: FormatedDate(),
    details: "",
    items: [],
    soliciterState: Aprobado,
    contableState: Pendiente,
    imageTreasuryState: Pendiente,
    advanceState: Abierto,
    paymentTreasuryState: Pendiente,
    financialState: Pendiente,
    applicantDate: FormatedDate(),
    contableAdvanceDate: FormatedDate(),
    advanceDate: FormatedDate(),
    accountantDate: FormatedDate(),
    contableAdvanceState: Abierto,
    treasuryDate: FormatedDate(),
    financialDate: FormatedDate(),
    imageTreasuryDate: FormatedDate(),
    itemsComment: [],
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [commentModalVisible, setCommentModalVisible] =
    useState<boolean>(false);
  const [itemCommentToDelete, setItemCommentToDelete] = useState<string>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string>(null);
  const [statusModal, setStatusModal] = useState<boolean>(false);
  const [editingFactureAdvance, setEditingFactureAdvance] =
    useState<FactureAdvanceCalderon | null>(null);
  const [imageModal, setImageModal] = useState<ImageModalProps>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const advanceCalderonId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/advanceCalderon/" + advanceCalderonId,
        "GET",
        auth.userName,
        auth.role
      );
      setInitialValues(response.data);
      setItems(response.data.items);
      setItemsComment(response.data.itemsComment);
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (formData: AdvanceCalderon) => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const advanceCalderonId = Router.query.id as string;
      const factureAdvanceCalderonItems = await UploadSolicitudeImages(items);
      const requestData = {
        ...formData,
        itemsComment,
        items: factureAdvanceCalderonItems,
        id: advanceCalderonId,
      };
      const response: ResponseData = await HttpClient(
        "/api/advanceCalderon",
        "PUT",
        auth.userName,
        auth.role,
        requestData
      );
      if (response.success) {
        toast.success("Anticipo editado correctamente!");
        await loadData();
      } else {
        toast.warning(response.message);
      }
      setLoading(false);
    } else {
      setTimeout(onSubmit, 1000);
    }
  };

  const formik = useFormik<AdvanceCalderon>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const showConfirmModal = (factureAdvanceCalderonId: string) =>
    setItemToDelete(factureAdvanceCalderonId);
  const hideConfirmModal = () => setItemToDelete(null);

  const showModalComment = () => setCommentModalVisible(true);

  const showConfirmModalComment = (commentId: string) =>
    setItemCommentToDelete(commentId);
  const hideConfirmModalComment = () => setItemCommentToDelete(null);

  const printAdvance = () => {
    if (Router.asPath !== Router.route) {
      const advanceId = Router.query.id as string;
      Router.push({ pathname: "/advanceCalderon/print/" + advanceId });
    } else {
      setTimeout(printAdvance, 1000);
    }
  };

  const excelAdvance = () => {
    if (Router.asPath !== Router.route) {
      const advanceId = Router.query.id as string;
      Router.push({ pathname: "/advanceCalderon/excel/" + advanceId });
    } else {
      setTimeout(excelAdvance, 1000);
    }
  };

  const txtPichincha = () => {
    if (Router.asPath !== Router.route) {
      const advanceId = Router.query.id as string;
      Router.push({ pathname: "/advanceCalderon/txt/" + advanceId });
    } else {
      setTimeout(txtPichincha, 1000);
    }
  };

  const txtBGR = () => {
    if (Router.asPath !== Router.route) {
      const advanceId = Router.query.id as string;
      Router.push({ pathname: "/advanceCalderon/txtBGR/" + advanceId });
    } else {
      setTimeout(txtBGR, 1000);
    }
  };

  const columnsComment: ColumnData[] = [
    {
      dataField: "userComment",
      caption: "Nombre",
      width: 200,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "dateComment",
      caption: "Fecha",
      width: 200,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "messageComment",
      caption: "Comentario",
      alignment: "left",
      cssClass: "bold",
    },
  ];

  const columns: ColumnData[] = [
    //Solicitante
    {
      dataField: "centerCostCalderon.name",
      caption: "Centro de Costos",
      cssClass: "column-soli",
    },
    {
      dataField: "providerCalderon.name",
      caption: "Proveedor",
      cssClass: "column-soli",
    },
    {
      dataField: "details",
      caption: "Detalle",
      width: 250,
      cssClass: "column-soli",
    },
    {
      dataField: "value",
      caption: "Valor",
      cssClass: "column-soli",
    },
    {
      dataField: "observation",
      caption: "Observacion",
      cssClass: "column-soli",
    },
    //Tesoreria
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
    {
      dataField: "typeCard",
      caption: "Tipo de identificacion",
      cssClass: "column-teso",
      width: 80,
    },
    {
      dataField: "typePayments",
      caption: "Tipo de Pago",
      cssClass: "column-teso",
    },
    {
      dataField: "numberCheck",
      caption: "Numero de Cheque",
      cssClass: "column-teso",
    },
    {
      dataField: "bankCheck",
      caption: "Banco del Cheque",
      cssClass: "column-teso",
    },
    {
      dataField: "discount",
      caption: "Descuento",
      cssClass: "column-teso",
    },
    {
      dataField: "increase",
      caption: "Aumento",
      cssClass: "column-teso",
    },
    {
      dataField: "observationTreasury",
      caption: "Observacion de Tesorería",
      cssClass: "column-teso",
    },
    //Financiero
    {
      dataField: "payments",
      caption: "Pago",
      cellRender: (params) => <FinanField finan={params.value ?? Pendiente} />,
      cssClass: "column-finan",
    },
    //Tesoreria 2
    {
      dataField: "accreditedPayment",
      caption: "Pago Acreditado",
      cssClass: "column-teso",
    },
    {
      dataField: "difference",
      caption: "Diferencia",
      cssClass: "column-teso",
    },
    {
      dataField: "discount",
      caption: "Descuesto",
      cssClass: "column-teso",
    },
    {
      dataField: "debitNote",
      caption: "Nota de debito",
      cssClass: "column-teso",
    },
    //anticipo
    {
      dataField: "factureDate",
      caption: "Fecha de factura",
      cssClass: "column-soli",
    },
    {
      dataField: "factureNumber",
      caption: "Numero de Factura",
      cssClass: "column-soli",
    },
    {
      dataField: "documentDelivered",
      caption: "Documento",
      cssClass: "column-soli",
    },
    //contabilidad
    {
      dataField: "numberRetention",
      caption: "Numero de Retencion",
      cssClass: "column-conta",
    },
    {
      dataField: "valueRetention",
      caption: "Valor de Retencion",
      cssClass: "column-conta",
    },
    {
      dataField: "valueNet",
      caption: "Valor a Pagar",
      cssClass: "column-conta",
    },
    {
      dataField: "closingSeat",
      caption: "Asiento de Cierre",
      cssClass: "column-conta",
    },
  ];

  const buttonsComment = {
    edit: (rowData: Comment) => {
      setEditingComment(rowData);
      CheckPermissions(auth, [0])
        ? showModalComment()
        : toast.info("No puedes editar un comentario");
    },
    delete: async (rowData: Comment) => {
      CheckPermissions(auth, [0])
        ? showConfirmModalComment(rowData.id)
        : toast.info("No puedes borrar un comentario");
    },
  };

  const buttons = {
    show: (rowData: FactureAdvanceCalderon) => {
      if (
        (rowData.file as CloudImage)?.secure_url ||
        (rowData.treasuryFile as CloudImage)?.secure_url
      ) {
        setImageModal({
          title: rowData.details,
          image: (rowData.file as CloudImage)?.secure_url ?? "",
          treasuryImage: (rowData.treasuryFile as CloudImage)?.secure_url ?? "",
        });
      }
    },
    edit: (rowData: FactureAdvanceCalderon) => {
      setEditingFactureAdvance(rowData);
      CheckPermissions(auth, [0])
        ? showModal()
        : toast.warning("No tiene permiso  para editar una factura");
    },
    delete: (rowData: FactureAdvanceCalderon) => {
      CheckPermissions(auth, [0])
        ? showConfirmModal(rowData.id)
        : toast.warning("No tiene permiso para eliminar una factura");
    },
  };

  return (
    <>
      <title>Calderon | Historial de Anticipo</title>
      <div className="flex w-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
              Historial de Anticipo {initialValues.number}
            </h3>
            <LoadingContainer visible={loading} miniVersion>
              <div className="grid grid-cols-0 md:grid-cols-3 m-4 gap-4 mb-4">
                <div>
                  <label className="text-gray-700 text-lg font-bold mb-2">
                    Numero
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="No definido"
                    value={formik.values?.number ?? 0}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-lg font-bold mb-2">
                    Fecha
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    value={formik.values?.date}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-lg font-bold mb-2">
                    Detalle
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Detalle"
                    value={formik.values?.details ?? ""}
                    name="details"
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-lg font-bold mb-2">
                    Solicitante
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Solicitante"
                    value={formik.values?.soliciter ?? ""}
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 m-4 gap-4 mb-4">
                <div>
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    onClick={() => formik.handleSubmit()}
                  >
                    Actualizar
                  </button>
                </div>
                <div>
                  <div className="relative inline-block">
                    <button
                      type="button"
                      className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold gap-x-1.5 text-red-500 bg-transparent border border-red-500 rounded-md hover:bg-red-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      id="dropdown-toggle"
                      aria-haspopup="true"
                      aria-expanded={isMenuOpen}
                      onClick={toggleMenu}
                    >
                      Descargar
                      <svg
                        className="-mr-1 h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {isMenuOpen && (
                      <div className="relative right-0 w-40 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        {CheckPermissions(auth, [0, 1, 2, 3, 9, 14]) && (
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            onClick={printAdvance}
                          >
                            PDF
                          </button>
                        )}
                        {CheckPermissions(auth, [0, 1, 14]) && (
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            onClick={excelAdvance}
                          >
                            EXCEL
                          </button>
                        )}
                        {CheckPermissions(auth, [0, 3, 6]) && (
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            onClick={txtPichincha}
                          >
                            CASH PICHINCHA
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 m-4">
                <TreeTable
                  dataSource={items.sort((a, b) => {
                    let fa = a.project.name.toLowerCase(),
                      fb = b.project.name.toLowerCase();

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
                  colors={{
                    headerBackground: "#F8F9F9",
                    headerColor: "#CD5C5C",
                  }}
                  buttonsFirst
                  paging
                  showNavigationButtons
                  showNavigationInfo
                  pageSize={15}
                  infoText={(actual, total, items) =>
                    `Página ${actual} de ${total} (${items} facturas)`
                  }
                />

                <div className="w-full mt-3 p-1">
                  <p className="mt-2">
                    Valor Total a Pagar: $
                    {items
                      .reduce(
                        (partialSum, factureAdvanceCalderon) =>
                          partialSum + factureAdvanceCalderon.valueNet,
                        0
                      )
                      .toLocaleString()}
                  </p>
                  <p>
                    Pago acreditado: $
                    {items
                      .reduce(
                        (partialSum, factureAdvanceCalderon) =>
                          partialSum + factureAdvanceCalderon.accreditedPayment,
                        0
                      )
                      .toLocaleString()}
                  </p>
                  <p className="text-red-500">
                    Diferencia: $
                    {items
                      .reduce(
                        (partialSum, factureAdvanceCalderon) =>
                          partialSum + factureAdvanceCalderon.difference,
                        0
                      )
                      .toLocaleString()}
                  </p>
                </div>

                <div
                  style={{
                    border: "1px solid black",
                    marginTop: "3%",
                    backgroundColor: "#F8F9F9",
                    marginBottom: "2%",
                  }}
                >
                  <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
                    Caja de Comentarios
                  </h3>
                  <div className="m-3">
                    <button
                      className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                      onClick={() => setCommentModalVisible(true)}
                    >
                      Agregar Comentario
                    </button>
                  </div>
                  <div className="m-3">
                    <TreeTable
                      keyExpr="id"
                      dataSource={itemsComment}
                      columns={columnsComment}
                      buttons={buttonsComment}
                      searchPanel={false}
                      colors={{
                        headerBackground: "#9ed9f7",
                        headerColor: "black",
                        contentBackground: "#c6e5f5",
                        contentColor: "black",
                      }}
                      paging
                      buttonsFirst
                      showNavigationButtons
                      showNavigationInfo
                      pageSize={15}
                      infoText={(actual, total, items) =>
                        `Página ${actual} de ${total} (${items} comentarios)`
                      }
                    />
                  </div>
                  <div className="grid md:grid-cols-2 grid-cols-1 w-2/4 m-4">
                    <div>
                      <button
                        className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                        onClick={() => formik.handleSubmit()}
                      >
                        Crear Comentario
                      </button>
                    </div>
                    <div>
                      <button
                        className="text-center bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                        onClick={() => Router.back()}
                      >
                        Volver
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <FactureAdvanceCalderonModal
                visible={modalVisible}
                close={hideModal}
                initialData={editingFactureAdvance}
                onDone={(newItem: FactureAdvanceCalderon) => {
                  if (editingFactureAdvance === null) {
                    setItems((oldData) => [
                      ...oldData,
                      { ...newItem, id: `${oldData.length + 1}` },
                    ]);
                  } else {
                    setItems((oldData) =>
                      oldData.map((element: FactureAdvanceCalderon) =>
                        element.id === newItem.id ? newItem : element
                      )
                    );
                    setEditingFactureAdvance(null);
                  }
                }}
              />

              <ComentModal
                visible={commentModalVisible}
                close={() => setCommentModalVisible(!commentModalVisible)}
                initialData={editingComment}
                onDone={(newItemComment: Comment) => {
                  if (editingComment === null) {
                    setItemsComment((oldData) => [
                      ...oldData,
                      { ...newItemComment, id: `${oldData.length + 1}` },
                    ]);
                  } else {
                    setItemsComment((oldData) =>
                      oldData.map((element: Comment) =>
                        element.id === newItemComment.id
                          ? newItemComment
                          : element
                      )
                    );
                    setEditingComment(null);
                  }
                }}
              />

              <ConfirmModal
                visible={itemCommentToDelete !== null}
                close={() => setItemCommentToDelete}
                onDone={() => {
                  setItemsComment((oldData) => [
                    ...oldData.filter(
                      (item: Comment) => item.id !== itemCommentToDelete
                    ),
                  ]);
                  hideConfirmModalComment();
                }}
              />

              <ConfirmModal
                visible={itemToDelete !== null}
                close={() => setItemToDelete(null)}
                onDone={() => {
                  setItems((oldData) => [
                    ...oldData.filter(
                      (item: FactureAdvanceCalderon) => item.id !== itemToDelete
                    ),
                  ]);
                  hideConfirmModal();
                }}
              />

              <ImageModal
                visible={imageModal !== null}
                close={() => setImageModal(null)}
                {...imageModal}
              />
            </LoadingContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditFactureAdvance;
