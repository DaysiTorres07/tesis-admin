import React, { useEffect, useState } from "react";
import { Holidays, ResponseData } from "../../../lib/types";
import NavBar from "../../../lib/components/navbar";
import { Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import HttpClient from "../../../lib/utils/http_client";
import { toast } from "react-toastify";
import Router from "next/router";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import { Pendiente } from "../../../lib/utils/constants";
import Footer from "../../../lib/components/footer";
import FormatedDate from "../../../lib/utils/formated_date";
import Sidebar from "../../../lib/components/sidebar";

// Inicio de la app
const ViewSolicitude = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [initialValues, setInitialValues] = useState<Holidays>({
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
      const solicitudeId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/holidays/" + solicitudeId,
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

  const onSubmit = async (formData: Holidays) => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const solicitudeId = Router.query.id as string;
      const requestData = {
        ...formData,
        id: solicitudeId,
        soliciterId: auth.id,
      };
      const response: ResponseData = await HttpClient(
        "/api/holidays",
        "PUT",
        auth.userName,
        auth.role,
        requestData
      );
      if (response.success) {
        toast.success("Solicitud procesada correctamente");
        await loadData();
      } else {
        toast.warning(response.message);
      }
      setLoading(false);
    } else {
      setTimeout(onSubmit, 1000);
    }
  };

  const formik = useFormik<Holidays>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });

  return (
    <>
      <title>Historial de Vacacion procesada</title>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
              SOLICITUD DE VACACIONES
            </h3>
            <LoadingContainer visible={loading} miniVersion>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 m-2">
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">Solicitante</label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    value={formik.values.soliciter}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">Fecha de Salida</label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="date"
                    id="dateS"
                    value={formik.values.dateS ?? ""}
                    name="dateS"
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">Fecha de Entrada</label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="date"
                    id="dateE"
                    value={formik.values.dateE}
                    name="dateE"
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">Detalle</label>

                  <textarea
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    value={formik.values.details ?? ""}
                    name="details"
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">Fecha de Creación</label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    value={formik.values.date ?? ""}
                    name="date"
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">Vacación Escogida</label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    name="typePermissions"
                    value={formik.values?.typePermissions}
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">Días Solicitados</label>
                  <input
                    type="number"
                    id="requestedDays"
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    value={formik.values?.requestedDays ?? 0}
                    name="requestedDays"
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">Horas Solicitadas</label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="number"
                    value={formik.values?.requestedHour ?? ""}
                    name="requestedHour"
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 m-4 gap-4 mb-4">
                <div>
                  <button
                    className="m-4 text-center bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                    onClick={() => Router.back()}
                  >
                    Volver
                  </button>
                </div>
              </div>
            </LoadingContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewSolicitude;
