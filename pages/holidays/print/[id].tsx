/* eslint-disable @next/next/no-img-element */
import Router from "next/router";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import { Holidays, ResponseData } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

const PrintSolicitude = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [solicitude, setSolicitude] = useState<Holidays>(null);
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
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
      setSolicitude(response.data);
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <title>Reporte de Vacaciones</title>
      
      <div>
        <div className="text-center my-8">
          <button
            className="inline-block px-6 py-2.5 bg-blue-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out"
            onClick={handlePrint}
          >
            Imprimir PDF
          </button>
          <button
            className="ml-4 inline-block px-6 py-2.5 bg-gray-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-500 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-600 active:shadow-lg transition duration-150 ease-in-out"
            onClick={() =>
              Router.back()
            }
          >
            Volver
          </button>
        </div>
        <LoadingContainer visible={loading}>
          {solicitude === null ? (
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
                <div style={{ margin: "1em", marginTop: "2em" }}>
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <table width="100%">
                      <tr>
                        <td className="w-1/5">
                          <img
                            src="/logoAncon.png"
                            alt="logo"
                            className="w-20 h-20 block m-auto"
                          />
                        </td>
                        <td className="text-center w3/5">
                          <h1 className="text-2xl font-semibold">
                            ANCON
                            <br />
                            GRUPO INMOBILIARIO
                          </h1>
                        </td>
                        <td className="w-1/5">
                          <p className="mt-4 ml-4 text-red-500 text-xl">
                            N0. 00{solicitude.number}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div className="text-center mt-2 w-3/5 mx-auto">
                    <h2 className="border-2 border-black">
                      SOLICITUD DE VACACIONES
                    </h2>
                  </div>
                  <div className="border-2 border-black my-4">
                    <div className="m-2">
                      <p className="mb-2">
                        <strong>SOLICITANTE: </strong>
                        <span className="underline underline-offset-4">
                          {solicitude.soliciter}
                        </span>
                      </p>
                      <p className="mb-2">
                        <strong>CARGO: </strong>
                        {/* <span className="underline underline-offset-4">{`${auth?.position}`}</span> */}
                      </p>
                      <p className="mb-2">
                        <strong>DEPARTAMENTO: </strong>
                        <span className="underline underline-offset-4">{`${auth?.department}`}</span>
                      </p>
                    </div>
                    <table className="mt-4" width="100%">
                      <tr>
                        <td className="text-center">
                          <strong>DIAS SOLICITADOS: </strong>
                          {solicitude.requestedDays}
                        </td>
                        {/* <td className="text-center">
                          <strong>SALDO VACACIONES: </strong>
                          {`${auth?.holidays}`}
                        </td> */}
                      </tr>
                    </table>
                    <table width="100%" className="my-3">
                      <tr>
                        <td className="text-center">
                          <strong>FECHA DE SALIDA (Desde): </strong>
                          <span>{solicitude.dateS}</span>
                        </td>
                        <td className="text-center">
                          <strong>FECHA DE ENTRADA (Hasta): </strong>
                          <span>{solicitude.dateE}</span>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <br />
                  <div className="border-2 border-black mb-52">
                    <div className="m-8">
                      <h3 className="underline underline-offset-4 font-semibold mb-2">
                        EXPLIQUE SU PEDIDO:
                      </h3>
                      <p>
                        <strong>
                          UD ESCOGIO EL SIGUIENTE TIPO DE VACACIONES:
                        </strong>
                      </p>
                      <p>{solicitude.typePermissions}</p>
                      <p>
                        <strong>DETALLE DE SU SOLICITUD:</strong>
                      </p>
                      <p>{solicitude.details}</p>
                      <p style={{ marginTop: "10%" }}>
                        <strong>ESTADO DE SU SOLICITUD:</strong>{" "}
                        {solicitude.state.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <table style={{ marginBottom: "1em" }} width="100%">
                    <tr className="text-center">
                      <th>
                        FIRMA SOLICITANTE
                        <p>
                          Fecha:{" "}
                          <span className="underline underline-offset-4">
                            {solicitude.dateState}
                          </span>
                        </p>
                      </th>
                      <th>
                        JEFE INMEDIATO
                        <p>
                          Fecha:{" "}
                          <span className="underline underline-offset-4">
                            {solicitude.dateState}
                          </span>
                        </p>
                      </th>
                      <th>
                        RECURSOS HUMANOS
                        <p>
                          Fecha:{" "}
                          <span className="underline underline-offset-4">
                            {solicitude.dateState}
                          </span>
                        </p>
                      </th>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          )}
        </LoadingContainer>
      </div>
    </>
  );
};
export default PrintSolicitude;
