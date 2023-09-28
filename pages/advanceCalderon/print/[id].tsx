/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useRef } from "react";
import Router from "next/router";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import theme from "../../../lib/styles/theme";
import { AdvanceCalderon, ResponseData } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

const PrintAdvanceCalderon = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [advanceCalderon, setAdvanceCalderon] = useState<AdvanceCalderon>(null);
  const componentRef = useRef(null);

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const advanceCalderonId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/advanceCalderon/" + advanceCalderonId,
        "GET",
        auth.userName,
        auth.role
      );
      setAdvanceCalderon(response.data);
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const facturesAdvanceCalderonColumns: Array<string> = [
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
      <title>Calderon | Reporte de Anticipo</title>
      <LoadingContainer visible={loading}>
        {advanceCalderon === null ? (
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
                  CALDERON ANTICIPO N° <strong>{advanceCalderon.number}</strong>
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
                        {advanceCalderon.soliciter}
                      </p>
                    </td>
                    <td style={{ width: "14%" }}>
                      <p>
                        <strong>ESTADO: </strong>
                        {advanceCalderon.soliciterState}{" "}
                        {advanceCalderon.applicantDate.split("  ")[0] ?? ""}
                      </p>
                    </td>
                    <td style={{ width: "12%" }}>
                      <p>
                        <strong>FECHA DE SOLICITUD: </strong>
                        {advanceCalderon.date.split("  ")[0]}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "15%" }}>
                      <p>
                        <strong>DETALLE GENERAL: </strong>
                        {advanceCalderon.details}
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
                      {facturesAdvanceCalderonColumns.map((item, index) => (
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
                    {advanceCalderon.items.map((item, index) => (
                      <tr
                        style={{
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                        key={index}
                      >
                        <td
                          className="p-0 border border-black"
                          style={{
                            width: 200,
                          }}
                        >
                          {item.centerCostCalderon?.name ?? ""}
                        </td>
                        <td
                          className="p-0 border border-black"
                          style={{
                            width: 200,
                          }}
                        >
                          {item.providerCalderon?.name ?? ""}
                        </td>
                        <td
                          className="p-0 border border-black"
                          style={{
                            width: 300,
                          }}
                        >
                          {item.details ?? ""}
                        </td>
                        <td
                          className="p-0 border border-black"
                          style={{
                            width: 200,
                          }}
                        >
                          {item.observation ?? ""}
                        </td>
                        <td
                          className="p-0 border border-black"
                          style={{
                            width: 220,
                          }}
                        >
                          {item.beneficiary ?? ""}
                        </td>
                        <td
                          className="p-0 border border-black"
                          style={{
                            width: 90,
                          }}
                        >
                          {item.accountBank ?? ""}
                        </td>
                        <td
                          className="p-0 border border-black"
                          style={{
                            width: 80,
                          }}
                        >
                          {(item.value ?? "").toLocaleString("en-US")}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <th className="p-0 border border-black" colSpan={6}>
                        TOTAL
                      </th>
                      <th className="p-0 border border-black">
                        {advanceCalderon.items
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
            </div>
          </div>
        )}
      </LoadingContainer>
    </>
  );
};

export default PrintAdvanceCalderon;
