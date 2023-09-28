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
import SoliciterPanel from "../../../lib/layouts/edit_advance/soliciter";
import TreasuryPanel from "../../../lib/layouts/edit_advance/treasury";
import FinancialPanel from "../../../lib/layouts/edit_advance/financial";
import PaymentPanel from "../../../lib/layouts/edit_advance/payment";
import ContabAdvancePanel from "../../../lib/layouts/edit_advance/contableAdvance";
import {
  Abierto,
  Aprobado,
  Cerrado,
  Pendiente,
} from "../../../lib/utils/constants";
import { FinanField } from "../../../lib/styles/views/financialStyled";
import FormatedDate from "../../../lib/utils/formated_date";
import ComentModal from "../../../lib/components/modals/coment";
import FactureAdvanceCalderonModal from "../../../lib/components/modals/factureAdvanceCalderon";
import { useForm } from "react-hook-form";
import StatusAdvanceC from "../status/[id]";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
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

  const onClickSo = (data: any) => {
    fetch("/api/mailCalderon/mailAdvaSoli", {
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
    fetch("/api/mailCalderon/mailAdvaTeso", {
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
    fetch("/api/mailCalderon/mailAdvaFinan", {
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
    fetch("/api/mailCalderon/mailAdvaTesor", {
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

  const showStatusModal = () => setStatusModal(true);

  const printAdvanceCalderon = () => {
    if (Router.asPath !== Router.route) {
      const advanceCalderonId = Router.query.id as string;
      Router.push({ pathname: "/advanceCalderon/print/" + advanceCalderonId });
    } else {
      setTimeout(printAdvanceCalderon, 1000);
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
    edit: (rowData: FactureAdvanceCalderon) => {
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
        CheckFinished(auth, [2], formik.values?.contableAdvanceState, Cerrado)
      )
        return;
      setEditingFactureAdvance(rowData);
      showModal();
    },
    delete: (rowData: FactureAdvanceCalderon) => {
      if (CheckPermissions(auth, [0, 9])) {
        showConfirmModal(rowData.id);
      }
    },

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
  };

  const tabPanels: Array<TabPanel> = [
    {
      name: "Solicitantes",
      content: (
        <SoliciterPanel sm={12} md={12} lg={6} xl={6} formik={formik} inTabs />
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

  //Filtro de busqueda de la tabla
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const newFilteredItems = items.filter((item) => {
      return (
        item.project.name.toLowerCase().includes(searchTerm) ||
        item.centerCostCalderon.name.toLowerCase().includes(searchTerm) ||
        item.providerCalderon.name.toLowerCase().includes(searchTerm) ||
        item.providerCalderon.emailCalderon
          .toLowerCase()
          .includes(searchTerm) ||
        item.factureDate.toLowerCase().includes(searchTerm) ||
        item.factureNumber.toString().includes(searchTerm) ||
        item.details.toLowerCase().includes(searchTerm) ||
        item.observation.toLowerCase().includes(searchTerm) ||
        item.documentDelivered.toLowerCase().includes(searchTerm) ||
        item.numberRetention.toString().includes(searchTerm) ||
        item.valueRetention.toString().includes(searchTerm) ||
        item.valueNet.toString().includes(searchTerm) ||
        item.closingSeat.toLowerCase().includes(searchTerm) ||
        item.beneficiary.toLowerCase().includes(searchTerm) ||
        item.identificationCard.toLowerCase().includes(searchTerm) ||
        item.bank.toLowerCase().includes(searchTerm) ||
        item.accountBank.toLowerCase().includes(searchTerm) ||
        item.numberCheck.toLowerCase().includes(searchTerm) ||
        item.debitNote.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredItems(newFilteredItems);
  }, [searchTerm, items]);

  currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  //ordena la tabla por el nombre del proyecto
  const sortItemsByName = () => {
    currentItems.sort((a, b) => a.project.name.localeCompare(b.project.name));
  };

  return (
    <>
      <title>Calderon | Editar Anticipo</title>
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
          <div className="w-11/12 bg-white my-14">
            <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
              Editar Anticipo
            </h3>
            <LoadingContainer visible={loading} miniVersion>
              <div className="grid grid-cols-1 md:grid-cols-3 m-4 gap-4 mb-4">
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Orden de Pago #{formik.values?.number ?? 0}
                  </label>
                </div>
                <div>
                  {CheckPermissions(auth, [9]) ? (
                    <SoliciterPanel lg={6} md={6} formik={formik} />
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
                </div>
                <div>
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

                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Fecha
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    value={formik.values?.date}
                    disabled
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Detalle General
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Detalle"
                    value={formik.values?.details ?? ""}
                    name="details"
                    onChange={formik.handleChange}
                    disabled={!CheckPermissions(auth, [0, 1, 14])}
                  />
                </div>
                <div>
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
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
                    disabled={CheckPermissions(auth, [2, 3, 4, 5, 6, 7])}
                  >
                    Agregar
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
                            onClick={printAdvanceCalderon}
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
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          onClick={showStatusModal}
                        >
                          ESTADO DE SOLICITUD
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    onClick={() => formik.handleSubmit()}
                  >
                    Actualizar
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
                {CheckPermissions(auth, [0]) ? (
                  <TabContainer tabPanels={tabPanels} />
                ) : null}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
                <div className="flex justify-center items-center">
                  <div className="w-full sm:w-auto bg-white rounded-lg shadow p-2 flex items-center">
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
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleChange}
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
                          <th>Pago</th>
                        )}
                        {CheckPermissions(auth, [0, 1, 2, 3, 4, 6, 9, 14]) && (
                          <th>Pago Acreditado</th>
                        )}
                        {CheckPermissions(auth, [0, 2, 3, 4, 6, 9]) && (
                          <th>Diferencia</th>
                        )}
                        {CheckPermissions(auth, [0, 2, 3, 4, 6, 9]) && (
                          <th>Nota debito</th>
                        )}
                        {CheckPermissions(auth, [0, 1, 2, 4, 5, 9, 14]) && (
                          <th>Fecha factura</th>
                        )}
                        {CheckPermissions(
                          auth,
                          [0, 1, 2, 3, 4, 5, 6, 9, 14]
                        ) && <th>Numero Factura</th>}
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
                          <th>Asiento Cierre</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        {sortItemsByName()}
                        {currentItems.map((item, index) => {
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
                                    item.centerCostCalderon.name,
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
                                    item.providerCalderon.name,
                                    searchTerm
                                  )}
                                </td>
                              )}
                              {CheckPermissions(auth, [0, 1, 2, 9, 14]) && (
                                <td className="p-1 border border-black">
                                  {getHighlightedText(
                                    item.providerCalderon.emailCalderon,
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
                                  {item.difference.toLocaleString("en-US")}
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
                                    item.closingSeat,
                                    searchTerm
                                  )}
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
                        className={`page-item ${
                          currentPage === pageNumber
                            ? "bg-blue-500 text-white"
                            : ""
                        }`}
                      >
                        <a
                          href="#"
                          className="block px-3 py-2 text-white hover:bg-blue-500 hover:text-white"
                          onClick={(e) => handlePageClick(e, pageNumber)}
                        >
                          {pageNumber}
                        </a>
                      </li>
                    ))}
                    <p className="mx-2">
                      Página {currentPage} de {totalPages} ({items.length}{" "}
                      Facturas)
                    </p>
                  </ul>
                </nav>
                <div className="w-full mt-3 p-1">
                  <p style={{ marginTop: "10px" }}>
                    <strong> Valor Total a Pagar: $</strong>
                    {items
                      .reduce(
                        (partialSum, factureAdvance) =>
                          partialSum + factureAdvance.valueNet,
                        0
                      )
                      .toLocaleString()}
                  </p>
                  <p>
                    <strong>Pago acreditado: $</strong>
                    {items
                      .reduce(
                        (partialSum, factureAdvance) =>
                          partialSum + factureAdvance.accreditedPayment,
                        0
                      )
                      .toLocaleString()}
                  </p>
                  <p className="text-red-500">
                    <strong>Diferencia: $</strong>
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
                    <button
                      type="submit"
                      className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    >
                      Enviar notificacion
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
                      className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    >
                      Enviar notificacion
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
                      className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    >
                      Enviar notificacion
                    </button>
                  </form>
                )}

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
                    <button
                      type="submit"
                      className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    >
                      Enviar notificacion
                    </button>
                  </form>
                )}
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

              <StatusAdvanceC
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
