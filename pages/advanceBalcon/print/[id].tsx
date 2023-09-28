/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useRef } from "react";
import Router from "next/router";
import { Button, Container, Row, Table } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import LoadingContainer from "../../../lib/components/loading_container";
import PdfContainer from "../../../lib/components/pdf_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import { useWindowSize } from "../../../lib/hooks/use_window_size";
import theme from "../../../lib/styles/theme";
import { AdvanceBalcon, ResponseData } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

const PrintAdvanceBalcon = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [advanceBalcon, setAdvanceBalcon] = useState<AdvanceBalcon>(null);
  const windowSize = useWindowSize();
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const advanceBalconId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/advanceBalcon/" + advanceBalconId,
        "GET",
        auth.userName,
        auth.role
      );
      setAdvanceBalcon(response.data);
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const facturesAdvanceBalconColumns: Array<string> = [
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
      <title>Balcon | Reporte de Anticipo</title>
      
      <LoadingContainer visible={loading}>
        {advanceBalcon === null ? (
          <div>Error al cargar los datos</div>
        ) : (
          <div>
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
              <div className="row clase-a-ocultar">
                <div className="col">
                  <button
                    className="btn btn-primary d-block mx-auto my-4 px-4 py-2.5 rounded-pill shadow-sm hover-shadow-lg transition duration-150"
                    onClick={() => window.print()}
                  >
                    Imprimir
                  </button>
                </div>
                <div className="col">
                  <button
                    className="btn btn-secondary d-block mx-auto my-4 px-4 py-2.5 rounded-pill shadow-sm hover-shadow-lg transition duration-150"
                    onClick={() => Router.back()}
                  >
                    Volver
                  </button>
                </div>
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
                  BALCON ANTICIPO N° <strong>{advanceBalcon.number}</strong>
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
                        {advanceBalcon.soliciter}
                      </p>
                    </td>
                    <td style={{ width: "14%" }}>
                      <p>
                        <strong>ESTADO: </strong>
                        {advanceBalcon.soliciterState}{" "}
                        {advanceBalcon.applicantDate.split("  ")[0] ?? ""}
                      </p>
                    </td>
                    <td style={{ width: "12%" }}>
                      <p>
                        <strong>FECHA DE SOLICITUD: </strong>
                        {advanceBalcon.date.split("  ")[0]}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "15%" }}>
                      <p>
                        <strong>DETALLE GENERAL: </strong>
                        {advanceBalcon.details}
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
                      {facturesAdvanceBalconColumns.map((item, index) => (
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
                    {advanceBalcon.items.map((item, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            border: "1px solid",
                            textAlign: "center",
                            width: 200,
                          }}
                        >
                          {item.centerCostBalcon?.name ?? ""}
                        </td>
                        <td
                          style={{
                            border: "1px solid",
                            textAlign: "center",
                            width: 200,
                          }}
                        >
                          {item.providerBalcon?.name ?? ""}
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
                            width: 90,
                          }}
                        >
                          {item.accountBank ?? ""}
                        </td>
                        <td
                          style={{
                            border: "1px solid",
                            width: 80,
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
                        }}
                      >
                        {advanceBalcon.items
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

export default PrintAdvanceBalcon;
