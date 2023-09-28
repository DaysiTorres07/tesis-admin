import React, { useEffect, useState } from "react";
import {
  ResponseData,
  Facture,
  Solicitude,
  Comment,
  CloudImage,
} from "../../../lib/types";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";
import { useFormik } from "formik";
import HttpClient from "../../../lib/utils/http_client";
import { toast } from "react-toastify";
import Router from "next/router";
import ConfirmModal from "../../../lib/components/modals/confirm";
import FactureModal from "../../../lib/components/modals/facture";
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
import ContabPanel from "../../../lib/layouts/edit_solicitude/contable";
import TreasuryPanel from "../../../lib/layouts/edit_solicitude/treasury";
import FinancialPanel from "../../../lib/layouts/edit_solicitude/financial";
import PaymentPanel from "../../../lib/layouts/edit_solicitude/payment";
import {
  Aprobado,
  Elaborando,
  Pendiente,
  Abierto,
} from "../../../lib/utils/constants";
import { FinanField } from "../../../lib/styles/views/financialStyled";
import FormatedDate from "../../../lib/utils/formated_date";
import ComentModal from "../../../lib/components/modals/coment";
import { useForm } from "react-hook-form";
import StatusSolicitude from "../status/[id]";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import Sidebar from "../../../lib/components/sidebar";
import { alignPropType } from "react-bootstrap/esm/types";

