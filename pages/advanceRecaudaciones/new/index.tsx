import React, { useEffect, useState } from "react";
import {
  AdvanceRecaudaciones,
  FactureAdvanceRecaudaciones,
  ResponseData,
} from "../../../lib/types";
import NavBar from "../../../lib/components/navbar";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useAuth } from "../../../lib/hooks/use_auth";
import FormatedDate from "../../../lib/utils/formated_date";
import { useFormik } from "formik";
import Router from "next/router";
import HttpClient from "../../../lib/utils/http_client";
import { toast } from "react-toastify";
import ConfirmModal from "../../../lib/components/modals/confirm";
import FactureAdvanceModal from "../../../lib/components/modals/factureAdvance";
import LoadingContainer from "../../../lib/components/loading_container";
import { UploadSolicitudeImages } from "../../../lib/utils/upload_solicitude_images";
import RoleLayout from "../../../lib/layouts/role_layout";
import { Abierto, Elaborando, Pendiente } from "../../../lib/utils/constants";
import Footer from "../../../lib/components/footer";
import FactureAdvanceRecaudacionesModal from "../../../lib/components/modals/factureAdvanceRecaudaciones";

// Inicio de la app
const NewFactureAdvance = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Array<FactureAdvanceRecaudaciones>>([]);
  const [initialValues, _setInitialValues] = useState<AdvanceRecaudaciones>({
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
    useState<FactureAdvanceRecaudaciones | null>(null);

  const formik = useFormik<AdvanceRecaudaciones>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: AdvanceRecaudaciones) => {
      if (formData.details.trim() === "") {
        toast.warning("El campo detalle no puede estar vacío");
        return;
      }
      setLoading(true);
      const facutureAdvanceRecaudacionesItems = await UploadSolicitudeImages(
        items
      );
      const response: ResponseData = await HttpClient(
        "/api/advanceRecaudaciones",
        "POST",
        auth.userName,
        auth.role,
        { ...formData, items: facutureAdvanceRecaudacionesItems }
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

  const showConfirmModal = (factureAdvanceRecaudacionesId: string) =>
    setItemToDelete(factureAdvanceRecaudacionesId);
  const hideConfirmModal = () => setItemToDelete(null);

  const columns: ColumnData[] = [
    {
      dataField: "providerRecaudaciones.name",
      caption: "Proveedor",
    },
    {
      dataField: "providerRecaudaciones.emailRecaudaciones",
      caption: "Email Prov",
      cssClass: "column-soli",
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
    edit: (rowData: FactureAdvanceRecaudaciones) => {
      setEditingFactureAdvance(rowData);
      showModal();
    },
    delete: (rowData: FactureAdvanceRecaudaciones) =>
      showConfirmModal(rowData.id),
  };

  return (
    <RoleLayout permissions={[0, 1]}>
      <title>Recaudaciones | Crear Anticipo</title>
      
      <div
        className="min-vh-100 w-100 position-absolute d-flex flex-column align-items-center justify-content-center"
        style={{ background: "#9e3636", fontSize: "14px" }}
      >
        <NavBar />
        <br />
        <div className="flex-grow-1 d-flex justify-content-center align-items-center w-75">
          <div className="bg-white rounded shadow pb-5 px-3 w-100">
            <h3 className="mb-4 mt-4 text-center">Nuevo Anticipo</h3>
            <LoadingContainer visible={loading} miniVersion>
              <Row>
                <Col sm className="mb-3">
                  <Form.Group>
                    <Form.Label>Solicitante</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Solicitante"
                      value={formik.values.soliciter}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col sm className="mb-3">
                  <Form.Group>
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control
                      type="text"
                      value={formik.values.date}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col sm className="mb-3">
                  <Form.Group>
                    <Form.Label>Detalle</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Detalle"
                      value={formik.values.details}
                      name="details"
                      onChange={formik.handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={2} sm className="mb-3">
                  <Button variant="outline-dark" onClick={showModal}>
                    Agregar Factura
                  </Button>
                </Col>
                <Col className="mb-3">
                  <Button
                    variant="outline-dark"
                    onClick={() => formik.handleSubmit()}
                  >
                    Guardar Anticipo
                  </Button>
                </Col>
              </Row>

              <TreeTable
                dataSource={items}
                columns={columns}
                buttons={buttons}
                searchPanel={true}
                buttonsFirst
                colors={{ headerBackground: "#c0c0c0", headerColor: "#000000" }}
                paging
                showNavigationButtons
                showNavigationInfo
                pageSize={15}
                infoText={(actual, total, items) =>
                  `Página ${actual} de ${total} (${items} facturas)`
                }
              />

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
            </LoadingContainer>
          </div>
        </div>
        <br />
        <Footer />
      </div>
    </RoleLayout>
  );
};
export default NewFactureAdvance;
