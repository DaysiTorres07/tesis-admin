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
import { ResponseData, SolicitudeRecaudaciones } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

const PrintSolicitudeRecaudaciones = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [solicitudeRecaudaciones, setSolicitudeRecaudaciones] =
    useState<SolicitudeRecaudaciones>(null);
  const windowSize = useWindowSize();
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const solicitudeRecaudacionesId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/solicitudeRecaudaciones/" + solicitudeRecaudacionesId,
        "GET",
        auth.userName,
        auth.role
      );
      setSolicitudeRecaudaciones(response.data);
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const facturesRecaudacionesColumns: Array<string> = [
    "Proveedor",
    "Fecha",
    "# Factura",
    "Detalle",
    "Observacion",
    "Valor",
    "Documento",
    "Valor Pagado",
    "Beneficiario",
    "Banco Beneficiario",
    "# Cuenta",
  ];

  return (
    <>
      <title>Recaudaciones | Reporte de solicitud</title>
      <LoadingContainer visible={loading}>
        {solicitudeRecaudaciones === null ? (
          <div>Error al cargar los datos</div>
        ) : (
          <div>
            <PdfContainer ref={componentRef}>
              <div
                style={{
                  width: windowSize.width,
                  minWidth: "500px",
                  padding: "30px 0",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <table width="100%">
                  <tr>
                    <td>
                      <div style={{ paddingLeft: "10%" }}>
                        <h3
                          style={{
                            background: theme.colors.red,
                            padding: "20px 35px 20px 35px",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          DETALLE DE PAGOS SOLICITADOS
                        </h3>
                      </div>
                    </td>
                    <td>
                      <img
                        src="/logo_horizontal.png"
                        alt="logo"
                        style={{
                          width: "300px",
                          height: "60px",
                          marginLeft: "10em",
                          marginBottom: "30px",
                        }}
                      />
                    </td>
                  </tr>
                </table>
                <h3
                  style={{
                    margin: "0",
                    textAlign: "center",
                    fontSize: "30px",
                    marginBottom: "10px",
                  }}
                >
                  SOLICITUD RECAUDACIONES N°{" "}
                  <strong style={{ fontSize: "48px" }}>
                    {" "}
                    {solicitudeRecaudaciones.number}{" "}
                  </strong>
                </h3>
                <table
                  width="95%"
                  align="center"
                  border={2}
                  style={{ fontSize: "18px" }}
                >
                  <tr>
                    <td style={{ width: "20%" }}>
                      <p style={{ marginTop: "18px", marginLeft: "10px" }}>
                        <strong style={{ marginRight: "80px" }}>
                          SOLICITANTE:{" "}
                        </strong>{" "}
                        {solicitudeRecaudaciones.soliciter}
                      </p>
                    </td>
                    <td style={{ width: "14%" }}>
                      <p style={{ marginTop: "18px" }}>
                        <strong style={{ marginRight: "35px" }}>
                          SOLICITANTE:
                        </strong>
                        {solicitudeRecaudaciones.soliciterState}:{" "}
                        {solicitudeRecaudaciones.applicantDate.split("  ")[0] ??
                          ""}
                      </p>
                    </td>
                    <td style={{ width: "10%" }}>
                      <p style={{ marginTop: "18px", marginLeft: "25%" }}>
                        <strong style={{ marginRight: "70px" }}>
                          Valor Solicitado:{" "}
                        </strong>
                        $
                        {solicitudeRecaudaciones.items
                          .reduce(
                            (partialSum, facture) => partialSum + facture.value,
                            0
                          )
                          .toLocaleString()}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "20%" }}>
                      <p style={{ marginLeft: "10px" }}>
                        <strong style={{ marginRight: "16px" }}>
                          FECHA DE SOLICITUD:{" "}
                        </strong>
                        {solicitudeRecaudaciones.date.split("  ")[0]}
                      </p>
                    </td>
                    <td></td>
                    <td style={{ width: "12%" }}></td>
                  </tr>
                  <tr>
                    <td style={{ width: "20%" }}>
                      <p style={{ marginLeft: "10px" }}>
                        <strong style={{ marginRight: "42px" }}>
                          DETALLE GENERAL:
                        </strong>
                        {solicitudeRecaudaciones.details}
                      </p>
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                </table>
              </div>
              <Container
                fluid
                style={{ marginBottom: "40px", padding: "0 60px" }}
              >
                <Row>
                  <Table responsive>
                    <thead>
                      <tr>
                        {facturesRecaudacionesColumns.map((item, index) => (
                          <th
                            style={{
                              textAlign: "center",
                              backgroundColor: "#8c130f",
                              color: "white",
                              fontSize: "14px",
                              padding: "10px",
                              border: "1px solid black",
                              marginBottom: "5%",
                            }}
                            key={index}
                          >
                            {item}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {solicitudeRecaudaciones.items.map((item, index) => (
                        <tr
                          style={{
                            border: "1px solid",
                            fontSize: "14px",
                            textAlign: "center",
                          }}
                          key={index}
                        >
                          <td style={{ border: "1px solid", width: 200 }}>
                            {item.providerRecaudaciones?.name ?? ""}
                          </td>
                          <td style={{ border: "1px solid", width: 90 }}>
                            {item.factureDate ?? ""}
                          </td>
                          <td style={{ border: "1px solid", width: 90 }}>
                            {item.factureNumber ?? ""}
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
                              width: 300,
                              textAlign: "left",
                            }}
                          >
                            {item.observation ?? ""}
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
                          <td style={{ border: "1px solid", width: 180 }}>
                            {item.documentDelivered ?? ""}
                          </td>
                          <td
                            style={{
                              border: "1px solid",
                              width: 120,
                              textAlign: "center",
                            }}
                          >
                            {(item.valueNet ?? "").toLocaleString("en-US")}
                          </td>
                          <td style={{ border: "1px solid", width: 220 }}>
                            {item.beneficiary ?? ""}
                          </td>
                          <td style={{ border: "1px solid", width: 150 }}>
                            {item.bank ?? ""}
                          </td>
                          <td style={{ border: "1px solid", width: 100 }}>
                            {item.accountBank ?? ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Row>
              </Container>
            </PdfContainer>
            <div>
              <br></br>
              <br></br>
              <Button style={{ marginLeft: "5%" }} onClick={handlePrint}>
                Imprimir
              </Button>
            </div>
            <br></br>
            <div>
              <Button
                style={{ marginLeft: "5%", marginBottom: "3%" }}
                onClick={() => Router.back()}
              >
                Volver
              </Button>
            </div>
          </div>
        )}
      </LoadingContainer>
    </>
  );
};

export default PrintSolicitudeRecaudaciones;
