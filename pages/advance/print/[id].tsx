/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useRef } from "react";
import Router from "next/router";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import theme from "../../../lib/styles/theme";
import { Advance, ResponseData } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

const PrintAdvance = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [advance, setAdvance] = useState<Advance>(null);
  const componentRef = useRef(null);

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const advanceId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/advance/" + advanceId,
        "GET",
        auth.userName,
        auth.role
      );
      setAdvance(response.data);
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const facturesAdvanceColumns: Array<string> = [
    "Proyecto",
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
      <title>IC | Reporte de Anticipo</title>
      
      <LoadingContainer visible={loading}>
        {advance === null ? (
          <div>Error al cargar los datos</div>
        ) : (
          <div className="bg-white min-h-screen flex">
            <div
              style={{
                width: "297mm",
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
                  INMOCONSTRUCCIONES ANTICIPO N°{" "}
                  <strong>{advance.number}</strong>
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
                        {advance.soliciter}
                      </p>
                    </td>
                    <td style={{ width: "14%" }}>
                      <p>
                        <strong>ESTADO: </strong>
                        {advance.soliciterState}:{" "}
                        {advance.applicantDate.split("  ")[0] ?? ""}
                      </p>
                    </td>
                    <td style={{ width: "12%" }}>
                      <p>
                        <strong>FECHA DE SOLICITUD: </strong>
                        {advance.date.split("  ")[0]}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "15%" }}>
                      <p>
                        <strong>DETALLE GENERAL: </strong>
                        {advance.details}
                      </p>
                    </td>
                  </tr>
                </table>
                <table
                  width={"100%"}
                  align="center"
                  style={{ fontSize: "11px" }}
                  border={1}
                  className="table table-striped"
                >
                  <thead>
                    <tr>
                      {facturesAdvanceColumns.map((item, index) => (
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
                    {advance.items
                      .sort((a, b) =>
                        (a.project?.name ?? "").localeCompare(
                          b.project?.name ?? ""
                        )
                      )
                      .map((item, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              border: "1px solid",
                              textAlign: "center",
                              width: 150,
                            }}
                          >
                            {item.project?.name ?? ""}
                          </td>
                          <td
                            style={{
                              border: "1px solid",
                              textAlign: "center",
                              width: 200,
                            }}
                          >
                            {item.centerCost?.name ?? ""}
                          </td>
                          <td
                            style={{
                              border: "1px solid",
                              textAlign: "center",
                              width: 180,
                            }}
                          >
                            {item.provider?.name ?? ""}
                          </td>
                          <td
                            style={{
                              border: "1px solid",
                              width: 300,
                              textAlign: "left",
                            }}
                          >
                            {item.details ?? ""}
                          </td>
                          <td
                            style={{
                              border: "1px solid",
                              width: 200,
                              textAlign: "left",
                            }}
                          >
                            {item.observation ?? ""}
                          </td>
                          <td
                            style={{
                              border: "1px solid",
                              textAlign: "center",
                              width: 250,
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
                        colSpan={7}
                      >
                        TOTAL
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        {advance.items
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

export default PrintAdvance;
