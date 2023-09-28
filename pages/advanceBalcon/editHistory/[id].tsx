import React, { useEffect, useState } from "react";
import {
  ResponseData,
  CloudImage,
  Comment,
  FactureAdvanceBalcon,
  AdvanceBalcon,
} from "../../../lib/types";
import NavBar from "../../../lib/components/navbar";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
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
import Footer from "../../../lib/components/footer";
import Dropdown from "react-bootstrap/Dropdown";
import FormatedDate from "../../../lib/utils/formated_date";
import { CheckPermissions } from "../../../lib/utils/check_permissions";
import ComentModal from "../../../lib/components/modals/coment";
import FactureAdvanceBalconModal from "../../../lib/components/modals/factureAdvanceBalcon";
import ConfirmModal from "../../../lib/components/modals/confirm";
import Sidebar from "../../../lib/components/sidebar";

// Inicio de la app
const EditFactureAdvance = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [itemsComment, setItemsComment] = useState<Array<Comment>>([]);
  const [items, setItems] = useState<Array<FactureAdvanceBalcon>>([]);
  const [initialValues, setInitialValues] = useState<AdvanceBalcon>({
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
    useState<FactureAdvanceBalcon | null>(null);
  const [imageModal, setImageModal] = useState<ImageModalProps>(null);

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const advanceBalconId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/advanceBalcon/" + advanceBalconId,
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

  const onSubmit = async (formData: AdvanceBalcon) => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const advanceBalconId = Router.query.id as string;
      const factureAdvanceBalconItems = await UploadSolicitudeImages(items);
      const requestData = {
        ...formData,
        itemsComment,
        items: factureAdvanceBalconItems,
        id: advanceBalconId,
      };
      const response: ResponseData = await HttpClient(
        "/api/advanceBalcon",
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

  const formik = useFormik<AdvanceBalcon>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const showConfirmModal = (factureAdvanceBalconId: string) =>
    setItemToDelete(factureAdvanceBalconId);
  const hideConfirmModal = () => setItemToDelete(null);

  const showModalComment = () => setCommentModalVisible(true);

  const showConfirmModalComment = (commentId: string) =>
    setItemCommentToDelete(commentId);
  const hideConfirmModalComment = () => setItemCommentToDelete(null);

  const printAdvance = () => {
    if (Router.asPath !== Router.route) {
      const advanceId = Router.query.id as string;
      Router.push({ pathname: "/advanceBalcon/print/" + advanceId });
    } else {
      setTimeout(printAdvance, 1000);
    }
  };

  const excelAdvance = () => {
    if (Router.asPath !== Router.route) {
      const advanceId = Router.query.id as string;
      Router.push({ pathname: "/advanceBalcon/excel/" + advanceId });
    } else {
      setTimeout(excelAdvance, 1000);
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
      dataField: "centerCostBalcon.name",
      caption: "Centro de Costos",
      cssClass: "column-soli",
    },
    {
      dataField: "providerBalcon.name",
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
    show: (rowData: FactureAdvanceBalcon) => {
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
    edit: (rowData: FactureAdvanceBalcon) => {
      setEditingFactureAdvance(rowData);
      CheckPermissions(auth, [0])
        ? showModal()
        : toast.warning("No tiene permiso para editar una factura");
    },
    delete: (rowData: FactureAdvanceBalcon) => {
      CheckPermissions(auth, [0])
        ? showConfirmModal(rowData.id)
        : toast.warning("No tiene permiso para elimianr una factura");
    },
  };

  return (
    <>
      <title>Balcon | Historial de Anticipo</title>

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
                  <Form.Control
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
                  <Form.Control
                    type="text"
                    value={formik.values?.date}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-lg font-bold mb-2">
                    Detalle
                  </label>
                  <Form.Control
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
                  <Form.Control
                    type="text"
                    placeholder="Solicitante"
                    value={formik.values?.soliciter ?? ""}
                    disabled
                  />
                </div>
              </div>

              <div className="container">
                <div className="row" style={{ width: "50%" }}>
                  <div className="col mt-3">
                    <Button
                      variant="outline-danger"
                      onClick={() => formik.handleSubmit()}
                    >
                      Actualizar
                    </Button>
                  </div>
                  <div className="col my-3">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-danger"
                        id="dropdown-basic"
                      >
                        Descargar
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={printAdvance}>
                          PDF
                        </Dropdown.Item>
                        <Dropdown.Item onClick={excelAdvance}>
                          EXCEL
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>
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
                colors={{ headerBackground: "#F8F9F9", headerColor: "#CD5C5C" }}
                buttonsFirst
                paging
                showNavigationButtons
                showNavigationInfo
                pageSize={15}
                infoText={(actual, total, items) =>
                  `Página ${actual} de ${total} (${items} facturas)`
                }
              />

              <div
                style={{
                  textAlign: "center",
                  width: "75%",
                  marginTop: "2em",
                  border: "1px solid",
                  padding: "1px",
                  marginBottom: "2em",
                }}
              >
                <p>
                  Valor Total a Pagar: $
                  {items
                    .reduce(
                      (partialSum, factureAdvanceBalcon) =>
                        partialSum + factureAdvanceBalcon.valueNet,
                      0
                    )
                    .toLocaleString()}
                </p>
                <p>
                  Pago acreditado: $
                  {items
                    .reduce(
                      (partialSum, factureAdvanceBalcon) =>
                        partialSum + factureAdvanceBalcon.accreditedPayment,
                      0
                    )
                    .toLocaleString()}
                </p>
                <p className="text-danger">
                  Diferencia: $
                  {items
                    .reduce(
                      (partialSum, factureAdvanceBalcon) =>
                        partialSum + factureAdvanceBalcon.difference,
                      0
                    )
                    .toLocaleString()}
                </p>
              </div>
              <div
                style={{
                  border: "1px solid black",
                  backgroundColor: "#F8F9F9",
                  display: "block",
                  position: "relative",
                }}
              >
                <h3 className="mt-2 text-center">Caja de Comentarios</h3>
                <div className="w-75 m-3">
                  <Button
                    variant="outline-dark"
                    onClick={() => setCommentModalVisible(true)}
                  >
                    Agregar Comentario
                  </Button>
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
                <Row className="w-75 m-2">
                  <Col className="mb-3" lg={3}>
                    <Button
                      variant="outline-dark"
                      onClick={() => formik.handleSubmit()}
                    >
                      Crear Comentario
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="outline-danger"
                      onClick={() => Router.back()}
                    >
                      Volver
                    </Button>
                  </Col>
                </Row>
              </div>

              <FactureAdvanceBalconModal
                visible={modalVisible}
                close={hideModal}
                initialData={editingFactureAdvance}
                onDone={(newItem: FactureAdvanceBalcon) => {
                  if (editingFactureAdvance === null) {
                    setItems((oldData) => [
                      ...oldData,
                      { ...newItem, id: `${oldData.length + 1}` },
                    ]);
                  } else {
                    setItems((oldData) =>
                      oldData.map((element: FactureAdvanceBalcon) =>
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
                      (item: FactureAdvanceBalcon) => item.id !== itemToDelete
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
