import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/hooks/use_auth";
import { Pendiente } from "../../../lib/utils/constants";
import FormatedDate from "../../../lib/utils/formated_date";
import { Permission, ResponseData } from "../../../lib/types";
import Router from "next/router";
import HttpClient from "../../../lib/utils/http_client";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import NavBar from "../../../lib/components/navbar";
import { Row, Form, Button } from "react-bootstrap";
import LoadingContainer from "../../../lib/components/loading_container";
import SoliciterPanel from "../../../lib/layouts/edit_solicitude/soliciter";
import Footer from "../../../lib/components/footer";
import styles from "../../../styles/Home.module.css";
import Sidebar from "../../../lib/components/sidebar";
import HolidaysPanel from "../../../lib/layouts/edit_holidays/holidays";

const EditPermission = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [initialValues, setInitialValues] = useState<Permission>({
    number: 0,
    soliciter: auth?.userName,
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

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const permissionId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/permission/" + permissionId,
        "GET",
        auth.userName,
        auth.role
      );
      setInitialValues(response.data);
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (formData: Permission) => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const permissionId = Router.query.id as string;
      const requestData = {
        ...formData,
        id: permissionId,
      };
      const response: ResponseData = await HttpClient(
        "/api/permission",
        "PUT",
        auth.userName,
        auth.role,
        requestData
      );
      if (response.success) {
        toast.success("Permiso procesado correctamente");
        await loadData();
      } else {
        toast.warning(response.message);
      }
      setLoading(false);
    } else {
      setTimeout(onSubmit, 1000);
    }
  };

  const formik = useFormik<Permission>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });

  return (
    <>
      <title>Procesar Solicitud de Permiso</title>

      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
              Editar Solicitud de Permisos
            </h3>
            <LoadingContainer visible={loading} miniVersion>
              <div className="grid grid-cols-1 md:grid-cols-2 m-4 gap-4 mb-4">
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Solicitante
                  </label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    name="soliciter"
                    value={formik.values?.soliciter}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Fecha de Permiso
                  </label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="date"
                    name="dateS"
                    value={formik.values.dateS}
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Hora inicial del permiso
                  </label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="time"
                    name="startTime"
                    id="startTime"
                    value={formik.values.startTime}
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Hora final del permiso
                  </label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="time"
                    name="finalTime"
                    id="fianlTime"
                    value={formik.values.finalTime}
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Fechas de Creación
                  </label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    name="date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Permiso Escogido
                  </label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    name="typePermissions"
                    value={formik.values.typePermissions}
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Horas Solicitadas
                  </label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    name="requestedHour"
                    value={formik.values.requestedHour}
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
                    name="details"
                    value={formik.values.details}
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Observacion de Recursos Humanos
                  </label>
                  <br />
                  <textarea
                    style={{
                      fontSize: "14px",
                      width: "100%",
                      height: "auto",
                      border: "1px solid black",
                    }}
                    value={formik.values.observation ?? ""}
                    name="observation"
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 m-4 gap-4 mb-4 md:w-1/6">
                <HolidaysPanel formik={formik} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 m-4 gap-4 mb-4">
                <button
                  className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                  onClick={() => formik.handleSubmit()}
                >
                  Actualizar
                </button>
                <button
                  className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                  onClick={() => Router.back()}
                >
                  Volver
                </button>
              </div>
            </LoadingContainer>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditPermission;
