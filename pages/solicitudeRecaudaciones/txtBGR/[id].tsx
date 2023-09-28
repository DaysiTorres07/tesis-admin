import { saveAs } from "file-saver";
import Router from "next/router";
import { useEffect, useState } from "react";
import { Button, Container, Row, Table } from "react-bootstrap";
import { useAuth } from "../../../lib/hooks/use_auth";
import {
  FactureRecaudaciones,
  ResponseData,
  SolicitudeRecaudaciones,
} from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

const SoliTxtBGR = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [solicitudeR, setSolicitudeR] = useState<SolicitudeRecaudaciones>(null);
  const [items, setItems] = useState("");

  const createFile = () => {
    const blob = new Blob([items], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "cash-bgr-recaudaciones.txt");
  };

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      const solicitudeRecaudacionesid = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/solicitudeRecaudaciones/" + solicitudeRecaudacionesid,
        "GET",
        auth.userName,
        auth.role
      );
      const solicitudeR: SolicitudeRecaudaciones = response.data;
      const facturesR: Map<String, FactureRecaudaciones> = new Map();
      solicitudeR.items.forEach((factureR: FactureRecaudaciones) => {
        if (Array.from(facturesR.keys()).includes(factureR.beneficiary)) {
          const auxFact = facturesR.get(factureR.beneficiary);
          auxFact.valueNet += factureR.valueNet;
          facturesR.set(factureR.beneficiary, auxFact);
        } else {
          facturesR.set(factureR.beneficiary, factureR);
        }
      });
      setSolicitudeR({
        ...solicitudeR,
        items: Array.from(facturesR.values()),
      });
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
      <title>Recaudaciones | Cash BGR</title>
      
      {solicitudeR === null ? (
        <div>Error al cargar los datos</div>
      ) : (
        <div>
          <h3 className="text-danger text-center mt-2">Descargar Cash BGR</h3>
          <Container>
            <Row>
              <Table responsive>
                {(solicitudeR.items ?? []).map((item, index) => {
                  let value: string | number;
                  if (Number.isInteger(item.valueNet)) {
                    value = item.valueNet + ".00";
                  } else {
                    value = item.valueNet.toFixed(2);
                  }
                  let typebank: string;
                  if (item.accountType === "CC") {
                    typebank = "CTE";
                  } else {
                    typebank = "AHO";
                  }
                  return (
                    <tr key={index}>
                      <td>PA</td>
                      <td>{item.identificationCard ?? ""}</td>
                      <td>USD</td>
                      <td>{value.toLocaleString().replace(/[$.,]/g, "")}</td>
                      <td>CTA</td>
                      <td>{typebank}</td>
                      <td>{item.accountBank}</td>
                      <td>{item.details.toLocaleUpperCase()}</td>
                      <td>{item.typeCard}</td>
                      <td>{item.identificationCard}</td>
                      <td>{item.beneficiary.toLocaleUpperCase()}</td>
                      <td>{item.codBank}</td>
                    </tr>
                  );
                })}
              </Table>
            </Row>
            <textarea
              style={{ width: "60%", marginTop: "8%" }}
              value={items}
              onChange={(e) => setItems(e.target.value)}
            ></textarea>
          </Container>
          <br />
          <Button
            style={{ marginLeft: "50%", marginTop: "2%" }}
            onClick={createFile}
          >
            Guardar cash
          </Button>
          <br />
          <br />
          <Button
            style={{ marginLeft: "50%", marginBottom: "3%" }}
            onClick={() => Router.back()}
          >
            Volver
          </Button>
        </div>
      )}
    </>
  );
};
export default SoliTxtBGR;
