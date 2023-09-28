/* eslint-disable @next/next/no-img-element */
import Router from "next/router";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import { Permission, ResponseData } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

const PrintPermission = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<Permission>(null);
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
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
      setPermission(response.data);
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
        <div className="text-center my-3 grid grid-cols-2 w-1/2 mx-auto">
          <div className="flex mx-auto">
            <button
              className="inline-block mr-8 px-6 py-2.5 bg-blue-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out"
              onClick={handlePrint}
            >
              Imprimir PDF
            </button>
          </div>
          <div className="flex">
            <button
              className="inline-block px-6 py-2.5 bg-gray-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-500 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-600 active:shadow-lg transition duration-150 ease-in-out"
              onClick={() =>
                Router.back()
              }
            >
              Volver
            </button>
          </div>
        </div>
        <LoadingContainer visible={loading}>
          {permission === null ? (
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
                <div className="m-4">
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <table width="100%">
                      <tr>
                        <td width="20%">
                          <img
                            src="/logohoja.png"
                            alt="logo"
                            className="w-20 h-20 blocl m-auto"
                          />
                        </td>
                        <td className="text-center w-3/5">
                          <h2 className="font-semibold">
                            ANCON
                            <br />
                            GRUPO INMOBILIARIO
                          </h2>
                        </td>
                        <td
                          style={{
                            width: "20%",
                          }}
                        >
                          <p className="my-4 text-red-500 text-lg">
                            N0. 00{permission.number}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div className="text-center mt-2 w-3/5 mx-auto">
                    <h3 className="border-2 border-black font-semibold">
                      SOLICITUD DE PERMISOS
                    </h3>
                  </div>
                  <div
                    style={{
                      marginLeft: "2em",
                      marginTop: "2em",
                      marginBottom: "2em",
                    }}
                  >
                    <p className="my-2">
                      <strong>SOLICITANTE:</strong> {permission.soliciter}
                    </p>
                    <p className="my-2">
                      <strong>CARGO:</strong> {`${auth?.userName}`}
                    </p>
                    <p className="my-2">
                      <strong>DEPARTAMENTO:</strong> {`${auth?.department}`}
                    </p>
                  </div>
                  <table width="100%">
                    <tr>
                      <td className="text-center">
                        <strong>FECHA DEL PERMISO: </strong>
                        {permission.dateS}
                      </td>
                      <td className="text-center">
                        <strong>HORAS SOLICITADAS: </strong>
                        {permission.requestedHour}
                      </td>
                    </tr>
                  </table>
                  <table width="100%" className="mt-4 mb-2">
                    <tr>
                      <td className="text-center">
                        <strong>DESDE LAS:</strong> {permission.startTime}
                      </td>
                      <td className="text-center">
                        <strong>HASTA LAS:</strong> {permission.finalTime}
                      </td>
                    </tr>
                  </table>

                  <div className="ml-8 mt-8 mb-40">
                    <h3 className="underline underline-offset-4 font-semibold mb-4">
                      EXPLIQUE SU PEDIDO:
                    </h3>
                    <p className="my-2">
                      <strong>UD ESCOGIO EL SIGUIENTE TIPO DE PERMISO:</strong>
                    </p>
                    <p className="my-2">{permission.typePermissions}</p>
                    <p className="my-2">
                      <strong>DETALLE DE SU SOLICITUD:</strong>
                    </p>
                    <p className="my-2">{permission.details}</p>
                    <p style={{ marginTop: "18%" }}>
                      <strong>ESTADO DE SU SOLICITUD: </strong>
                      {permission.state.toUpperCase()}
                    </p>
                  </div>
                  <table className="mb-4" width="100%">
                    <tr className="text-center">
                      <td>
                        FIRMA SOLICITANTE
                        <p>
                          Fecha:
                          <span className="underline underline-offset-4">
                            {permission.dateState}
                          </span>
                        </p>
                      </td>
                      <td>
                        JEFE INMEDIATO
                        <p>
                          Fecha:
                          <span className="underline underline-offset-4">
                            {permission.dateState}
                          </span>
                        </p>
                      </td>
                      <td>
                        RECURSOS HUMANOS
                        <p>
                          Fecha:
                          <span className="underline underline-offset-4">
                            {permission.dateState}
                          </span>
                        </p>
                      </td>
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
export default PrintPermission;
