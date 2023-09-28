import React, { useEffect, useState } from "react";
import {
  ResponseData,
  Comment,
  CloudImage,
  FactureRecaudaciones,
  SolicitudeRecaudaciones,
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
import { Elaborando, Pendiente, Abierto } from "../../../lib/utils/constants";
import { FinanField } from "../../../lib/styles/views/financialStyled";
import Footer from "../../../lib/components/footer";
import Dropdown from "react-bootstrap/Dropdown";
import FormatedDate from "../../../lib/utils/formated_date";
import { CheckPermissions } from "../../../lib/utils/check_permissions";
import FactureRecaudacionesModal from "../../../lib/components/modals/factureRecaudaciones";
import ComentModal from "../../../lib/components/modals/coment";
import ConfirmModal from "../../../lib/components/modals/confirm";

// Inicio de la app
const EditFacture = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [itemsComment, setItemsComment] = useState<Array<Comment>>([]);
  const [items, setItems] = useState<Array<FactureRecaudaciones>>([]);
  const [initialValues, setInitialValues] = useState<SolicitudeRecaudaciones>({
    number: 0,
    soliciter: "",
    date: FormatedDate(),
    details: "",
    items: [],
    contableAdvanceState: Abierto,
    advanceState: Abierto,
    soliciterState: Elaborando,
    contableState: Pendiente,
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
  const [commentModalVisible, setCommentModalVisible] =
    useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string>(null);
  const [itemCommentToDelete, setItemCommentToDelete] = useState<string>(null);
  const [editingFacture, setEditingFacture] =
    useState<FactureRecaudaciones | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [statusModal, setStatusModal] = useState<boolean>(false);
  const [imageModal, setImageModal] = useState<ImageModalProps>(null);

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const solicitudeId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/solicitudeRecaudaciones/" + solicitudeId,
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

  const onSubmit = async (formData: SolicitudeRecaudaciones) => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const solicitudeId = Router.query.id as string;
      const factureItems = await UploadSolicitudeImages(items);
      const requestData = {
        ...formData,
        itemsComment,
        items: factureItems,
        id: solicitudeId,
      };
      const response: ResponseData = await HttpClient(
        "/api/solicitudeRecaudaciones",
        "PUT",
        auth.userName,
        auth.role,
        requestData
      );
      if (response.success) {
        toast.success("Solicitud editada correctamente!");
        await loadData();
      } else {
        toast.warning(response.message);
      }
      setLoading(false);
    } else {
      setTimeout(onSubmit, 1000);
    }
  };

  const formik = useFormik<SolicitudeRecaudaciones>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const showConfirmModal = (factureRecaudacionesId: string) =>
    setItemToDelete(factureRecaudacionesId);
  const hideConfirmModal = () => setItemToDelete(null);

  const showModalComment = () => setCommentModalVisible(true);

  const showConfirmModalComment = (commentId: string) =>
    setItemCommentToDelete(commentId);
  const hideConfirmModalComment = () => setItemCommentToDelete(null);

  const printSolicitude = () => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;
      Router.push({
        pathname: "/solicitudeRecaudaciones/print/" + solicitudeId,
      });
    } else {
      setTimeout(printSolicitude, 1000);
    }
  };

  const excelSolicitude = () => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;
      Router.push({
        pathname: "/solicitudeRecaudaciones/excel/" + solicitudeId,
      });
    } else {
      setTimeout(excelSolicitude, 1000);
    }
  };

  const txtBGR = () => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;
      Router.push({
        pathname: "/solicitudeRecaudaciones/txtBGR/" + solicitudeId,
      });
    } else {
      setTimeout(txtBGR, 1000);
    }
  };

  const columnsComent: ColumnData[] = [
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
      dataField: "providerRecaudaciones.name",
      caption: "Proveedor",
      cssClass: "column-soli",
    },
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
    //Contabilidad
    {
      dataField: "documentDelivered",
      caption: "Documento",
      cssClass: "column-conta",
    },
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
      dataField: "observationConta",
      caption: "Observacion de Contabilidad",
      cssClass: "column-conta",
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
      caption: "Tipo de pago",
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
      cellRender: (params) => <FinanField finan={params.value} />,
      cssClass: "column-finan",
    },
    //Tesoreria 2
    {
      dataField: "accreditedPayment",
      caption: "Pago Acreditado",
      cssClass: "column-teso",
    },
    {
      dataField: "debitNote",
      caption: "Nota de debito",
      cssClass: "column-teso",
    },
    {
      dataField: "difference",
      caption: "Diferencia",
      cssClass: "column-teso",
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
    show: (rowData: FactureRecaudaciones) => {
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
    edit: (rowData: FactureRecaudaciones) => {
      setEditingFacture(rowData);
      CheckPermissions(auth, [0])
        ? showModal()
        : toast.warning("No tiene permiso para editar una factura");
    },
    delete: (rowData: FactureRecaudaciones) => {
      CheckPermissions(auth, [0])
        ? showConfirmModal(rowData.id)
        : toast.warning("No tiene permiso para eliminar una factura");
    },
  };

  return (
    <>
      <title>Recaudaciones | Historial de solicitud</title>
      
      <div
        className="min-vh-100 w-100 position-absolute d-flex flex-column align-items-center justify-content-center"
        style={{ background: "#9e3636", fontSize: "14px" }}
      >
        <NavBar />
        <br />
        <div className="flex-grow-1 d-flex justify-content-center align-items-center w-75">
          <div className="bg-white rounded shadow pb-5 px-3 w-100">
            <h3 className="text-danger mb-4 mt-4 text-center">
              Historial de Solicitud {initialValues.number}
            </h3>
            <LoadingContainer visible={loading} miniVersion>
              <Row>
                <Col lg={4} md={4} style={{ marginBottom: "10px" }}>
                  <Form.Group>
                    <Form.Label>Numero</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="No definido"
                      value={formik.values?.number ?? 0}
                      disabled
                    />
                  </Form.Group>
                </Col>

                <Col lg={4} md={4}>
                  <Form.Group>
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control
                      type="text"
                      value={formik.values?.date}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col lg={4} md={4}>
                  <Form.Group>
                    <Form.Label>Detalle</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Detalle"
                      value={formik.values?.details ?? ""}
                      name="details"
                      onChange={formik.handleChange}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={4} md={4}>
                  <Form.Group>
                    <Form.Label>Solicitante</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Solicitante"
                      value={formik.values?.soliciter ?? ""}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Col className="my-3" lg={4} md={4}>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-danger" id="dropdown-basic">
                    Descargar
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={printSolicitude}>PDF</Dropdown.Item>
                    <Dropdown.Item onClick={excelSolicitude}>
                      EXCEL
                    </Dropdown.Item>
                    <Dropdown.Item onClick={txtBGR}>CASH BGR</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
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
                <p style={{ marginTop: "10px" }}>
                  <strong>Valor Total a Pagar: $ </strong>
                  {items
                    .reduce(
                      (partialSum, facture) => partialSum + facture.valueNet,
                      0
                    )
                    .toLocaleString()}
                </p>
                <p>
                  <strong>Pago acreditado: $ </strong>
                  {items
                    .reduce(
                      (partialSum, facture) =>
                        partialSum + facture.accreditedPayment,
                      0
                    )
                    .toLocaleString()}
                </p>
                <p className="text-danger">
                  <strong>
                    Diferencia: $
                    {items
                      .reduce(
                        (partialSum, facture) =>
                          partialSum + facture.difference,
                        0
                      )
                      .toLocaleString()}
                  </strong>
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
                    columns={columnsComent}
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

              <FactureRecaudacionesModal
                visible={modalVisible}
                close={hideModal}
                initialData={editingFacture}
                onDone={(newItem: FactureRecaudaciones) => {
                  if (editingFacture === null) {
                    setItems((oldData) => [
                      ...oldData,
                      { ...newItem, id: `${oldData.length + 1}` },
                    ]);
                  } else {
                    setItems((oldData) =>
                      oldData.map((element: FactureRecaudaciones) =>
                        element.id === newItem.id ? newItem : element
                      )
                    );
                    setEditingFacture(null);
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
                visible={itemToDelete !== null}
                close={() => setItemToDelete(null)}
                onDone={() => {
                  setItems((oldData) => [
                    ...oldData.filter(
                      (item: FactureRecaudaciones) => item.id !== itemToDelete
                    ),
                  ]);
                  hideConfirmModal();
                }}
              />

              <ConfirmModal
                visible={itemCommentToDelete !== null}
                close={() => setItemCommentToDelete(null)}
                onDone={() => {
                  setItemsComment((oldData) => [
                    ...oldData.filter(
                      (item: Comment) => item.id !== itemCommentToDelete
                    ),
                  ]);
                  hideConfirmModalComment();
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
        <br />
        <Footer />
      </div>
    </>
  );
};
export default EditFacture;
