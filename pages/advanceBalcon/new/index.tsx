// import NavBar from "../../../lib/components/navbar";
// import { Button, Col, Container, Form, Row } from "react-bootstrap";
// import Footer from "../../../lib/components/footer";
import React, { useEffect, useState } from "react";
import { AdvanceBalcon, FactureAdvanceBalcon, ResponseData } from "../../../lib/types";
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
import FactureAdvanceBalconModal from "../../../lib/components/modals/factureAdvanceBalcon";
import Sidebar from "../../../lib/components/sidebar";

// Inicio de la app
const NewFactureAdvance = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Array<FactureAdvanceBalcon>>([]);
  const [initialValues, _setInitialValues] = useState<AdvanceBalcon>({
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
    useState<FactureAdvanceBalcon | null>(null);

  const formik = useFormik<AdvanceBalcon>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: AdvanceBalcon) => {
      if (formData.details.trim() === "") {
        toast.warning("El campo detalle no puede estar vacío");
        return;
      }
      setLoading(true);
      const facutureAdvanceBalconItems = await UploadSolicitudeImages(items);
      const response: ResponseData = await HttpClient(
        "/api/advanceBalcon",
        "POST",
        auth.userName,
        auth.role,
        { ...formData, items: facutureAdvanceBalconItems }
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

  const showConfirmModal = (factureAdvanceBalconId: string) =>
    setItemToDelete(factureAdvanceBalconId);
  const hideConfirmModal = () => setItemToDelete(null);

  const columns: ColumnData[] = [
    {
      dataField: "centerCostBalcon.name",
      caption: "Centro de Costos",
      cssClass: "bold",
    },
    {
      dataField: "providerBalcon.name",
      caption: "Proveedor",
      cssClass: "bold",
    },
    {
      dataField: "providerBalcon.emailBalcon",
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
    edit: (rowData: FactureAdvanceBalcon) => {
      setEditingFactureAdvance(rowData);
      showModal();
    },
    delete: (rowData: FactureAdvanceBalcon) => showConfirmModal(rowData.id),
  };

  return (
    <RoleLayout permissions={[0, 1, 14]}>
      <title>Balcón | Crear Anticipo</title>
      <div className="flex w-full">
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
              BALCÓN DEL CAONY
              </em>              
            </p>
            <LoadingContainer visible={loading} miniVersion>
              <div className="grid grid-cols-0 md:grid-cols-3 m-4 gap-4 mb-4 text-center">
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
                    let fa = a.centerCostCalderon.name.toLowerCase(),
                      fb = b.centerCostCalderon.name.toLowerCase();

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
            </LoadingContainer>
          </div>
        </div>
      </div>
    </RoleLayout>
  );
};
export default NewFactureAdvance;

//     <RoleLayout permissions={[0, 1]}>
//       <title>Balcon | Crear Anticipo</title>
      
//       <div
//         className="min-vh-100 w-100 position-absolute d-flex flex-column align-items-center justify-content-center"
//         style={{ background: "#9e3636", fontSize: "14px" }}
//       >
//         <NavBar />
//         <br />
//         <div className="flex-grow-1 d-flex justify-content-center align-items-center w-75">
//           <div className="bg-white rounded shadow pb-5 px-3 w-100">
//             <h3 className="mb-4 mt-4 text-center">Nuevo Anticipo</h3>
//             <LoadingContainer visible={loading} miniVersion>
//               <Row>
//                 <Col sm className="mb-3">
//                   <Form.Group>
//                     <Form.Label>Solicitante</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Solicitante"
//                       value={formik.values.soliciter}
//                       disabled
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col sm className="mb-3">
//                   <Form.Group>
//                     <Form.Label>Fecha</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={formik.values.date}
//                       disabled
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col sm className="mb-3">
//                   <Form.Group>
//                     <Form.Label>Detalle General</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Detalle"
//                       value={formik.values.details}
//                       name="details"
//                       onChange={formik.handleChange}
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col lg={2} sm className="mb-3">
//                   <Button variant="outline-dark" onClick={showModal}>
//                     Agregar Factura
//                   </Button>
//                 </Col>
//                 <Col className="mb-3">
//                   <Button
//                     variant="outline-dark"
//                     onClick={() => formik.handleSubmit()}
//                   >
//                     Guardar Anticipo
//                   </Button>
//                 </Col>  
//               </Row>
//               <TreeTable
//                 dataSource={items.sort((a, b) => {
//                   let fa = a.centerCostBalcon.name.toLowerCase(),
//                     fb = b.centerCostBalcon.name.toLowerCase();

//                   if (fa < fb) {
//                     return -1;
//                   }
//                   if (fa > fb) {
//                     return 1;
//                   }
//                   return 0;
//                 })}
//                 columns={columns}
//                 buttons={buttons}
//                 searchPanel={true}
//                 buttonsFirst
//                 colors={{ headerBackground: "#c0c0c0", headerColor: "#000000" }}
//                 paging
//                 showNavigationButtons
//                 showNavigationInfo
//                 pageSize={15}
//                 infoText={(actual, total, items) =>
//                   `Página ${actual} de ${total} (${items} facturas)`
//                 }
//               />

//               <FactureAdvanceBalconModal
//                 visible={modalVisible}
//                 close={hideModal}
//                 initialData={editingFactureAdvance}
//                 onDone={(newItem: FactureAdvanceBalcon) => {
//                   if (editingFactureAdvance === null) {
//                     setItems((oldData) => [
//                       ...oldData,
//                       { ...newItem, id: `${oldData.length + 1}` },
//                     ]);
//                   } else {
//                     setItems((oldData) =>
//                       oldData.map((element: FactureAdvanceBalcon) =>
//                         element.id === newItem.id ? newItem : element
//                       )
//                     );
//                     setEditingFactureAdvance(null);
//                   }
//                 }}
//               />
//               <ConfirmModal
//                 visible={itemToDelete !== null}
//                 close={() => setItemToDelete(null)}
//                 onDone={() => {
//                   setItems((oldData) => [
//                     ...oldData.filter(
//                       (item: FactureAdvanceBalcon) => item.id !== itemToDelete
//                     ),
//                   ]);
//                   hideConfirmModal();
//                 }}
//               />
//             </LoadingContainer>
//           </div>
//         </div>
//         <br />
//         <Footer />
//       </div>
//     </RoleLayout>
//   );
// };
// export default NewFactureAdvance;
