import { useFormik } from "formik";
import Router from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import RoleLayout from "../../../lib/layouts/role_layout";
import { Pendiente } from "../../../lib/utils/constants";
import FormatedDate from "../../../lib/utils/formated_date";
import HttpClient from "../../../lib/utils/http_client";
import { useForm } from "react-hook-form";
import Sidebar from "../../../lib/components/sidebar";
import { Permission, ResponseData, User } from "../../../lib/types";
import { FaArrowLeft, FaSave, FaUserClock } from "react-icons/fa";

const NewPermissions = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [permissionAttempts, setPermissionAttempts] = useState<number>(0);
  const [initialValues, _setInitialValues] = useState<Permission>({
    number: 0,
    soliciter: auth?.name,
    deparmentSoliciter: auth?.department,
    typePermissions: "",
    details: "",
    dateState: FormatedDate(),
    state: Pendiente,
    date: FormatedDate(),
    dateS: "",
    dateE: "",
    requestedDays: 0,
    requestedHour: "",
    startTime: "",
    finalTime: "",
    observation: "",
  });
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm();

  const loadUser = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/user/" + auth.id,
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const users = response.data;
      setUser(users);
      setPermissionAttempts(users.countPermission);
    } else {
      toast.warning(response.message);
    }
    setLoading(false);
  };

  // ejecuta funcion al renderizar la vista
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik<Permission>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Permission) => {
      const isPermisoMedico = formData.typePermissions === "PERMISO MEDICO";
      const isPermisoCalamidad =
        formData.typePermissions === "PERMISO POR CALAMIDAD DOMESTICA";
      const isPermisoOficial = formData.typePermissions === "PERMISO OFICIAL";

      if (
        !isPermisoMedico &&
        !isPermisoCalamidad &&
        !isPermisoOficial &&
        permissionAttempts >= 2
      ) {
        toast.error(
          "Ya ha alcanzado el límite de intentos de permisos para este mes."
        );
        return;
      }

      if (formData.typePermissions.trim() === "") {
        toast.error("Ingrese un tipo de Permiso");
        return;
      }
      const dateSISO: string = new Date(formData.dateS).toISOString();
      const currentDateISO: string = new Date().toISOString();

      const dateSYear: number = parseInt(dateSISO.substr(0, 4), 10);
      const dateSMonth: number = parseInt(dateSISO.substr(5, 2), 10) - 1;
      const dateSDay: number = parseInt(dateSISO.substr(8, 2), 10);

      const currentYear: number = parseInt(currentDateISO.substr(0, 4), 10);
      const currentMonth: number =
        parseInt(currentDateISO.substr(5, 2), 10) - 1;
      const currentDay: number = parseInt(currentDateISO.substr(8, 2), 10);

      if (
        currentYear > dateSYear ||
        (currentYear === dateSYear && currentMonth > dateSMonth) ||
        (currentYear === dateSYear &&
          currentMonth === dateSMonth &&
          currentDay > dateSDay &&
          !isPermisoOficial &&
          formData.typePermissions !== "PERMISO POR CALAMIDAD DOMESTICA")
      ) {
        toast.error("La fecha del permiso ya ha pasado");
        return;
      }

      const startTime = formData.startTime;
      const finalTime = formData.finalTime;

      const isStartTimeOutOfRange =
        startTime < "06:00:00" || startTime > "19:00:00";
      const isFinalTimeOutOfRange =
        finalTime < "06:00:00" || finalTime > "19:00:00";

      const isStartTimeLessThanFinalTime = startTime < finalTime;

      if (
        (!isPermisoOficial && isStartTimeOutOfRange) ||
        isFinalTimeOutOfRange
      ) {
        toast.error(
          "Los tiempos deben estar entre 06:00:00 de la mañana y 19:00:00 de la tarde"
        );
        return;
      }

      if (!isStartTimeLessThanFinalTime) {
        toast.error("La hora de inicio debe ser menor a la hora final");
        return;
      }

      if (formData.details.trim() === "") {
        toast.error("Ingrese un detalle");
        return;
      }

      if (
        !isPermisoOficial &&
        formData.requestedHour >= "4" + ":" + "1" + ":" + "0"
      ) {
        toast.error("No puede superar las 4 horas de permiso");
        return;
      }

      let fechaActual = new Date();
      let diaActual = fechaActual.getDate();
      let dia = formData.dateS.substring(8, 10);

      if (
        parseInt(dia) === diaActual &&
        !isPermisoOficial &&
        formData.typePermissions !== "PERMISO POR CALAMIDAD DOMESTICA"
      ) {
        toast.error(
          "Debe solicitar su permiso con 48H de anticipacion, por favor comuniquese con RRHH o Gerencia"
        );
        return;
      }

      if (
        parseInt(dia) === diaActual + 1 &&
        !isPermisoOficial &&
        formData.typePermissions !== "PERMISO POR CALAMIDAD DOMESTICA"
      ) {
        toast.error(
          "Debe solicitar su permiso con 48H de anticipacion, por favor comuniquese con RRHH o Gerencia"
        );
        return;
      }

      setLoading(true);

      try {
        const response: ResponseData = await HttpClient(
          "/api/permission",
          "POST",
          auth.userName,
          auth.role,
          { ...formData }
        );

        if (response.success) {
          toast.success("Permiso creado correctamente");

          await fetch("/api/mail/mailPer", {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          })
            .then((res) => {
              if (res.status === 200) {
                toast("Se envió correctamente");
              } else {
                toast("Email/Password is invalid.");
              }
            })
            .catch((e) => e);

          const updatedUser: User = {
            ...user!,
            countPermission: permissionAttempts + 1,
          };

          const res = await HttpClient(
            "/api/user",
            "PUT",
            auth.userName,
            auth.role,
            updatedUser
          );
          if (res.success) {
            toast.success("Se agrego un numero de permisos a su cuenta");
          } else {
            toast.warning(res.message);
          }

          setPermissionAttempts(permissionAttempts + 1);

          reset();
          setShowModal(true);
        } else {
          toast.warning(response.message);
        }
      } catch (error) {
        console.error("Error al procesar la solicitud de permiso:", error);
        toast.error("Ocurrió un error al procesar la solicitud de permiso.");
      }

      setLoading(false);
    },
  });

  const onClickMail = (data: Permission) => {
    fetch("/api/mail/mailPer", {
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
      .catch((e) => e);
    reset();
  };

  useEffect(() => {
    const getSeconds = (s: string) =>
      s.split(":").reduce((acc, curr) => acc * 60 + +curr, 0);
    let starTime = getSeconds(formik.values.startTime);
    let finaTime = getSeconds(formik.values.finalTime);
    let diff = Math.abs(starTime - finaTime);
    let hour = Math.floor(diff / 3600);
    let minute = Math.floor((diff % 3600) / 60);
    let second = diff % 60;
    let meridian: string;
    let meridiann: string;
    if (formik.values.startTime > "11:59:59") {
      meridian = "PM";
    } else {
      meridian = "AM";
    }
    if (formik.values.finalTime > "11:59:59") {
      meridiann = "PM";
    } else {
      meridiann = "AM";
    }
    let result = hour + ":" + minute + ":" + second;
    formik.setFieldValue("requestedHour", result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values?.startTime,
    formik.values?.finalTime,
    formik.values?.requestedHour,
  ]);

  const closeModal = () => {
    Router.push({ pathname: "/" });
  };

  return (
    <>
      <title>Crear Solicitud de Permiso</title>
      <div className="md:flex md:h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <h3
              className="mx-2 flex items-center justify-center xl:text-2xl text-base font-bold leading-normal m-10"
              style={{ color: "#DC3545" }}
            >
              <span>CREA TU SOLICITUD DE PERMISO</span>
              <FaUserClock size={48} style={{ marginLeft: "0.9rem" }} />
            </h3>
            <LoadingContainer visible={loading} miniVersion>
              <div className="grid md:grid-cols-2 gap-2 m-2 md:w-5/6 md:mx-auto">
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Solicitante
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="text"
                    name="soliciter"
                    id="soliciter"
                    value={formik.values.soliciter}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Fecha de Permiso
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="date"
                    value={formik.values.dateS ?? ""}
                    name="dateS"
                    id="dateS"
                    onChange={formik.handleChange}
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Hora inicial del permiso
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="time"
                    name="startTime"
                    step="2"
                    id="startTime"
                    value={formik.values.startTime}
                    onChange={formik.handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Hora Final del permiso
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="time"
                    step="2"
                    name="finalTime"
                    id="finalTime"
                    value={formik.values.finalTime}
                    onChange={formik.handleChange}
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Fecha de Creación
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="text"
                    value={formik.values.date ?? ""}
                    name="date"
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Tipos de Permisos
                  </label>
                  <select
                    className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="typePermissions"
                    value={formik.values?.typePermissions}
                    onChange={formik.handleChange}
                  >
                    <option>Seleccione un tipo de Permiso</option>
                    <option value="PERMISO MEDICO">PERMISO MEDICO</option>
                    <option value="PERMISO SIN SUELDO">
                      PERMISO SIN SUELDO
                    </option>
                    <option value="PERMISO A SER RECUPERADO">
                      PERMISO A SER RECUPERADO
                    </option>
                    <option value="TRAMITES LEGALES">TRAMITES LEGALES</option>
                    <option value="PERMISO CARGO A VACACIONES">
                      PERMISO CARGO A VACACIONES
                    </option>
                    <option value="ASUNTOS PERSONALES">
                      ASUNTOS PERSONALES
                    </option>
                    <option value="PERMISO POR CALAMIDAD DOMESTICA">
                      PERMISO POR CALAMIDAD DOMESTICA
                    </option>
                    <option value="PERMISO POR MATRIMONIO">
                      PERMISO POR MATRIMONIO
                    </option>
                    <option value="PERMISO DEL DIA">PERMISO DEL DIA</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Horas Solicitadas
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="text"
                    value={formik.values?.requestedHour ?? ""}
                    name="requestedHour"
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Detalle
                  </label>
                  <br />
                  <textarea
                    className="float-left w-full border border-black"
                    placeholder="Escriba aquí el detalle de su solicitud..."
                    value={formik.values.details ?? ""}
                    name="details"
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 m-4 gap-4 w-8/12 mx-auto">
                <div>
                  <button
                    className="my-3 ms-4 flex items-center text-center whitespace-nowrap bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    onClick={() => formik.handleSubmit()}
                  >
                    <FaSave className="mr-2" />
                    Guardar Solicitud
                  </button>
                </div>
                <div>
                  <button
                    className="flex my-3 ms-4 items-center text-center bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                    onClick={() => Router.back()}
                  >
                    <FaArrowLeft className="mr-2" />
                    Volver
                  </button>
                </div>
              </div>
            </LoadingContainer>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded shadow-lg z-10 w-1/3 h-4/12 overflow-y-auto relative">
            <h1 className="text-center font-extrabold text-xl">
              DETALLE DE PERMISO CREADO
            </h1>
            <div>
              <p className="mt-5">
                <strong>Tipo de Permiso:</strong>{" "}
                {formik.values.typePermissions}
              </p>
              <p className="mt-5">
                <strong>Fecha de Permiso:</strong> {formik.values.dateS}
              </p>
              <p className="mt-5">
                <strong>Hora inicial:</strong> {formik.values.startTime}
              </p>
              <p className="mt-5">
                <strong>Hora final:</strong> {formik.values.finalTime}
              </p>
              <p className="text-center mt-5">
                <strong>
                  Recuerde: Si su permiso, es un permiso medico por favor
                  registrar su certificado en el IESS, caso contrario no será
                  validado
                </strong>
              </p>
            </div>
            <button
              className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
              onClick={closeModal}
            >
              Salir
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default NewPermissions;
