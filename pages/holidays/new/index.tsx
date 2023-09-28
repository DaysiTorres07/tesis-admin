import React, { useEffect, useState } from "react";
import { Holidays, ResponseData } from "../../../lib/types";
import { useAuth } from "../../../lib/hooks/use_auth";
import FormatedDate from "../../../lib/utils/formated_date";
import { useFormik } from "formik";
import Router from "next/router";
import HttpClient from "../../../lib/utils/http_client";
import { toast } from "react-toastify";
import LoadingContainer from "../../../lib/components/loading_container";
import RoleLayout from "../../../lib/layouts/role_layout";
import { Pendiente } from "../../../lib/utils/constants";
import { useForm } from "react-hook-form";
import Sidebar from "../../../lib/components/sidebar";
import { FaArrowLeft, FaSave, FaUmbrellaBeach } from "react-icons/fa";

// Inicio de la app
const NewVacation = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValues, _setInitialValues] = useState<Holidays>({
    number: 0,
    soliciter: auth?.name,
    deparmentSoliciter: auth?.department,
    soliciterId: auth?.id,
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
  const formik = useFormik<Holidays>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Holidays) => {
      if (formData.typePermissions.trim() === "") {
        toast.error("Ingrese un tipo de Vacaciones");
        return;
      }
      if (formData.details.trim() === "") {
        toast.error("Ingrese el detalle sus Vacaciones");
        return;
      }
      setLoading(true);
      const response: ResponseData = await HttpClient(
        "/api/holidays",
        "POST",
        auth.userName,
        auth.role,
        { ...formData }
      );
      if (response.success) {
        toast.success("Vacaciones creada correctamente!");
        await fetch("/api/mail/mailVac", {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
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
      } else {
        toast.warning(response.message);
      }
      setLoading(false);
      Router.back();
    },
  });

  const onClickMail = (data: Holidays) => {
    fetch("/api/mail/mailVac", {
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

  useEffect(
    () => {
      if (
        formik.values?.dateS.length !== 0 &&
        formik.values?.dateE.length !== 0
      ) {
        let date1: Date = new Date(formik.values?.dateS);
        let date2: Date = new Date(formik.values?.dateE);
        let timeInMilisec: number = date2.getTime() - date1.getTime();
        let day: number = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24) + 1);
        let hour: number = day * 24;
        formik.setFieldValue("requestedDays", day);
        formik.setFieldValue("requestedHour", hour);
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [formik.values?.dateE, formik.values?.dateS]
  );

  return (
    <>
      <title>Crear Solicitud de Vacaciones</title>
      <div className="md:flex md:h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>

        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <h3 className="flex items-center justify-center my-4 mb-4 md:text-xl font-bold leading-none tracking-tight text-red-500 dark:text-white">
              <span>CREA TU SOLICITUD DE VACACIONES</span>
              <FaUmbrellaBeach size={48} style={{ marginLeft: "0.9rem" }} />
            </h3>
            <div className=" border-2 border-black bg-gray-200 p-6 w-11/12 mx-auto">
              <h3 className="text-center" style={{ color: "#636c68" }}>
                Te recordamos tus días de Vacaciones:
                <strong>
                  <span className="text-3xl">{` ${auth?.holidays}`}</span>
                </strong>
              </h3>
            </div>
            <LoadingContainer visible={loading} miniVersion>
              <div className="bg-white w-4/5 mx-auto mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 m-4 gap-4 md:w-3/4 md:mx-auto">
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
                      Fecha de Salida (Desde)
                    </label>
                    <input
                      className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                      type="date"
                      id="dateS"
                      value={formik.values.dateS ?? ""}
                      name="dateS"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Fecha de Entrada (Hasta)
                    </label>
                    <input
                      className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                      type="date"
                      id="dateE"
                      value={formik.values.dateE ?? ""}
                      name="dateE"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Detalle
                    </label>
                    <textarea
                      className="appearance-none border-2 border-gray-200 rounded w-full h-10 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                      placeholder="Escriba aquí el detalle de su solicitud..."
                      value={formik.values.details ?? ""}
                      name="details"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Tipos de Vacaciones
                    </label>
                    <select
                      className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="typePermissions"
                      value={formik.values?.typePermissions}
                      onChange={formik.handleChange}
                    >
                      <option>Seleccione un tipo de Vacación</option>
                      <option value="Vacaciones Anticipadas">
                        Vacaciones Anticipadas
                      </option>
                      <option value="Vacaciones Anuales">
                        Vacaciones Anuales
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Días Solicitados
                    </label>
                    <input
                      className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                      type="number"
                      id="requestedDays"
                      value={formik.values?.requestedDays ?? 0}
                      name="requestedDays"
                      onChange={formik.handleChange}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Horas Solicitados
                    </label>
                    <input
                      className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                      type="number"
                      value={formik.values.requestedHour ?? 0}
                      name="requestedHour"
                      onChange={formik.handleChange}
                      disabled
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
              </div>
            </LoadingContainer>
          </div>
        </div>
      </div>
    </>
  );
};
export default NewVacation;
