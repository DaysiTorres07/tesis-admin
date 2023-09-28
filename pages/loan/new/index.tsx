import { useFormik } from "formik";
import Router from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../lib/hooks/use_auth";
import { Loan, ResponseData } from "../../../lib/types";
import { Pendiente } from "../../../lib/utils/constants";
import FormatedDate from "../../../lib/utils/formated_date";
import HttpClient from "../../../lib/utils/http_client";
import LoadingContainer from "../../../lib/components/loading_container";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaFileInvoiceDollar, FaSave } from "react-icons/fa";
import Sidebar from "../../../lib/components/sidebar";

const NewLoan = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValues, _setInitialValues] = useState<Loan>({
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
    requestedHour: auth?.position,
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
  const formik = useFormik<Loan>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Loan) => {
      if (formData.typePermissions.trim() === "") {
        toast.error(
          "Debe seleccionar el tipo de prestamo que esta solicitando"
        );
        return;
      }
      setLoading(true);
      const response: ResponseData = await HttpClient(
        "/api/loan",
        "POST",
        auth.userName,
        auth.role,
        { ...formData }
      );
      if (response.success) {
        toast.success("Prestamo creado correctamente!");
      } else {
        toast.warning(response.message);
      }

      Router.back();
      fetch("/api/mail/mailPres", {
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
      setLoading(false);
    },
  });

  return (
    <>
      <title>Crear Solicitud de Prestamo</title>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>

        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <h3
              className="mx-2 flex items-center justify-center xl:text-2xl text-base font-bold leading-normal m-10"
              style={{ color: "#DC3545" }}
            >
              <span>CREA TU SOLICITUD DE PRESTAMO / ANTICIPO</span>
              <FaFileInvoiceDollar size={48} style={{ marginLeft: "0.9rem" }} />
            </h3>
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
                      Departamento
                    </label>
                    <input
                      className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                      type="text"
                      value={formik.values.deparmentSoliciter}
                      onChange={formik.handleChange}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Cargo
                    </label>
                    <input
                      className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                      type="text"
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
                      placeholder="Escriba aquí el detalle de su solicitud..."
                      value={formik.values.observation ?? ""}
                      name="observation"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Prestamo
                    </label>
                    <input
                      className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                      type="number"
                      name="requestedDays"
                      value={formik.values?.requestedDays}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div>
                    <label>Tipo de Prestamo</label>
                    <select
                      className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="typePermissions"
                      value={formik.values?.typePermissions}
                      onChange={formik.handleChange}
                    >
                      <option>Seleccione el tipo de su prestamos</option>
                      <option value="PRESTAMO">PRESTAMO</option>
                      <option value="ANTICIPO SUELDO">ANTICIPO SUELDO</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Plazos
                    </label>
                    <select
                      className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="dateS"
                      value={formik.values?.dateS}
                      onChange={formik.handleChange}
                    >
                      <option>Seleccion el plazo a pagar su prestamo</option>
                      <option value="1 mes">1 mes</option>
                      <option value="2 Meses">2 Meses</option>
                      <option value="3 Meses">3 Meses</option>
                      <option value="6 Meses">6 Meses</option>
                      <option value="9 Meses">9 Meses</option>
                      <option value="12 Meses">12 Meses</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Mes de cobro
                    </label>
                    <select
                      className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="dateE"
                      value={formik.values?.dateE}
                      onChange={formik.handleChange}
                    >
                      <option>
                        Seleccion desde que mes se empezara a descontar su
                        prestamo
                      </option>
                      <option value="ENERO">ENERO</option>
                      <option value="FEBRERO">FEBRERO</option>
                      <option value="MARZO">MARZO</option>
                      <option value="ABRIL">ABRIL</option>
                      <option value="MAYO">MAYO</option>
                      <option value="JUNIO">JUNIO</option>
                      <option value="JULIO">JULIO</option>
                      <option value="AGOSTO">AGOSTO</option>
                      <option value="SEPTIEMBRE">SEPTIEMBRE</option>
                      <option value="OCTUBRE">OCTUBRE</option>
                      <option value="NOVIEMBRE">NOVIEMBRE</option>
                      <option value="DICIEMBRE">DICIEMBRE</option>
                    </select>
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
export default NewLoan;
