/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useRef } from "react";
import Router from "next/router";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import theme from "../../../lib/styles/theme";
import { AdvanceInmogestion, ResponseData } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

const PrintAdvanceInmogestion = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [advanceInmogestion, setAdvanceInmogestion] =
    useState<AdvanceInmogestion>(null);
  const componentRef = useRef(null);

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const advanceInmogestionId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/advanceInmogestion/" + advanceInmogestionId,
        "GET",
        auth.userName,
        auth.role
      );
      setAdvanceInmogestion(response.data);
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const facturesAdvanceInmogestionColumns: Array<string> = [
    "Centro costos",
    "Proveedor",
    "Detalle",
    "Observacion",
    "Beneficiario",
    "# Cuenta",
    "Valor",
  ];

  return (
    <>
      <title>IG | Reporte de Anticipo</title>
      
      <LoadingContainer visible={loading}>
        {advanceInmogestion === null ? (
          <div>Error al cargar los datos</div>
        ) : (
          <div className="bg-white min-h-screen flex">
            <div
              style={{
                width: "297mm",
                height: "210mm",
                position: "relative",
                margin: "0 auto",
                marginBottom: "5%",
              }}
            >
              <style>
                {`
                  @media print {
                    .clase-a-ocultar {
                      display: none !important;
                    }
                  }
                `}
              </style>
              <div className="grid grid-cols-0 md:grid-cols-3 m-4 gap-4 mb-4 clase-a-ocultar">
                <button
                  className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white mx-auto my-4 px-4 py-2.5 border border-red-500 hover:border-transparent rounded"
                  onClick={() => window.print()}
                >
                  Imprimir
                </button>
                <button
                  className="text-center bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white mx-auto my-4 px-4 py-2.5 border border-gray-500 hover:border-transparent rounded"
                  onClick={() => Router.back()}
                >
                  Volver
                </button>
              </div>
              <div ref={componentRef}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <table width="100%">
                  <tr>
                    <td width={"50%"}>
                      <h6
                        className="mx-4"
                        style={{
                          background: theme.colors.grey,
                          padding: "20px 35px 20px 35px",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        DETALLE DE PAGOS ANTICIPADOS
                      </h6>
                    </td>
                    <td width={"50%"} className="text-center">
                      <img
                        src="/logo_horizontal.png"
                        alt="logo"
                        style={{
                          width: "300px",
                          height: "60px",
                        }}
                      />
                    </td>
                  </tr>
                </table>
                <h4 className="text-center my-3">
                  INMOGESTIÓN ANTICIPO N°{" "}
                  <strong>{advanceInmogestion.number}</strong>
                </h4>
                <table
                  style={{ fontSize: "12px", textAlign: "center" }}
                  className="mb-3"
                  width="95%"
                  align="center"
                  border={2}
                >
                  <tr>
                    <td style={{ width: "13%" }}>
                      <p>
                        <strong>SOLICITANTE: </strong>
                        {advanceInmogestion.soliciter}
                      </p>
                    </td>
                    <td style={{ width: "14%" }}>
                      <p>
                        <strong>ESTADO: </strong>
                        {advanceInmogestion.soliciterState}{" "}
                        {advanceInmogestion.applicantDate.split("  ")[0] ?? ""}
                      </p>
                    </td>
                    <td style={{ width: "12%" }}>
                      <p>
                        <strong>FECHA DE SOLICITUD: </strong>
                        {advanceInmogestion.date.split("  ")[0]}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "15%" }}>
                      <p>
                        <strong>DETALLE GENERAL: </strong>
                        {advanceInmogestion.details}
                      </p>
                    </td>
                  </tr>
                </table>
                <table
                  width={"100%"}
                  align="center"
                  style={{ fontSize: "9px" }}
                  border={1}
                >
                  <thead>
                    <tr>
                      {facturesAdvanceInmogestionColumns.map((item, index) => (
                        <th
                          style={{
                            textAlign: "center",
                            backgroundColor: theme.colors.grey,
                            color: "white",
                            border: "1px solid black",
                          }}
                          key={index}
                        >
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {advanceInmogestion.items.map((item, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            border: "1px solid",
                            textAlign: "center",
                            width: 200,
                          }}
                        >
                          {item.centerCostIg?.name ?? ""}
                        </td>
                        <td
                          style={{
                            border: "1px solid",
                            textAlign: "center",
                            width: 200,
                          }}
                        >
                          {item.providerIg?.name ?? ""}
                        </td>
                        <td
                          style={{
                            border: "1px solid",
                            width: 300,
                          }}
                        >
                          {item.details ?? ""}
                        </td>
                        <td
                          style={{
                            border: "1px solid",
                            width: 200,
                          }}
                        >
                          {item.observation ?? ""}
                        </td>
                        <td
                          style={{
                            border: "1px solid",
                            textAlign: "center",
                            width: 220,
                          }}
                        >
                          {item.beneficiary ?? ""}
                        </td>
                        <td
                          style={{
                            border: "1px solid",
                            textAlign: "center",
                            width: 100,
                          }}
                        >
                          {item.accountBank ?? ""}
                        </td>
                        <td
                          style={{
                            border: "1px solid",
                            width: 120,
                            textAlign: "center",
                          }}
                        >
                          {(item.value ?? "").toLocaleString("en-US")}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                        }}
                        colSpan={6}
                      >
                        TOTAL
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          border: "1px solid black"
                        }}
                      >
                        {advanceInmogestion.items
                          .reduce(
                            (partialSum, facture) => partialSum + facture.value,
                            0
                          )
                          .toLocaleString("en-US")}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <br />
            </div>
          </div>
        )}
      </LoadingContainer>
    </>
  );
};

export default PrintAdvanceInmogestion;