// Inicio de la app
const EditFacture = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [itemsComment, setItemsComment] = useState<Array<Comment>>([]);
  const [items, setItems] = useState<Array<Facture>>([]);
  const [initialValues, setInitialValues] = useState<Solicitude>({
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
  const [editingFacture, setEditingFacture] = useState<Facture | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [statusModal, setStatusModal] = useState<boolean>(false);
  const [imageModal, setImageModal] = useState<ImageModalProps>(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const solicitudeId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/solicitude/" + solicitudeId,
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

  const onSubmit = async (formData: Solicitude) => {
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
        "/api/solicitude",
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

  const onClickSo = (data: any) => {
    fetch("/api/mailIC/mailSoli", {
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
  const onClickCo = (data: any) => {
    fetch("/api/mailIC/mailConta", {
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
    fetch("/api/mailIC/mailteso", {
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
    fetch("/api/mailIC/mailFinan", {
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

  const formik = useFormik<Solicitude>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const showConfirmModal = (factureId: string) => setItemToDelete(factureId);
  const hideConfirmModal = () => setItemToDelete(null);

  const showModalComment = () => setCommentModalVisible(true);

  const showConfirmModalComment = (commentId: string) =>
    setItemCommentToDelete(commentId);
  const hideConfirmModalComment = () => setItemCommentToDelete(null);

  const showStatusModal = () => setStatusModal(true);

  const printSolicitude = () => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;
      Router.push({ pathname: "/solicitude/print/" + solicitudeId });
    } else {
      setTimeout(printSolicitude, 1000);
    }
  };

  const excelSolicitude = () => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;
      Router.push({ pathname: "/solicitude/excel/" + solicitudeId });
    } else {
      setTimeout(excelSolicitude, 1000);
    }
  };

  const txtPichincha = () => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;
      Router.push({ pathname: "/solicitude/txt/" + solicitudeId });
    } else {
      setTimeout(txtPichincha, 1000);
    }
  };

  const txtBGR = () => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;
      Router.push({ pathname: "/solicitude/txtBGR/" + solicitudeId });
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
    edit: (rowData: Facture) => {
      if (
        CheckFinished(auth, [9], formik.values?.soliciterState, Aprobado) ||
        (CheckPermissions(auth, [2]) &&
          !CheckFinished(auth, [2], formik.values?.soliciterState, Aprobado)) ||
        CheckFinished(auth, [2], formik.values?.contableState, Aprobado) ||
        (CheckPermissions(auth, [3]) &&
          !CheckFinished(auth, [3], formik.values?.contableState, Aprobado)) ||
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
        CheckFinished(auth, [6], formik.values?.imageTreasuryState, Aprobado)
      )
        return;
      setEditingFacture(rowData);
      showModal();
    },
    delete: (rowData: Facture) => {
      if (CheckPermissions(auth, [0, 9])) {
        showConfirmModal(rowData.id);
      }
    },

    show: (rowData: Facture) => {
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
      content: <SoliciterPanel formik={formik} />,
    },
    {
      name: "Contabilidad",
      content: <ContabPanel formik={formik} />,
    },
    {
      name: "Tesorería",
      content: <TreasuryPanel formik={formik} />,
    },
    {
      name: "Financiero",
      content: (
        <FinancialPanel formik={formik} items={items} setItems={setItems} />
      ),
    },
    {
      name: "Pagos",
      content: <PaymentPanel formik={formik} />,
    },
  ];

  function getHighlightedText(text: string, highlight: string) {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} className="highlight">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  }

  //Paginacion de la tabla
  const ITEMS_PER_PAGE = 20;

  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  let currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (e: any, pageNumber: number) => {
    e.preventDefault();
    setCurrentPage(pageNumber);
  };

  //ordena la tabla por el nombre del proyecto
  const sortItemsByName = () => {
    const sortedItems = [...items].sort((a, b) =>
      a.project.name.localeCompare(b.project.name)
    );
    currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  };

  //Filtro de busqueda de la tabla
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const filterItems = () => {
    if (searchTerm === "") {
      return currentItems;
    } else {
      return items.filter(
        (item) =>
          item.project.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
            -1 ||
          item.centerCost.name
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase()) !== -1 ||
          item.provider.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
            -1 ||
          item.provider.email
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase()) !== -1 ||
          item.factureDate.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
            -1 ||
          item.factureNumber.toString().indexOf(searchTerm.toLowerCase()) !==
            -1 ||
          item.details.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          item.observation.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
            -1 ||
          item.documentDelivered
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase()) !== -1 ||
          item.numberRetention.toString().indexOf(searchTerm.toLowerCase()) !==
            -1 ||
          item.valueRetention.toString().indexOf(searchTerm.toLowerCase()) !==
            -1 ||
          item.observationConta
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase()) !== -1 ||
          item.beneficiary.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
            -1 ||
          item.identificationCard
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase()) !== -1 ||
          item.accountBank.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
            -1 ||
          item.debitNote.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      );
    }
  };

  return (
    <>
      <title>IC | Editar Solicitud</title>

      <style>
        {`
        .highlight {
          background-color: yellow;
        }
        `}
      </style>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-12/12 bg-white my-14 mx-8">
            <div className="grid md:grid-cols-3 flex justify-center items-center my-4 text-center">  
              <label className="text-gray-700 text-lg font-bold mx-4">
                Orden de Pago #{" "}
                <em
                  style={{
                    color: "#bb22dd",
                    fontStyle: "normal",
                    fontSize: "28px",
                    fontFamily: "Arial Black",
                  }}
                >
                  {formik.values?.number ?? 0}
                </em>
              </label> 
              <div className="mr-4">
                <em
                  style={{
                    color: "#334155",
                    fontStyle: "normal",
                    fontSize: "24px",
                    fontFamily: "Lato",
                    fontWeight: "bold",
                  }}
                >
                  EDITAR {" "}
                </em>
                <em
                  style={{
                    color: "#94a3b8",
                    fontStyle: "normal",
                    fontSize: "24px",
                    fontFamily: "Lato",
                  }}
                >
                  SOLICITUD INMOCONSTRUCCIONES
                </em>
              </div>
            </div>            
            <LoadingContainer visible={loading} miniVersion>
            <div className="grid grid-cols-1 md:grid-cols-3 flex h-full m-4 gap-4 mb-4 text-center">
                <div>
                  {CheckPermissions(auth, [9]) ? (
                    <SoliciterPanel formik={formik} />
                  ) : CheckPermissions(auth, [2]) ? (
                    <ContabPanel formik={formik} />
                  ) : CheckPermissions(auth, [3]) ? (
                    <TreasuryPanel formik={formik} />
                  ) : CheckPermissions(auth, [4]) ? (
                    <FinancialPanel
                      formik={formik}
                      items={items}
                      setItems={setItems}
                    />
                  ) : CheckPermissions(auth, [6]) ? (
                    <PaymentPanel lg={6} md={6} formik={formik} />
                  ) : null}
                </div>
                <div className="mx-auto">
                  <label className="text-gray-700 text-sm font-bold mb-2">
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
                <div className="mx-auto">
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Fecha de Creación
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    value={formik.values?.date}
                    disabled
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-gray-700 text-sm font-bold mb-2">
                  Detalle General Solicitud
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Detalle General Solicitud"
                    value={formik.values?.details ?? ""}
                    name="details"
                    onChange={formik.handleChange}
                    disabled={!CheckPermissions(auth, [0, 1, 14])}
                  />
                </div>  
              </div>                  
                <div className="grid grid-cols-1 md:grid-cols-6 gap-1">                 
                      <button
                        className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 mx-8 border border-red-500 hover:border-transparent rounded-full text-sm"
                        onClick={() =>
                          CheckPermissions(auth, [0]) ||
                          !CheckFinished(
                            auth,
                            [1, 14],
                            formik.values?.soliciterState,
                            "Aprobado"
                          )
                            ? showModal()
                            : toast.info("No tienes permiso para agregar un item")
                        }
                        disabled={CheckPermissions(auth, [2, 3, 4, 5, 6, 9, 14])}
                      >
                        Agregar Factura
                      </button>                
                      <button
                        className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 mx-8 border border-red-500 hover:border-transparent rounded-full text-sm"
                        onClick={() => formik.handleSubmit()}
                      >
                        Actualizar Solicitud
                      </button>
                      <button
                        className="text-center bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white py-2 px-4 mx-8 border border-gray-500 hover:border-transparent rounded-full text-sm"
                        onClick={() => Router.back()}
                      >
                        Volver
                      </button>              
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-1 my-3">
                    <div className="relative inline-block text-center flex-auto w-48">
                    <button
                      type="button"
                      className="flex items-center justify-center w-full py-2 px-4 mx-8 font-semibold gap-x-1.5 text-red-500 bg-transparent border border-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-full text-sm"
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
                      <div className="relative text-center w-40 mx-14  bg-white divide-y divide-gray-100 shadow-lg ring-1 ring-black ring-opacity-5">
                        {CheckPermissions(auth, [0, 1, 2, 3, 9, 14]) && (
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            onClick={printSolicitude}
                          >
                            PDF
                          </button>
                        )}
                        {CheckPermissions(auth, [0, 1, 14]) && (
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            onClick={excelSolicitude}
                          >
                            EXCEL
                          </button>
                        )}
                        {CheckPermissions(auth, [0, 3, 6]) && (
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            onClick={txtPichincha}
                          >
                            CASH PICHINCHA
                          </button>
                        )}
                        {CheckPermissions(auth, [0, 3, 6]) && (
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            onClick={txtBGR}
                          >
                            CASH BGR
                          </button>
                        )}
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          onClick={showStatusModal}
                        >
                          ESTADO DE SOLICITUD
                        </button>
                      </div>
                    )}
                    </div>
                  </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
                {CheckPermissions(auth, [0]) ? (
                  <TabContainer tabPanels={tabPanels} />
                ) : null}
              </div>
              <div className="grid grid-cols-1 gap-4 m-2">
                <div className="flex justify-center items-center">
                <div className="w-full sm:w-auto bg-white  flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-search text-gray-400 mr-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                    <label className="text-xs font-bold">Filtro de Búsqueda </label>
                    <input
                      className="border border-gray-300 rounded-md p-2 ml-2 outline-none focus:ring-2 focus:ring-blue-500"
                      type="text"
                      value={searchTerm}
                      onChange={handleChange}
                      placeholder="Escriba el criterio a buscar..."
                    />
                  </div>
                </div>
                <div className="overflow-x-auto mx-2">
                  <table className="text-xs w-full">
                    <thead>
                      <tr className="text-center border border-black">
                        <th>Acciones</th>
                        {CheckPermissions(
                          auth,
                          [0, 1, 2, 3, 4, 5, 6, 9, 14]
                        ) && <th>Proyecto</th>}
                        {CheckPermissions(auth, [0, 1, 2, 3, 4, 5, 9, 14]) && (
                          <th>Centro Costos</th>
                        )}
                        {CheckPermissions(
                          auth,
                          [0, 1, 2, 3, 5, 4, 6, 9, 14]
                        ) && <th>Proveedor</th>}
                        {CheckPermissions(auth, [0, 1, 2, 9, 14]) && (
                          <th>Email Prov</th>
                        )}
                        {CheckPermissions(auth, [0, 1, 2, 4, 5, 9, 14]) && (
                          <th>Fecha factura</th>
                        )}
                        {CheckPermissions(
                          auth,
                          [0, 1, 2, 3, 4, 5, 6, 9, 14]
                        ) && <th>Numero Factura</th>}
                        {CheckPermissions(
                          auth,
                          [0, 1, 2, 3, 4, 5, 6, 9, 14]
                        ) && <th>Detalle</th>}
                        {CheckPermissions(
                          auth,
                          [0, 1, 2, 3, 4, 5, 6, 9, 14]
                        ) && <th>Valor</th>}
                        {CheckPermissions(auth, [0, 1, 2, 3, 9, 14]) && (
                          <th>Observacion</th>
                        )}
                        {CheckPermissions(auth, [0, 1, 9, 14]) && (
                          <th>Documento</th>
                        )}
                        {CheckPermissions(auth, [0, 2, 3, 9]) && (
                          <th>Numero Retencion</th>
                        )}
                        {CheckPermissions(auth, [0, 1, 2, 3, 4, 5, 9, 14]) && (
                          <th>Valor Retencion</th>
                        )}
                        {CheckPermissions(
                          auth,
                          [0, 1, 2, 3, 4, 5, 6, 9, 14]
                        ) && <th>Valor Pagar</th>}
                        {CheckPermissions(auth, [0, 2, 3, 6, 9]) && (
                          <th>Observacion Contabilidad</th>
                        )}
                        {CheckPermissions(auth, [0, 1, 2, 3, 4, 6, 9, 14]) && (
                          <th>Beneficiario</th>
                        )}
                        {CheckPermissions(auth, [0, 1, 2, 3, 4, 6, 9, 14]) && (
                          <th>Cedula o RUC</th>
                        )}
                        {CheckPermissions(auth, [0, 1, 2, 4, 9, 14]) && (
                          <th>Banco Beneficiario</th>
                        )}
                        {CheckPermissions(auth, [0, 1, 2, 4, 9, 14]) && (
                          <th>Numero Cuenta</th>
                        )}
                        {CheckPermissions(auth, [0, 1, 9, 14]) && (
                          <th>Tipo Cuenta</th>
                        )}
                        {CheckPermissions(auth, [0, 1, 9, 14]) && (
                          <th>Tipo identificacion</th>
                        )}
                        {CheckPermissions(auth, [0, 1, 9, 14]) && (
                          <th>Tipo pago</th>
                        )}
                        {CheckPermissions(auth, [0, 2, 4, 5, 9]) && (
                          <th>Numero Cheque</th>
                        )}
                        {CheckPermissions(auth, [0, 9]) && (
                          <th>Banco Cheque</th>
                        )}
                        {CheckPermissions(auth, [0, 2, 3, 4, 6, 9]) && (
                          <th>Descuento</th>
                        )}
                        {CheckPermissions(auth, [0, 2, 3, 4, 6, 9]) && (
                          <th>Aumento</th>
                        )}
                        {CheckPermissions(auth, [0, 2, 4, 6, 9]) && (
                          <th>Observacion Tesorería</th>
                        )}
                        {CheckPermissions(auth, [0, 2, 4, 6, 9]) && (
                          <th>Estado Pago</th>
                        )}
                        {CheckPermissions(auth, [0, 1, 2, 3, 4, 6, 9, 14]) && (
                          <th>Pago Acreditado</th>
                        )}
                        {CheckPermissions(auth, [0, 2, 3, 4, 6, 9]) && (
                          <th>Nota debito</th>
                        )}
                        {CheckPermissions(auth, [0, 2, 3, 4, 6, 9]) && (
                          <th>Diferencia</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        {sortItemsByName()}
                        {(filterItems() ?? []).map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className="text-center whitespace-nowrap border"
                            >
                              <td className="p-1 border border-black">
                                <div className="flex justify-content-between">
                                  <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    style={{
                                      marginRight: "2px",
                                      width: "25px",
                                      height: "25px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() => buttons.edit(item)}
                                  >
                                    <span
                                      style={{
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <FaEdit />
                                    </span>
                                  </button>
                                  <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    style={{
                                      marginRight: "2px",
                                      width: "25px",
                                      height: "25px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() => buttons.delete(item)}
                                  >
                                    <span
                                      style={{
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <FaTrashAlt />
                                    </span>
                                  </button>
                                  <button
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => buttons.show(item)}
                                    style={{
                                      width: "25px",
                                      height: "25px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <span
                                      style={{
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <FaEye />
                                    </span>
                                  </button>
                                </div>
                              </td>
                              {CheckPermissions(
                                auth,
                                [0, 1, 2, 3, 4, 5, 6, 9, 14]
                              ) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.project.name,
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(
                                auth,
                                [0, 1, 2, 3, 4, 5, 9, 14]
                              ) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.centerCost.name,
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(
                                auth,
                                [0, 1, 2, 3, 4, 5, 6, 9, 14]
                              ) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.provider.name,
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 1, 2, 9, 14]) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.provider.email,
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(
                                auth,
                                [0, 1, 2, 4, 5, 9, 14]
                              ) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.factureDate,
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(
                                auth,
                                [0, 1, 2, 3, 4, 5, 6, 9, 14]
                              ) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.factureNumber.toString(),
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(
                                auth,
                                [0, 1, 2, 3, 4, 5, 6, 9, 14]
                              ) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(item.details, searchTerm)}
                                </td>
                              )}
                              {CheckPermissions(
                                auth,
                                [0, 1, 2, 3, 4, 5, 6, 9, 14]
                              ) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.value.toString(),
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 1, 2, 3, 9, 14]) && (
                                <td className="p-1 border border-black">
                                  {item.observation}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 1, 14]) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.documentDelivered,
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 2, 3, 9]) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.numberRetention.toString(),
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(
                                auth,
                                [0, 1, 2, 3, 4, 5, 9, 14]
                              ) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.valueRetention.toString(),
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(
                                auth,
                                [0, 1, 2, 3, 4, 5, 6, 9, 14]
                              ) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.valueNet.toString(),
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 2, 3, 6, 9]) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.observationConta,
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(
                                auth,
                                [0, 1, 2, 3, 4, 6, 9, 14]
                              ) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.beneficiary,
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(
                                auth,
                                [0, 1, 2, 3, 4, 6, 9, 14]
                              ) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.identificationCard,
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 1, 2, 4, 9, 14]) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(item.bank, searchTerm)}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 1, 2, 9, 14]) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.accountBank,
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 1, 9, 14]) && (
                                <td className="p-1 border border-black">
                                  {item.accountType}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 1, 9, 14]) && (
                                <td className="p-1 border border-black">
                                  {item.typeCard}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 1, 9, 14]) && (
                                <td className="p-1 border border-black">
                                  {item.typePayments}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 2, 4, 5, 9]) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.numberCheck,
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 9]) && (
                                <td className="p-1 border border-black">
                                  {item.bankCheck}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 2, 3, 4, 6, 9]) && (
                                <td className="p-1 border border-black">
                                  {item.discount}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 2, 3, 4, 6, 9]) && (
                                <td className="p-1 border border-black">
                                  {item.increase}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 2, 4, 6, 9]) && (
                                <td className="p-1 border border-black">
                                  {item.observationTreasury}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 2, 6, 9]) && (
                                <td className="p-1 border border-black">
                                  <FinanField finan={item.payments} />
                                </td>
                              )}
                              {CheckPermissions(
                                auth,
                                [0, 1, 2, 3, 4, 6, 9, 14]
                              ) && (
                                <td className="p-1 border border-black">
                                  {item.accreditedPayment}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 2, 3, 4, 6, 9]) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.debitNote,
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 2, 3, 4, 6, 9]) && (
                                <td className="p-1 border border-black">
                                  {item.difference.toLocaleString("en-US")}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </>
                    </tbody>
                  </table>
                </div>
                <nav className="mt-2">
                  <ul className="flex justify-center">
                    {pageNumbers.map((pageNumber) => (
                      <li
                        key={pageNumber}
                        className={`${
                          currentPage === pageNumber
                            ? "bg-slate-700 text-white text-xs rounded-full"
                            : ""
                        }`}
                      >
                        <a
                          href="#"
                          className="block px-3 py-2 text-white text-xs hover:bg-slate-500 hover:text-white rounded-full"
                          onClick={(e) => handlePageClick(e, pageNumber)}
                        >
                          {pageNumber}
                        </a>
                      </li>
                    ))}
                    <p className="mx-2 text-xs">
                      Página {currentPage} de {totalPages} ({items.length}{" "}
                      Facturas)
                    </p>
                  </ul>
                </nav>

                <div className="mx-16 my-3 py-2 px-8 text-left border rounded-lg bg-slate-100">
                  <p className="mt-1">
                    <strong>Valor Total a Pagar: $ </strong>
                    <em className=" items-right text-right"
                      style={{                       
                        fontStyle: "normal",
                        fontSize: "16px",
                        fontFamily: "Lato",  
                        fontWeight: "bold",                      
                      }}
                      >
                          {items
                            .reduce(
                              (partialSum, facture) => partialSum + facture.valueNet,
                              0
                            )
                            .toLocaleString()}
                    </em>
                  </p> 
                  <p className="mt-1">
                    <strong>Pago Acreditado : $ </strong>
                    <em className=" items-right text-right"
                      style={{                       
                        fontStyle: "normal",
                        fontSize: "16px",
                        fontFamily: "Lato",  
                        fontWeight: "bold",                      
                      }}
                      >
                    {items
                      .reduce(
                        (partialSum, facture) =>
                          partialSum + facture.accreditedPayment,
                        0
                      )
                      .toLocaleString()}
                    </em>  
                  </p>
                  <p className="mt-1 text-red-500">
                    <strong>Valor de Diferencia: $ </strong>
                     <em className=" items-right text-right"
                      style={{                       
                        fontStyle: "normal",
                        fontSize: "16px",
                        fontFamily: "Lato",  
                        fontWeight: "bold",                      
                      }}
                      >
                      {items
                        .reduce(
                          (partialSum, facture) =>
                            partialSum + facture.difference,
                          0
                        )
                        .toLocaleString()}
                    </em>
                  </p>
                </div>
                <div
                  style={{
                    border: "1px solid black",
                    marginTop: "1%",
                    backgroundColor: "#F8F9F9",                    
                    marginBottom: "1%",
                    borderRadius: "10px",
                  }}
                >
                  {/* <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
                    Caja de Comentarios
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
              CAJA DE {" "} 
              </em>  
              <em
                style={{
                  color: "#94a3b8",
                  fontStyle: "normal",
                  fontSize: "24px",
                  fontFamily: "Lato"
                }}
              >
              COMENTARIOS
              </em>              
            </p>
                  <div className="m-3">
                    <button
                      className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                      onClick={() => setCommentModalVisible(true)}
                    >
                      Agregar Comentario
                    </button>
                  </div>
                  <div className="m-3">
                    <TreeTable
                      keyExpr="id"
                      dataSource={itemsComment}
                      columns={columnsComent}
                      buttons={buttonsComment}
                      searchPanel={false}
                      colors={{
                        headerBackground: "#bae6fd",
                        headerColor: "black",
                        contentBackground: "#f1f5f9",
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
                        className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                        onClick={() => formik.handleSubmit()}
                      >
                        Guardar Comentario
                      </button>
                    </div>
                    <div>
                      <button
                        className="text-center bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
                        onClick={() => Router.back()}
                      >
                        Volver
                      </button>
                    </div>
                  </div>
                </div>
                {CheckPermissions(auth, [0, 9]) && (
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

                    <button
                      type="submit"
                      className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                    >
                      Enviar notificación
                    </button>
                  </form>
                )}
                {CheckPermissions(auth, [0, 2]) && (
                  <form onSubmit={handleSubmit(onClickCo)} method="POST">
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

                    <button
                      type="submit"
                      className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                    >
                      Enviar notificación
                    </button>
                  </form>
                )}
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

                    <button
                      type="submit"
                      className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                    >
                      Enviar notificación
                    </button>
                  </form>
                )}
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

                    <button
                      type="submit"
                      className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
                    >
                      Enviar notificación
                    </button>
                  </form>
                )}
              </div>

              <FactureModal
                visible={modalVisible}
                close={hideModal}
                initialData={editingFacture}
                onDone={(newItem: Facture) => {
                  if (editingFacture === null) {
                    setItems((oldData) => [
                      ...oldData,
                      { ...newItem, id: `${oldData.length + 1}` },
                    ]);
                  } else {
                    setItems((oldData) =>
                      oldData.map((element: Facture) =>
                        element.id === newItem.id ? newItem : element
                      )
                    );
                    setEditingFacture(null);
                  }
                }}
              />

              <StatusSolicitude
                visible={statusModal}
                close={() => setStatusModal(!statusModal)}
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
                      (item: Facture) => item.id !== itemToDelete
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
      </div>
    </>
  );
};

export default EditFacture;
