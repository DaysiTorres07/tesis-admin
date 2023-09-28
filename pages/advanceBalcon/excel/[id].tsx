/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/hooks/use_auth";
import { AdvanceBalcon, ResponseData } from "../../../lib/types";
import Router from "next/router";
import HttpClient from "../../../lib/utils/http_client";
import LoadingContainer from "../../../lib/components/loading_container";
import theme from "../../../lib/styles/theme";

const ExcelAdvanceBalcon = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [advance, setAdvance] = useState<AdvanceBalcon>(null);

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const advanceId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/advanceBalcon/" + advanceId,
        "GET",
        auth.userName,
        auth.role
      );
      setAdvance(response.data ?? []);
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exportToExcel() {
    let table = document.getElementById("mi-tabla");
    let html = table.outerHTML;
    let url =
      "data:application/vnd.ms-excel;charset=ISO-8859-1," + escape(html);
    let downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.href = url;
    downloadLink.download = "Anticipo-Balcon.xls";
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  return (
    <>
      <title>Balcon | Excel Anticipo</title>

      <LoadingContainer visible={loading}>
        {advance === null ? (
          <div>Error al cargar los datos</div>
        ) : (
          <div>
            <table
              width="100%"
              className="mt-5"
              style={{
                fontSize: "12px",
              }}
            >
              <thead>
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
                        DETALLE DE PAGOS ANTICIPADOS
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
              </thead>
            </table>
            <h3
              style={{ margin: 0, textAlign: "center", marginBottom: "10px" }}
            >
              ANTICIPO N° <strong>{advance.number}</strong>
            </h3>
            <table width="95%" align="center">
              <thead>
                <tr>
                  <td style={{ width: "40%" }}>
                    <strong>SOLICITANTE: </strong>
                    {advance.soliciter}
                  </td>
                  <td style={{ width: "40%" }}>
                    <strong>ESTADO: </strong>
                    {advance.soliciterState}:{" "}
                    {advance.applicantDate.split("  ")[0] ?? ""}
                  </td>
                  <td className="text-danger">
                    <strong>Diferencia: </strong>
                    {advance.items
                      .reduce(
                        (parsialSum, facture) =>
                          parsialSum + facture.difference,
                        0
                      )
                      .toLocaleString("en-US")}
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: "20%" }}>
                    <strong>FECHA DE SOLICITUD: </strong>
                    {advance.date.split("  ")[0]}
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "20%" }}>
                    <strong>DETALLE GENERAL</strong> {advance.details}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4">
              <table
                id="mi-tabla"
                align="center"
                border={1}
                className="table table-striped"
                style={{
                  fontSize: "11px",
                  width: "95%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ textAlign: "center" }}>
                    <td>Proyecto</td>
                    <td>Centro Costos</td>
                    <td>Proveedor</td>
                    <td>Fecha Factura</td>
                    <td># Factura</td>
                    <td>Detalle</td>
                    <td>Beneficiario</td>
                    <td>Cédula</td>
                    <td>Banco Beneficiario</td>
                    <td># Cuenta</td>
                    <td>Valor</td>
                    <td>Valor Retenido</td>
                    <td>Valor Pagado</td>
                  </tr>
                </thead>
                <tbody>
                  {advance.items.map((item, index) => (
                    <tr key={index} style={{ textAlign: "center" }}>
                      <td>{item.project?.name ?? ""}</td>
                      <td>{item.centerCostBalcon?.name ?? ""}</td>
                      <td>{item.providerBalcon?.name ?? ""}</td>
                      <td>{item.factureDate ?? ""}</td>
                      <td>{item.factureNumber ?? ""}</td>
                      <td>{item.details ?? ""}</td>
                      <td>{item.beneficiary ?? ""}</td>
                      <td>{item.identificationCard ?? ""}</td>
                      <td>{item.bank ?? ""}</td>
                      <td>{item.accountBank ?? ""}</td>
                      <td>{(item.value ?? 0).toLocaleString("en-US")}</td>
                      <td>
                        {(item.valueRetention ?? 0).toLocaleString("en-US")}
                      </td>
                      <td>{(item.valueNet ?? 0).toLocaleString("en-US")}</td>
                    </tr>
                  ))}
                  <tr style={{ textAlign: "center" }}>
                    <th colSpan={10}>Total:</th>
                    <td>
                      {advance.items
                        .reduce((total, item) => total + item.value, 0)
                        .toLocaleString("en-US")}
                    </td>
                    <td>
                      {advance.items
                        .reduce((total, item) => total + item.valueRetention, 0)
                        .toLocaleString("en-US")}
                    </td>
                    <td>
                      {advance.items
                        .reduce((total, item) => total + item.valueNet, 0)
                        .toLocaleString("en-US")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </LoadingContainer>
      <div className="row w-50">
        <button className="btn btn-success m-4" onClick={exportToExcel}>
          Excel
        </button>
        <button className="btn btn-primary m-4" onClick={() => Router.back()}>
          Volver
        </button>
      </div>
    </>
  );
};
export default ExcelAdvanceBalcon;
