import { useFormik } from "formik";
import Router from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import { Loan, ResponseData } from "../../../lib/types";
import { Pendiente } from "../../../lib/utils/constants";
import FormatedDate from "../../../lib/utils/formated_date";
import HttpClient from "../../../lib/utils/http_client";
import Sidebar from "../../../lib/components/sidebar";
import HolidaysPanel from "../../../lib/layouts/edit_holidays/holidays";

const EditLoan = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [initialValues, setInitialValues] = useState<Loan>({
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
      const loanId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/loan/" + loanId,
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

  const onSubmit = async (formData: Loan) => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const loanId = Router.query.id as string;
      const requestData = {
        ...formData,
        id: loanId,
      };
      const response: ResponseData = await HttpClient(
        "/api/loan",
        "PUT",
        auth.userName,
        auth.role,
        requestData
      );
      if (response.success) {
        toast.success("Prestamo procesado correctamente");
        await loadData();
      } else {
        toast.warning(response.message);
      }
      setLoading(false);
    } else {
      setTimeout(onSubmit, 1000);
    }
  };

  const formik = useFormik<Loan>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });

  return (
    <>
      <title>Procesar Solicitud de Prestamo</title>

      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
              Editar Solicitud de Prestamos
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
                    value={formik.values.soliciter}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Departamento
                  </label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    value={formik.values.details}
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Cargo
                  </label>
                  <input
                    className="appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
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
                    name="observation"
                    value={formik.values.observation}
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Prestamo
                  </label>
                  <input
                    className="noscroll appearance-none text-xs md:text-base border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="number"
                    name="requestedDays"
                    value={formik.values?.requestedDays}
                    onChange={formik.handleChange}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Tipo de Prestamo
                  </label>
                  <select
                    className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="typePermissions"
                    value={formik.values?.typePermissions}
                    onChange={formik.handleChange}
                    disabled
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
                    disabled
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
                    disabled
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
export default EditLoan;
