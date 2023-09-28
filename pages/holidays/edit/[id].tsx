import React, { useEffect, useState } from "react";
import { Holidays, ResponseData, User } from "../../../lib/types";
import { useFormik } from "formik";
import HttpClient from "../../../lib/utils/http_client";
import { toast } from "react-toastify";
import Router from "next/router";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import { Aprobado, Pendiente } from "../../../lib/utils/constants";
import FormatedDate from "../../../lib/utils/formated_date";
import Sidebar from "../../../lib/components/sidebar";
import HolidaysPanel from "../../../lib/layouts/edit_holidays/holidays";

// Inicio de la app
const EditHolidays = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
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

  const loadUsers = async () => {
    setLoading(true);

    const response = await HttpClient(
      "/api/user",
      "GET",
      auth.userName,
      auth.role
    );

    if (response.success) {
      setUsers(response.data);
    } else {
      toast.warning(response.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUserVacationDays = async (id: string, requestedDays: number) => {
    try {
      // Obtener los datos del usuario
      const response: ResponseData = await HttpClient(
        `/api/user/${id}`,
        "GET",
        auth.userName,
        auth.role
      );
      if (response.success) {
        const user = response.data;
        const remainingDays = user.holidays - requestedDays;
        await HttpClient(`/api/user/${id}`, "PUT", auth.userName, auth.role, {
          holidays: remainingDays,
        });

        toast.success("Días de vacaciones actualizados correctamente");
      } else {
        toast.warning(response.message);
      }
    } catch (error) {
      toast.error("Error al actualizar los días de vacaciones");
    }
  };

  const onSubmit = async (formData: Holidays) => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const solicitudeId = Router.query.id as string;
      const requestData = {
        ...formData,
        id: solicitudeId,
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

        if (formData.state === Aprobado) {
          const { soliciterId, requestedDays } = requestData;
          if (soliciterId && requestedDays) {
            await updateUserVacationDays(soliciterId, requestedDays);
          }
        }
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
      <title>Procesar Solicitud de Vacaciones</title>

      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
              Editar Solicitud de Vacaciones
            </h3>
            <LoadingContainer visible={loading} miniVersion>
              <div className="grid grid-cols-2 md:grid-cols-2 m-4 gap-4 mb-4">
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Solicitante
                  </label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    value={formik.values.soliciter ?? ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Fecha de Salida
                  </label>
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
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Fecha de Entrada
                  </label>
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
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Detalle
                  </label>
                  <textarea
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    value={formik.values.details ?? ""}
                    name="details"
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Fecha de Creación
                  </label>
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
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Vacación Escogida
                  </label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    style={{ fontSize: "14px" }}
                    name="typePermissions"
                    value={formik.values?.typePermissions}
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Días Solicitados
                  </label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="number"
                    id="requestedDays"
                    style={{ fontSize: "14px" }}
                    value={formik.values?.requestedDays ?? 0}
                    name="requestedDays"
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
                    type="number"
                    style={{ fontSize: "14px" }}
                    value={formik.values?.requestedHour ?? ""}
                    name="requestedHour"
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 m-4 gap-4 mb-4">
                <HolidaysPanel formik={formik} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 m-4 gap-4 mb-4">
                <button
                  className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                  onClick={() => formik.handleSubmit()}
                >
                  Actualizar
                </button>
              </div>
            </LoadingContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditHolidays;
