import { useFormik } from "formik";
import Router from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../lib/hooks/use_auth";
import RoleLayout from "../../../lib/layouts/role_layout";
import { FactureEmployees, Nomina, ResponseData } from "../../../lib/types";
import { Aprobado, Elaborando } from "../../../lib/utils/constants";
import FormatedDate from "../../../lib/utils/formated_date";
import HttpClient from "../../../lib/utils/http_client";
import LoadingContainer from "../../../lib/components/loading_container";
import Papa from "papaparse";
import { CheckPermissions } from "../../../lib/utils/check_permissions";
import Sidebar from "../../../lib/components/sidebar";

const EditNomina = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Array<FactureEmployees>>([]);
  const [values, setValues] = useState<Map<string, number>>(new Map());
  const [initialValues, setInitialValues] = useState<Nomina>({
    number: 0,
    soliciter: auth?.userName,
    date: FormatedDate(),
    details: "",
    soliciterState: "",
    state: Elaborando,
    items: [],
    month: "",
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      let valueNomina = 0;
      setLoading(true);
      const nominaId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/nomina/" + nominaId,
        "GET",
        auth.userName,
        auth.role
      );
      setInitialValues(response.data);
      setItems(response.data?.items ?? []);
      (response.data?.items ?? []).forEach((nomina: FactureEmployees) => {
        const valueWithComma = nomina.value.replace(",", ".");
        valueNomina += parseFloat(nomina.value);
      });
      setLoading(false);

      setValues(new Map([["valueNomina", valueNomina]]));
    } else {
      setTimeout(loadData, 1000);
    }
  };

  const onSubmit = async (formData: Nomina) => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const nominaId = Router.query.id as string;
      const requestData = {
        ...formData,
        id: nominaId,
      };
      const response: ResponseData = await HttpClient(
        "/api/nomina",
        "PUT",
        auth.userName,
        auth.role,
        requestData
      );
      if (response.success) {
        toast.success("Nomina editada correctamente!");
        await loadData();
      } else {
        toast.warning(response.message);
      }
      setLoading(false);
    } else {
      setTimeout(onSubmit, 1000);
    }
  };

  const formik = useFormik<Nomina>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const bytes = new Uint8Array(reader.result as ArrayBuffer);
      const encoding = "ISO-8859-1";
      const text = new TextDecoder(encoding).decode(bytes);
      const result = Papa.parse(text, { header: true, delimiter: "\t" });
      const employees = result.data.map((row) => ({
        beneficiary: row["beneficiary"],
        position: row["position"],
        department: row["department"],
        bank: row["bank"],
        identificationCard: row["identificationCard"],
        accountBank: row["accountBank"],
        accountType: row["accountType"],
        typeCard: row["typeCard"],
        codBank: row["codBank"],
        value: row["value"],
        typeProv: row["typeProv"],
      })) as unknown as Array<FactureEmployees>;

      setItems(employees);

      formik.setValues({
        ...formik.values,
        items: employees,
      });
    };

    reader.readAsArrayBuffer(file);
  };

  const txtPichinca = () => {
    if (Router.asPath !== Router.route) {
      const nominaId = Router.query.id as string;
      Router.push({ pathname: "/nomina/txtPichincha/" + nominaId });
    } else {
      setTimeout(txtPichinca, 1000);
    }
  };

  const txtBGR = () => {
    if (Router.asPath !== Router.route) {
      const nominaId = Router.query.id as string;
      Router.push({ pathname: "/nomina/txtBGR/" + nominaId });
    } else {
      setTimeout(txtBGR, 1000);
    }
  };

  const totalValue = (items ?? []).reduce((acc, cur) => {
    return acc + (parseFloat(cur.value) ?? 0);
  }, 0);

  return (
    <RoleLayout permissions={[0, 3, 4, 5, 9]}>
      <>
        <title>Editar Nomina</title>
        <div className="flex h-full">
          <div className="md:w-1/6 max-w-none">
            <Sidebar />
          </div>
          <div className="w-12/12 md:w-5/6 flex items-center justify-center">
            <div className="w-11/12 bg-white my-14">
              <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
                Editar Nomina
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
                      value={formik.values?.soliciter}
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
                      value={formik.values?.date}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Mes
                    </label>
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      value={formik.values?.month}
                      name="month"
                      onChange={formik.handleChange}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Detalle General
                    </label>
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      value={formik.values?.details}
                      name="details"
                      onChange={formik.handleChange}
                      disabled
                    />
                  </div>
                  <div>
                    <input
                      className="bg-gray-50 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="file"
                      onChange={handleFileUpload}
                      disabled={!CheckPermissions(auth, [0, 9])}
                    />
                  </div>
                  <div>
                    <select
                      className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="state"
                      value={formik.values?.state}
                      onChange={formik.handleChange}
                      disabled={!CheckPermissions(auth, [0, 4])}
                    >
                      <option value={Elaborando}>Elaborando</option>
                      <option value={Aprobado}>Aprobado</option>
                    </select>
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
                          {CheckPermissions(auth, [0, 3, 6]) && (
                            <button
                              type="button"
                              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              onClick={txtPichinca}
                            >
                              CASH PICHINCHA
                            </button>
                          )}
                          {CheckPermissions(auth, [0, 3, 6]) && (
                            <button
                              type="button"
                              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              onClick={txtBGR}
                            >
                              CASH BGR
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                      onClick={() => formik.handleSubmit()}
                      disabled={!CheckPermissions(auth, [0, 4, 9])}
                    >
                      Actualizar
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 m-2">
                <div className="overflow-x-auto mx-2">
                  <table className="text-xs w-full">
                    <thead>
                      <tr className="text-center border border-black">
                        <th>Colaborador</th>
                        <th>Departamento</th>
                        <th>Cargo</th>
                        <th>ID</th>
                        <th>Tipo ID</th>
                        <th>Banco</th>
                        <th># Cuenta</th>
                        <th>Tipo</th>
                        <th>Codigo</th>
                        <th>Descripcion</th>
                        <th>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(items ?? []).map((row, index) => {
                        return (
                          <tr key={index} className="text-center whitespace-nowrap">
                            <td className="p-1 border border-black" width={"230px"}>{row.beneficiary ?? ""}</td>
                            <td className="p-1 border border-black">{row.department ?? ""}</td>
                            <td className="p-1 border border-black" width={"140px"}>{row.position ?? ""}</td>
                            <td className="p-1 border border-black">{row.identificationCard ?? ""}</td>
                            <td className="p-1 border border-black">{row.typeCard ?? ""}</td>
                            <td className="p-1 border border-black" width={"210px"}>{row.bank ?? ""}</td>
                            <td className="p-1 border border-black">{row.accountBank ?? ""}</td>
                            <td className="p-1 border border-black">{row.accountType ?? ""}</td>
                            <td className="p-1 border border-black">{row.codBank ?? ""}</td>
                            <td className="p-1 border border-black">{row.typeProv ?? ""}</td>
                            <td className="p-1 border border-black">{row.value ?? 0}</td>
                          </tr>
                        );
                      })}
                      <tr>
                        <th className="p-1 border border-black" colSpan={10}>Valor Total</th>
                        <th className="p-1 border border-black">{totalValue}</th>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                </div>
              </LoadingContainer>
            </div>
          </div>
        </div>
      </>
    </RoleLayout>
  );
};
export default EditNomina;
