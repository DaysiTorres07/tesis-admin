import React, { useEffect, useState } from "react";
import {
  ResponseData,
  CloudImage,
  Comment,
  FactureAdvanceRecaudaciones,
  AdvanceRecaudaciones,
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
import {
  Abierto,
  Aprobado,
  Elaborando,
  Pendiente,
} from "../../../lib/utils/constants";
import { FinanField } from "../../../lib/styles/views/financialStyled";
import Footer from "../../../lib/components/footer";
import Dropdown from "react-bootstrap/Dropdown";
import FormatedDate from "../../../lib/utils/formated_date";
import { CheckPermissions } from "../../../lib/utils/check_permissions";
import FactureAdvanceRecaudacionesModal from "../../../lib/components/modals/factureAdvanceRecaudaciones";
import ComentModal from "../../../lib/components/modals/coment";
import ConfirmModal from "../../../lib/components/modals/confirm";

// Inicio de la app
const EditFactureAdvance = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [itemsComment, setItemsComment] = useState<Array<Comment>>([]);
  const [items, setItems] = useState<Array<FactureAdvanceRecaudaciones>>([]);
  const [initialValues, setInitialValues] = useState<AdvanceRecaudaciones>({
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
    useState<FactureAdvanceRecaudaciones | null>(null);
  const [imageModal, setImageModal] = useState<ImageModalProps>(null);

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const advanceRecaudacionesId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/advanceRecaudaciones/" + advanceRecaudacionesId,
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

  const onSubmit = async (formData: AdvanceRecaudaciones) => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const advanceRecaudacionesId = Router.query.id as string;
      const factureAdvanceRecaudacionesItems = await UploadSolicitudeImages(
        items
      );
      const requestData = {
        ...formData,
        itemsComment,
        items: factureAdvanceRecaudacionesItems,
        id: advanceRecaudacionesId,
      };
      const response: ResponseData = await HttpClient(
        "/api/advanceRecaudaciones",
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

  const formik = useFormik<AdvanceRecaudaciones>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const showConfirmModal = (factureAdvanceRecaudacionesId: string) =>
    setItemToDelete(factureAdvanceRecaudacionesId);
  const hideConfirmModal = () => setItemToDelete(null);

  const showModalComment = () => setCommentModalVisible(true);

  const showConfirmModalComment = (commentId: string) =>
    setItemCommentToDelete(commentId);
  const hideConfirmModalComment = () => setItemCommentToDelete(null);

  const printAdvance = () => {
    if (Router.asPath !== Router.route) {
      const advanceId = Router.query.id as string;
      Router.push({ pathname: "/advanceRecaudaciones/print/" + advanceId });
    } else {
      setTimeout(printAdvance, 1000);
    }
  };

  const excelAdvance = () => {
    if (Router.asPath !== Router.route) {
      const advanceId = Router.query.id as string;
      Router.push({ pathname: "/advanceRecaudaciones/excel/" + advanceId });
    } else {
      setTimeout(excelAdvance, 1000);
    }
  };

  const txtPichincha = () => {
    if (Router.asPath !== Router.route) {
      const advanceId = Router.query.id as string;
      Router.push({ pathname: "/advanceRecaudaciones/txt/" + advanceId });
    } else {
      setTimeout(txtPichincha, 1000);
    }
  };

  const txtBGR = () => {
    if (Router.asPath !== Router.route) {
      const advanceId = Router.query.id as string;
      Router.push({ pathname: "/advanceRecaudaciones/txtBGR/" + advanceId });
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
      dataField: "providerRecaudaciones.name",
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
    show: (rowData: FactureAdvanceRecaudaciones) => {
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
    edit: (rowData: FactureAdvanceRecaudaciones) => {
      setEditingFactureAdvance(rowData);
      CheckPermissions(auth, [0])
        ? showModal()
        : toast.warning("No tienes permiso para editar una factura");
    },
    delete: (rowData: FactureAdvanceRecaudaciones) => {
      CheckPermissions(auth, [0])
        ? showConfirmModal(rowData.id)
        : toast.warning("No tiene permiso para eliminar una factura");
    },
  };

  return (
    <>
      <title>Recaudaciones | Historial de Anticipo</title>
      
      <NavBar />
      <Container>
        <h3 className="text-danger mb-4 mt-4 text-center">
          Historial de Anticipo {initialValues.number}
        </h3>
        <LoadingContainer visible={loading} miniVersion>
          <Col>
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
            </Row>
            <Row style={{ marginBottom: "40px" }}>
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
              <Col lg={4} md={4}>
                <Dropdown style={{ marginTop: "33px", marginLeft: "10%" }}>
                  <Dropdown.Toggle variant="outline-danger" id="dropdown-basic">
                    Descargar
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={printAdvance}>PDF</Dropdown.Item>
                    <Dropdown.Item onClick={excelAdvance}>EXCEL</Dropdown.Item>
                    <Dropdown.Item onClick={txtPichincha}>
                      CASH PICHINCHA
                    </Dropdown.Item>
                    <Dropdown.Item onClick={txtBGR}>CASH BGR</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
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
              width: 400,
              marginTop: "3%",
              border: "1px solid black",
              paddingRight: "100px",
            }}
          >
            <p>
              Valor Total a Pagar: $
              {items
                .reduce(
                  (partialSum, factureAdvanceRecaudaciones) =>
                    partialSum + factureAdvanceRecaudaciones.valueNet,
                  0
                )
                .toLocaleString()}
            </p>
            <p>
              Pago acreditado: $
              {items
                .reduce(
                  (partialSum, factureAdvanceRecaudaciones) =>
                    partialSum + factureAdvanceRecaudaciones.accreditedPayment,
                  0
                )
                .toLocaleString()}
            </p>
            <p className="text-danger">
              Diferencia: $
              {items
                .reduce(
                  (partialSum, factureAdvanceRecaudaciones) =>
                    partialSum + factureAdvanceRecaudaciones.difference,
                  0
                )
                .toLocaleString()}
            </p>
          </div>

          <div
            style={{
              border: "1px solid black",
              marginTop: "3%",
              marginBottom: "15%",
              backgroundColor: "#F8F9F9",
            }}
          >
            <h3 className="mt-2" style={{ textAlign: "center" }}>
              Caja de Comentarios
            </h3>
            <Button
              variant="outline-dark"
              style={{ marginLeft: "47px", marginTop: "10px" }}
              onClick={() => setCommentModalVisible(true)}
            >
              Agregar Comentario
            </Button>
            <div style={{ margin: 50 }}>
              <TreeTable
                keyExpr="id"
                dataSource={itemsComment}
                columns={columnsComment}
                buttons={buttonsComment}
                searchPanel={true}
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
            <div
              style={{
                marginRight: "45px",
                marginBottom: "30px",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Button
                variant="outline-danger"
                style={{ marginRight: "20px" }}
                onClick={() => Router.back()}
              >
                Volver
              </Button>
              <Button
                variant="outline-dark"
                onClick={() => formik.handleSubmit()}
              >
                Actualizar Comentario
              </Button>
            </div>
          </div>

          <FactureAdvanceRecaudacionesModal
            visible={modalVisible}
            close={hideModal}
            initialData={editingFactureAdvance}
            onDone={(newItem: FactureAdvanceRecaudaciones) => {
              if (editingFactureAdvance === null) {
                setItems((oldData) => [
                  ...oldData,
                  { ...newItem, id: `${oldData.length + 1}` },
                ]);
              } else {
                setItems((oldData) =>
                  oldData.map((element: FactureAdvanceRecaudaciones) =>
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
                    element.id === newItemComment.id ? newItemComment : element
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
                  (item: FactureAdvanceRecaudaciones) =>
                    item.id !== itemToDelete
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
      </Container>
      <Footer />
    </>
  );
};

export default EditFactureAdvance;
