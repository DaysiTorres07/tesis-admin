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
import ConfirmModal from "../../../lib/components/modals/confirm";
import LoadingContainer from "../../../lib/components/loading_container";
import { UploadSolicitudeImages } from "../../../lib/utils/upload_solicitude_images";
import ImageModal, {
  ImageModalProps,
} from "../../../lib/components/modals/image";
import { useAuth } from "../../../lib/hooks/use_auth";
import {
  CheckFinished,
  CheckPermissions,
} from "../../../lib/utils/check_permissions";
import TabContainer, { TabPanel } from "../../../lib/components/tab_container";
import SoliciterPanel from "../../../lib/layouts/edit_solicitude/soliciter";
import TreasuryPanel from "../../../lib/layouts/edit_solicitude/treasury";
import FinancialPanel from "../../../lib/layouts/edit_solicitude/financial";
import PaymentPanel from "../../../lib/layouts/edit_solicitude/payment";
import ContabAdvancePanel from "../../../lib/layouts/edit_solicitude/contableAdvance";
import {
  Abierto,
  Aprobado,
  Cerrado,
  Pendiente,
} from "../../../lib/utils/constants";
import { FinanField } from "../../../lib/styles/views/financialStyled";
import Footer from "../../../lib/components/footer";
import Dropdown from "react-bootstrap/Dropdown";
import FormatedDate from "../../../lib/utils/formated_date";
import ComentModal from "../../../lib/components/modals/coment";
import FactureAdvanceRecaudacionesModal from "../../../lib/components/modals/factureAdvanceRecaudaciones";
import { useForm } from "react-hook-form";
import StatusAdvanceR from "../status/[id]";

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
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm();

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

  const onClickSo = (data: any) => {
    fetch("/api/mailRecaudaciones/mailAdvaSoli", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          toast("Se envio correctamente");
        } else {
          toast("Email/Password is invalid.");
        }
      })
      .catch((e) => console.log(e));
    reset();
  };
  const onClickTe = (data: any) => {
    fetch("/api/mailRecaudaciones/mailAdvaTeso", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          toast("Se envio correctamente");
        } else {
          toast("Email/Password is invalid.");
        }
      })
      .catch((e) => console.log(e));
    reset();
  };
  const onClickFi = (data: any) => {
    fetch("/api/mailRecaudaciones/mailAdvaFinan", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          toast("Se envio correctamente");
        } else {
          toast("Email/Password is invalid.");
        }
      })
      .catch((e) => console.log(e));
    reset();
  };
  const onClickTes = (data: any) => {
    fetch("/api/mailRecaudaciones/mailAdvaTesor", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          toast("Se envio correctamente");
        } else {
          toast("Email/Password is invalid.");
        }
      })
      .catch((e) => console.log(e));
    reset();
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

  const showStatusModal = () => setStatusModal(true);

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
      dataField: "providerRecaudaciones.emailRecaudaciones",
      caption: "Email Prov",
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
    edit: (rowData: FactureAdvanceRecaudaciones) => {
      if (
        CheckFinished(auth, [9], formik.values?.soliciterState, Aprobado) ||
        (CheckPermissions(auth, [3]) &&
          !CheckFinished(auth, [3], formik.values?.soliciterState, Aprobado)) ||
        CheckFinished(
          auth,
          [3],
          formik.values?.paymentTreasuryState,
          Aprobado
        ) ||
        (CheckPermissions(auth, [4]) &&
          !CheckFinished(
            auth,
            [4],
            formik.values?.paymentTreasuryState,
            Aprobado
          )) ||
        CheckFinished(auth, [4], formik.values?.financialState, Aprobado) ||
        (CheckPermissions(auth, [6]) &&
          !CheckFinished(auth, [6], formik.values?.financialState, Aprobado)) ||
        CheckFinished(auth, [6], formik.values?.imageTreasuryState, Aprobado) ||
        (CheckPermissions(auth, [2]) &&
          !CheckFinished(
            auth,
            [2],
            formik.values?.imageTreasuryState,
            Aprobado
          )) ||
        CheckFinished(
          auth,
          [2],
          formik.values?.contableAdvanceState,
          Cerrado
        )
      )
        return;
      setEditingFactureAdvance(rowData);
      showModal();
    },
    delete: (rowData: FactureAdvanceRecaudaciones) => {
      if (CheckPermissions(auth, [0, 9])) {
        showConfirmModal(rowData.id);
      }
    },

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
  };

  const tabPanels: Array<TabPanel> = [
    {
      name: "Solicitantes",
      content: (
        <SoliciterPanel formik={formik}  />
      ),
    },
    {
      name: "Tesorería",
      content: (
        <TreasuryPanel sm={12} md={12} lg={6} xl={6} formik={formik} inTabs />
      ),
    },
    {
      name: "Financiero",
      content: (
        <FinancialPanel
          sm={12}
          md={12}
          lg={6}
          xl={6}
          formik={formik}
          items={items}
          setItems={setItems}
          inTabs
        />
      ),
    },
    {
      name: "Pagos",
      content: (
        <PaymentPanel sm={12} md={12} lg={6} xl={6} formik={formik} inTabs />
      ),
    },
    {
      name: "Contabilidad",
      content: (
        <ContabAdvancePanel
          sm={12}
          md={12}
          lg={6}
          xl={6}
          formik={formik}
          inTabs
        />
      ),
    },
  ];

  return (
    <>
      <title>Recadaciones | Editar Anticipo</title>
      
      <NavBar />
      <Container>
        <h3 className="mb-4 mt-4 text-center">Editar Anticipo</h3>

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
              <Col style={{ marginBottom: "10px" }}>
                {CheckPermissions(auth, [9]) ? (
                  <SoliciterPanel formik={formik} />
                ) : CheckPermissions(auth, [2]) ? (
                  <ContabAdvancePanel lg={6} md={6} formik={formik} />
                ) : CheckPermissions(auth, [3]) ? (
                  <TreasuryPanel lg={6} md={6} formik={formik} />
                ) : CheckPermissions(auth, [4]) ? (
                  <FinancialPanel
                    lg={6}
                    md={6}
                    formik={formik}
                    items={items}
                    setItems={setItems}
                  />
                ) : CheckPermissions(auth, [6]) ? (
                  <PaymentPanel lg={6} md={6} formik={formik} />
                ) : null}
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
                    disabled={!CheckPermissions(auth, [0, 1])}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row style={{ marginBottom: "60px" }}>
              <Col lg={8} md={8} sm={12} xs={12}>
                {CheckPermissions(auth, [0]) ? (
                  <TabContainer tabPanels={tabPanels} />
                ) : null}
              </Col>
              <Col lg={4} md={4} sm={12} xs={12}>
                <Row>
                  <Col sm={4} xs={4}>
                    <Button
                      variant="outline-dark"
                      onClick={() =>
                        CheckPermissions(auth, [0]) ||
                        !CheckFinished(
                          auth,
                          [1],
                          formik.values?.soliciterState,
                          "Aprobado"
                        )
                          ? showModal()
                          : toast.info("No tienes permiso para agregar un item")
                      }
                      disabled={CheckPermissions(auth, [2, 3, 4, 5, 6, 7])}
                    >
                      Agregar
                    </Button>
                  </Col>

                  <Col sm={4} xs={3}>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-dark"
                        id="dropdown-basic"
                      >
                        Descargar
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {CheckPermissions(auth, [0, 1, 2, 3, 9]) && (
                          <Dropdown.Item onClick={printAdvance}>
                            PDF
                          </Dropdown.Item>
                        )}
                        <Dropdown.Item onClick={() => showStatusModal()}>
                          ESTADO DE ANTICIPO
                        </Dropdown.Item>
                        {CheckPermissions(auth, [0, 3, 6]) && (
                          <Dropdown.Item onClick={txtBGR}>
                            CASH BGR
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>

                  <Col sm={4} xs={4}>
                    <Button
                      variant="outline-dark"
                      onClick={() => formik.handleSubmit()}
                    >
                      Actualizar
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Row>
            <Col lg={2} md={2}>
              {CheckPermissions(auth, [0, 1]) && (
                <form onSubmit={handleSubmit(onClickSo)} method="POST">
                  <div className="form-group mb-3" style={{ width: "100px" }}>
                    <>
                      <input
                        type="number"
                        name="number"
                        id="number"
                        value={initialValues.number}
                        className="form-control"
                        {...register("number", { required: true })}
                      />
                      <input
                        type="text"
                        name="soliciter"
                        id="soliciter"
                        value={initialValues.soliciter}
                        className="form-control"
                        {...register("soliciter", { required: true })}
                      />
                    </>
                  </div>
                  <button type="submit" className="px-2 btn btn-outline-danger">
                    Enviar notificacion
                  </button>
                </form>
              )}
            </Col>
            <Col lg={2} md={2}>
              {CheckPermissions(auth, [0, 3]) && (
                <form onSubmit={handleSubmit(onClickTe)} method="POST">
                  <div className="form-group mb-3" style={{ width: "80px" }}>
                    <>
                      <input
                        type="number"
                        name="number"
                        id="number"
                        value={initialValues.number}
                        className="form-control"
                        {...register("number", { required: true })}
                      />
                    </>
                  </div>
                  <button type="submit" className="px-2 btn btn-outline-danger">
                    Enviar notificacion
                  </button>
                </form>
              )}
            </Col>
            <Col lg={2} md={2}>
              {CheckPermissions(auth, [0, 4]) && (
                <form onSubmit={handleSubmit(onClickFi)} method="POST">
                  <div className="form-group mb-3" style={{ width: "80px" }}>
                    <>
                      <input
                        type="number"
                        name="number"
                        id="number"
                        value={initialValues.number}
                        className="form-control"
                        {...register("number", { required: true })}
                      />
                    </>
                  </div>
                  <button type="submit" className="px-2 btn btn-outline-danger">
                    Enviar notificacion
                  </button>
                </form>
              )}
            </Col>
            <Col>
              {CheckPermissions(auth, [0, 6]) && (
                <form onSubmit={handleSubmit(onClickTes)} method="POST">
                  <div className="form-group mb-3" style={{ width: "80px" }}>
                    <>
                      <input
                        type="number"
                        name="number"
                        id="number"
                        value={initialValues.number}
                        className="form-control"
                        {...register("number", { required: true })}
                      />
                    </>
                  </div>
                  <button type="submit" className="px-2 btn btn-outline-danger">
                    Enviar notificacion
                  </button>
                </form>
              )}
            </Col>
          </Row>
          <TreeTable
            dataSource={items}
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
                  (partialSum, factureAdvance) =>
                    partialSum + factureAdvance.valueNet,
                  0
                )
                .toLocaleString()}
            </p>
            <p>
              Pago acreditado: $
              {items
                .reduce(
                  (partialSum, factureAdvance) =>
                    partialSum + factureAdvance.accreditedPayment,
                  0
                )
                .toLocaleString()}
            </p>
            <p className="text-danger">
              Diferencia: $
              {items
                .reduce(
                  (partialSum, factureAdvance) =>
                    partialSum + factureAdvance.difference,
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

          <StatusAdvanceR
            visible={statusModal}
            close={() => setStatusModal(!statusModal)}
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
