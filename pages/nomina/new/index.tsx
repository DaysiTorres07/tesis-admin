import { useFormik } from "formik";
import Router from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../lib/hooks/use_auth";
import RoleLayout from "../../../lib/layouts/role_layout";
import { Nomina, ResponseData } from "../../../lib/types";
import { Elaborando } from "../../../lib/utils/constants";
import FormatedDate from "../../../lib/utils/formated_date";
import HttpClient from "../../../lib/utils/http_client";
import LoadingContainer from "../../../lib/components/loading_container";
import Sidebar from "../../../lib/components/sidebar";

const NewNomina = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValues, _setInitialValues] = useState<Nomina>({
    number: 0,
    soliciter: auth?.userName,
    date: FormatedDate(),
    details: "",
    soliciterState: "",
    state: Elaborando,
    items: [],
    month: "",
  });

  const formik = useFormik<Nomina>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Nomina) => {
      if (formData.details.trim() === "") {
        toast.warning("El campo detalle no puede estar vacío");
        return;
      }
      setLoading(true);
      const response: ResponseData = await HttpClient(
        "/api/nomina",
        "POST",
        auth.userName,
        auth.role,
        { ...formData }
      );
      if (response.success) {
        toast.success("Nomina creada correctamente!");
      } else {
        toast.warning(response.message);
      }
      setLoading(false);
      Router.back();
    },
  });

  return (
    <RoleLayout permissions={[0, 9]}>
      <title>Crear Nomina</title>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 flex items-center justify-center">
          <div className="w-11/12 bg-white my-14">
            <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
              Nueva Nomina
            </h3>

            <LoadingContainer visible={loading} miniVersion>
              <div className="grid grid-cols-1 md:grid-cols-4 m-4 gap-4 text-center">
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
                    Fecha
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
                    Mes
                  </label>
                  <select
                    className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={formik.values.month}
                    name="month"
                    onChange={formik.handleChange}
                  >
                    <option>Seleccione el mes de la Nomina</option>
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
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Detalle General
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Detalle"
                    value={formik.values.details}
                    name="details"
                    onChange={formik.handleChange}
                  />
                </div>
                <div>
                  <button
                    className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    onClick={() => formik.handleSubmit()}
                  >
                    Guardar Nomina
                  </button>
                </div>
              </div>
            </LoadingContainer>
          </div>
        </div>
      </div>
    </RoleLayout>
  );
};
export default NewNomina;
