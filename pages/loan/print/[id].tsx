/* eslint-disable @next/next/no-img-element */
import { useFormik } from "formik";
import Router from "next/router";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import { Loan, ResponseData } from "../../../lib/types";
import { Pendiente } from "../../../lib/utils/constants";
import FormatedDate from "../../../lib/utils/formated_date";
import HttpClient from "../../../lib/utils/http_client";

const PrintLoan = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<Loan>({
    number: 0,
    soliciter: auth?.userName,
    typePermissions: "",
    deparmentSoliciter: auth?.department,
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
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
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

  const onSubmit = async (formData: Loan) => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const solicitudeId = Router.query.id as string;
      const requestData = {
        ...formData,
        id: solicitudeId,
      };
      const response: ResponseData = await HttpClient(
        "/api/solicitude",
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

  const formik = useFormik<Loan>({
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

  const date = new Date();
  const day = date.getDate();
  const mes = date.toLocaleString("default", { month: "long" });
  const anio = date.getFullYear();

  useEffect(() => {
    const numero = Math.trunc(formik.values?.requestedDays);
    const decimal = formik.values?.requestedDays.toFixed(2).toString();
    const n = 2;
    const str = decimal.slice(decimal.length - n);
    formik.setFieldValue("startTime", numero);
    formik.setFieldValue("finalTime", str);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.startTime, formik.values.finalTime]);

  return (
    <>
      <title>Reporte de Prestamos</title>

      <div>
        <div
          style={{ textAlign: "center", marginTop: "2em", marginBottom: "2em" }}
        >
          <button
            className="inline-block px-6 py-2.5 bg-blue-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out"
            onClick={handlePrint}
          >
            Imprimir PDF
          </button>
          <button
            className="inline-block px-6 py-2.5 bg-gray-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-500 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-600 active:shadow-lg transition duration-150 ease-in-out"
            style={{ marginLeft: "2em" }}
            onClick={() => Router.back()}
          >
            Volver
          </button>
        </div>
        <LoadingContainer visible={loading}>
          {initialValues === null ? (
            <div>Error</div>
          ) : (
            <div
              className="relative border-2 border-black mx-auto mb-12"
              style={{
                width: "210mm",
                height: "297mm",
              }}
            >
              <div
                style={{ fontFamily: "openSans Regular" }}
                ref={componentRef}
              >
                <div>
                  <div className="m-8 mb-2">
                    <table width="100%">
                      <tr>
                        <td width="15%">
                          <img
                            src="/logohoja.png"
                            alt="logo"
                            className="w-20 h-20 block m-auto"
                          />
                        </td>
                        <td className="text-center w-10/12">
                          <h4 style={{ fontWeight: "bold" }}>
                            SOLICITUD DE PRESTAMOS Y ANTICIPOS
                          </h4>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div className="mx-10">
                    <div className="mb-4">
                      <p className="text-right text-lg">
                        <strong>
                          Quito, {day} de {mes} de {anio}
                        </strong>
                      </p>
                      <p style={{ fontSize: "18px" }}>
                        <strong>
                          Estimado <br /> Msc. Diego Andrade <br /> Presente. -
                        </strong>
                      </p>
                    </div>
                    <div className="mb-4 text-lg">
                      <p>
                        <strong>Nombres y Apellidos: </strong>
                        {formik.values.soliciter}
                      </p>
                      <p>
                        <strong>Departamento:</strong> {formik.values.details}
                      </p>
                      <p>
                        <strong>Cargo:</strong> {formik.values.requestedHour}
                      </p>
                    </div>
                    <div className="text-lg text-justify mb-52">
                      <p>
                        Por medio de la presente y luego de saludarle, solicito
                        a usted se me otorgue, el siguiente desembolso:
                      </p>
                      <p className="text-center">
                        <strong>{formik.values.typePermissions}</strong>
                      </p>
                      <p>
                        Por la cantidad de $:{" "}
                        {formik.values.startTime.toLocaleString()} (dolares con{" "}
                        {formik.values.finalTime}
                        /100 ctvs) comprometiéndome a pagar la totalidad del
                        mismo en un plazo de:{" "}
                        <strong>{formik.values.dateS}</strong> a partir del mes
                        de: <strong>{formik.values.dateE}</strong>
                      </p>
                      <p>
                        Por su atención y comprensión, quedo a sus ordenes
                        <br />
                        Gracias.
                      </p>
                    </div>
                    <div className="col-5">
                      <p>
                        <hr className="border-2 border-black" />
                        <strong>
                          Firma Solicitante <br /> Cédula:
                        </strong>
                      </p>
                    </div>
                    <div className="col-5">
                      <p>
                        <hr className="border-2 border-black" />
                        <strong>
                          APROBADO <br /> Msc: Diego Andrade
                        </strong>
                      </p>
                    </div>
                    <p className="mb-5">
                      <strong>
                        Nota: Luego de su aprobación, enviar a Contabilidad
                      </strong>
                    </p>
                  </div>
                  <footer className="absolute bottom-0 w-full text-white">
                    <img
                      style={{ width: "100%" }}
                      src="/footerPrestamos.png"
                      alt=""
                    />
                  </footer>
                </div>
              </div>
            </div>
          )}
        </LoadingContainer>
      </div>
    </>
  );
};
export default PrintLoan;
